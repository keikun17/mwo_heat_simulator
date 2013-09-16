$ ->
  window.weapons.ghostHeat.lrm_group=
    # Returns the total heat penalty for the list of weapons fired
    # Parameters:
    #   list - an array of dom elements with weaponClass data attribute
    #          that represents the weapons fired
    getPenalty: (list) ->
      list = $(list)

      list = $(list)
      group_ghost_heat = 0

      # LRM Linked penalty Group
      max_alpha = 2
      link_fired = []

      # This must be ordered in descending order accdg to base heat 
      # to ensure that the lower heat gets shifted out when counting 
      # weapons that exceed max alpha
      link_fired = link_fired.concat list.filter("[data-weapon-class='lrm10']").toArray()
      link_fired = link_fired.concat list.filter("[data-weapon-class='lrm15']").toArray()
      link_fired = link_fired.concat list.filter("[data-weapon-class='lrm20']").toArray()

      console.log(link_fired)

      console.log "There are #{link_fired.length} Lrm-group weapons linked"

      if link_fired.length > max_alpha
        _.times max_alpha, =>
          link_fired.shift()

        console.log(link_fired)
        group_ghost_heat = 0


        _.each link_fired, (element, index, list) =>
          console.log "index is #{index}"
          weapon_position = index + 1 + max_alpha
          element = $(element)

          base_heat = window.mech.weapons.weaponStats[element.data('weaponClass')].heat
          multiplier = window.mech.weapons.weaponStats[element.data('weaponClass')].multiplier
          console.log "base heat is #{base_heat}"
          console.log "multiplier is #{multiplier}"

          heat_scale = window.mech.weapons.ghostHeat.scale(weapon_position)
          console.log "heat scale is #{heat_scale}"

          ghost_heat = ( base_heat * (heat_scale * multiplier) )
          console.log "ghost heat is #{ghost_heat}"
          group_ghost_heat = group_ghost_heat + ghost_heat

      group_ghost_heat

