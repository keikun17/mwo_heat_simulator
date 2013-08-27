$(function(){
  weaponHeatTable = {
    'slas': 2,
    'mlas': 3,
    'llas': 7,
    'ellas': 8.5,
    'splas': 2.4,
    'mplas': 5,
    'lplas': 8.5,
    'ppc': 9,
    'eppc': 12,
    'flam': 1  // Flamer heat should actually be 0.6 but bootstrap progress bar can't do >1 values.
  };

  shoot = function(val){
    console.log('-------');
    console.log('Adding Heat:');
    console.log(val);
    console.log('Current Heat Is:');
    console.log(currentHeat());

    towards = val + currentHeat();
    $('#heatlevel').attr('aria-valuetransitiongoal', towards);
  };

  weapons = $('.js-fire');

  fireWeapon = function(event){
    weapon_name = $(this).data('weaponClass');
    shoot(weaponHeatTable[weapon_name]);
  }

  $('.weapon-list').on('click', 'a.js-fire', fireWeapon);

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

  console.log('Weapons: Online');
});
