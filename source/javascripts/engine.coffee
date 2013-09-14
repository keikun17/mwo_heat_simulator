$ ->
  window.engine =
    init: ->
      $('#engine_type').on 'change', window.mech.refit

    rating: ->
      parseInt $('#engine_type').val()

    internal_heatsink_count: ->
      Math.floor(@rating() / 25)
