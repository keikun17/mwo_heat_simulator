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
