//= require_tree .

$(function(){
  console.log("Reactor: Online")
  // get heat value
  currentHeat = function(){
    return parseInt($('.progress .progress-bar').attr('aria-valuetransitiongoal'));
  }

  // Reset upon completion
  coolDown = function(){
    towards = currentHeat() - 1;

    $('.progress .progress-bar').attr('aria-valuetransitiongoal', towards);
    $('.progress .progress-bar').progressbar({
      refresh_rate: 10,
      display_text: 'fill'
    })

  };

  // Run heatsinks
  runHeatsink = function(){
    console.log("Sensors: Online")
    setInterval(coolDown,100);
  };
  runHeatsink();

  // Shoot at start
  shoot = function(val){
    console.log('Weapons: Online');

    $('.progress .progress-bar').attr('aria-valuetransitiongoal', val);
    $('.progress .progress-bar').progressbar({
      display_text: 'fill'
    });

  };

  console.log("All Systems: Nominal")
  shoot(55);
});
