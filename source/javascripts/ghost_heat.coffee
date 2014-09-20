$ ->
  window.weapons.ghostHeat=

    is_enabled: ->
     $('#ghost_heat').is(':checked')

    # HERE BE DRAGONS

    # Returns the heatscale for the number of shots fired
    # Parameters:
    #   count - Number of  weapons fired under a weapon group in an Alpha
    scale: (count) ->
      heat_scale = switch
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
        when count >= 12 then 5.00

      heat_scale


    # Returns the total heat penalty for the list of weapons fired
    # Parameters: (list, group, max_alpha)
    #   list - an array of dom elements with weaponId data attribute
    #          that contains the ids of the weapons fired
    #   weapon_group_id - the weapon group that has linked ghost heat, should be in ascending
    #          order of the ghost heat of the weapons (e.g. ['lrm10', 'lrm15', lrm20'])
    #   max_alpha - max alpha of the weapon group
    getPenalty: (list, group, max_alpha) ->
      console.log('called `getPenalty`')
      list = $(list)

      list = $(list)
      group_ghost_heat = 0

      link_fired = []

      _.each group, (element) =>
        link_fired = link_fired.concat list.filter("[data-weapon-id='#{element}']").toArray()



      if link_fired.length > max_alpha
        console.log("link fired is ")
        console.log(link_fired)

        # Take only those who exceeded the safe threshold
        _.times max_alpha, =>
          link_fired.shift()

        group_ghost_heat = 0

        _.each link_fired, (element, index, list) =>
          weapon_position = index + 1 + max_alpha
          element = $(element)

          base_heat = window.mech.weapons.weaponStats[element.data('weaponId')].heat
          multiplier = window.mech.weapons.weaponStats[element.data('weaponId')].multiplier

          heat_scale = window.mech.weapons.ghostHeat.scale(weapon_position)

          ghost_heat = ( base_heat * (heat_scale * multiplier) )
          group_ghost_heat = group_ghost_heat + ghost_heat

      group_ghost_heat

    # Returns the total heat penalty for the list of weapons fired
    # Parameters:
    #   list - an array of dom elements with weaponId data attribute
    #          that represents the weapons fired
    computeTotalPenalty: (list) ->
      console.log('called `computeTotalPenalty`')
      list = $(list)
      group_ghost_heat = 0
      individual_ghost_heat = 0

      # REIMPLEMENT
      # --------------------

      weapons_fired_by_id  = {}
      group_fire = {}
      #--------------------
      # 1 .Get the weapon ids [1000,1002,1003]
      #--------------------
      weapon_ids = ($(element).data('weaponId') for element in list)

      #--------------------
      # 2. Get the count for each "ghost heat group" using the collected weapon id
      # example :  2 ppcs fired, 3 ER PPC fired.
      #            PPC id is '1009'
      #            ERPPC id is '1006'
      #            Firing order is 'PPC', 'ERPPC', 'PPC', 'ERPPC', 'PPC'
      #            Ghost heat trigger for PPC and ERPPC is `3`
      #            Ghost heat group id for ERPPC and PPC is `1`
      #
      #  Return:  group_fire = {
      #             {1: { fire_order = [1009, 1006, 1009, 1006, 1009],
      #                   weapon_ids: {
      #                                 1006: {
      #                                         fire_count: 2,
      #                                         ghost_heat: XXX
      #                                      },
      #                                 1009: {
      #                                         fire_count: 3,
      #                                         ghost_heat: XXX
      #                                       }
      #                               },
      #                   ghost_heat_trigger: 3,
      #                   total_fire_count: 5,
      #                   ghost_heat: XXX
      #                   } },
      #            ...}
      # --------------------
      _.each weapon_ids, (weapon_id, index ) =>
        weapon = window.weaponsList[weapon_id]
        group_id = weapon.ghost_heat_group


        if group_id != null

          # Initialize
          if group_fire[group_id] == undefined
            group_fire[group_id] = {}

          # --------------------
          # Fire order of weapons
          # --------------------
          # Initialize if first pass
          if group_fire[group_id].fire_order == undefined
            group_fire[group_id].fire_order = []

          group_fire[group_id].fire_order.push(weapon_id)

          # --------------------
          # Fire count of weapons
          # --------------------
          # Initialize if first pass
          if group_fire[group_id].weapon_ids == undefined
            group_fire[group_id].weapon_ids = {}
          if group_fire[group_id].weapon_ids[weapon_id] == undefined
            group_fire[group_id].weapon_ids[weapon_id] = {fire_count: 0, ghost_heat: 0}

          group_fire[group_id].weapon_ids[weapon_id].fire_count++


          # --------------------
          # Fire count of the ghost heat group
          # --------------------
          # Initialize on first pass
          if group_fire[group_id].total_fire_count == undefined
            group_fire[group_id].total_fire_count = 0

          group_fire[group_id].total_fire_count++

          # --------------------
          # Set the ghost_heat_trigger
          # --------------------
          group_fire[group_id].ghost_heat_trigger = window.ghostHeatGroups[group_id].ghost_heat_trigger

          # --------------------
          # Get ghost heat generated
          # --------------------
          if group_fire[group_id].ghost_heat_trigger <= group_fire[group_id].total_fire_count
            heat_scale_position = group_fire[group_id].total_fire_count
            heat_scale_multiplier = weapons.ghostHeat.scale(heat_scale_position)

            console.log(heat_scale_multiplier)

            ghost_heat = weapon.heat * heat_scale_multiplier * weapon.multiplier

            # set value at the waepon level
            group_fire[group_id].weapon_ids[weapon_id].ghost_heat += ghost_heat
            # set value at the group level
            group_fire[group_id].ghost_heat += ghost_heat
            # set the value at the overall level
            group_ghost_heat += ghost_heat

      # TODO: remove this debugger
      window.group_fire = group_fire

      total_ghost_heat = group_ghost_heat + individual_ghost_heat


      # --------------------
      # Single penaltyy + group penalty
      # --------------------
      # ghost_heat = lrm_group_ghost_heat +
      #   srm_group_ghost_heat +
      #   llas_group_ghost_heat +
      #   ppc_group_ghost_heat +
      #   @getPenalty(list, ['ac2'], 3) +
      #   @getPenalty(list, ['ac20'], 1) +
      #   @getPenalty(list, ['mlas'], 6) +
      #   @getPenalty(list, ['srm2'], 4) +
      #   @getPenalty(list, ['ssrm2'], 4)

      total_ghost_heat

    apply: (list) ->
      console.log('called `apply`')
      penalty = @computeTotalPenalty(list)
      $('#ghost_heat_penalty').text(penalty)
      penalty = penalty * 100
      towards = penalty + window.mech.heatsink.getCurrentHeat()
      window.mech.setHeat(towards)


