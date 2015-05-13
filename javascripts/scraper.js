(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $(function() {
    return window.scraper = {
      form: {
        smurfy_url: function() {
          return $('#smurfy_url').val();
        }
      },
      init: function() {
        return $('#import_from_smurfy').submit(function(e) {
          var mech_json, smurfy_url;
          e.preventDefault();
          $('#js-stripall').click();
          smurfy_url = scraper.form.smurfy_url();
          return mech_json = window.scraper.scrape(smurfy_url);
        });
      },
      scrapedData: '',
      scrape: function(smurfy_url) {
        var _this = this;
        smurfy_url = smurfy_url.replace('mwo.smurfy-net.de/mechlab#', 'mwo.smurfy-net.de/mechlab/loadouts');
        smurfy_url = smurfy_url.replace('i=', '/');
        smurfy_url = smurfy_url.replace('&l=', '/');
        console.log("new url is " + smurfy_url);
        return $.get(smurfy_url, function(response) {
          var needed_values, scraped_html, scraped_json;
          _this.scrapedData = response.responseText;
          scraped_html = $.parseHTML(_this.scrapedData);
          window.x = scraped_html;
          scraped_json = $.parseJSON($(scraped_html[0]).text());
          needed_values = scraper.extract_needed_values(scraped_json);
          console.log(needed_values);
          _.each(needed_values.extracted_weapons, function(qty, weapon_id, list) {
            return _.times(qty, function() {
              return window.weapons.equip(weapon_id);
            });
          });
          $('#heatsink-count').val(needed_values.extracted_external_heatsinks);
          $('#heatsink_type').val(needed_values.extracted_heatsink_type);
          if (needed_values.extracted_engine !== "") {
            $('#engine_type').val(needed_values.extracted_engine);
          }
          window.mech.refit();
          return window.persistence.rebuildPermalink();
        });
      },
      extract_needed_values: function(mech_json) {
        var extracted_engine, extracted_external_heatsinks, extracted_heatsink_type, extracted_weapons, needed_values;
        console.log(mech_json);
        extracted_weapons = {};
        extracted_engine = "";
        extracted_external_heatsinks = 0;
        extracted_heatsink_type = "single";
        _.each(mech_json.upgrades, function(upgrade) {
          var _ref;
          if ((_ref = upgrade.id) === "3002" || _ref === "3005") {
            return extracted_heatsink_type = "double";
          }
        });
        _.each(mech_json.configuration, function(mech_part) {
          return _.each(mech_part.items, function(item) {
            var _i, _ref, _ref1, _results;
            console.log("into mech item");
            if (item.type === "module") {
              if (_ref = parseInt(item.id), __indexOf.call((function() {
                _results = [];
                for (_i = 3218; _i <= 3478; _i++){ _results.push(_i); }
                return _results;
              }).apply(this), _ref) >= 0) {
                console.log("It's an ENGINE! " + item.id);
                extracted_engine = window.engine.get_rating_from_id(item.id);
              }
              if ((_ref1 = parseInt(item.id)) === 3000 || _ref1 === 3001 || _ref1 === 3004) {
                extracted_external_heatsinks++;
              }
            }
            if (item.type === "weapon") {
              switch (item.id) {
                case '1038':
                  item.id = 1030;
                  break;
                case '1039':
                  item.id = 1004;
                  break;
                case '1040':
                  item.id = 1031;
                  break;
                case '1041':
                  item.id = 1026;
                  break;
                case '1042':
                  item.id = 1027;
                  break;
                case '1043':
                  item.id = 1028;
                  break;
                case '1044':
                  item.id = 1002;
                  break;
                case '1222':
                  item.id = 1218;
                  break;
                case '1223':
                  item.id = 1219;
                  break;
                case '1224':
                  item.id = 1220;
                  break;
                case '1225':
                  item.id = 1221;
                  break;
                case '1229':
                  item.id = 1226;
                  break;
                case '1230':
                  item.id = 1227;
                  break;
                case '1231':
                  item.id = 1228;
              }
              if (!extracted_weapons[item.id]) {
                extracted_weapons[item.id] = 0;
              }
              return extracted_weapons[item.id] = extracted_weapons[item.id] + 1;
            }
          });
        });
        return needed_values = {
          extracted_weapons: extracted_weapons,
          extracted_engine: extracted_engine,
          extracted_external_heatsinks: extracted_external_heatsinks,
          extracted_heatsink_type: extracted_heatsink_type
        };
      }
    };
  });

}).call(this);
