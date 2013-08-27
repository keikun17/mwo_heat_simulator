//= require_tree .

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

  // Shoot at start
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
