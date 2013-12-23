$ ->
  window.map =
    init: ->
      $('#map').on 'change', window.mech.refit

    modifier:
      capacity: ->
        parseFloat $('#map').find(':selected').data('capacity')
      dissipation: ->
        parseFloat $('#map').find(':selected').data('dissipation')
