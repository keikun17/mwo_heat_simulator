$ ->
  window.weapons.ghostHeat=

    is_enabled: ->
     $('#ghost_heat').is(':checked')

    # Returns the heatscale for the number of shots fired
    # Parameters:
    #   count - Number of  weapons fired under a weapon group in an Alpha
    scale: (count) ->
      # console.log "count is #{count}"
      multiplier = switch
        when count < 2 then 0
        when count == 2 then 0.08
        when count == 3 then 0.18
        when count ==  4 then 0.30
        when count ==  5 then 0.45
        when count ==  6 then 0.60
        when count ==  7 then 0.80
        when count ==  8 then 1.10
        when count ==  9 then 1.50
        when count ==  10 then 2.00
        when count ==  11 then 3.00
        when count <= 12 then 5.00

      multiplier


    # Returns the total heat penalty for the list of weapons fired
    # Parameters: (list, group, max_alpha)
    #   list - an array of dom elements with weaponClass data attribute
    #          that represents the weapons fired
    #   group - the weapon group that has linked ghost heat, should be in ascending
    #          order of the ghost heat of the weapons (e.g. ['lrm10', 'lrm15', lrm20'])
    #   max_alpha - max alpha of the weapon group
    getPenalty: (list, group, max_alpha) ->
      list = $(list)

      list = $(list)
      group_ghost_heat = 0

      link_fired = []

      _.each group, (element) =>
        link_fired = link_fired.concat list.filter("[data-weapon-class='#{element}']").toArray()

      # console.log(link_fired)

      # console.log "There are #{link_fired.length} Lrm-group weapons linked"

      if link_fired.length > max_alpha
        _.times max_alpha, =>
          link_fired.shift()

        # console.log(link_fired)
        group_ghost_heat = 0

        _.each link_fired, (element, index, list) =>
          # console.log "index is #{index}"
          weapon_position = index + 1 + max_alpha
          element = $(element)

          base_heat = window.mech.weapons.weaponStats[element.data('weaponClass')].heat
          multiplier = window.mech.weapons.weaponStats[element.data('weaponClass')].multiplier
          # console.log "base heat is #{base_heat}"
          # console.log "multiplier is #{multiplier}"

          heat_scale = window.mech.weapons.ghostHeat.scale(weapon_position)
          # console.log "heat scale is #{heat_scale}"

          ghost_heat = ( base_heat * (heat_scale * multiplier) )
          # console.log "ghost heat is #{ghost_heat}"
          group_ghost_heat = group_ghost_heat + ghost_heat

      # console.log("Total Group Ghost heat is #{group_ghost_heat}")
      group_ghost_heat

    # Returns the total heat penalty for the list of weapons fired
    # Parameters:
    #   list - an array of dom elements with weaponClass data attribute
    #          that represents the weapons fired
    computeTotalPenalty: (list) ->
      list = $(list)
      ghost_heat = 0

      lrm_group = ['lrm10', 'lrm15', 'lrm20']
      lrm_max_alpha = 2
      lrm_group_ghost_heat = @getPenalty(list, lrm_group, lrm_max_alpha)

      srm_group = ['srm4', 'srm6']
      srm_max_alpha = 3
      srm_group_ghost_heat = @getPenalty(list, srm_group, srm_max_alpha)

      llas_group = ['llas', 'ellas', 'lplas']
      llas_max_alpha = 3
      llas_group_ghost_heat = @getPenalty(list, llas_group, llas_max_alpha)

      ppc_group = ['ppc', 'eppc']
      ppc_max_alpha = 3
      ppc_group_ghost_heat = @getPenalty(list, ppc_group, ppc_max_alpha)

      ghost_heat = lrm_group_ghost_heat +
        srm_group_ghost_heat +
        llas_group_ghost_heat +
        ppc_group_ghost_heat +
        @getPenalty(list, ['ac2'], 3) +
        @getPenalty(list, ['ac20'], 1) +
        @getPenalty(list, ['mlas'], 6) +
        @getPenalty(list, ['srm2'], 4) +
        @getPenalty(list, ['ssrm2'], 4)

      console.log "Total Ghost Heat is #{ghost_heat}"
      ghost_heat

    apply: (list) ->
      penalty = @computeTotalPenalty(list)
      # console.log "Ghost heat penalty is #{penalty}"
      $('#ghost_heat_penalty').text(penalty)
      penalty = penalty * 100
      towards = penalty + window.mech.heatsink.getCurrentHeat()
      window.mech.setHeat(towards)


