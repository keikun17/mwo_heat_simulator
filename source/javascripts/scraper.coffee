$ ->
  window.scraper =
    form:
      smurfy_url: ->
        $('#smurfy_url').val()


    init: ->
      $('#import_from_smurfy').submit (e) ->
        e.preventDefault()

        smurfy_url = scraper.form.smurfy_url()
        console.log("scraping from #{smurfy_url}")
        console.log window.scraper.scrape(smurfy_url)

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
        @html = ($.parseHTML @scrapedData)
        @json = $.parseJSON $(@html[5]).text()
        @json


