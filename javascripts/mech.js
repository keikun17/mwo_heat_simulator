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
          $('#current-heat-text').text('0.0');
          return _this.exitOverheat();
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
          $('#current-heat-text').text(this.getCurrentHeat() / 100);
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
        $.fn.bootstrapSwitch.defaults.size = 'normal';
        $.fn.bootstrapSwitch.defaults.onText = 'Clan';
        $.fn.bootstrapSwitch.defaults.onColor = 'primary';
        $.fn.bootstrapSwitch.defaults.offText = 'I.S.';
        $.fn.bootstrapSwitch.defaults.offColor = 'warning';
        $('input[name="weapon_switcher"]').on('init.bootstrapSwitch', function(event, state) {
          $('#innersphere_weapons').show();
          return $('#clan_weapons').hide();
        });
        $('input[name="weapon_switcher"]').on('switchChange.bootstrapSwitch', function(event, state) {
          if (state === true) {
            $('#innersphere_weapons').hide();
            return $('#clan_weapons').show();
          } else if (state === false) {
            $('#innersphere_weapons').show();
            return $('#clan_weapons').hide();
          }
        });
        $('input[name="weapon_switcher"]').bootstrapSwitch('state', false);
        $('.weapon-list').on("click", "a.js-fire.ready", this.fireWeapon);
        $('.weapon-list').on("click", "a.js-fire.not_ready", function() {
          return false;
        });
        $(".armory").on("click", ".js-add-weapon", function() {
          var html, weaponId, weaponName;
          weaponId = $(this).data("weaponId");
          weaponName = $(this).data("weaponName");
          html = weaponView({
            name: weaponName,
            weaponId: weaponId
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
          weapon = $(element).data('weapon-id');
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
            weapon.removeClass('not_ready');
            return progress.removeClass('progress-bar-danger').addClass('progress-bar-success');
          }
        });
      },
      weaponStats: window.weaponsList,
      applyHeat: function(val) {
        var towards;
        val = val * 100;
        towards = val + window.mech.heatsink.getCurrentHeat();
        return window.mech.setHeat(towards);
      },
      damage: function(val) {
        mech.damage += val;
        $('#damage').text(mech.damage.toFixed(2));
        if (!mech.dps.clock) {
          mech.dps.clock = setInterval(mech.dps.incrementTimer, 1000);
        }
        return mech.dps.recompute();
      },
      fireWeapon: function(event) {
        var heat_to_apply, stats, weapon_id;
        weapon_id = $(this).data("weaponId");
        stats = mech.weapons.weaponStats[weapon_id];
        heat_to_apply = stats.heat - (stats.heat * quirks.weaponheat(weapon_id));
        console.log("heat to apply is " + heat_to_apply);
        window.weapons.applyHeat(heat_to_apply);
        window.mech.weapons.disableWeapon($(this));
        window.mech.weapons.damage(stats.damage);
        return false;
      },
      disableWeapon: function(weapon) {
        var progress,
          _this = this;
        weapon.removeClass("btn-danger").addClass("btn-default").removeClass("ready").addClass("not_ready");
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
        var heat_scale;
        heat_scale = (function() {
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
        return heat_scale;
      },
      computeTotalPenalty: function(list) {
        var element, group_fire, group_ghost_heat, individual_ghost_heat, solo_fire, total_ghost_heat, weapon_ids, weapons_fired_by_id,
          _this = this;
        list = $(list);
        group_ghost_heat = 0;
        individual_ghost_heat = 0;
        weapons_fired_by_id = {};
        group_fire = {};
        solo_fire = {};
        weapon_ids = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = list.length; _i < _len; _i++) {
            element = list[_i];
            _results.push($(element).data('weaponId'));
          }
          return _results;
        })();
        _.each(weapon_ids, function(weapon_id, index) {
          var ghost_heat, group_id, heat_scale_multiplier, heat_scale_position, weapon;
          weapon = window.weaponsList[weapon_id];
          group_id = weapon.ghost_heat_group;
          if (group_id === null && weapon.ghost_heat_trigger !== null) {
            if (solo_fire[weapon_id] === void 0) {
              solo_fire[weapon_id] = {
                fire_count: 0,
                ghost_heat: 0,
                ghost_heat_trigger: weapon.ghost_heat_trigger
              };
            }
            solo_fire[weapon_id].fire_count++;
            if (solo_fire[weapon_id].ghost_heat_trigger <= solo_fire[weapon_id].fire_count) {
              heat_scale_position = solo_fire[weapon_id].fire_count;
              heat_scale_multiplier = weapons.ghostHeat.scale(heat_scale_position);
              ghost_heat = weapon.heat * heat_scale_multiplier * weapon.multiplier;
              solo_fire[weapon_id].ghost_heat += ghost_heat;
              individual_ghost_heat += ghost_heat;
            }
          }
          if (group_id !== null) {
            if (group_fire[group_id] === void 0) {
              group_fire[group_id] = {};
            }
            if (group_fire[group_id].fire_order === void 0) {
              group_fire[group_id].fire_order = [];
            }
            group_fire[group_id].fire_order.push(weapon_id);
            if (group_fire[group_id].weapon_ids === void 0) {
              group_fire[group_id].weapon_ids = {};
            }
            if (group_fire[group_id].weapon_ids[weapon_id] === void 0) {
              group_fire[group_id].weapon_ids[weapon_id] = {
                fire_count: 0,
                ghost_heat: 0
              };
            }
            group_fire[group_id].weapon_ids[weapon_id].fire_count++;
            if (group_fire[group_id].total_fire_count === void 0) {
              group_fire[group_id].total_fire_count = 0;
            }
            group_fire[group_id].total_fire_count++;
            group_fire[group_id].ghost_heat_trigger = window.ghostHeatGroups[group_id].ghost_heat_trigger;
            if (group_fire[group_id].ghost_heat_trigger <= group_fire[group_id].total_fire_count) {
              heat_scale_position = group_fire[group_id].total_fire_count;
              heat_scale_multiplier = weapons.ghostHeat.scale(heat_scale_position);
              ghost_heat = weapon.heat * heat_scale_multiplier * weapon.multiplier;
              group_fire[group_id].weapon_ids[weapon_id].ghost_heat += ghost_heat;
              if (group_fire[group_id].ghost_heat === void 0) {
                group_fire[group_id].ghost_heat = 0;
              }
              group_fire[group_id].ghost_heat += ghost_heat;
              return group_ghost_heat += ghost_heat;
            }
          }
        });
        total_ghost_heat = group_ghost_heat + individual_ghost_heat;
        return total_ghost_heat;
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
    return window.quirks = {
      form: {
        weapon_id: function() {
          return $('#quirked').val();
        },
        quirk_type: function() {
          return $('#quirk_type').val();
        },
        reduction_value: function() {
          return parseInt($('#quirk_value').val());
        }
      },
      insert_quirk: function(weapon_id, quirk_type, value) {
        var compiled, quirk_id, quirk_text, remove_link, weapon_name;
        weapon_name = window.weaponsList[weapon_id].name;
        quirk_id = "" + quirk_type + "-quirk-" + weapon_id;
        quirk_text = "" + weapon_name + " " + value + "% " + quirk_type + " reduction";
        remove_link = "<a href='#' class='js_remove_quirk btn-xs btn-warning' ><span class='glyphicon glyphicon-remove'/></a>";
        compiled = "<li class='js-quirk_item' id='" + quirk_id + "' data-value='" + value + "' data-quirk_type='" + quirk_type + "' data-weapon_id='" + weapon_id + "'>" + quirk_text + " " + remove_link + "</li>";
        if (!(document.getElementById(quirk_id) || isNaN(value))) {
          $('ul#quirks-list').append(compiled);
          return window.mech.refit();
        }
      },
      init: function() {
        $('#add_quirk').submit(function(e) {
          var quirk_type, value, weapon_id;
          console.log('something');
          e.preventDefault();
          weapon_id = quirks.form.weapon_id();
          quirk_type = quirks.form.quirk_type();
          value = quirks.form.reduction_value();
          return window.mech.quirks.insert_quirk(weapon_id, quirk_type, value);
        });
        return $('#quirks-list').on("click", ".js_remove_quirk", function() {
          console.log($(this).parent().remove());
          window.mech.refit();
          return false;
        });
      },
      weaponheat: function(weapon_id) {
        var modifier, quirk_value, weapon_quirk;
        weapon_quirk = $("#heat-quirk-" + weapon_id);
        modifier = 0;
        if (weapon_quirk.length === 0) {
          modifier = 0;
        } else {
          quirk_value = weapon_quirk.data("value");
          if (quirk_value > 100) {
            quirk_value = 100;
          }
          modifier = quirk_value / 100;
        }
        console.log("modifier is " + modifier);
        return modifier;
      },
      listAll: function() {
        var quirk_collection, quirk_views;
        quirk_views = $('.js-quirk_item');
        return quirk_collection = _.collect(quirk_views, function(quirk_view) {
          return {
            weapon_id: $(quirk_view).data('weapon_id'),
            quirk_type: $(quirk_view).data('quirk_type'),
            reduction_value: $(quirk_view).data('value')
          };
        });
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
        weapon_params = _.intersection(Object.keys(url_params), Object.keys(window.weaponsList));
        if (weapon_params.length > 0) {
          $('#js-stripall').click();
          _.each(weapon_params, function(val, key, list) {
            var count;
            count = url.param(val);
            return _(count).times(function() {
              return $('#armory').find("a[data-weapon-id='" + val + "']").click();
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
          $('#skill_elite').prop('checked', true);
        }
        return _.each(url.param('quirks'), function(quirk) {
          return window.mech.quirks.insert_quirk(quirk.weapon_id, quirk.quirk_type, quirk.reduction_value);
        });
      },
      rebuildPermalink: function() {
        var host, quirks_list, quirks_str, str, url;
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
        str = "" + str + "engine=" + (window.engine.rating()) + "&";
        quirks_str = "";
        quirks_list = window.quirks.listAll();
        _.each(quirks_list, function(quirk) {
          console.log("Callhed");
          console.log(quirk);
          quirks_str += "quirks[" + (quirks_list.indexOf(quirk)) + "][weapon_id]=" + quirk.weapon_id + "&";
          quirks_str += "quirks[" + (quirks_list.indexOf(quirk)) + "][quirk_type]=" + quirk.quirk_type + "&";
          return quirks_str += "quirks[" + (quirks_list.indexOf(quirk)) + "][reduction_value]=" + quirk.reduction_value + "&";
        });
        str = "" + str + quirks_str;
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
        window.quirks.init();
        window.engine.init();
        window.skills.init();
        window.persistence.init();
        window.map.init();
        $('.js-with_tooltip').tooltip('show');
        return setTimeout((function() {
          return $('.js-with_tooltip').tooltip('hide');
        }), 10000);
      },
      heatsink: window.heatsink,
      engine: window.engine,
      quirks: window.quirks,
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
