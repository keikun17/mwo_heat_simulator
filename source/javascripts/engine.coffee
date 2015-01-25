$ ->
  window.engine =
    init: ->
      $('#engine_type').on 'change', window.mech.refit

    rating: ->
      parseInt $('#engine_type').val()

    internal_heatsink_count: ->
      Math.floor(@rating() / 25)

    get_rating_from_id: (engine_id) ->
      engine_id = parseInt(engine_id)

      # IS Standar
      if parseInt(engine_id) in [3218..3278]
        rating = (engine_id - 3218) * 5 + 100

      # IS XL
      if parseInt(engine_id) in [3318..3378]
        rating = (engine_id - 3318) * 5 + 100

      # CLAN XL
      if parseInt(engine_id) in [3418..3478]
        rating = (engine_id - 3418) * 5 + 100

      rating

