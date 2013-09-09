(function() {
  $(function() {
    console.log("Reactor: Online");
    this.currentHeat = function() {
      var val;
      val = parseInt($("#heatlevel").attr("aria-valuetransitiongoal"));
      if (isNaN(val)) {
        val = 0;
      }
      return val;
    };
    this.heatSinkCount = function() {
      return parseInt($("#heatsink-count").val());
    };
    this.isSingleHeatSink = function() {
      return $("#heatsink_type").val() === "single";
    };
    this.coolRate = function() {
      var external_heat_sink, internal_heat_sink, rate;
      if (this.isSingleHeatSink()) {
        rate = .1 * this.heatSinkCount();
      } else {
        if (this.heatSinkCount() >= 10) {
          internal_heat_sink = 10;
          external_heat_sink = this.heatSinkCount() - internal_heat_sink;
          rate = (internal_heat_sink * .2) + (external_heat_sink * .14);
        } else {
          rate = .14 * this.heatSinkCount();
        }
      }
      return rate;
    };
    this.coolDown = function() {
      var towards;
      towards = this.currentHeat() - (this.coolRate() * 100);
      if (this.currentHeat() > 0) {
        $("#heatlevel").attr("aria-valuetransitiongoal", towards);
        return $("#heatlevel").progressbar({
          transition_delay: 100,
          refresh_speed: 10,
          display_text: "fill"
        });
      }
    };
    this.recomputeThreshold = function() {
      var threshold;
      if (this.isSingleHeatSink()) {
        threshold = 30 + (this.heatSinkCount());
      } else {
        threshold = 30 + ((this.heatSinkCount()) * 1.4);
      }
      threshold = threshold * 100;
      $("#heatlevel").attr("aria-valuemax", threshold);
      $("#heat-threshold").text(threshold / 100);
      return $("#cool-rate").text(this.coolRate().toPrecision(2));
    };
    this.tickRate = function() {
      return 1000;
    };
    this.tick = function() {
      this.coolDown();
      return this.recomputeThreshold();
    };
    this.runTicker = function() {
      console.log("Sensors: Online");
      return setInterval(this.tick, this.tickRate());
    };
    return this.runTicker();
  });

}).call(this);
