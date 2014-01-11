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
        $('#ghost_heat').tooltip('show');
        return this.runTicker();
      },
      getType: function() {
        return $('#heatsink_type').val();
      },
      external_heatsinks: function() {
        var hs;
        hs = parseInt($('#heatsink-count').val());
        if (isNaN(hs)) {
          hs = 0;
        }
        return hs;
      },
      internal_heatsinks: function() {
        var hs;
        hs = window.mech.engine.internal_heatsink_count();
        if (hs > 10) {
          hs = 10;
        }
        return hs;
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
          val = 30 + this.external_heatsinks() + this.internal_heatsinks();
        } else {
          val = 30 + (this.external_heatsinks() * 1.4) + (this.internal_heatsinks() * 2);
        }
        if (isNaN(val)) {
          val = 0;
        }
        if (window.mech.skills.heatContainmentEnabled()) {
          if (window.mech.skills.eliteMechEnabled()) {
            val = val * 1.20;
          } else {
            val = val * 1.10;
          }
        }
        val = val * 100 * window.map.modifier.capacity();
        return val;
      },
      getCoolRate: function() {
        var rate;
        if (window.heatsink.getType() === 'single') {
          rate = .1 * (this.external_heatsinks() + this.internal_heatsinks());
        } else {
          if (this.external_heatsinks() >= 0) {
            rate = (this.internal_heatsinks() * .2) + (this.external_heatsinks() * .14);
          } else {
            rate = .14 * heatSinkCount();
          }
        }
        if (window.mech.skills.coolRunEnabled()) {
          if (window.mech.skills.eliteMechEnabled()) {
            rate = rate * 1.15;
          } else {
            rate = rate * 1.075;
          }
        }
        rate = rate * window.map.modifier.dissipation();
        return rate;
      },
      tickRate: 1000,
      timeToZero: function() {
        var time;
        time = this.getCurrentHeat() / (this.getCoolRate() * 100);
        time = time.toPrecision(2);
        if (time < 0) {
          time = 0;
        }
        return $('#cooldown_time').text(time);
      },
      coolDown: function() {
        var towards;
        towards = this.getCurrentHeat() - (this.getCoolRate() * 100);
        if (this.getCurrentHeat() > 0) {
          window.mech.setHeat(towards);
          return this.timeToZero();
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
