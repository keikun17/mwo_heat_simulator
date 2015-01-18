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
    # Parameters:
    #   list - an array of dom elements with weaponId data attribute
    #          that represents the weapons fired
    computeTotalPenalty: (list) ->
      list = $(list)
      group_ghost_heat = 0
      individual_ghost_heat = 0

      # REIMPLEMENT
      # --------------------

      weapons_fired_by_id  = {}
      group_fire = {} # for Ghost-linked weapons
      solo_fire = {}  # for standalone ghost-heat weapons
      #--------------------
      # 1 .Get the weapon ids [1000,1002,1003]
      #--------------------
      weapon_ids = ($(element).data('weaponId') for element in list)

      _.each weapon_ids, (weapon_id, index ) =>
        weapon = window.weaponsList[weapon_id]
        group_id = weapon.ghost_heat_group

        # --------------------
        # 2A. With Ghost heat but not Ghost-linked
        #
        # example :  3 AC20s and 10 autocannon 2 fired
        #
        #       Autocannon20 id is 1000
        #       Autocannon2 id is 1018
        #       Ghost heat trigger for AC20 is 2
        #       Ghost heat trigger for AC2 is 4
        #
        #   {
        #     1000: {
        #       fire_count: 2,
        #       ghost_heat: XXX,
        #       ghost_heat_trigger: 2
        #       },
        #     1018: {
        #       fire_count: 3,
        #       ghost_heat: XXX,
        #       ghost_heat_trigger: 4
        #     }
        #   }
        #
        # --------------------
        if group_id == null and weapon.ghost_heat_trigger != null

          # Initialize if first pass
          if solo_fire[weapon_id] == undefined
            solo_fire[weapon_id] = {fire_count: 0, ghost_heat: 0, ghost_heat_trigger: weapon.ghost_heat_trigger}

          # Increment fire count
          solo_fire[weapon_id].fire_count++

          # Get Ghost heat generated
          if solo_fire[weapon_id].ghost_heat_trigger <= solo_fire[weapon_id].fire_count
            heat_scale_position = solo_fire[weapon_id].fire_count
            heat_scale_multiplier = weapons.ghostHeat.scale(heat_scale_position)

            quirked_weapon_heat = weapon.heat - (weapon.heat * quirks.weaponheat(weapon_id))
            ghost_heat = quirked_weapon_heat * heat_scale_multiplier * weapon.multiplier

            # set ghost heat at weapon level
            solo_fire[weapon_id].ghost_heat += ghost_heat

            # set the value at overall level
            individual_ghost_heat += ghost_heat


        # --------------------
        # 2B. Ghost-linked weapons
        # Get the count for each "ghost heat group" using the collected weapon id
        #
        # example :  2 ppcs fired, 3 ER PPC fired.
        #
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

            ghost_heat = weapon.heat * heat_scale_multiplier * weapon.multiplier

            # set value at the waepon level
            group_fire[group_id].weapon_ids[weapon_id].ghost_heat += ghost_heat

            # Set value at the group level
            if group_fire[group_id].ghost_heat == undefined
              group_fire[group_id].ghost_heat = 0

            group_fire[group_id].ghost_heat += ghost_heat

            # set the value at the overall level
            group_ghost_heat += ghost_heat

      total_ghost_heat = group_ghost_heat + individual_ghost_heat


      # The final value
      total_ghost_heat

    apply: (list) ->
      penalty = @computeTotalPenalty(list)
      $('#ghost_heat_penalty').text(penalty)
      penalty = penalty * 100
      towards = penalty + window.mech.heatsink.getCurrentHeat()
      window.mech.setHeat(towards)


