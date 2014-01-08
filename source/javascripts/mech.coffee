#= require heatsink
#= require weapons
#= require ghost_heat
#= require engine
#= require skills
#= require map
#= require persistence

$ ->
  window.mech=

    init: ->
      window.heatsink.init()
      window.weapons.init()
      window.engine.init()
      window.skills.init()
      window.map.init()

      @refit()

    heatsink: window.heatsink
    engine: window.engine

    damage: 0


    refit: ->
      $('#heat-threshold').text( window.mech.heatsink.getThreshold() / 100 ) 
      $("#heatlevel").attr "aria-valuemax", window.mech.heatsink.getThreshold()
      $('#cool-rate').text(window.mech.heatsink.getCoolRate().toFixed(2))
      $('#internal-heatsinks').text(window.mech.heatsink.internal_heatsinks())

    weapons: window.weapons

    skills: window.skills

    resetDamage: ->
      mech.damage = 0

    setHeat: (heatlevel) ->
      $("#heatlevel").attr "aria-valuetransitiongoal", heatlevel
      $("#heatlevel").progressbar
        transition_delay: 100
        refresh_speed: 10
        display_text: "fill"
