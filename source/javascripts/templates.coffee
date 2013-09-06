
_.templateSettings =
    interpolate: /\{\{=(.+?)\}\}/g
    evaluate: /\{\{(.+?)\}\}/g

@weaponView = _.template("<li class='equipped-weapon'><a href='#' class='js-fire btn-sm btn-danger' data-weapon-class='{{= weaponClass }}'> Fire</a> <a href='#' class='js-strip btn-sm btn-warning'>Strip</a>  {{= name }} </li>")

@armoryView = _.template("
  <li>
    {{= name }}
  </li>
")
