#= require heatsink
#= require weapons

$ ->
  window.mech=

    init: ->
      window.heatsink.init()
      @refit()

    heatsink: window.heatsink

    refit: ->
      $('#heat-threshold').text(window.mech.heatsink.getThreshold() / 100)
      $("#heatlevel").attr "aria-valuemax", window.mech.heatsink.getThreshold()
      $('#cool-rate').text(window.mech.heatsink.getCoolRate().toPrecision(2))

    weapons: window.weapons
