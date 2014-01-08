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
          mech.damage = 0;
          return $('#damage').text(0);
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
        return $('#damage').text(mech.damage.toFixed(2));
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
