
_.templateSettings =
    interpolate: /\{\{=(.+?)\}\}/g
    evaluate: /\{\{(.+?)\}\}/g

@weaponView = _.template("
<li class='equipped-weapon'>
  <a href='#' class='js-fire btn-sm btn-danger' data-weapon-class='{{= weaponClass }}'> <span class='glyphicon glyphicon-screenshot'></span></a>
  <a href='#' class='js-strip btn-sm btn-warning'><span class='glyphicon glyphicon-remove'></span></a>
  <a href='#' class='js-weapon_group btn-sm btn-default' data-weapon-group='1'>1</a>
  <a href='#' class='js-weapon_group btn-sm btn-default' data-weapon-group='2'>2</a>
  <a href='#' class='js-weapon_group btn-sm btn-default' data-weapon-group='3'>3</a>
  {{= name }}
  </li>")

@armoryView = _.template("
  <li>
    {{= name }}
  </li>
")
