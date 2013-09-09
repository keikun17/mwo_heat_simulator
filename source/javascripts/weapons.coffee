$ ->
  window.weapons=
    init: ->
      $('.weapon-list').on "click", "a.js-fire", @fireWeapon

      # Equip weapons
      $(".armory").on "click", ".js-add-weapon", ->
        weaponClass = $(this).data("weaponClass")
        weaponName = $(this).data("weaponName")
        html = weaponView(
          name: weaponName
          weaponClass: weaponClass
        )
        $(".weapon-list").append html
        false

      # Fire all Weapons
      $("#js-alphastrike").click ->
        $(".js-fire").click()

      # Fire weapon group
      $('.js-fire_weapon_group').click (e) ->
        e.preventDefault()
        group = $(@).data('activateGroup')

        # wgs : Weapon Groups
        wgs =  $("[data-weapon-group='#{group}'].js-weapon_group.assigned")

        _.each wgs, (wg) ->
          # Loop through all weapon groups for fired group and click it's weapon sibling
          $(wg).siblings('.js-fire').click()


      # Strip weapon
      $(".weapon-list").on "click", ".js-strip", ->
        $(this).parent().remove()

      # Strip all
      $("#js-stripall").click ->
        $('.js-strip').click()

    heatTable:

      # Energy Weapons
      slas: 2
      mlas: 3
      llas: 7
      ellas: 8.5
      splas: 2.4
      mplas: 5
      lplas: 8.5
      ppc: 10
      eppc: 12
      flam: .6

      # Balistic Weapons
      ac2: 1
      ac5: 1
      ac10: 3
      ac20: 6
      uac5: 1
      lb10x: 2
      gauss: 1
      mg: 0

      # Missile
      lrm5: 2
      lrm10: 4
      lrm15: 5
      lrm20: 6
      srm2: 2
      srm4: 3
      srm6: 4
      ssrm2: 2

    shoot: (val) ->
      val = val * 100
      console.log "-------"
      console.log "Adding Heat:"
      console.log val
      console.log "Current Heat Is:"
      console.log window.mech.heatsink.getCurrentHeat()
      towards = val + window.mech.heatsink.getCurrentHeat()
      $("#heatlevel").attr "aria-valuetransitiongoal", towards
      val = val * 100

    fireWeapon: (event) ->
      console.log('fire')
      weapon_name = $(this).data("weaponClass")
      window.weapons.shoot(window.weapons.heatTable[weapon_name])

