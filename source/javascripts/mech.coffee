$ ->
  window.mech=
    heatsink_display_el: '#heatsink-count'
    heatsink_type_el: '#heatsink_type'

    init: ->
      $(@heatsink_display_el).on 'input', @refit
      $(@heatsink_type_el).on 'change', @refit
      @refit()

    heatsink:
      getType: -> $('#heatsink_type').val()
      getCount: -> parseInt($('#heatsink-count').val())
      getThreshold: ->
        if @getType() == 'single'
          val = 30 + @getCount()
          console.log("1 #{val}")
        else
          external_heatsinks = @getCount() - 10
          internal_heatsinks = @getCount() - external_heatsinks
          val = 30 + (external_heatsinks * 1.4) + (internal_heatsinks * 2)
          console.log("2 #{val}")

        if isNaN(val)
          console.log("3 #{val}")
          val = 0


        console.log("4 #{val}")
        val

    refit: ->
      console.log("heattsink type is #{window.mech.heatsink.getType()}")
      $('#heat-threshold').text(window.mech.heatsink.getThreshold())

    weapons: []

