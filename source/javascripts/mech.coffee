$ ->
  class window.Mech
    instance = null

    @get: (@variant = 'default') ->
      instance ?= new PrivateMechClass(@variant)

    class PrivateMechClass
      constructor:(@variant) ->
        $('#heatsink-count').on 'input', @refit
        $('#heatsink_type').on 'change', @refit
        @refit()

      heatsink_type: 'single'
      heatsinks: 0
      heatsinks: 30
      weapons: []

      echo: -> @variant

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

