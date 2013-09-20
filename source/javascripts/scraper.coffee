$ ->
  window.scraper = {
    scrapedData: ''

    # converts url like these http://mwo.smurfy-net.de/mechlab#i=54&l=a94b1fc8b3943fd6775914e9ebce5d97a67c02b9
    # to http://mwo.smurfy-net.de/mechlab/loadouts/54/a94b1fc8b3943fd6775914e9ebce5d97a67c02b9
    scrape: (url) ->
      # In the mechlab tooltip, all the required HTML are loaded, whereas in the mechlab,
      # things gets loaded by JS
      url = url.replace('mwo.smurfy-net.de/mechlab#','mwo.smurfy-net.de/mechlab/loadouts')
      url = url.replace('i=', '/')
      url = url.replace('&l=', '/')

      console.log "new url is #{url}"
      $.get url, (response) =>
        console.log(response)
        @scrapedData = response.responseText


        @html = ($.parseHTML @scrapedData)[5]
        @json = $.parseJSON html.innerHtml

  }
