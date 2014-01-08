(function() {
  $(function() {
    return window.persistence = {
      init: function() {
        return window.persistence.resetLoadoutFromParams();
      },
      resetLoadoutFromParams: function() {
        var url, url_params, weapon_params;
        url = $.url(location);
        url_params = url.param();
        weapon_params = _.intersection(Object.keys(url_params), Object.keys(window.mech.weapons.weaponStats));
        if (weapon_params.length > 0) {
          $('#js-stripall').click();
          return _.each(weapon_params, function(val, key, list) {
            var count;
            count = url.param(val);
            return _(count).times(function() {
              return $('#armory').find("a[data-weapon-class='" + val + "']").click();
            });
          });
        }
      },
      rebuildPermalink: function() {
        var host, str;
        str = "";
        _.each(window.weapons.weaponCounts(), function(val, key) {
          return str = "" + str + key + "=" + val + "&";
        });
        host = '?' + str;
        host;
        $('#permalink').text($.url(location).attr('host') + host);
        return $('#permalink').attr('href', host);
      },
      generateLink: function() {
        return window.persistence.rebuildPermalink();
      }
    };
  });

}).call(this);
