$ ->
  window.weapons=
    init: ->
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
        false

      # Strip all
      $("#js-stripall").click ->
        $('.js-strip').click()
        false

      # ready all initial weapons
      _.each $('.cooldown-meter'), @armWeapon

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

      # Energy Weapons
      slas:
        heat: 2
        damage: 3
      mlas:
        heat: 4
        multiplier: 1
        damage: 5
      llas:
        heat: 7
        multiplier: 2.8
        damage: 9
      ellas:
        heat: 8.5
        multiplier: 2.8
        damage: 9
      splas:
        heat: 2.4
        damage: 3.40
      mplas:
        heat: 5
        damage: 6
      lplas:
        heat: 8.5
        multiplier: 2.8
        damage: 10.60
      ppc:
        heat: 10
        multiplier: 7.0
        damage: 10
      eppc:
        heat: 12
        multiplier: 4.5
        damage: 10
      flam:
        heat: .6
        damage: 0.70

      # Balistic Weapons
      ac2:
        heat: 1
        multiplier: 0.6
        damage: 2
      ac5:
        heat: 1
        damage: 5
      ac10:
        heat: 3
        damage: 10
      ac20:
        heat: 6
        multiplier: 24
        damage: 20
      uac5:
        heat: 1
        damage: 5
      lb10x:
        heat: 2
        damage: 10
      gauss:
        heat: 1
        damage: 15
      mg:
        heat: 0
        damage: 0.1

      # Missile
      lrm5:
        heat: 2
        damage: 5.50
      lrm10:
        heat: 4
        multiplier: 2.8
        damage: 11
      lrm15:
        heat: 5
        multiplier: 2.8
        damage: 16.50
      lrm20:
        heat: 6
        multiplier: 2.8
        damage: 22.0
      srm2:
        heat: 2
        multiplier: 1
        damage: 4
      srm4:
        heat: 3
        multiplier: 1
        damage: 8
      srm6:
        heat: 4
        multiplier: 1
        damage: 12
      ssrm2:
        heat: 2
        multiplier: 1
        damage: 5



    shoot: (val) ->
      val = val * 100
      towards = val + window.mech.heatsink.getCurrentHeat()
      window.mech.setHeat(towards)

    damage: (val) ->
      $('#damage').text(val)

    fireWeapon: (event) ->
      # console.log('fire')
      weapon_name = $(this).data("weaponClass")
      stats = mech.weapons.weaponStats[weapon_name]

      window.weapons.shoot(stats.heat)
      window.mech.weapons.disableWeapon $(this)

      console.log "Damage : #{stats.damage}"
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




