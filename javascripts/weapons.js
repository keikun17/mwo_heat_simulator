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
          return $(".js-fire.ready").click();
        });
        $('.weapon-list').on("click", ".js-weapon_group", function() {
          $(this).toggleClass('assigned');
          $(this).toggleClass('btn-default');
          $(this).toggleClass('btn-info');
          return false;
        });
        $('.js-fire_weapon_group').click(function(e) {
          var group, wgs;
          e.preventDefault();
          group = $(this).data('activateGroup');
          wgs = $("[data-weapon-group='" + group + "'].js-weapon_group.assigned");
          console.log("count is " + wgs.length);
          _.each(wgs, function(wg) {
            return $(wg).siblings('.js-fire.ready').click();
          });
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
          heat: 3
        },
        llas: {
          heat: 7
        },
        ellas: {
          heat: 8.5
        },
        splas: {
          heat: 2.4
        },
        mplas: {
          heat: 5
        },
        lplas: {
          heat: 8.5
        },
        ppc: {
          heat: 10
        },
        eppc: {
          heat: 12
        },
        flam: {
          heat: .6
        },
        ac2: {
          heat: 1
        },
        ac5: {
          heat: 1
        },
        ac10: {
          heat: 3
        },
        ac20: {
          heat: 6
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
          heat: 4
        },
        lrm15: {
          heat: 5
        },
        lrm20: {
          heat: 6
        },
        srm2: {
          heat: 2
        },
        srm4: {
          heat: 3
        },
        srm6: {
          heat: 4
        },
        ssrm2: {
          heat: 2
        }
      },
      shoot: function(val) {
        var towards;
        val = val * 100;
        towards = val + window.mech.heatsink.getCurrentHeat();
        window.mech.setHeat(towards);
        return val = val * 100;
      },
      fireWeapon: function(event) {
        var weapon_name;
        console.log('fire');
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
