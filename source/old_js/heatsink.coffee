$ ->
  console.log "Reactor: Online"

  # get heat value
  @currentHeat = ->
    val = parseInt($("#heatlevel").attr("aria-valuetransitiongoal"))
    val = 0  if isNaN(val)
    val

  @heatSinkCount = ->
    parseInt $("#heatsink-count").val()

  @isSingleHeatSink = ->
    $("#heatsink_type").val() is "single"


  # TODO Internal Heatsink count should be depended on the engine type
  @coolRate = ->
    if @isSingleHeatSink()
      rate = .1 * @heatSinkCount()
    else
      if @heatSinkCount() >= 10
        internal_heat_sink = 10
        external_heat_sink = @heatSinkCount() - internal_heat_sink
        rate = (internal_heat_sink * .2) + (external_heat_sink * .14)
      else
        rate = .14 * @heatSinkCount()
    rate


  # Run heatsinks
  @coolDown = ->
    towards = @currentHeat() - (@coolRate() * 100)
    if @currentHeat() > 0
      $("#heatlevel").attr "aria-valuetransitiongoal", towards
      $("#heatlevel").progressbar
        transition_delay: 100
        refresh_speed: 10
        display_text: "fill"


  @recomputeThreshold = ->
    if @isSingleHeatSink()
      threshold = 30 + (@heatSinkCount())
    else
      threshold = 30 + ((@heatSinkCount()) * 1.4)
    threshold = threshold * 100
    $("#heatlevel").attr "aria-valuemax", threshold
    $("#heat-threshold").text (threshold / 100)
    $("#cool-rate").text @coolRate().toPrecision(2)

  @tickRate = ->
    1000


  @tick = ->
    @coolDown()
    @recomputeThreshold()
    @timeToZero()

  @runTicker = ->
    console.log "Sensors: Online"
    setInterval @tick, @tickRate()

  @runTicker()

