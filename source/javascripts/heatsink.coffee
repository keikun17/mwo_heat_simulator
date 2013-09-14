$ ->
  window.heatsink=

    init: ->
      heatsink_display_el = '#heatsink-count'
      heatsink_type_el =  '#heatsink_type'
      coolant_el = '#flush_coolant'
      $(heatsink_display_el).on 'input', window.mech.refit
      $(heatsink_type_el).on 'change', window.mech.refit
      $(coolant_el).on 'click', ->
        window.mech.setHeat(0)

      @runTicker()

    getType: -> $('#heatsink_type').val()

    external_heatsinks: -> parseInt($('#heatsink-count').val())
    internal_heatsinks: -> window.mech.engine.internal_heatsink_count()

    getCurrentHeat: ->
      val = parseInt($("#heatlevel").attr("aria-valuetransitiongoal"))
      val = 0  if isNaN(val)
      val

    getThreshold: ->
      if window.heatsink.getType() == 'single'
        val = 30 + @external_heatsinks()
      else
        val = 30 + (@external_heatsinks() * 1.4)

      if isNaN(val)
        val = 0

      val * 100

    getCoolRate: ->
      if window.heatsink.getType() == 'single'
        rate = .1 * (@external_heatsinks() + @internal_heatsinks())
      else
        if @external_heatsinks() >= 0
          rate = (@internal_heatsink() * .2) + (@external_heatsinks() * .14)
        else
          rate = .14 * heatSinkCount()
      rate

    tickRate: 1000

    timeToZero: ->
      time = @getCurrentHeat() / (@getCoolRate() * 100)
      time = time.toPrecision(2)
      time = 0 if time < 0
      $('#cooldown_time').text(time)

    coolDown: ->
      towards = @getCurrentHeat() - (@getCoolRate() * 100)
      if @getCurrentHeat() > 0
        window.mech.setHeat(towards)
        @timeToZero()


    doTick: ->
      window.mech.heatsink.coolDown()
      # @recomputeThreshold()

    runTicker: ->
      setInterval @doTick, @tickRate

