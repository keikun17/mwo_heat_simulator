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
          multiplier: 1
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
