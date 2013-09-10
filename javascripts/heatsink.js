(function() {
  $(function() {
    return window.heatsink = {
      init: function() {
        var coolant_el, heatsink_display_el, heatsink_type_el;
        heatsink_display_el = '#heatsink-count';
        heatsink_type_el = '#heatsink_type';
        coolant_el = '#flush_coolant';
        $(heatsink_display_el).on('input', window.mech.refit);
        $(heatsink_type_el).on('change', window.mech.refit);
        $(coolant_el).on('click', function() {
          return window.mech.setHeat(0);
        });
        return this.runTicker();
      },
      getType: function() {
        return $('#heatsink_type').val();
      },
      getCount: function() {
        return parseInt($('#heatsink-count').val());
      },
      getCurrentHeat: function() {
        var val;
        val = parseInt($("#heatlevel").attr("aria-valuetransitiongoal"));
        if (isNaN(val)) {
          val = 0;
        }
        return val;
      },
      getThreshold: function() {
        var val;
        if (window.heatsink.getType() === 'single') {
          val = 30 + this.getCount();
        } else {
          val = 30 + (this.getCount() * 1.4);
        }
        if (isNaN(val)) {
          val = 0;
        }
        return val * 100;
      },
      getCoolRate: function() {
        var external_heatsinks, internal_heatsinks, rate;
        if (window.heatsink.getType() === 'single') {
          rate = .1 * this.getCount();
        } else {
          if (this.getCount() >= 0) {
            external_heatsinks = this.getCount() - 10;
            internal_heatsinks = this.getCount() - external_heatsinks;
            rate = (internal_heatsinks * .2) + (external_heatsinks * .14);
          } else {
            rate = .14 * heatSinkCount();
          }
        }
        return rate;
      },
      tickRate: 1000,
      coolDown: function() {
        var towards;
        towards = this.getCurrentHeat() - (this.getCoolRate() * 100);
        if (this.getCurrentHeat() > 0) {
          return window.mech.setHeat(towards);
        }
      },
      doTick: function() {
        return window.mech.heatsink.coolDown();
      },
      runTicker: function() {
        return setInterval(this.doTick, this.tickRate);
      }
    };
  });

}).call(this);
