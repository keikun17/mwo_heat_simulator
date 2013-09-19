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
        val = val * 100;
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
(function() {
  $(function() {
    return window.weapons = {
      init: function() {
        $('.weapon-list').on("click", "a.js-fire.ready", this.fireWeapon);
        $(".armory").on("click", ".js-add-weapon", function() {
          var html, weaponClass, weaponName;
          weaponClass = $(this).data("weaponClass");
          weaponName = $(this).data("weaponName");
          html = weaponView({
            name: weaponName,
            weaponClass: weaponClass
          });
          $(".weapon-list").append(html);
          _.each($('.cooldown-meter'), function(element, iterator, list) {
            return window.mech.weapons.armWeapon(element);
          });
          return false;
        });
        $("#js-alphastrike").click(function() {
          var grouped_weapons;
          grouped_weapons = $(".js-fire.ready");
          if (grouped_weapons.length > 0) {
            if (window.weapons.ghostHeat.is_enabled()) {
              window.mech.weapons.ghostHeat.apply(grouped_weapons);
            }
            grouped_weapons.click();
          }
          return false;
        });
        $('.weapon-list').on("click", ".js-weapon_group", function() {
          $(this).toggleClass('assigned');
          $(this).toggleClass('btn-default');
          $(this).toggleClass('btn-info');
          return false;
        });
        $('.js-fire_weapon_group').click(function(e) {
          var group, grouped_weapons, wgs,
            _this = this;
          e.preventDefault();
          group = $(this).data('activateGroup');
          wgs = $("[data-weapon-group='" + group + "'].js-weapon_group.assigned");
          grouped_weapons = [];
          _.each(wgs, function(wg) {
            var weapon;
            weapon = $(wg).siblings('.js-fire.ready')[0];
            if (typeof weapon !== 'undefined') {
              return grouped_weapons.push(weapon);
            }
          });
          if (grouped_weapons.length > 0) {
            if (window.weapons.ghostHeat.is_enabled()) {
              window.mech.weapons.ghostHeat.apply(grouped_weapons);
            }
            _.each(grouped_weapons, function(weapon) {
              return weapon.click();
            });
          }
          return false;
        });
        $(".weapon-list").on("click", ".js-strip", function() {
          $(this).parent().parent().parent().remove();
          return false;
        });
        $("#js-stripall").click(function() {
          $('.js-strip').click();
          return false;
        });
        return _.each($('.cooldown-meter'), this.armWeapon);
      },
      armWeapon: function(progress) {
        if (typeof progress.initialized !== 'undefined') {
          return true;
        }
        progress.initialized = true;
        progress = $(progress);
        return progress.progressbar({
          done: function() {
            var weapon;
            weapon = progress.parent().parent().siblings().find('.js-fire');
            weapon.removeClass('btn-default');
            weapon.addClass('btn-danger');
            weapon.addClass('ready');
            return progress.removeClass('progress-bar-danger').addClass('progress-bar-success');
          }
        });
      },
      weaponStats: {
        slas: {
          heat: 2
        },
        mlas: {
          heat: 4,
          multiplier: 1
        },
        llas: {
          heat: 7,
          multiplier: 2.8
        },
        ellas: {
          heat: 8.5,
          multiplier: 2.8
        },
        splas: {
          heat: 2.4
        },
        mplas: {
          heat: 5
        },
        lplas: {
          heat: 8.5,
          multiplier: 2.8
        },
        ppc: {
          heat: 10,
          multiplier: 7.0
        },
        eppc: {
          heat: 12,
          multiplier: 4.5
        },
        flam: {
          heat: .6
        },
        ac2: {
          heat: 1,
          multiplier: 0.6
        },
        ac5: {
          heat: 1
        },
        ac10: {
          heat: 3
        },
        ac20: {
          heat: 6,
          multiplier: 24
        },
        uac5: {
          heat: 1
        },
        lb10x: {
          heat: 2
        },
        gauss: {
          heat: 1
        },
        mg: {
          heat: 0
        },
        lrm5: {
          heat: 2
        },
        lrm10: {
          heat: 4,
          multiplier: 2.8
        },
        lrm15: {
          heat: 5,
          multiplier: 2.8
        },
        lrm20: {
          heat: 6,
          multiplier: 2.8
        },
        srm2: {
          heat: 2,
          multiplier: 1
        },
        srm4: {
          heat: 3,
          multiplier: 1
        },
        srm6: {
          heat: 4,
          multiplier: 1
        },
        ssrm2: {
          heat: 2,
          multiplier: 1
        }
      },
      shoot: function(val) {
        var towards;
        val = val * 100;
        towards = val + window.mech.heatsink.getCurrentHeat();
        return window.mech.setHeat(towards);
      },
      fireWeapon: function(event) {
        var weapon_name;
        weapon_name = $(this).data("weaponClass");
        window.weapons.shoot(window.mech.weapons.weaponStats[weapon_name].heat);
        window.mech.weapons.disableWeapon($(this));
        return false;
      },
      disableWeapon: function(weapon) {
        var progress,
          _this = this;
        weapon.removeClass("btn-danger").addClass("btn-default").removeClass("ready");
        progress = $(weapon).parent().siblings('.weapon-cooldown-container').find('.progress .cooldown-meter');
        progress.addClass('quick-reset');
        progress.removeClass('progress-bar-success').addClass('progress-bar-danger');
        progress.attr('aria-valuenow', '0');
        progress.attr('style', 'width: 0%');
        return window.setTimeout((function() {
          return _this.enableWeapon(weapon);
        }), 1);
      },
      enableWeapon: function(weapon) {
        var progress;
        progress = $(weapon).parent().siblings('.weapon-cooldown-container').find('.progress .cooldown-meter');
        progress.removeClass('quick-reset');
        progress.progressbar();
        return true;
      }
    };
  });

}).call(this);
(function() {
  $(function() {
    return window.weapons.ghostHeat = {
      is_enabled: function() {
        return $('#ghost_heat').is(':checked');
      },
      scale: function(count) {
        var multiplier;
        multiplier = (function() {
          switch (false) {
            case !(count < 2):
              return 0;
            case count !== 2:
              return 0.08;
            case count !== 3:
              return 0.18;
            case count !== 4:
              return 0.30;
            case count !== 5:
              return 0.45;
            case count !== 6:
              return 0.60;
            case count !== 7:
              return 0.80;
            case count !== 8:
              return 1.10;
            case count !== 9:
              return 1.50;
            case count !== 10:
              return 2.00;
            case count !== 11:
              return 3.00;
            case !(count >= 12):
              return 5.00;
          }
        })();
        return multiplier;
      },
      getPenalty: function(list, group, max_alpha) {
        var group_ghost_heat, link_fired,
          _this = this;
        list = $(list);
        list = $(list);
        group_ghost_heat = 0;
        link_fired = [];
        _.each(group, function(element) {
          return link_fired = link_fired.concat(list.filter("[data-weapon-class='" + element + "']").toArray());
        });
        if (link_fired.length > max_alpha) {
          _.times(max_alpha, function() {
            return link_fired.shift();
          });
          group_ghost_heat = 0;
          _.each(link_fired, function(element, index, list) {
            var base_heat, ghost_heat, heat_scale, multiplier, weapon_position;
            weapon_position = index + 1 + max_alpha;
            element = $(element);
            base_heat = window.mech.weapons.weaponStats[element.data('weaponClass')].heat;
            multiplier = window.mech.weapons.weaponStats[element.data('weaponClass')].multiplier;
            heat_scale = window.mech.weapons.ghostHeat.scale(weapon_position);
            ghost_heat = base_heat * (heat_scale * multiplier);
            return group_ghost_heat = group_ghost_heat + ghost_heat;
          });
        }
        return group_ghost_heat;
      },
      computeTotalPenalty: function(list) {
        var ghost_heat, llas_group, llas_group_ghost_heat, llas_max_alpha, lrm_group, lrm_group_ghost_heat, lrm_max_alpha, ppc_group, ppc_group_ghost_heat, ppc_max_alpha, srm_group, srm_group_ghost_heat, srm_max_alpha;
        list = $(list);
        ghost_heat = 0;
        lrm_group = ['lrm10', 'lrm15', 'lrm20'];
        lrm_max_alpha = 2;
        lrm_group_ghost_heat = this.getPenalty(list, lrm_group, lrm_max_alpha);
        srm_group = ['srm4', 'srm6'];
        srm_max_alpha = 3;
        srm_group_ghost_heat = this.getPenalty(list, srm_group, srm_max_alpha);
        llas_group = ['llas', 'ellas', 'lplas'];
        llas_max_alpha = 2;
        llas_group_ghost_heat = this.getPenalty(list, llas_group, llas_max_alpha);
        ppc_group = ['ppc', 'eppc'];
        ppc_max_alpha = 3;
        ppc_group_ghost_heat = this.getPenalty(list, ppc_group, ppc_max_alpha);
        ghost_heat = lrm_group_ghost_heat + srm_group_ghost_heat + llas_group_ghost_heat + ppc_group_ghost_heat + this.getPenalty(list, ['ac2'], 3) + this.getPenalty(list, ['ac20'], 1) + this.getPenalty(list, ['mlas'], 6) + this.getPenalty(list, ['srm2'], 4) + this.getPenalty(list, ['ssrm2'], 4);
        console.log("Total Ghost Heat is " + ghost_heat);
        return ghost_heat;
      },
      apply: function(list) {
        var penalty, towards;
        penalty = this.computeTotalPenalty(list);
        $('#ghost_heat_penalty').text(penalty);
        penalty = penalty * 100;
        towards = penalty + window.mech.heatsink.getCurrentHeat();
        return window.mech.setHeat(towards);
      }
    };
  });

}).call(this);
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
(function() {
  $(function() {
    return window.skills = {
      init: function() {
        $('#skill_coolrun').on('change', window.mech.refit);
        $('#skill_containment').on('change', window.mech.refit);
        return $('#skill_elite').on('change', window.mech.refit);
      },
      coolRunEnabled: function() {
        return $('#skill_coolrun').is(':checked');
      },
      heatContainmentEnabled: function() {
        return $('#skill_containment').is(':checked');
      },
      eliteMechEnabled: function() {
        return $('#skill_elite').is(':checked');
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
        window.engine.init();
        window.skills.init();
        return this.refit();
      },
      heatsink: window.heatsink,
      engine: window.engine,
      refit: function() {
        $('#heat-threshold').text(window.mech.heatsink.getThreshold() / 100);
        $("#heatlevel").attr("aria-valuemax", window.mech.heatsink.getThreshold());
        $('#cool-rate').text(window.mech.heatsink.getCoolRate().toPrecision(2));
        return $('#internal-heatsinks').text(window.mech.heatsink.internal_heatsinks());
      },
      weapons: window.weapons,
      skills: window.skills,
      setHeat: function(heatlevel) {
        $("#heatlevel").attr("aria-valuetransitiongoal", heatlevel);
        return $("#heatlevel").progressbar({
          transition_delay: 100,
          refresh_speed: 10,
          display_text: "fill"
        });
      }
    };
  });

}).call(this);
