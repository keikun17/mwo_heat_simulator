#= require heatsink
#= require weapons

$ ->
  window.mech=

    init: ->
      window.heatsink.init()
      window.weapons.init()
      @refit()

    heatsink: window.heatsink

    refit: ->
      $('#heat-threshold').text(window.mech.heatsink.getThreshold() / 100)
      $("#heatlevel").attr "aria-valuemax", window.mech.heatsink.getThreshold()
      $('#cool-rate').text(window.mech.heatsink.getCoolRate().toPrecision(2))

    weapons: window.weapons

    setHeat: (heatlevel) ->
      $("#heatlevel").attr "aria-valuetransitiongoal", heatlevel
      $("#heatlevel").progressbar
        transition_delay: 100
        refresh_speed: 10
        display_text: "fill"
