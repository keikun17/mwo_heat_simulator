(function() {
  $(function() {
    return window.persistence = {
      init: function() {
        window.persistence.resetLoadoutFromParams();
        return $('#permalink').tooltip('show');
      },
      resetEngineFromParams: function() {},
      resetLoadoutFromParams: function() {
        var cool_run, elite_mech, engine_rating, ghost_heat_status, heat_containment, heatsink_count, heatsink_type, url, url_params, weapon_params;
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
        ghost_heat_status = url.param('gh_on');
        if (ghost_heat_status && ghost_heat_status === 'true') {
          $('#ghost_heat').prop('checked', true);
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
        str = "" + str + "gh_on=" + (window.weapons.ghostHeat.is_enabled()) + "&";
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
