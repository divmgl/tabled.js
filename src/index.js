(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.tabled = factory();
  }
}(this, function () {
  var camelize = function(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index == 0 ? match.toLowerCase() : match.toUpperCase();
    });
  }

  var noElementFoundError =
    new Error("No element found. Please specify an element to convert.");

  var unspecifiedHeaderError =
    new Error("Please specify headers by providing " +
      "a <thead></thead> tag.");

  var create = function(element, opts) {
    opts = opts || {};

    if (!element) throw noElementFoundError;
    var thead = element.getElementsByTagName("thead")[0];
    if (!thead) throw unspecifiedHeaderError;
    var theadRow = thead.getElementsByTagName("tr")[0];
    var data = opts.data || [];

    var table = {
      headers: opts.headers || [],
      element: element
    };

    if (theadRow && !opts.headers) {
      var ths = theadRow.getElementsByTagName("th");
      for(var i = 0; i < ths.length; i++) {
        table.headers.push(camelize(ths[i].innerText));
      }
    }

    var tbody = element.getElementsByTagName("tbody")[0];
    if (!tbody) {
    	tbody = document.createElement("tbody");
      element.appendChild(tbody);
    }

    Object.defineProperty(table, 'data', {
      get: function() {
        return val;
      },
      set: function(val) {
        tbody.innerHTML = "";
        for(var i = 0; i < val.length; i++){
          var tr = document.createElement("tr");
          var row = [];
          for(var j = 0; j < table.headers.length; j++) {
            if (val[i][table.headers[j]]) row.push(val[i][table.headers[j]]);
            else row.push("");
          }
          for(var j = 0; j < row.length; j++) {
            var td = document.createElement("td");
            td.innerHTML = row[j];
            tr.appendChild(td);
          }
          tbody.appendChild(tr);
        }
        data = val;
      }
    });

    return table;
  }

  tabled = {
    create: create,
    __unspecifiedHeaderError: unspecifiedHeaderError,
    __noElementFoundError: noElementFoundError
  };

  if (typeof window !== 'undefined') window.tabled = tabled;

  return tabled;
}));
