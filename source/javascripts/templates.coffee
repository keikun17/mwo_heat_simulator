
_.templateSettings =
    interpolate: /\{\{=(.+?)\}\}/g
    evaluate: /\{\{(.+?)\}\}/g

@weaponView = _.template("
<li class='equipped-weapon'>
  <a href='#' class='js-fire btn-sm btn-danger' data-weapon-class='{{= weaponClass }}'> Fire</a>
  <a href='#' class='js-strip btn-sm btn-warning'>Strip</a>
  <a href='#' class='js-weapon_group assigned btn-sm btn-info' data-weapon-group='1'>1</a>
  <a href='#' class='js-weapon_group btn-sm btn-default' data-weapon-group='2'>2</a>
  <a href='#' class='js-weapon_group btn-sm btn-default' data-weapon_group='3'>3</a>
  {{= name }}
  </li>")

@armoryView = _.template("
  <li>
    {{= name }}
  </li>
")
