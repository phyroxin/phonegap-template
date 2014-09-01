
jade = (function(exports){
/*!
 * Jade - runtime
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Lame Array.isArray() polyfill for now.
 */

if (!Array.isArray) {
  Array.isArray = function(arr){
    return '[object Array]' == Object.prototype.toString.call(arr);
  };
}

/**
 * Lame Object.keys() polyfill for now.
 */

if (!Object.keys) {
  Object.keys = function(obj){
    var arr = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        arr.push(key);
      }
    }
    return arr;
  }
}

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    ac = ac.filter(nulls);
    bc = bc.filter(nulls);
    a['class'] = ac.concat(bc).join(' ');
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function nulls(val) {
  return val != null;
}

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 * @api private
 */

exports.attrs = function attrs(obj, escaped){
  var buf = []
    , terse = obj.terse;

  delete obj.terse;
  var keys = Object.keys(obj)
    , len = keys.length;

  if (len) {
    buf.push('');
    for (var i = 0; i < len; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('boolean' == typeof val || null == val) {
        if (val) {
          terse
            ? buf.push(key)
            : buf.push(key + '="' + key + '"');
        }
      } else if (0 == key.indexOf('data') && 'string' != typeof val) {
        buf.push(key + "='" + JSON.stringify(val) + "'");
      } else if ('class' == key && Array.isArray(val)) {
        buf.push(key + '="' + exports.escape(val.join(' ')) + '"');
      } else if (escaped && escaped[key]) {
        buf.push(key + '="' + exports.escape(val) + '"');
      } else {
        buf.push(key + '="' + val + '"');
      }
    }
  }

  return buf.join(' ');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  return String(html)
    .replace(/&(?!(\w+|\#\d+);)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno){
  if (!filename) throw err;

  var context = 3
    , str = require('fs').readFileSync(filename, 'utf8')
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

  return exports;

})({});

jade.templates = {};
jade.render = function(node, template, data) {
  var tmp = jade.templates[template](data);
  node.innerHTML = tmp;
};

jade.templates["temp-content"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="appWeatherNow" class="app-weather-now float"><p>Location: ' + escape((interp = location) == null ? '' : interp) + '</p></div>');
}
return buf.join("");
}
jade.templates["temp-football-content"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="appFootballNow" class="app-football-now float"><table class="standings-table-style"><tr class="table-header-row"><th>Team</th><th>Wins</th><th>Losses</th><th>Progress</th><th>Points</th></tr>');
// iterate teams
;(function(){
  if ('number' == typeof teams.length) {
    for (var i = 0, $$l = teams.length; i < $$l; i++) {
      var team = teams[i];

buf.push('<tr class="table-data-row"><td>' + escape((interp = team.stand_team_name) == null ? '' : interp) + '</td><td>' + escape((interp = team.stand_overall_w) == null ? '' : interp) + '</td><td>' + escape((interp = team.stand_overall_l) == null ? '' : interp) + '</td><td>' + escape((interp = team.stand_status) == null ? '' : interp) + '</td><td>' + escape((interp = team.stand_points) == null ? '' : interp) + '</td></tr>');
    }
  } else {
    for (var i in teams) {
      var team = teams[i];

buf.push('<tr class="table-data-row"><td>' + escape((interp = team.stand_team_name) == null ? '' : interp) + '</td><td>' + escape((interp = team.stand_overall_w) == null ? '' : interp) + '</td><td>' + escape((interp = team.stand_overall_l) == null ? '' : interp) + '</td><td>' + escape((interp = team.stand_status) == null ? '' : interp) + '</td><td>' + escape((interp = team.stand_points) == null ? '' : interp) + '</td></tr>');
   }
  }
}).call(this);

buf.push('</table></div>');
}
return buf.join("");
}
jade.templates["temp-football-header"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="appFootballHeaderText" class="app-football-header-style"><h2 class="float">Football Droid &nbsp;&nbsp;</h2><span>' + escape((interp = season) == null ? '' : interp) + '</span></div><div id="appFootballHeaderMenu" class="app-football-header-menu"></div>');
}
return buf.join("");
}
jade.templates["temp-header"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="appHeaderText" class="app-weather-header-style"><h2>' + escape((interp = header) == null ? '' : interp) + ' &nbsp;&nbsp;<input id="area" type="text" placeholder="search" class="area-style"/></h2></div>');
}
return buf.join("");
}
jade.templates["temp-user"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div style="height:30px;" class="user-wrap"><div');
buf.push(attrs({ 'id':("icon_" + (id) + ""), 'style':("background-color:" + (col) + ";"), "class": ("userIcon") }, {"id":true,"class":true,"style":true}));
buf.push('></div><div');
buf.push(attrs({ 'id':("" + (id) + ""), "class": ("userName") }, {"id":true,"class":true}));
buf.push('>' + escape((interp = user) == null ? '' : interp) + '</div></div>');
}
return buf.join("");
}
jade.templates["temp-weather-content"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="appWeatherNow" class="app-weather-now float"><p>Location: ' + escape((interp = location) == null ? '' : interp) + '</p><h3>' + escape((interp = temp) == null ? '' : interp) + '&deg;C</h3><p>Observation time: ' + escape((interp = observation_time) == null ? '' : interp) + '</p></div><div id="appWeatherDays" class="app-weather-days float"><div class="sub-header"><p>Cloud cover</p></div><div><span>' + escape((interp = cloudcover) == null ? '' : interp) + '<span class="smallSpan">%</span></span></div><div class="sub-header"><p>Humidity</p></div><div><span>' + escape((interp = humidity) == null ? '' : interp) + '<span class="smallSpan">%</span></span></div><div class="sub-header"><p>Pressure</p></div><div><span>' + escape((interp = pressure) == null ? '' : interp) + ' <span class="smallSpan">millibars</span></span></div><div class="sub-header"><p>	\nWind Speed</p></div><div><span>' + escape((interp = windspeedKmph) == null ? '' : interp) + '<span class="smallSpan">	\nMph</span></span></div><div class="sub-header"><p>	\nWind Direction</p></div><div><span>' + escape((interp = winddir16Point) == null ? '' : interp) + '</span></div></div><div id="appWeatherMap" class="app-weather-map float"><p></p></div><div id="appWeatherSummary" class="app-weather-summary float"><p></p></div>');
}
return buf.join("");
}
jade.templates["temp-weather-header"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="appWeatherHeaderText" class="app-weather-header-style"><h2>Weather Bot &nbsp;&nbsp;<input id="area" type="text" placeholder="enter a city or postcode" class="area-style"/></h2></div><div id="appWeatherHeaderMenu" class="app-weather-header-menu"></div>');
}
return buf.join("");
}