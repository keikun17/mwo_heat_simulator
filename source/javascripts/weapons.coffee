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
        $(".js-fire.ready").click()

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
        console.log "count is " + wgs.length

        _.each wgs, (wg) ->
          # Loop through all weapon groups for fired group and click it's weapon sibling
          $(wg).siblings('.js-fire.ready').click()

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
      mlas:
        heat: 3
      llas:
        heat: 7
      ellas:
        heat: 8.5
      splas:
        heat: 2.4
      mplas:
        heat: 5
      lplas:
        heat: 8.5
      ppc:
        heat: 10
      eppc:
        heat: 12
      flam:
        heat: .6

      # Balistic Weapons
      ac2:
        heat: 1
      ac5:
        heat: 1
      ac10:
        heat: 3
      ac20:
        heat: 6
      uac5:
        heat: 1
      lb10x:
        heat: 2
      gauss:
        heat: 1
      mg:
        heat: 0

      # Missile
      lrm5:
        heat: 2
      lrm10:
        heat: 4
      lrm15:
        heat: 5
      lrm20:
        heat: 6
      srm2:
        heat: 2
      srm4:
        heat: 3
      srm6:
        heat: 4
      ssrm2:
        heat: 2

    heatScale:
      multiplier: (count) ->
        multiplier = switch
          when count < 2 then 0
          when count == 2 then 0.08
          when count == 3 then 0.18
          when count ==  4 then 0.30
          when count ==  5 then 0.45
          when count ==  6 then 0.60
          when count ==  7 then 0.80
          when count ==  9 then 1.10
          when count ==  9 then 1.50
          when count ==  10 then 2.00
          when count ==  11 then 3.00
          when count <= 12 then 5.00

        multiplier

    shoot: (val) ->
      val = val * 100
      towards = val + window.mech.heatsink.getCurrentHeat()
      window.mech.setHeat(towards)
      val = val * 100

    fireWeapon: (event) ->
      console.log('fire')
      weapon_name = $(this).data("weaponClass")
      window.weapons.shoot(window.mech.weapons.weaponStats[weapon_name].heat)
      window.mech.weapons.disableWeapon $(this)
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




