(function() {
  $(function() {
    return window.weapons = {
      init: function() {
        $('.weapon-list').on("click", "a.js-fire", this.fireWeapon);
        $(".armory").on("click", ".js-add-weapon", function() {
          var html, weaponClass, weaponName;
          weaponClass = $(this).data("weaponClass");
          weaponName = $(this).data("weaponName");
          html = weaponView({
            name: weaponName,
            weaponClass: weaponClass
          });
          $(".weapon-list").append(html);
          return false;
        });
        $("#js-alphastrike").click(function() {
          return $(".js-fire").click();
        });
        $('.js-fire_weapon_group').click(function(e) {
          var group, wgs;
          e.preventDefault();
          group = $(this).data('activateGroup');
          wgs = $("[data-weapon-group='" + group + "'].js-weapon_group.assigned");
          return _.each(wgs, function(wg) {
            return $(wg).siblings('.js-fire').click();
          });
        });
        $(".weapon-list").on("click", ".js-strip", function() {
          return $(this).parent().remove();
        });
        return $("#js-stripall").click(function() {
          return $('.js-strip').click();
        });
      },
      heatTable: {
        slas: 2,
        mlas: 3,
        llas: 7,
        ellas: 8.5,
        splas: 2.4,
        mplas: 5,
        lplas: 8.5,
        ppc: 10,
        eppc: 12,
        flam: .6,
        ac2: 1,
        ac5: 1,
        ac10: 3,
        ac20: 6,
        uac5: 1,
        lb10x: 2,
        gauss: 1,
        mg: 0,
        lrm5: 2,
        lrm10: 4,
        lrm15: 5,
        lrm20: 6,
        srm2: 2,
        srm4: 3,
        srm6: 4,
        ssrm2: 2
      },
      shoot: function(val) {
        var towards;
        val = val * 100;
        console.log("-------");
        console.log("Adding Heat:");
        console.log(val);
        console.log("Current Heat Is:");
        console.log(window.mech.heatsink.getCurrentHeat());
        towards = val + window.mech.heatsink.getCurrentHeat();
        $("#heatlevel").attr("aria-valuetransitiongoal", towards);
        return val = val * 100;
      },
      fireWeapon: function(event) {
        var weapon_name;
        console.log('fire');
        weapon_name = $(this).data("weaponClass");
        return window.weapons.shoot(window.weapons.heatTable[weapon_name]);
      }
    };
  });

}).call(this);
