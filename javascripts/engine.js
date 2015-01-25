(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $(function() {
    return window.engine = {
      init: function() {
        return $('#engine_type').on('change', window.mech.refit);
      },
      rating: function() {
        return parseInt($('#engine_type').val());
      },
      internal_heatsink_count: function() {
        return Math.floor(this.rating() / 25);
      },
      get_rating_from_id: function(engine_id) {
        var rating, _i, _j, _k, _ref, _ref1, _ref2, _results, _results1, _results2;
        engine_id = parseInt(engine_id);
        if (_ref = parseInt(engine_id), __indexOf.call((function() {
          _results = [];
          for (_i = 3218; _i <= 3278; _i++){ _results.push(_i); }
          return _results;
        }).apply(this), _ref) >= 0) {
          rating = (engine_id - 3218) * 5 + 100;
        }
        if (_ref1 = parseInt(engine_id), __indexOf.call((function() {
          _results1 = [];
          for (_j = 3318; _j <= 3378; _j++){ _results1.push(_j); }
          return _results1;
        }).apply(this), _ref1) >= 0) {
          rating = (engine_id - 3318) * 5 + 100;
        }
        if (_ref2 = parseInt(engine_id), __indexOf.call((function() {
          _results2 = [];
          for (_k = 3418; _k <= 3478; _k++){ _results2.push(_k); }
          return _results2;
        }).apply(this), _ref2) >= 0) {
          rating = (engine_id - 3418) * 5 + 100;
        }
        return rating;
      }
    };
  });

}).call(this);
