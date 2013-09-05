$ ->
  window.heatsink=

    init: ->
      heatsink_display_el = '#heatsink-count'
      heatsink_type_el =  '#heatsink_type'
      $(heatsink_display_el).on 'input', window.mech.refit
      $(heatsink_type_el).on 'change', window.mech.refit
      @runTicker()

    getType: -> $('#heatsink_type').val()

    getCount: -> parseInt($('#heatsink-count').val())

    getCurrentHeat: ->
      val = parseInt($("#heatlevel").attr("aria-valuetransitiongoal"))
      val = 0  if isNaN(val)
      val

    getThreshold: ->
      if window.heatsink.getType() == 'single'
        val = 30 + @getCount()
      else
        val = 30 + (@getCount() * 1.4)

      if isNaN(val)
        val = 0

      val

    getCoolRate: ->
      if window.heatsink.getType() == 'single'
        rate = .1 * @getCount()
      else
        if @getCount() >= 0
          external_heatsinks = @getCount() - 10
          internal_heatsinks = @getCount() - external_heatsinks
          rate = (internal_heatsinks * .2) + (external_heatsinks * .14)
        else
          rate = .14 * heatSinkCount()
      rate

    tickRate: 1000

    coolDown: ->
      towards = @getCurrentHeat() - (@getCoolRate() * 100)
      if @getCurrentHeat() > 0
        $("#heatlevel").attr "aria-valuetransitiongoal", towards
        $("#heatlevel").progressbar
          transition_delay: 100
          refresh_speed: 10
          display_text: "fill"

    doTick: ->
      window.mech.heatsink.coolDown()
      # @recomputeThreshold()

    runTicker: ->
      setInterval @doTick, @tickRate

