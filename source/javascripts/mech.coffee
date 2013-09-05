#= require heatsink

$ ->
  window.mech=

    init: ->
      window.heatsink.init()
      @refit()

    heatsink: window.heatsink

    refit: ->
      $('#heat-threshold').text(window.mech.heatsink.getThreshold())
      $('#cool-rate').text(window.mech.heatsink.getCoolRate())

    weapons: []
