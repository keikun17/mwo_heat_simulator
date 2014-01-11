(function() {
  $(document).keypress(function(e) {
    if (e.which === 49) {
      $('#wg1').click();
    }
    if (e.which === 50) {
      $('#wg2').click();
    }
    if (e.which === 51) {
      console.log("3");
      return $('#wg3').click();
    }
  });

}).call(this);
