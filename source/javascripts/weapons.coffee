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

        grouped_weapons = []

        _.each wgs, (wg) =>
          # Find weapon beside weapon group label
          weapon = $(wg).siblings('.js-fire.ready')[0]
          grouped_weapons.push weapon

        console.log grouped_weapons
        window.mech.weapons.ghostHeat.apply(grouped_weapons)

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
      mlas:
        heat: 3
        multiplier: 1
      llas:
        heat: 7
        multiplier: 2.8
      ellas:
        heat: 8.5
        multiplier: 2.8
      splas:
        heat: 2.4
      mplas:
        heat: 5
      lplas:
        heat: 8.5
        multiplier: 2.8
      ppc:
        heat: 10
        multiplier: 7.0
      eppc:
        heat: 12
        multiplier: 4.5
      flam:
        heat: .6

      # Balistic Weapons
      ac2:
        heat: 1
        multiplier: 1
      ac5:
        heat: 1
      ac10:
        heat: 3
      ac20:
        heat: 6
        multiplier: 24
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
        multiplier: 2.8
      lrm15:
        heat: 5
        multiplier: 2.8
      lrm20:
        heat: 6
        multiplier: 2.8
      srm2:
        heat: 2
        multiplier: 1
      srm4:
        heat: 3
        multiplier: 1
      srm6:
        heat: 4
        multiplier: 1
      ssrm2:
        heat: 2
        multiplier: 1

    ghostHeat:
      # Returns the heatscale for the number of shots fired
      # Parameters:
      #   count - Number of  weapons fired under a weapon group in an Alpha
      scale: (count) ->
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

      # Returns the total heat penalty for the list of weapons fired
      # Parameters:
      #   list - an array of dom elements with weaponClass data attribute
      #          that represents the weapons fired
      getPenalty: (list) ->
        list = $(list)

        # LRM Linked penalty Group
        lrm_max_alpha = 2
        lrm_linked = []

        lrm_linked = lrm_linked.concat list.filter("[data-weapon-class='lrm20']").toArray()
        lrm_linked = lrm_linked.concat list.filter("[data-weapon-class='lrm15']").toArray()
        lrm_linked = lrm_linked.concat list.filter("[data-weapon-class='lrm10']").toArray()

        console.log "There are #{lrm_linked.length} Lrm-group weapons linked"

        if lrm_linked.length > lrm_max_alpha
          _.times lrm_max_alpha, =>
            lrm_linked.shift()

          console.log(lrm_linked)
          lrm_group_ghost_heat = 0
          _.each lrm_linked, (element, index, list) =>
            index = index + 1 + lrm_max_alpha
            element = $(element)

            base_heat = window.mech.weapons.weaponStats[element.data('weaponClass')].heat
            multiplier = window.mech.weapons.weaponStats[element.data('weaponClass')].multiplier

            console.log "base heat is #{base_heat}"

            heat_scale = window.mech.weapons.heatScale.scale(index + lrm_max_alpha)
            console.log "multiplier is #{multiplier}"

            lrm_group_ghost_heat = ( base_heat * (heat_scale * multiplier) )
            console.log "ghost heat is #{lrm_group_ghost_heat}"

          ghost_heat = lrm_group_ghost_heat


        # SRM Linked penalty Group
        # srm_linked = 0
        # srm_linked = srm_linked + list.filter("[data-weapon-class='srm4']").length
        # srm_linked = srm_linked + list.filter("[data-weapon-class='srm6']").length
        # srm_linked

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




