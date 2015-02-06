$ ->
  window.quirks =
    form:
      weapon_id: ->
        $('#quirked').val()
      quirk_type: ->
        $('#quirk_type').val()
      reduction_value: ->
        parseInt($('#quirk_value').val())

    insert_quirk: (weapon_id, quirk_type, value) ->
      weapon_name = window.weaponsList[weapon_id].name

      quirk_id = "#{ quirk_type }-quirk-#{ weapon_id }"
      quirk_text = "#{ weapon_name } #{value}% #{quirk_type} reduction"
      remove_link = "<a href='#' class='js_remove_quirk btn-xs btn-warning' ><span class='glyphicon glyphicon-remove'/></a>"
      compiled = "<li class='js-quirk_item' id='#{ quirk_id }' data-value='#{ value }' data-quirk_type='#{quirk_type}' data-weapon_id='#{weapon_id}'>#{remove_link} #{quirk_text} </li>"

      unless document.getElementById(quirk_id) or isNaN(value)
        $('ul#quirks-list').append(compiled)
        window.mech.refit()

    init: ->

      $('#add_quirk').submit (e) ->
        e.preventDefault()

        weapon_id  = quirks.form.weapon_id()
        quirk_type = quirks.form.quirk_type()
        value      = quirks.form.reduction_value()

        window.mech.quirks.insert_quirk(weapon_id, quirk_type, value)

      $('#quirks-list').on "click", ".js_remove_quirk", ->
        console.log $(this).parent().remove()
        window.mech.refit()
        false

    cooldown: (weapon_id) ->
      weapon_quirk = $("#cooldown-quirk-#{weapon_id}")
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

    weaponcooldown: (weapon_id) ->
      weapon_quirk = $("#cooldown-quirk-#{weapon_id}")
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

    listAll: ->
      quirk_views = $('.js-quirk_item')
      quirk_collection = _.collect quirk_views, (quirk_view) ->
        {
          weapon_id: $(quirk_view).data('weapon_id')
          quirk_type: $(quirk_view).data('quirk_type')
          reduction_value: $(quirk_view).data('value')
        }




