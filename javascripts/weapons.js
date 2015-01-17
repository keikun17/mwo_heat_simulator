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
