(function() {
  $(function() {
    return window.heatsink = {
      init: function() {
        var coolant_el, heatsink_display_el, heatsink_type_el,
          _this = this;
        heatsink_display_el = '#heatsink-count';
        heatsink_type_el = '#heatsink_type';
        coolant_el = '#flush_coolant';
        $(heatsink_display_el).on('input', window.mech.refit);
        $(heatsink_type_el).on('change', window.mech.refit);
        $(coolant_el).on('click', function() {
          window.mech.setHeat(0);
          return _this.exitOverheat();
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
          this.timeToZero();
          if (!$('body').hasClass('overheating') && this.isOverheating()) {
            return this.doOverheat();
          } else if ($('body').hasClass('overheating') && !this.isOverheating()) {
            return this.exitOverheat();
          }
        }
      },
      isOverheating: function() {
        return this.getCurrentHeat() >= this.getThreshold();
      },
      doOverheat: function() {
        $('body').addClass('overheating');
        return $('body').removeClass('cool');
      },
      exitOverheat: function() {
        $('body').removeClass('overheating');
        return $('body').addClass('cool');
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
          window.persistence.rebuildPermalink();
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
          window.persistence.rebuildPermalink();
          return false;
        });
        $("#js-stripall").click(function() {
          $('.js-strip').click();
          return false;
        });
        _.each($('.cooldown-meter'), this.armWeapon);
        return $("#js-reset_damage").click(function(e) {
          window.mech.resetDamage();
          return window.mech.dps.resetTimer();
        });
      },
      weaponCounts: function() {
        var counter;
        counter = {};
        _.each($('.js-fire'), function(element) {
          var weapon;
          weapon = $(element).data('weapon-class');
          if (counter[weapon] === void 0) {
            counter[weapon] = 0;
          }
          return counter[weapon] = counter[weapon] + 1;
        });
        return counter;
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
          heat: 2,
          damage: 3
        },
        mlas: {
          heat: 4,
          multiplier: 1,
          damage: 5
        },
        llas: {
          heat: 7,
          multiplier: 2.8,
          damage: 9
        },
        ellas: {
          heat: 8.5,
          multiplier: 2.8,
          damage: 9
        },
        splas: {
          heat: 2.4,
          damage: 3.40
        },
        mplas: {
          heat: 5,
          damage: 6
        },
        lplas: {
          heat: 8.5,
          multiplier: 2.8,
          damage: 10.60
        },
        ppc: {
          heat: 10,
          multiplier: 7.0,
          damage: 10
        },
        eppc: {
          heat: 15,
          multiplier: 4.5,
          damage: 10
        },
        flam: {
          heat: .6,
          damage: 0.70
        },
        ac2: {
          heat: 1,
          multiplier: 0.6,
          damage: 2
        },
        ac5: {
          heat: 1,
          damage: 5
        },
        ac10: {
          heat: 3,
          damage: 10
        },
        ac20: {
          heat: 6,
          multiplier: 24,
          damage: 20
        },
        uac5: {
          heat: 1,
          damage: 5
        },
        lb10x: {
          heat: 2,
          damage: 10
        },
        gauss: {
          heat: 1,
          damage: 15
        },
        mg: {
          heat: 0,
          damage: 0.1
        },
        lrm5: {
          heat: 2,
          damage: 5.50
        },
        lrm10: {
          heat: 4,
          multiplier: 2.8,
          damage: 11
        },
        lrm15: {
          heat: 5,
          multiplier: 2.8,
          damage: 16.50
        },
        lrm20: {
          heat: 6,
          multiplier: 2.8,
          damage: 22.0
        },
        srm2: {
          heat: 2,
          multiplier: 1,
          damage: 4
        },
        srm4: {
          heat: 3,
          multiplier: 1,
          damage: 8
        },
        srm6: {
          heat: 4,
          multiplier: 1,
          damage: 12
        },
        ssrm2: {
          heat: 2,
          multiplier: 1,
          damage: 5
        }
      },
      shoot: function(val) {
        var towards;
        val = val * 100;
        towards = val + window.mech.heatsink.getCurrentHeat();
        return window.mech.setHeat(towards);
      },
      damage: function(val) {
        mech.damage += val;
        $('#damage').text(mech.damage.toFixed(2));
        if (!mech.dps.clock) {
          console.log("called");
          mech.dps.clock = setInterval(mech.dps.incrementTimer, 1000);
        }
        return mech.dps.recompute();
      },
      fireWeapon: function(event) {
        var stats, weapon_name;
        weapon_name = $(this).data("weaponClass");
        stats = mech.weapons.weaponStats[weapon_name];
        window.weapons.shoot(stats.heat);
        window.mech.weapons.disableWeapon($(this));
        window.mech.weapons.damage(stats.damage);
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
        ppc_max_alpha = 2;
        ppc_group_ghost_heat = this.getPenalty(list, ppc_group, ppc_max_alpha);
        ghost_heat = lrm_group_ghost_heat + srm_group_ghost_heat + llas_group_ghost_heat + ppc_group_ghost_heat + this.getPenalty(list, ['ac2'], 3) + this.getPenalty(list, ['ac20'], 1) + this.getPenalty(list, ['mlas'], 6) + this.getPenalty(list, ['srm2'], 4) + this.getPenalty(list, ['ssrm2'], 4);
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
(function() {
  $(function() {
    return window.persistence = {
      init: function() {
        window.persistence.resetLoadoutFromParams();
        return $('#permalink').tooltip('show');
      },
      resetEngineFromParams: function() {},
      resetLoadoutFromParams: function() {
        var cool_run, elite_mech, engine_rating, heat_containment, heatsink_count, heatsink_type, url, url_params, weapon_params;
        url = $.url(location);
        url_params = url.param();
        weapon_params = _.intersection(Object.keys(url_params), Object.keys(window.mech.weapons.weaponStats));
        if (weapon_params.length > 0) {
          $('#js-stripall').click();
          _.each(weapon_params, function(val, key, list) {
            var count;
            count = url.param(val);
            return _(count).times(function() {
              return $('#armory').find("a[data-weapon-class='" + val + "']").click();
            });
          });
        }
        heatsink_count = url.param('hs');
        heatsink_type = url.param('hstype');
        if (heatsink_count) {
          $('#heatsink-count').val(heatsink_count);
        }
        if (heatsink_type) {
          $('#heatsink_type').val(heatsink_type);
        }
        engine_rating = url.param('engine');
        if (engine_rating) {
          $('#engine_type').val(engine_rating);
        }
        cool_run = url.param('ms_coolr');
        heat_containment = url.param('ms_heatc');
        elite_mech = url.param('ms_elite');
        if (cool_run) {
          $('#skill_coolrun').prop('checked', true);
        }
        if (heat_containment) {
          $('#skill_containment').prop('checked', true);
        }
        if (elite_mech) {
          return $('#skill_elite').prop('checked', true);
        }
      },
      rebuildPermalink: function() {
        var host, str, url;
        str = "";
        _.each(window.weapons.weaponCounts(), function(val, key) {
          return str = "" + str + key + "=" + val + "&";
        });
        str = "" + str + "hs=" + (window.heatsink.external_heatsinks()) + "&";
        str = "" + str + "hstype=" + (window.heatsink.getType()) + "&";
        if (window.mech.skills.coolRunEnabled()) {
          str = "" + str + "ms_coolr=1&";
        }
        if (window.mech.skills.eliteMechEnabled()) {
          str = "" + str + "ms_elite=1&";
        }
        if (window.mech.skills.heatContainmentEnabled()) {
          str = "" + str + "ms_heatc=1&";
        }
        str = "" + str + "engine=" + (window.engine.rating());
        host = '?' + str;
        host;
        url = $.url(location);
        return $('#permalink').attr('href', host);
      },
      generateLink: function() {
        return window.persistence.rebuildPermalink();
      }
    };
  });

}).call(this);
(function() {
  $(function() {
    var _this = this;
    return window.mech = {
      init: function() {
        window.heatsink.init();
        window.weapons.init();
        window.engine.init();
        window.skills.init();
        window.map.init();
        window.persistence.init();
        $('.js-with_tooltip').tooltip('show');
        return setTimeout((function() {
          return $('.js-with_tooltip').tooltip('hide');
        }), 10000);
      },
      heatsink: window.heatsink,
      engine: window.engine,
      damage: 0,
      refit: function() {
        $('#heat-threshold').text(window.mech.heatsink.getThreshold() / 100);
        $("#heatlevel").attr("aria-valuemax", window.mech.heatsink.getThreshold());
        $('#cool-rate').text(window.mech.heatsink.getCoolRate().toFixed(2));
        $('#internal-heatsinks').text(window.mech.heatsink.internal_heatsinks());
        return window.persistence.generateLink();
      },
      weapons: window.weapons,
      skills: window.skills,
      resetDamage: function() {
        mech.damage = 0;
        return $('#damage').text(0);
      },
      dpsUptime: 0,
      dps: {
        uptime: 0,
        value: 0,
        incrementTimer: function() {
          mech.dps.uptime = mech.dps.uptime + 1;
          return mech.dps.recompute();
        },
        resetTimer: function() {
          mech.dps.value = 0;
          mech.dps.uptime = 0;
          mech.dps.clock = clearInterval(mech.dps.clock);
          return $('#dps').text('0.00');
        },
        recompute: function() {
          mech.dps.value = mech.damage / mech.dps.uptime;
          return $('#dps').text(mech.dps.value.toFixed(2));
        }
      },
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
