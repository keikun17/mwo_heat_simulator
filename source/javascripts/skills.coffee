$ ->
  window.skills =
    init: ->
      $('#skill_coolrun').on 'change', window.mech.refit
      $('#skill_containment').on 'change', window.mech.refit
      $('#skill_elite').on 'change', window.mech.refit

    coolRunEnabled: ->
      $('#skill_coolrun').is(':checked')

    heatContainmentEnabled: ->
      $('#skill_containment').is(':checked')

    eliteMechEnabled: ->
      $('#skill_elite').is(':checked')
