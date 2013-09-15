$ ->
  window.weapons.ghostHeat=
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
      ghost_heat = 0
      lrm_group_ghost_heat = 0

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

          heat_scale = window.mech.weapons.ghostHeat.scale(index + lrm_max_alpha)
          console.log "multiplier is #{multiplier}"

          lrm_group_ghost_heat = ( base_heat * (heat_scale * multiplier) )
          console.log "ghost heat is #{lrm_group_ghost_heat}"

      # SRM Linked penalty Group
      # srm_linked = 0
      # srm_linked = srm_linked + list.filter("[data-weapon-class='srm4']").length
      # srm_linked = srm_linked + list.filter("[data-weapon-class='srm6']").length
      # srm_linked

      ghost_heat = lrm_group_ghost_heat
      ghost_heat

    apply: (list) ->
      penalty = @getPenalty(list) * 100
      console.log "penalty is #{penalty}"
      towards = penalty + window.mech.heatsink.getCurrentHeat()
      console.log "ghost heat going to #{towards}"
      window.mech.setHeat(towards)

