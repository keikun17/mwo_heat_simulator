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

  coolRate = function(){
    if(isSingleHeatSink()){
      rate = .1 * heatSinkCount();
    }else{
      if(heatSinkCount() >= 10){
        internal_heat_sink = 10;
        external_heat_sink = heatSinkCount() - internal_heat_sink;
        rate = ( internal_heat_sink * .2 ) + ( external_heat_sink * .14 );
      }else{
        rate = .14 * heatSinkCount();
      }
    }
    return rate
  }

  // Run heatsinks
  coolDown = function(){

    towards = currentHeat() -  (coolRate() * 100);

    if( currentHeat() > 0 ) {
      $('#heatlevel').attr('aria-valuetransitiongoal', towards);
      $('#heatlevel').progressbar({
        transition_delay: 100,
        refresh_speed: 10,
        display_text: 'fill'
      })
    }
  };

  var recomputeThreshold = function(){
    if( isSingleHeatSink() ){
      threshold = 30 + (heatSinkCount());
    }else{
      threshold = 30 + ((heatSinkCount()) * 1.4);
    }
    threshold = threshold * 100;
    $('#heatlevel').attr('aria-valuemax', threshold);
    $('#heat-threshold').text((threshold / 100));
    $('#cool-rate').text(coolRate().toPrecision(2));
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
