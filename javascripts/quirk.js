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
      cooldown: function(weapon_id) {
        var modifier, quirk_value, weapon_quirk;
        weapon_quirk = $("#cooldown-quirk-" + weapon_id);
        modifier = 0;
        if (weapon_quirk.length === 0) {
          return modifier = 0;
        } else {
          quirk_value = weapon_quirk.data("value");
          if (quirk_value > 100) {
            quirk_value = 100;
          }
          return modifier = quirk_value / 100;
        }
      },
      weaponcooldown: function(weapon_id) {
        var modifier, quirk_value, weapon_quirk;
        weapon_quirk = $("#cooldown-quirk-" + weapon_id);
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
