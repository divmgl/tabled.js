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
    this.pageSize = opts.pageSize || 5;
    this.currentPage = opts.defaultPage || 1;
    var __data = opts.data || [];
    var self = this;

    if (theadRow && !opts.headers) {
      var ths = theadRow.getElementsByTagName("th");
      for(var i = 0; i < ths.length; i++) {
        this.headers.push(camelize(ths[i].innerText));
      }
    }

    Object.defineProperty(this, 'data', {
      get: function() {
        return __data;
      },
      set: function(val) {
        __data = val;
        self.draw();
      }
    });

    Object.defineProperty(this, 'availablePages', {
      get: function() {
        return Math.floor(self.data.length / self.pageSize)
      }
    });

    Object.defineProperty(this, 'subset', {
      get: function() {
        return self.data
          .slice((self.currentPage - 1) * self.pageSize, self.data.length);
      }
    });

    var tbody = element.getElementsByTagName("tbody")[0];

    if (tbody) {
      var tr = tbody.getElementsByTagName("tr");
      var items = [];

      for (var i = 0; i < tr.length; i++) {
        var item = {};
        var td = tr[i].getElementsByTagName("td");
        for (var j = 0; j < td.length; j++){
          var headerProp = this.headers[j];
          if (!headerProp) continue;
          item[headerProp] = td[j].innerText;
        }
        items.push(item);
      }

      this.data = items;
    } else {
      tbody = document.createElement("tbody");
      element.appendChild(tbody);
    }

    this.draw();
  }

  Table.prototype.draw = function() {
    var tbody = this.element.getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";

    var shownCount = this.pageSize < this.subset.length
      ? this.pageSize
      : this.subset.length;

    for(var i = 0; i < shownCount; i++){
      var tr = document.createElement("tr");
      var row = [];

      for(var j = 0; j < this.headers.length; j++) {
        if (this.subset[i][this.headers[j]]) row.push(this.subset[i][this.headers[j]]);
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

  Table.prototype.page = function(pagenum) {
    this.currentPage = pagenum || 1;
    this.draw();
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
