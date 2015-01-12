$ ->
  window.quirks =
    init: ->

      $('#addQuirk').on 'click', ->

        weapon_id = 1000
        quirk_type = 'heat'
        value = 10
        compiled = "<li id='#{ quirk_type }-quirk-#{ weapon_id }' data-value='#{ value }'>something</li>"

        $('ul#quirks-list').append(compiled)

    weaponheat: (weapon_id) ->
      weapon_quirk = $("#heat-quirk-#{weapon_id}")
      modifier = 0

      if weapon_quirk.length == 0
        # If weapon quirks are present

        modifier = 0
      else
        # If weapon heat quirks are present

        quirk_value = weapon_quirk.data("value")

        if quirk_value > 100
          quirk_value = 100

        modifier = quirk_value / 100

      console.log "modifier is #{modifier}"
      modifier

