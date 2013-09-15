$ ->
  window.weapons.ghostHeat.lrm_group=
    # Returns the total heat penalty for the list of weapons fired
    # Parameters:
    #   list - an array of dom elements with weaponClass data attribute
    #          that represents the weapons fired
    getPenalty: (list) ->
      list = $(list)
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
          # console.log "base heat is #{base_heat}"
          # console.log "multiplier is #{multiplier}"

          heat_scale = window.mech.weapons.ghostHeat.scale(index + lrm_max_alpha)
          # console.log "heat scale is #{heat_scale}"

          lrm_group_ghost_heat = ( base_heat * (heat_scale * multiplier) )
          # console.log "ghost heat is #{lrm_group_ghost_heat}"

      # SRM Linked penalty Group
      # srm_linked = 0
      # srm_linked = srm_linked + list.filter("[data-weapon-class='srm4']").length
      # srm_linked = srm_linked + list.filter("[data-weapon-class='srm6']").length
      # srm_linked

      lrm_group_ghost_heat

