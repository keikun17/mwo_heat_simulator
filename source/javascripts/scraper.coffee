$ ->
  window.scraper =
    form:
      smurfy_url: ->
        $('#smurfy_url').val()


    init: ->
      $('#import_from_smurfy').submit (e) ->
        e.preventDefault()

        $('#js-stripall').click()

        smurfy_url        = scraper.form.smurfy_url()
        mech_json         = window.scraper.scrape(smurfy_url)

    scrapedData: ''

    # converts url like these http://mwo.smurfy-net.de/mechlab#i=54&l=a94b1fc8b3943fd6775914e9ebce5d97a67c02b9
    # to http://mwo.smurfy-net.de/mechlab/loadouts/54/a94b1fc8b3943fd6775914e9ebce5d97a67c02b9
    scrape: (smurfy_url) ->
      # In the mechlab tooltip, all the required HTML are loaded, whereas in the mechlab,
      # things gets loaded by JS
      smurfy_url = smurfy_url.replace('mwo.smurfy-net.de/mechlab#','mwo.smurfy-net.de/mechlab/loadouts')
      smurfy_url = smurfy_url.replace('i=', '/')
      smurfy_url = smurfy_url.replace('&l=', '/')

      console.log "new url is #{smurfy_url}"
      $.get smurfy_url, (response) =>
        # console.log(response)
        @scrapedData = response.responseText
        scraped_html = ($.parseHTML @scrapedData)
        scraped_json = $.parseJSON $(scraped_html[5]).text()
        kek_json = scraped_json

        weapon_quantities = scraper.extract_weapon_quantites(scraped_json)

        _.each weapon_quantities, (qty, weapon_id, list) ->
          _.times qty, ->
            window.weapons.equip(weapon_id)



    extract_weapon_quantites: (mech_json) ->
      console.log mech_json
      extracted_weapons = {}
      _.each mech_json.configuration, (mech_part) ->
        console.log("diving into mech part")

        _.each mech_part.items, (item) ->
          console.log("into mech item")

          if item.type == "weapon"
            if !extracted_weapons[item.id]
              extracted_weapons[item.id] = 0
            extracted_weapons[item.id] = extracted_weapons[item.id] + 1


      console.log extracted_weapons
      extracted_weapons






