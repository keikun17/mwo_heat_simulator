
_.templateSettings =
    interpolate: /\{\{=(.+?)\}\}/g
    evaluate: /\{\{(.+?)\}\}/g

@weaponView = _.template("<li><a href='#' class='js-fire btn-xs btn-danger' data-weapon-class='{{= weaponClass }}'> Fire</a> <a href='#' class='js-strip btn-xs btn-warning'>Strip</a>  {{= name }} </li>")

@armoryView = _.template("
  <li>
    {{= name }}
  </li>
")
