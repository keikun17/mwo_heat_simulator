(function() {
  $(function() {
    return window.skills = {
      init: function() {
        $('#skill_coolrun').on('change', window.mech.refit);
        $('#skill_containment').on('change', window.mech.refit);
        return $('#skill_elite').on('change', window.mech.refit);
      },
      coolRunEnabled: function() {
        return $('#skill_coolrun').is(':checked');
      },
      heatContainmentEnabled: function() {
        return $('#skill_containment').is(':checked');
      },
      eliteMechEnabled: function() {
        return $('#skill_elite').is(':checked');
      }
    };
  });

}).call(this);
