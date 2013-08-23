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

  // Run heatsinks
  coolDown = function(){
    towards = currentHeat() - (.1 * heatSinkCount() );

    if( currentHeat() > 0 ) {
      $('#heatlevel').attr('aria-valuetransitiongoal', towards);
      $('#heatlevel').progressbar({
        refresh_speed: 10,
        display_text: 'fill'
      })
    }
  };

  coolDownRate = function(){
    return 1000;
  }

  runHeatsink = function(){
    console.log("Sensors: Online")
    setInterval(coolDown, coolDownRate());
  };

  runHeatsink();

  // Shoot at start
  shoot = function(val){
    towards = val + currentHeat();
    $('#heatlevel').attr('aria-valuetransitiongoal', towards);
    $('#heatlevel').progressbar({
      display_text: 'fill'
    });
  };
  console.log('Weapons: Online');

  $('#js-alphastrike').click(function(){
    console.log("PEEEW!")
    shoot(20);
  })

  console.log("All Systems: Nominal")
  shoot(55);
});
