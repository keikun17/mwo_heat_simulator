(function() {
  $(function() {
    return window.heatsink = {
      init: function() {
        var heatsink_display_el, heatsink_type_el;
        heatsink_display_el = '#heatsink-count';
        heatsink_type_el = '#heatsink_type';
        $(heatsink_display_el).on('input', window.mech.refit);
        $(heatsink_type_el).on('change', window.mech.refit);
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
          $("#heatlevel").attr("aria-valuetransitiongoal", towards);
          return $("#heatlevel").progressbar({
            transition_delay: 100,
            refresh_speed: 10,
            display_text: "fill"
          });
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
(function() {
  $(function() {
    return window.weapons = {
      init: function() {
        $('.weapon-list').on("click", "a.js-fire", this.fireWeapon);
        $(".armory").on("click", ".js-add-weapon", function() {
          var html, weaponClass, weaponName;
          weaponClass = $(this).data("weaponClass");
          weaponName = $(this).data("weaponName");
          html = weaponView({
            name: weaponName,
            weaponClass: weaponClass
          });
          $(".weapon-list").append(html);
          return false;
        });
        $("#js-alphastrike").click(function() {
          return $(".js-fire").click();
        });
        $('.js-fire_weapon_group').click(function(e) {
          var group, wgs;
          e.preventDefault();
          group = $(this).data('activateGroup');
          wgs = $("[data-weapon-group='" + group + "'].js-weapon_group.assigned");
          return _.each(wgs, function(wg) {
            return $(wg).siblings('.js-fire').click();
          });
        });
        $(".weapon-list").on("click", ".js-strip", function() {
          return $(this).parent().remove();
        });
        return $("#js-stripall").click(function() {
          return $('.js-strip').click();
        });
      },
      heatTable: {
        slas: 2,
        mlas: 3,
        llas: 7,
        ellas: 8.5,
        splas: 2.4,
        mplas: 5,
        lplas: 8.5,
        ppc: 10,
        eppc: 12,
        flam: .6,
        ac2: 1,
        ac5: 1,
        ac10: 3,
        ac20: 6,
        uac5: 1,
        lb10x: 2,
        gauss: 1,
        mg: 0,
        lrm5: 2,
        lrm10: 4,
        lrm15: 5,
        lrm20: 6,
        srm2: 2,
        srm4: 3,
        srm6: 4,
        ssrm2: 2
      },
      shoot: function(val) {
        var towards;
        val = val * 100;
        console.log("-------");
        console.log("Adding Heat:");
        console.log(val);
        console.log("Current Heat Is:");
        console.log(window.mech.heatsink.getCurrentHeat());
        towards = val + window.mech.heatsink.getCurrentHeat();
        $("#heatlevel").attr("aria-valuetransitiongoal", towards);
        return val = val * 100;
      },
      fireWeapon: function(event) {
        var weapon_name;
        console.log('fire');
        weapon_name = $(this).data("weaponClass");
        return window.weapons.shoot(window.weapons.heatTable[weapon_name]);
      }
    };
  });

}).call(this);
(function() {
  $(function() {
    return window.mech = {
      init: function() {
        window.heatsink.init();
        window.weapons.init();
        return this.refit();
      },
      heatsink: window.heatsink,
      refit: function() {
        $('#heat-threshold').text(window.mech.heatsink.getThreshold() / 100);
        $("#heatlevel").attr("aria-valuemax", window.mech.heatsink.getThreshold());
        return $('#cool-rate').text(window.mech.heatsink.getCoolRate().toPrecision(2));
      },
      weapons: window.weapons
    };
  });

}).call(this);
