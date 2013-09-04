$ ->
  @mech =
  heatsink_type: 'single'
  heatsinks: 0
  threshold: 30
  weapons: []

  refit: ->
    @heatsink_type = $('#heatsink_type').val()
    @heatsinks = parseInt($('#heatsink-count').val());

    console.log("heatsink type is: " +  @heatsink_type)

    # Compute for threshold
    if @heatsink_type == 'single'
      @threshold = 30 + @heatsinks
    else
      external_heatsinks = @heatsinks - 10
      internal_heatsinks = @heatsinks - external_heatsinks
      @threshold = 30 + (external_heatsinks * 1.4) + (internal_heatsinks * 2)

    if isNaN(@threshold)
      @threshold = 0

    $('#heat-threshold').text(@threshold)

  init: ->
    $('#heatsink-count').on 'input', @refit
    $('#heatsink_type').on 'change', @refit

    @refit()
