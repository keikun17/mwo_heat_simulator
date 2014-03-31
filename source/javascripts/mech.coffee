#= require heatsink
#= require weapons
#= require ghost_heat
#= require engine
#= require skills
#= require map
#= require persistence

$ ->
  window.mech=

    init: ->
      window.heatsink.init()
      window.weapons.init()
      window.engine.init()
      window.skills.init()
      window.persistence.init()
      window.map.init()

      # Show tooltips
      $('.js-with_tooltip').tooltip('show')

      # And hide them after 10 seconds
      setTimeout ( ->
        $('.js-with_tooltip').tooltip('hide')
      ), 10000

    heatsink: window.heatsink

    engine: window.engine

    damage: 0

    refit: ->
      $('#heat-threshold').text( window.mech.heatsink.getThreshold() / 100 )
      $("#heatlevel").attr "aria-valuemax", window.mech.heatsink.getThreshold()
      $('#cool-rate').text(window.mech.heatsink.getCoolRate().toFixed(2))
      $('#internal-heatsinks').text(window.mech.heatsink.internal_heatsinks())
      window.persistence.generateLink()

    weapons: window.weapons

    skills: window.skills

    resetDamage: ->
      mech.damage = 0
      $('#damage').text(0)

    dpsUptime: 0

    dps:
      uptime: 0
      value: 0

      incrementTimer: ->
        mech.dps.uptime = mech.dps.uptime + 1
        mech.dps.recompute()

      resetTimer: ->
        mech.dps.value = 0
        mech.dps.uptime = 0
        mech.dps.clock = clearInterval(mech.dps.clock)
        $('#dps').text('0.00')

      recompute: =>
        mech.dps.value = mech.damage / mech.dps.uptime
        $('#dps').text(mech.dps.value.toFixed(2))

    setHeat: (heatlevel) ->
      $("#heatlevel").attr "aria-valuetransitiongoal", heatlevel
      $("#heatlevel").progressbar
        transition_delay: 100
        refresh_speed: 10
        display_text: "fill"
