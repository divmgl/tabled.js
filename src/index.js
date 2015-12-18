(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.tabled = factory();
  }
}(this, function () {
  var noElementFoundError =
    new Error("No element found. Please specify an element to convert.");

  var unspecifiedHeaderError =
    new Error("Please specify headers by providing " +
      "a <thead></thead> tag.");

  var camelize = function(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index == 0 ? match.toLowerCase() : match.toUpperCase();
    });
  }

  var Table = function(element, opts) {
    if (!element) throw noElementFoundError;

    this.element = element;

    var thead = element.getElementsByTagName("thead")[0];
    if (!thead) throw unspecifiedHeaderError;
    var theadRow = thead.getElementsByTagName("tr")[0];

    opts = opts || {};
    this.headers = opts.headers || [];
    this.data = opts.data || [];
    this.pageSize = opts.pageSize || 5;
    this.currentPage = opts.defaultPage || 1;

    if (theadRow && !opts.headers) {
      var ths = theadRow.getElementsByTagName("th");
      for(var i = 0; i < ths.length; i++) {
        this.headers.push(camelize(ths[i].innerText));
      }
    }

    var tbody = element.getElementsByTagName("tbody")[0];
    if (!tbody) {
      tbody = document.createElement("tbody");
      element.appendChild(tbody);
    }

    var self = this;
    var __data = {};

    Object.defineProperty(this, 'data', {
      get: function() {
        return __data;
      },
      set: function(val) {
        __data = val;
        self.draw();
      }
    });
  }

  Table.prototype.draw = function() {
    var tbody = this.element.getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";

    var shownCount = this.pageSize < this.data.length
      ? this.pageSize
      : this.data.length;

    for(var i = 0; i < shownCount; i++){
      var tr = document.createElement("tr");
      var row = [];

      for(var j = 0; j < this.headers.length; j++) {
        if (this.data[i][this.headers[j]]) row.push(this.data[i][this.headers[j]]);
        else row.push("");
      }

      for(var j = 0; j < row.length; j++) {
        var td = document.createElement("td");
        td.innerHTML = row[j];
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
  }

  Table.prototype.page = function() {

  }

  tabled = {
    create: function(element, opts) {
      return new Table(element, opts);
    },
    __unspecifiedHeaderError: unspecifiedHeaderError,
    __noElementFoundError: noElementFoundError
  };

  if (typeof window !== 'undefined') window.tabled = tabled;

  return tabled;
}));
