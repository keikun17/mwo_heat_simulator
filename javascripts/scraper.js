(function() {
  $(function() {
    return window.scraper = {
      scrapedData: '',
      scrape: function(url) {
        url = url.replace('mwo.smurfy-net.de/mechlab#', 'mwo.smurfy-net.de/tools/mechtooltip?');
        return $.get(url, function(response) {
          console.log(response);
          return window.scraper.scrapedData = response.responseText;
        });
      }
    };
  });

}).call(this);
