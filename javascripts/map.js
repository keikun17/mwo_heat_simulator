(function() {
  $(function() {
    return window.map = {
      init: function() {
        $('#map').on('change', window.map.changemap);
        return window.map.changemap();
      },
      changemap: function() {
        window.mech.refit();
        $('#dissipation').text("" + (window.map.modifier.dissipation() * 100) + "%");
        return $('#capacity').text("" + (window.map.modifier.capacity() * 100) + "%");
      },
      modifier: {
        capacity: function() {
          return 1 + parseFloat($('#map').find(':selected').data('capacity'));
        },
        dissipation: function() {
          return 1 + parseFloat($('#map').find(':selected').data('dissipation'));
        }
      }
    };
  });

}).call(this);
