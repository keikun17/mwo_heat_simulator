(function() {
  $(function() {
    return window.engine = {
      init: function() {
        return $('#engine_type').on('change', window.mech.refit);
      },
      rating: function() {
        return parseInt($('#engine_type').val());
      },
      internal_heatsink_count: function() {
        return Math.floor(this.rating() / 25);
      }
    };
  });

}).call(this);
