$ ->
  window.persistence=

    init: ->
      window.persistence.resetLoadoutFromParams()

    resetLoadoutFromParams: ->
      url = $.url(location)
      url_params = url.param()

      weapon_params =  _.intersection(Object.keys(url_params), Object.keys(window.mech.weapons.weaponStats))

      if weapon_params.length > 0
        $('#js-stripall').click()

        _.each weapon_params,  (val, key, list)  ->
          # console.log("val #{val}, key #{key}, list #{list}")

          count = url.param(val)
          # console.log "count #{count}"

          _(count).times ->
            $('#armory').find("a[data-weapon-class='#{val}']").click()

    rebuildPermalink: ->
      # weapon_counts = window.weapons.weaponCounts()

      host = $.url(location).attr('host')

      if $.url(location).attr('port')
        host = host + ":#{$.url(location).attr('port')}"

      str = ""

      _.each window.weapons.weaponCounts(), (val, key) ->
        str = "#{str}#{key}=#{val}&"

      host = host + '?' + str
      host

      $('#permalink').text(host)
      $('#permalink').attr('href',host)

    generateLink: ->
      window.persistence.rebuildPermalink()






