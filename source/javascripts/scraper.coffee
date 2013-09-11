$ ->
  window.scraper = {
    scrapedData: ''

    scrape: (url) ->
      # In the mechlab tooltip, all the required HTML are loaded, whereas in the mechlab,
      # things gets loaded by JS
      url = url.replace('mwo.smurfy-net.de/mechlab#','mwo.smurfy-net.de/tools/mechtooltip?')

      # Normally this will not work and yield webserver errors that disallows request from
      # someplace other than the host. But since we are using the YQL crossdomain ajax Jquery
      # plugin, we can grab the response.
      $.get url, (response) ->
        console.log(response)
        window.scraper.scrapedData = response.responseText
  }
