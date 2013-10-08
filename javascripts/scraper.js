(function() {
  $(function() {
    return window.scraper = {
      scrapedData: '',
      scrape: function(url) {
        var _this = this;
        url = url.replace('mwo.smurfy-net.de/mechlab#', 'mwo.smurfy-net.de/mechlab/loadouts');
        url = url.replace('i=', '/');
        url = url.replace('&l=', '/');
        console.log("new url is " + url);
        return $.get(url, function(response) {
          console.log(response);
          _this.scrapedData = response.responseText;
          _this.html = ($.parseHTML(_this.scrapedData))[5];
          return _this.json = $.parseJSON(html.innerHtml);
        });
      }
    };
  });

}).call(this);
