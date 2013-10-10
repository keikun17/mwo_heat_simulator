
_.templateSettings =
    interpolate: /\{\{=(.+?)\}\}/g
    evaluate: /\{\{(.+?)\}\}/g

@weaponView = _.template("
  <li class='equipped-weapon'>
    <div class='row'>
      <div class='col-lg-9'>
        <a href='#' class='js-fire btn-sm btn-danger' data-weapon-class='{{= weaponClass }}'> <span class='glyphicon glyphicon-screenshot'></span></a>
        <a href='#' class='js-strip btn-sm btn-warning'><span class='glyphicon glyphicon-remove'></span></a>
        <a href='#' class='js-weapon_group btn-sm btn-default' data-weapon-group='1'> <span class='glyphicon glyphicon-link'></span>1</a>
        <a href='#' class='js-weapon_group btn-sm btn-default' data-weapon-group='2'> <span class='glyphicon glyphicon-link'></span>2</a>
        <a href='#' class='js-weapon_group btn-sm btn-default' data-weapon-group='3'> <span class='glyphicon glyphicon-link'></span>3</a>
        {{= name }}
      </div>
      <div class='col-lg-3 weapon-cooldown-container'>
        <div class='progress horizontal'>
          <div class='progress-bar progress-bar-success cooldown-meter {{= weaponClass }}-cooldown quick-reset' role='progressbar' aria-valuemax='100' aria-valuetransitiongoal='100' aria-valuenow='0' ></div>;
        </div>
      </div>
  </div>
</li>")

@armoryView = _.template("
  <li>
    {{= name }}
  </li>
")
