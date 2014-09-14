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
        weaponClass = $(this).data("weaponClass")
        weaponName = $(this).data("weaponName")
        html = weaponView(
          name: weaponName
          weaponClass: weaponClass
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
        weapon = $(element).data('weapon-class')

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
    weaponStats:

      # ----------------------------------------------
      # Inner Sphere
      # ----------------------------------------------

      # Energy Weapons
      slas:
        damage: 3
        heat: 2
      mlas:
        damage: 5
        heat: 4
        multiplier: 1
      llas:
        damage: 9
        heat: 7
        multiplier: 2.8
      ellas:
        damage: 9
        heat: 8.5
        multiplier: 2.8
      splas:
        damage: 3.40
        heat: 2.4
      mplas:
        damage: 6
        heat: 4.6
      lplas:
        damage: 10.60
        heat: 8.0
        multiplier: 2.8
      ppc:
        damage: 10
        heat: 10
        multiplier: 7.0
      eppc:
        damage: 10
        heat: 15
        multiplier: 4.5
      flam:
        damage: .7
        heat: 1

      # Balistic Weapons
      ac2:
        damage: 2
        heat: 1
        multiplier: 0.6
      ac5:
        damage: 5
        heat: 1
      ac10:
        damage: 10
        heat: 3
      ac20:
        damage: 20
        heat: 6
        multiplier: 24
      uac5:
        damage: 5
        heat: 1
      lb10x:
        damage: 10
        heat: 2
      gauss:
        damage: 15
        heat: 1
      mg:
        damage: 0.1
        heat: 0

      # Missile
      lrm5:
        damage: 5.50
        heat: 2
      lrm10:
        damage: 11
        heat: 4
        multiplier: 2.8
      lrm15:
        damage: 16.50
        heat: 5
        multiplier: 2.8
      lrm20:
        damage: 22.0
        heat: 6
        multiplier: 2.8
      srm2:
        damage: 4.3
        heat: 2
        multiplier: 1
      srm4:
        damage: 8.6
        heat: 3
        multiplier: 1
      srm6:
        damage: 12.9
        heat: 4
        multiplier: 1
      ssrm2:
        damage: 5
        heat: 2
        multiplier: 1

      # ----------------------------------------------
      # Clans
      # ----------------------------------------------

      # Energy Weapons
      ceslas:
        damage: 4
        heat: 3
      cemlas:
        damage: 7
        heat: 6
      cellas:
        damage: 11
        heat: 10
      csplas:
        damage: 4.40
        heat: 3.4
      cmplas:
        damage: 7.4
        heat: 6
      clplas:
        damage: 11.6
        heat: 9
      ceppc:
        damage: 15
        heat: 15
      cflam:
        damage: .7
        heat: .6

      # Balistic Weapons
      cac2:
        damage: 2
        heat: 1
      cac5:
        damage: 5
        heat: 1
      cac10:
        damage: 10
        heat: 2
      cac20:
        damage: 20
        heat: 6

      cuac2:
        damage: 2
        heat: 1
      cuac5:
        damage: 5
        heat: 1
      cuac10:
        damage: 10
        heat: 3
      cuac20:
        damage: 20
        heat: 6

      clb2x:
        damage: 2
        heat: 1
      clb5x:
        damage: 5
        heat: 1
      clb10x:
        damage: 10
        heat: 2
      clb20x:
        damage: 20
        heat: 6

      cgauss:
        damage: 15
        heat: 1
      cmg:
        damage: 0.08
        heat: 0

      # Missile
      clrm5:
        damage: 5.50
        heat: 2
      clrm10:
        damage: 11
        heat: 4
      clrm15:
        damage: 16.50
        heat: 5
      clrm20:
        damage: 22.0
        heat: 6

      csrm2:
        damage: 4
        heat: 2
      csrm4:
        damage: 8
        heat: 3
      csrm6:
        damage: 12
        heat: 4

      cssrm2:
        damage: 4
        heat: 2
      cssrm4:
        damage: 8
        heat: 3
      cssrm6:
        damage: 12
        heat: 4

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
      weapon_name = $(this).data("weaponClass")
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




