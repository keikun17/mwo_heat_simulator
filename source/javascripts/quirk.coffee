$ ->
  window.quirks =
    form:
      weapon_id: ->
        $('#quirked').val()
      quirk_type: ->
        $('#quirk_type').val()
      reduction_value: ->
        parseInt($('#quirk_value').val())

    init: ->

      $('#add_quirk').submit (e) ->
        console.log 'something'
        e.preventDefault()

        weapon_id  = quirks.form.weapon_id()
        quirk_type = quirks.form.quirk_type()
        value      = quirks.form.reduction_value()

        weapon_name = window.weaponsList[weapon_id].name

        quirk_id = "#{ quirk_type }-quirk-#{ weapon_id }"
        quirk_text = "#{ weapon_name } #{value}% #{quirk_type} reduction"
        remove_link = "<a href='#' class='js_remove_quirk btn-xs btn-warning' ><span class='glyphicon glyphicon-remove'/></a>"
        compiled = "<li id='#{ quirk_id }' data-value='#{ value }'>#{quirk_text} #{remove_link}</li>"

        unless document.getElementById(quirk_id) or isNaN(value)
          window.kek = e
          console.log e
          $('ul#quirks-list').append(compiled)

      $('#quirks-list').on "click", ".js_remove_quirk", ->
        console.log $(this).parent().remove()
        false

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

