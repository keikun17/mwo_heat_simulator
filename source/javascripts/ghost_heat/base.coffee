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
      lrm_group_ghost_heat = @lrm_group.getPenalty(list)

      ghost_heat = lrm_group_ghost_heat
      ghost_heat

    apply: (list) ->
      penalty = @getPenalty(list)
      console.log "Ghost heat penalty is #{penalty}"
      penalty = penalty * 100
      towards = penalty + window.mech.heatsink.getCurrentHeat()
      window.mech.setHeat(towards)

