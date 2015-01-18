$ ->
  window.weapons=
    init: ->
      # ----------------------------------------------
      # Weapon Switcher initialization
      # ----------------------------------------------
      $.fn.bootstrapSwitch.defaults.size = 'normal'

      # Clan
      $.fn.bootstrapSwitch.defaults.onText = 'Clan'
      $.fn.bootstrapSwitch.defaults.onColor = 'primary'

      # InnerSphere
      $.fn.bootstrapSwitch.defaults.offText = 'I.S.'
      $.fn.bootstrapSwitch.defaults.offColor = 'warning'

      $('input[name="weapon_switcher"]').on 'init.bootstrapSwitch', (event,state) ->
        $('#innersphere_weapons').show()
        $('#clan_weapons').hide()

      $('input[name="weapon_switcher"]').on 'switchChange.bootstrapSwitch', (event,state) ->
        if state == true
          $('#innersphere_weapons').hide()
          $('#clan_weapons').show()
        else if state == false
          $('#innersphere_weapons').show()
          $('#clan_weapons').hide()

      $('input[name="weapon_switcher"]').bootstrapSwitch('state', false)


      # ----------------------------------------------
      # Equipped Weapons' list initialization
      # ----------------------------------------------
      $('.weapon-list').on "click", "a.js-fire.ready", @fireWeapon
      $('.weapon-list').on "click", "a.js-fire.not_ready", -> false

      # Equip weapons
      $(".armory").on "click", ".js-add-weapon", ->
        weaponId = $(this).data("weaponId")
        weaponName = $(this).data("weaponName")
        html = weaponView(
          name: weaponName
          weaponId: weaponId
        )

        # Append the equipped weapon dom tree
        $(".weapon-list").append html

        # Arm the weapon
        _.each $('.cooldown-meter'), (element, iterator, list) ->
          cstime = window.weaponsList[weaponId].cooldown
          $(element).css(Modernizr.prefixed('transition'), "width #{cstime}s ease-in-out")
          window.mech.weapons.armWeapon(element)

        # save permaink
        window.persistence.rebuildPermalink()
        false

      # Fire all Weapons
      $("#js-alphastrike").click ->
        grouped_weapons = $(".js-fire.ready")

        if grouped_weapons.length > 0
          window.mech.weapons.ghostHeat.apply(grouped_weapons) if window.weapons.ghostHeat.is_enabled()
          grouped_weapons.click()

        false

      # Assign weapon group
      $('.weapon-list').on "click", ".js-weapon_group", ->
        $(@).toggleClass('assigned')
        $(@).toggleClass('btn-default')
        $(@).toggleClass('btn-info')
        false

      # Fire weapon group
      $('.js-fire_weapon_group').click (e) ->
        e.preventDefault()
        group = $(@).data('activateGroup')

        # wgs : Weapon Groups
        wgs =  $("[data-weapon-group='#{group}'].js-weapon_group.assigned")

        grouped_weapons = []

        _.each wgs, (wg) =>
          # Find weapon beside weapon group label
          weapon = $(wg).siblings('.js-fire.ready')[0]
          grouped_weapons.push weapon if typeof weapon isnt 'undefined'

        if grouped_weapons.length > 0
          window.mech.weapons.ghostHeat.apply(grouped_weapons) if window.weapons.ghostHeat.is_enabled()

          _.each grouped_weapons, (weapon) =>
            weapon.click()

        false


      # Strip weapon
      $(".weapon-list").on "click", ".js-strip", ->
        $(this).parent().parent().parent().remove()

        window.persistence.rebuildPermalink()

        false

      # Strip all
      $("#js-stripall").click ->
        $('.js-strip').click()
        false

      # ready all initial weapons
      _.each $('.cooldown-meter'), @armWeapon

      $("#js-reset_damage").click (e) ->
        window.mech.resetDamage()
        window.mech.dps.resetTimer()

    weaponCounts: ->
      counter = {}

      _.each $('.js-fire'), (element) ->
        weapon = $(element).data('weapon-id')

        if counter[weapon] == undefined
          counter[weapon] = 0

        counter[weapon] = counter[weapon] + 1

      counter

    armWeapon: (progress) ->
      return true if typeof progress.initialized isnt 'undefined'

      progress.initialized = true
      progress = $(progress)
      progress.progressbar({
        done: ->
          weapon =  progress.parent().parent().siblings().find('.js-fire')

          weapon.removeClass('btn-default')
          weapon.addClass('btn-danger')
          weapon.addClass('ready')
          weapon.removeClass('not_ready')
          progress.removeClass('progress-bar-danger').addClass('progress-bar-success')

      })

    weaponStats: window.weaponsList

    applyHeat: (val) ->
      val = val * 100
      towards = val + window.mech.heatsink.getCurrentHeat()
      window.mech.setHeat(towards)

    damage: (val) ->
      mech.damage += val
      $('#damage').text(mech.damage.toFixed(2))

      if !mech.dps.clock
        mech.dps.clock = setInterval(mech.dps.incrementTimer, 1000)

      mech.dps.recompute()

    fireWeapon: (event) ->
      weapon_id = $(this).data("weaponId")

      stats = mech.weapons.weaponStats[weapon_id]
      heat_to_apply = stats.heat - (stats.heat * quirks.weaponheat(weapon_id))

      console.log "heat to apply is #{heat_to_apply}"

      window.weapons.applyHeat(heat_to_apply)
      window.mech.weapons.disableWeapon $(this)
      window.mech.weapons.damage(stats.damage)

      false

    disableWeapon: (weapon) ->
      weapon.removeClass("btn-danger").
        addClass("btn-default").
        removeClass("ready").
        addClass("not_ready")
      progress = $(weapon).parent().
        siblings('.weapon-cooldown-container').
        find('.progress .cooldown-meter')
      progress.addClass('quick-reset')
      progress.removeClass('progress-bar-success').addClass('progress-bar-danger')
      progress.attr('aria-valuenow', '0')

      weapon_id = $(weapon).data('weapon-id')
      basecooldown = window.weaponsList[weapon_id].cooldown
      cooldown_time = basecooldown - (basecooldown * quirks.weaponcooldown(weapon_id))

      $(progress).css(Modernizr.prefixed('transition'), "width #{cooldown_time}s ease-in-out")
      $(progress).css('width', '0%')

      # have to do this because of 2 consecutive transition's timing issues
      window.setTimeout (=>
        @enableWeapon weapon
      ), 1


    enableWeapon: (weapon) ->
      progress = $(weapon).parent().siblings('.weapon-cooldown-container').find('.progress .cooldown-meter')
      progress.removeClass('quick-reset')
      progress.progressbar()
      true




