$(function(){
  console.log("Reactor: Online")

  // get heat value
  currentHeat = function(){
    val = parseInt($('#heatlevel').attr('aria-valuetransitiongoal'));
    if( isNaN(val) ) {
      val = 0;
    }
    return val;
  }

  heatSinkCount = function(){
    return parseInt($('#heatsink-count').val());
  }

  isSingleHeatSink = function(){
    return $('#heatsink_type').val() == 'single';
  }

  // Run heatsinks
  coolDown = function(){
    if(isSingleHeatSink()){
      towards = currentHeat() - (.1 * heatSinkCount() );
    }else{
      towards = currentHeat() - (.14 * heatSinkCount() );
    }

    if( currentHeat() > 0 ) {
      $('#heatlevel').attr('aria-valuetransitiongoal', towards);
      $('#heatlevel').progressbar({
        refresh_speed: 10,
        display_text: 'fill'
      })
    }
  };

  var recomputeThreshold = function(){
    if( isSingleHeatSink() ){
      threshold = 30 + (heatSinkCount() - 10);
    }else{
      threshold = 30 + ((heatSinkCount() - 10) * 1.4);
    }
    $('#heatlevel').attr('aria-valuemax', threshold)
    $('#heat-threshold').text(threshold)
  }

  tickRate = function(){
    return 1000;
  }

  var tick = function(){
    coolDown();
    recomputeThreshold();
  }

  runTicker = function(){
    console.log("Sensors: Online")
    setInterval(tick, tickRate());
  };

  runTicker();

});
$(function(){
  weaponView = _.template("<li> <%= name %> <a href='#' class='js-fire btn-xs btn-danger' data-weapon-class='<%= weaponClass %>'> Fire</a> <a href='#' class='js-strip btn-xs btn-warning'>Strip</a> </li>");
})


;
$(function(){
  weaponHeatTable = {
    // Energy Weapons
    'slas': 2,
    'mlas': 3,
    'llas': 7,
    'ellas': 8.5,
    'splas': 2.4,
    'mplas': 5,
    'lplas': 8.5,
    'ppc': 9,
    'eppc': 12,
    'flam': 1,  // Flamer heat should actually be 0.6 but bootstrap progress bar can't do >1 values.

    // Balistic Weapons
    'ac2': 1,
    'ac5': 1,
    'ac10': 3,
    'ac20': 6,
    'uac5': 1,
    'lb10x': 2,
    'gauss': 1,
    'mg': 0,

    // Missile
    'lrm5': 2,
    'lrm10': 4,
    'lrm15': 5,
    'lrm20': 6,
    'srm2': 2,
    'srm4': 3,
    'srm6': 4,
    'ssrm2': 2

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

$(function(){
  shoot(5);
  console.log("All Systems: Nominal")
});
