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
        console.log('gets')
        $('#innersphere_weapons').show()
        $('#clan_weapons').hide()

      $('input[name="weapon_switcher"]').on 'switchChange.bootstrapSwitch', (event,state) ->
        # console.log this
        # console.log event
        # console.log state
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
        # console.log "count is " + wgs.length

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
          progress.removeClass('progress-bar-danger').addClass('progress-bar-success')

      })


    # NOTE ABOUT COOLDOWN TIMES : it's in the weapon_cooldown.scss
    weaponStats: window.weaponsList

    shoot: (val) ->
      val = val * 100
      towards = val + window.mech.heatsink.getCurrentHeat()
      window.mech.setHeat(towards)

    damage: (val) ->
      mech.damage += val
      $('#damage').text(mech.damage.toFixed(2))

      if !mech.dps.clock
        console.log("called")
        mech.dps.clock = setInterval(mech.dps.incrementTimer, 1000)

      mech.dps.recompute()

    fireWeapon: (event) ->
      # console.log('fire')
      weapon_name = $(this).data("weaponId")
      stats = mech.weapons.weaponStats[weapon_name]

      window.weapons.shoot(stats.heat)
      window.mech.weapons.disableWeapon $(this)

      # console.log "Damage : #{stats.damage}"
      window.mech.weapons.damage(stats.damage)

      false

    disableWeapon: (weapon) ->
      weapon.removeClass("btn-danger").
        addClass("btn-default").
        removeClass("ready")
      progress = $(weapon).parent().
        siblings('.weapon-cooldown-container').
        find('.progress .cooldown-meter')
      progress.addClass('quick-reset')
      progress.removeClass('progress-bar-success').addClass('progress-bar-danger')
      progress.attr('aria-valuenow', '0')
      progress.attr('style', 'width: 0%')

      # have to do this because of 2 consecutive transition's timing issues
      window.setTimeout (=>
        @enableWeapon weapon
      ), 1


    enableWeapon: (weapon) ->
      progress = $(weapon).parent().siblings('.weapon-cooldown-container').find('.progress .cooldown-meter')
      progress.removeClass('quick-reset')
      progress.progressbar()
      true




