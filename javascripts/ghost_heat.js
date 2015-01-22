(function() {
  $(function() {
    return window.weapons.ghostHeat = {
      init: function() {
        return $('#ghost_heat').on('change', function() {
          return window.persistence.rebuildPermalink();
        });
      },
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
          var ghost_heat, group_id, heat_scale_multiplier, heat_scale_position, quirked_weapon_heat, weapon;
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
              quirked_weapon_heat = weapon.heat - (weapon.heat * quirks.weaponheat(weapon_id));
              ghost_heat = quirked_weapon_heat * heat_scale_multiplier * weapon.multiplier;
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
