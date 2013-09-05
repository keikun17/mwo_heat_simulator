$ ->
  window.heatsink=
    heatsink_display_el: '#heatsink-count'
    heatsink_type_el: '#heatsink_type'

    init: ->
      console.log("FIRE")
      $(@heatsink_display_el).on 'input', window.mech.refit
      $(@heatsink_type_el).on 'change', window.mech.refit

    getType: -> $('#heatsink_type').val()
    getCount: -> parseInt($('#heatsink-count').val())
    getThreshold: ->

      if window.heatsink.getType() == 'single'
        val = 30 + @getCount()
      else
        external_heatsinks = @getCount() - 10
        internal_heatsinks = @getCount() - external_heatsinks
        val = 30 + (external_heatsinks * 1.4) + (internal_heatsinks * 2)

      if isNaN(val)
        val = 0

      val
