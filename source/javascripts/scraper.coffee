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

        # just get the stuff we need and format it
        needed_values = scraper.extract_needed_values(scraped_json)

        console.log needed_values

        # Equip Extracted Weapons
        _.each needed_values.extracted_weapons, (qty, weapon_id, list) ->
          _.times qty, ->
            window.weapons.equip(weapon_id)



    # Returns
    # {extracted_weapons: {1002: 10, 1003, 2}, extracted_engine: 300, extracted_external_heatsink: 5}
    extract_needed_values: (mech_json) ->
      console.log mech_json

      extracted_weapons = {}
      extracted_engine = ""
      extracted_external_heatsinks = 0

      _.each mech_json.configuration, (mech_part) ->
        console.log("diving into mech part")

        _.each mech_part.items, (item) ->
          console.log("into mech item")

          if item.type == "module"

            # Engines
            if parseInt(item.id) in [3218..3478]
              console.log "It's an ENGINE! #{item.id}"
              extracted_engine = window.engine.get_rating_from_id(item.id)

            # Heatsinks
            if parseInt(item.id) in [3000,3001,3004]
              extracted_external_heatsinks++

          if item.type == "weapon"

            # Hack for normalizing Artemis Missiles
            switch item.id
              when '1038' #SRM2-A
                item.id = 1030
              when '1039' #SRM4-A
                item.id = 1004
              when '1040' #SRM6-A
                item.id = 1031

              when '1041' #LRM5-A
                item.id = 1026
              when '1042' #LRM10-A
                item.id = 1027
              when '1043' #LRM15-A
                item.id = 1028
              when '1044' #LRM20-A
                item.id = 1002

              when '1222' #CLRM5-A
                item.id = 1218
              when '1223' #CLRM10-A
                item.id = 1219
              when '1224' #CLRM15-A
                item.id = 1220
              when '1225' #CLRM20-A
                item.id = 1221

              when '1229' #CSRM2-A
                item.id = 1226
              when '1230' #CSRM4-A
                item.id = 1227
              when '1231' #CSRM6-A
                item.id = 1228

            if !extracted_weapons[item.id]
              extracted_weapons[item.id] = 0
            extracted_weapons[item.id] = extracted_weapons[item.id] + 1

      needed_values =
        extracted_weapons: extracted_weapons
        extracted_engine: extracted_engine
        extracted_external_heatsinks: extracted_external_heatsinks






