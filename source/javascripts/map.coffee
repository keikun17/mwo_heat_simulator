$ ->
  window.map =
    init: ->
      $('#map').on 'change', window.map.changemap
      window.map.changemap()


    changemap: ->
      window.mech.refit()
      $('#dissipation').text("#{window.map.modifier.dissipation() * 100}%")
      $('#dissipation').removeClass()
      if window.map.modifier.dissipation() == 1
        $('#dissipation').addClass('label label-info')
      else if window.map.modifier.dissipation() > 1
        $('#dissipation').addClass('label label-success')
      else if window.map.modifier.dissipation() < 1
        $('#dissipation').addClass('label label-danger')

      $('#capacity').text("#{window.map.modifier.capacity() * 100}%")
      $('#capacity').removeClass()
      if window.map.modifier.capacity() == 1
        $('#capacity').addClass('label label-info')
      else if window.map.modifier.capacity() > 1
        $('#capacity').addClass('label label-success')
      else if window.map.modifier.capacity() < 1
        $('#capacity').addClass('label label-danger')

    modifier:
      capacity: ->
        1 + parseFloat($('#map').find(':selected').data('capacity'))
      dissipation: ->
        1 + parseFloat($('#map').find(':selected').data('dissipation'))

