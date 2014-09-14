$ ->
  window.mech.init()

  $.fn.bootstrapSwitch.defaults.size = 'normal'

  # Clan
  $.fn.bootstrapSwitch.defaults.onText = 'Clan'
  $.fn.bootstrapSwitch.defaults.onColor = 'primary'

  # InnerSphere
  $.fn.bootstrapSwitch.defaults.offText = 'I.S.'
  $.fn.bootstrapSwitch.defaults.offColor = 'warning'

  $('input[name="weapon_switcher"]').on 'init.bootstrapSwitch', (event,state) ->
    console.log('gets')
    $('#innersphere_weapons').show()
    $('#clan_weapons').hide()

  $('input[name="weapon_switcher"]').on 'switchChange.bootstrapSwitch', (event,state) ->
    # console.log this
    # console.log event
    # console.log state
    if state == true
      $('#innersphere_weapons').hide()
      $('#clan_weapons').show()
    else if state == false
      $('#innersphere_weapons').show()
      $('#clan_weapons').hide()

  $('input[name="weapon_switcher"]').bootstrapSwitch('state', false)


