$(function(){
  shoot = function(val){
    towards = val + currentHeat();
    $('#heatlevel').attr('aria-valuetransitiongoal', towards);
    $('#heatlevel').progressbar({
      display_text: 'fill'
    });
  };
  console.log('Weapons: Online');

  weapons = $('.js-fire');

  fireWeapon = function(event){
    weapon_name = $(this).data('weaponClass');
    shoot(weaponHeatTable[weapon_name]);
  }

  $('.weapon-list').on('click', 'a.js-fire', fireWeapon);

  weaponHeatTable = {
    'slas': 2,
    'mlas': 3,
    'llas': 7,
    'ppc' : 9
  };

  $('#js-alphastrike').click(function(){
    $('.js-fire').click();
  })

  $('.armory').on('click','.js-add-weapon',function(){
    var weaponClass = $(this).data('weaponClass');
    var weaponName = $(this).data('weaponName');
    html = weaponView({name: weaponName, weaponClass: weaponClass})
    $('.weapon-list').append(html);
  })

  $('.weapon-list').on('click','.js-strip',function(){
    $(this).parent().remove();
  })

  console.log("All Systems: Nominal")
  shoot(5);
});
