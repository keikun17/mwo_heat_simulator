$ ->
  window.map =
    init: ->
      $('#map').on 'change', window.map.changemap
      window.map.changemap()


    changemap: ->
      window.mech.refit()
      $('#dissipation').text("#{window.map.modifier.dissipation() * 100}%")
      $('#capacity').text("#{window.map.modifier.capacity() * 100}%")

    modifier:
      capacity: ->
        1 + parseFloat($('#map').find(':selected').data('capacity'))
      dissipation: ->
        1 + parseFloat($('#map').find(':selected').data('dissipation'))

