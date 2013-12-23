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

    external_heatsinks: -> 
      hs = parseInt($('#heatsink-count').val())
      hs = 0 if isNaN(hs)
      hs

    internal_heatsinks: ->
      hs = window.mech.engine.internal_heatsink_count()
      hs = 10 if hs > 10
      hs

    getCurrentHeat: ->
      val = parseInt($("#heatlevel").attr("aria-valuetransitiongoal"))
      val = 0  if isNaN(val)
      val

    getThreshold: ->
      if window.heatsink.getType() == 'single'
        val = 30 + @external_heatsinks() + @internal_heatsinks()
      else
        val = 30 + (@external_heatsinks() * 1.4) + (@internal_heatsinks() * 2)

      if isNaN(val)
        val = 0

      if window.mech.skills.heatContainmentEnabled()
        if window.mech.skills.eliteMechEnabled()
          val = val * 1.20
        else
          val =  val * 1.10

      val = val * 100 * window.map.modifier.capacity()

      val

    getCoolRate: ->
      if window.heatsink.getType() == 'single'
        rate = .1 * (@external_heatsinks() + @internal_heatsinks())
      else
        if @external_heatsinks() >= 0
          rate = (@internal_heatsinks() * .2) + (@external_heatsinks() * .14)
        else
          rate = .14 * heatSinkCount()

      if window.mech.skills.coolRunEnabled()
        if window.mech.skills.eliteMechEnabled()
          rate = rate * 1.15
        else
          rate =  rate * 1.075

      rate = rate * window.map.modifier.dissipation()
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

