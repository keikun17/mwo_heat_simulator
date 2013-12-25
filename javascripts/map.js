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
        $('#dissipation').removeClass();
        if (window.map.modifier.dissipation() === 1) {
          $('#dissipation').addClass('label label-info');
        } else if (window.map.modifier.dissipation() > 1) {
          $('#dissipation').addClass('label label-success');
        } else if (window.map.modifier.dissipation() < 1) {
          $('#dissipation').addClass('label label-danger');
        }
        $('#capacity').text("" + (window.map.modifier.capacity() * 100) + "%");
        $('#capacity').removeClass();
        if (window.map.modifier.capacity() === 1) {
          return $('#capacity').addClass('label label-info');
        } else if (window.map.modifier.capacity() > 1) {
          return $('#capacity').addClass('label label-success');
        } else if (window.map.modifier.capacity() < 1) {
          return $('#capacity').addClass('label label-danger');
        }
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
