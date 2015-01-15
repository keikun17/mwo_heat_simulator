$ ->
  window.persistence=

    init: ->
      window.persistence.resetLoadoutFromParams()

      # Show tooltip
      $('#permalink').tooltip('show')

    resetEngineFromParams: ->

    resetLoadoutFromParams: ->
      url = $.url(location)
      url_params = url.param()

      # Reset weapon
      weapon_params =  _.intersection(Object.keys(url_params), Object.keys(window.weaponsList))

      if weapon_params.length > 0
        $('#js-stripall').click()

        _.each weapon_params,  (val, key, list)  ->

          count = url.param(val)

          _(count).times ->
            $('#armory').find("a[data-weapon-id='#{val}']").click()

      # Reset Heatsink
      heatsink_count = url.param('hs')
      heatsink_type = url.param('hstype')

      if heatsink_count
        $('#heatsink-count').val(heatsink_count)

      if heatsink_type
        $('#heatsink_type').val(heatsink_type)

      # Reset Engine
      engine_rating = url.param('engine')

      if engine_rating
        $('#engine_type').val(engine_rating)

      # Reset Mech skills
      cool_run = url.param('ms_coolr')
      heat_containment = url.param('ms_heatc')
      elite_mech = url.param('ms_elite')

      if cool_run
        $('#skill_coolrun').prop('checked', true)

      if heat_containment
        $('#skill_containment').prop('checked', true)

      if elite_mech
        $('#skill_elite').prop('checked', true)

      # Reset Mech quirks
      _.each url.param('quirks'), (quirk) ->
        window.mech.quirks.insert_quirk(quirk.weapon_id, quirk.quirk_type, quirk.reduction_value)


    rebuildPermalink: ->
      # weapon_counts = window.weapons.weaponCounts()
      str = ""

      # collect weapons
      _.each window.weapons.weaponCounts(), (val, key) ->
        str = "#{str}#{key}=#{val}&"

      # collect heatsinks
      str = "#{str}hs=#{window.heatsink.external_heatsinks()}&"
      str = "#{str}hstype=#{window.heatsink.getType()}&"

      # Collect skills
      if window.mech.skills.coolRunEnabled()
        str = "#{str}ms_coolr=1&"

      if window.mech.skills.eliteMechEnabled()
        str = "#{str}ms_elite=1&"

      if window.mech.skills.heatContainmentEnabled()
        str = "#{str}ms_heatc=1&"

      # collect engine
      str = "#{str}engine=#{window.engine.rating()}&"

      # collect quirks
      quirks_str = ""
      quirks_list = window.quirks.listAll()
      _.each quirks_list, (quirk) ->
        console.log "Callhed"
        console.log quirk
        quirks_str += "quirks[#{quirks_list.indexOf(quirk)}][weapon_id]=#{quirk.weapon_id}&"
        quirks_str += "quirks[#{quirks_list.indexOf(quirk)}][quirk_type]=#{quirk.quirk_type}&"
        quirks_str += "quirks[#{quirks_list.indexOf(quirk)}][reduction_value]=#{quirk.reduction_value}&"

      str = "#{str}#{quirks_str}"

      # build link
      host =  '?' + str
      host



      url = $.url(location)
      # $('#permalink').text(url.attr('protocol') + '://' + url.attr('host') + $.url(location).attr('path') + host)
      $('#permalink').attr('href',host)


    generateLink: ->
      window.persistence.rebuildPermalink()






