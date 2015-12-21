beforeEach(function() {
  var table = this.table = document.createElement("table");
  document.body.insertBefore(table, document.body.firstChild);
});

describe('tabled', function(){
  describe('bootstrap', function () {
    it('returns an object', function() {
      window.tabled.should.not.equal(null);
    });

    it('throws an error when no element', function() {
      expect(function() {
        tabled.create();
      }).to.throw(tabled.__noElementFoundError);
    });

    it('throws an error when no thead', function() {
      var self = this;
      expect(function() {
        tabled.create(self.table);
      }).to.throw(tabled.__unspecifiedHeaderError);
    });

    it('does not throw when thead found', function(){
      var self = this;
      var thead = document.createElement("thead");
      self.table.insertBefore(thead, self.table.firstChild);

      var create = function(){
        tabled.create(self.table);
      }

      expect(create).to.not.throw();
      expect(create).to.not.throw(tabled.__noElementFoundError);
      expect(create).to.not.throw(tabled.__unspecifiedHeaderError);
    });
  });

  describe('headers and rows', function(){
    it('uses thead element to construct headers', function() {
      var self = this;
      var thead = document.createElement("thead");
      thead.innerHTML =
        "<tr>" +
          "<th>Test</th>" +
          "<th>Data</th>" +
        "</tr>";
      self.table.insertBefore(thead, self.table.firstChild);

      var table = tabled.create(self.table);

      expect(table.headers[0]).to.equal("test");
      expect(table.headers[1]).to.equal("data");
    });

    it('captures tbody element to construct rows', function() {
      var self = this;
      var thead = document.createElement("thead");
      thead.innerHTML =
        "<tr>" +
          "<th>Test</th>" +
          "<th>Data</th>" +
        "</tr>";
      self.table.appendChild(thead);

      var tbody = document.createElement("tbody");
      tbody.innerHTML =
        "<tr>" +
          "<td>Foo</td>" +
          "<td>Bar</td>" +
        "</tr>"

      self.table.appendChild(tbody);

      var table = tabled.create(self.table);

      var rows = table.element.getElementsByTagName("tbody")[0]
        .getElementsByTagName("tr");

      expect(rows[0].getElementsByTagName("td")[0].innerText).to.equal("Foo");
      expect(rows[0].getElementsByTagName("td")[1].innerText).to.equal("Bar");
    });

    it('uses custom provided schema to construct headers', function() {
      var self = this;
      var thead = document.createElement("thead");
      thead.innerHTML =
        "<tr>" +
          "<th>Test</th>" +
          "<th>Data</th>" +
        "</tr>";
      self.table.insertBefore(thead, self.table.firstChild);

      var table = tabled.create(self.table, {
        headers: ["a", "b", "c", "d"]
      });

      expect(table.headers.length).to.equal(4);
    })

    it('constructs rows when schema built from thead with data options',
      function() {
        var self = this;
        var thead = document.createElement("thead");
        thead.innerHTML =
          "<tr>" +
            "<th>Test</th>" +
            "<th>Data</th>" +
          "</tr>";
        self.table.insertBefore(thead, self.table.firstChild);

        var table = tabled.create(self.table, {
          data: [{
            "test": "HAI",
            "data": "GURL"
          }, {
            "data": "HAI",
            "test": "BOI"
          }]
        });

        var rows = table.element.getElementsByTagName("tbody")[0]
          .getElementsByTagName("tr");
        var firstRow = rows[0].getElementsByTagName("td");
        var secondRow = rows[1].getElementsByTagName("td");

        expect(rows.length).to.equal(2);
        expect(firstRow.length).to.equal(2);
        expect(firstRow[0].innerText).to.equal("HAI");
        expect(firstRow[1].innerText).to.equal("GURL");
        expect(secondRow[0].innerText).to.equal("BOI");
        expect(secondRow[1].innerText).to.equal("HAI");
      });

    it('constructs rows when schema built from provided schema and data '
      + 'assignment', function(){
      var self = this;
      var thead = document.createElement("thead");
      thead.innerHTML =
        "<tr>" +
          "<th>Test</th>" +
          "<th>Data</th>" +
        "</tr>";
      self.table.insertBefore(thead, self.table.firstChild);

      var table = tabled.create(self.table, {
        headers: [ "foo", "bar" ]
      });

      table.data = [{
        "foo": "234",
        "bar": "123"
      }];

      var rows = table.element.getElementsByTagName("tbody")[0]
        .getElementsByTagName("tr");

      expect(rows.length).to.equal(1);
      expect(rows[0].getElementsByTagName("td")[0].innerText).to.equal("234");
      expect(rows[0].getElementsByTagName("td")[1].innerText).to.equal("123");
    });
  });

  describe('pagination', function() {
    it('limits results to five items', function() {
      var self = this;
      var thead = document.createElement("thead");
      thead.innerHTML =
        "<tr>" +
          "<th>Foo</th>" +
        "</tr>";
      self.table.insertBefore(thead, self.table.firstChild);

      var table = tabled.create(self.table);

      table.data = [{ "foo": "t1" }, { "foo": "t2" }, { "foo": "t3" },
        { "foo": "t4" }, { "foo": "t5" }, { "foo": "t6" }, { "foo": "t7" },
        { "foo": "t8" }, { "foo": "t9" }, { "foo": "t10" }];

      var rows = table.element.getElementsByTagName("tbody")[0]
        .getElementsByTagName("tr");

      expect(rows.length).to.equal(5);
      expect(rows[0].getElementsByTagName("td")[0].innerText).to.equal("t1");
      expect(rows[1].getElementsByTagName("td")[0].innerText).to.equal("t2");
      expect(rows[2].getElementsByTagName("td")[0].innerText).to.equal("t3");
      expect(rows[3].getElementsByTagName("td")[0].innerText).to.equal("t4");
      expect(rows[4].getElementsByTagName("td")[0].innerText).to.equal("t5");
    });

    it('gets available pages', function() {
      var self = this;
      var thead = document.createElement("thead");
      thead.innerHTML =
        "<tr>" +
          "<th>Foo</th>" +
        "</tr>";
      self.table.insertBefore(thead, self.table.firstChild);

      var table = tabled.create(self.table);

      table.data = [{ "foo": "t1" }, { "foo": "t2" }, { "foo": "t3" },
        { "foo": "t4" }, { "foo": "t5" }, { "foo": "t6" }, { "foo": "t7" },
        { "foo": "t8" }, { "foo": "t9" }, { "foo": "t10" }];

      expect(table.availablePages).to.equal(2);

      table.data = [{ "foo": "t1" }, { "foo": "t2" }, { "foo": "t3" },
        { "foo": "t4" }, { "foo": "t5" }, { "foo": "t6" }, { "foo": "t7" },
        { "foo": "t8" }, { "foo": "t9" }, { "foo": "t10" }, { "foo": "t1" },
        { "foo": "t2" }, { "foo": "t3" }, { "foo": "t4" }, { "foo": "t5" },
        { "foo": "t6" }, { "foo": "t7" }, { "foo": "t8" }, { "foo": "t9" },
        { "foo": "t10" }];

      expect(table.availablePages).to.equal(4);
    });

    it('goes to next five items', function() {
      var self = this;
      var thead = document.createElement("thead");
      thead.innerHTML =
        "<tr>" +
          "<th>Foo</th>" +
        "</tr>";
      self.table.insertBefore(thead, self.table.firstChild);

      var table = tabled.create(self.table);

      table.data = [{ "foo": "t1" }, { "foo": "t2" }, { "foo": "t3" },
        { "foo": "t4" }, { "foo": "t5" }, { "foo": "t6" }, { "foo": "t7" },
        { "foo": "t8" }, { "foo": "t9" }, { "foo": "t10" }];

      table.page(2);

      var rows = table.element.getElementsByTagName("tbody")[0]
        .getElementsByTagName("tr");

      expect(rows.length).to.equal(5);
      expect(rows[0].getElementsByTagName("td")[0].innerText).to.equal("t6");
      expect(rows[1].getElementsByTagName("td")[0].innerText).to.equal("t7");
      expect(rows[2].getElementsByTagName("td")[0].innerText).to.equal("t8");
      expect(rows[3].getElementsByTagName("td")[0].innerText).to.equal("t9");
      expect(rows[4].getElementsByTagName("td")[0].innerText).to.equal("t10");
    });

    it('does not crash on imperfect matches', function() {
      var self = this;
      var thead = document.createElement("thead");
      thead.innerHTML =
        "<tr>" +
          "<th>Foo</th>" +
        "</tr>";
      self.table.insertBefore(thead, self.table.firstChild);

      var table = tabled.create(self.table, {
        data: [{ "foo": "t1" }, { "foo": "t2" }, { "foo": "t3" },
          { "foo": "t4" }, { "foo": "t5" }, { "foo": "t6" }, { "foo": "t7" },
          { "foo": "t8" }]
      });

      table.page(2);

      var rows = table.element.getElementsByTagName("tbody")[0]
        .getElementsByTagName("tr");

      expect(rows.length).to.equal(3);
      expect(rows[0].getElementsByTagName("td")[0].innerText).to.equal("t6");
      expect(rows[1].getElementsByTagName("td")[0].innerText).to.equal("t7");
      expect(rows[2].getElementsByTagName("td")[0].innerText).to.equal("t8");
    });
  });

  describe('filtering', function() {
    it('should filter by value', function() {
      var self = this;
      var thead = document.createElement("thead");
      thead.innerHTML =
        "<tr>" +
          "<th>Foo</th>" +
          "<th>Bar</th>" +
        "</tr>";
      self.table.insertBefore(thead, self.table.firstChild);

      var table = tabled.create(self.table, {
        data: [
          { "foo": "abc", "bar": "456" },
          { "foo": "789", "bar": "" },
          { "foo": "456", "bar": "789" },
          { "foo": "bar", "bar": "foo" }
        ]
      });

      table.filter("ABC");
      var rows = table.element.getElementsByTagName("tbody")[0]
        .getElementsByTagName("tr");
      var links = table.paginationElement.getElementsByTagName("a");

      expect(rows.length).to.equal(1);
      expect(links.length).to.equal(5);
      expect(rows[0].getElementsByTagName("td")[0].innerText).to.equal("abc");
      expect(links[2].innerText).to.equal("1");
    });

    it('should have correct links', function() {
      var self = this;
      var thead = document.createElement("thead");
      thead.innerHTML =
        "<tr>" +
          "<th>Foo</th>" +
          "<th>Bar</th>" +
        "</tr>";
      self.table.insertBefore(thead, self.table.firstChild);

      var table = tabled.create(self.table, {
        data: [
          { "foo": "abc", "bar": "456" },
          { "foo": "789", "bar": "" },
          { "foo": "456", "bar": "789" },
          { "foo": "bar", "bar": "foo" },
          { "foo": "abc", "bar": "456" },
          { "foo": "789", "bar": "" },
          { "foo": "456", "bar": "789" },
          { "foo": "bar", "bar": "foo" },
          { "foo": "bar", "bar": "foo" },
          { "foo": "abc", "bar": "456" },
          { "foo": "789", "bar": "" },
          { "foo": "456", "bar": "789" },
          { "foo": "bar", "bar": "foo" }
        ]
      });

      table.filter("ABC");
      var links = table.paginationElement.getElementsByTagName("a");

      expect(links.length).to.equal(5);
    });

    it('should unfilter on empty value after initially filtering', function() {
      var self = this;
      var thead = document.createElement("thead");
      thead.innerHTML =
        "<tr>" +
          "<th>Foo</th>" +
          "<th>Bar</th>" +
        "</tr>";
      self.table.insertBefore(thead, self.table.firstChild);

      var table = tabled.create(self.table, {
        data: [
          { "foo": "abc", "bar": "456" },
          { "foo": "789", "bar": "" },
          { "foo": "456", "bar": "789" },
          { "foo": "bar", "bar": "foo" },
          { "foo": "abc", "bar": "456" },
          { "foo": "789", "bar": "" },
          { "foo": "456", "bar": "789" },
          { "foo": "bar", "bar": "foo" }
        ]
      });

      table.filter("123");
      table.filter(null);

      var rows = table.element.getElementsByTagName("tbody")[0]
        .getElementsByTagName("tr");
      var links = table.paginationElement.getElementsByTagName("a");

      expect(rows.length).to.equal(5);
      expect(links.length).to.equal(6);
      expect(rows[0].getElementsByTagName("td")[0].innerText).to.equal("abc");
      expect(links[3].innerText).to.equal("2");
    });
  });

  describe('dom builder', function() {
    it('finds pagination element', function() {
      var self = this;
      var thead = document.createElement("thead");
      thead.innerHTML =
        "<tr>" +
          "<th>Foo</th>" +
        "</tr>";
      self.table.insertBefore(thead, self.table.firstChild);

      var table = tabled.create(self.table, {
        data: [{ "foo": "t1" }, { "foo": "t2" }, { "foo": "t3" },
          { "foo": "t4" }, { "foo": "t5" }, { "foo": "t6" }, { "foo": "t7" },
          { "foo": "t8" }]
      });

      var links = table.paginationElement.getElementsByTagName("a");

      expect(links.length).to.equal(6);
      expect(links[2].innerText).to.equal("1");
      expect(links[3].innerText).to.equal("2");
      expect(table.paginationElement.style.display).to.equal("");
    });

    it('hides pagination element when specified in options', function() {
      var self = this;
      var thead = document.createElement("thead");
      thead.innerHTML =
        "<tr>" +
          "<th>Foo</th>" +
        "</tr>";
      self.table.insertBefore(thead, self.table.firstChild);

      var table = tabled.create(self.table, {
        data: [{ "foo": "t1" }, { "foo": "t2" }, { "foo": "t3" },
          { "foo": "t4" }, { "foo": "t5" }, { "foo": "t6" }, { "foo": "t7" },
          { "foo": "t8" }],
        showPagination: false
      });

      expect(table.paginationElement.style.display).to.equal("none");
    });

    describe('page links', function() {
      it('changes pages when clicked', function() {
        var self = this;
        var thead = document.createElement("thead");
        thead.innerHTML =
          "<tr>" +
            "<th>Foo</th>" +
          "</tr>";
        self.table.insertBefore(thead, self.table.firstChild);

        var table = tabled.create(self.table, {
          data: [{ "foo": "t1" }, { "foo": "t2" }, { "foo": "t3" },
            { "foo": "t4" }, { "foo": "t5" }, { "foo": "t6" }, { "foo": "t7" },
            { "foo": "t8" }]
        });

        var links = table.paginationElement.getElementsByTagName("a");
        links[3].onclick();

        var rows = table.element.getElementsByTagName("tbody")[0]
          .getElementsByTagName("tr");
        var firstRow = rows[0].getElementsByTagName("td");

        expect(firstRow[0].innerText).to.equal("t6");
      });

      it('changes back to the original pages', function() {
        var self = this;
        var thead = document.createElement("thead");
        thead.innerHTML =
          "<tr>" +
            "<th>Foo</th>" +
          "</tr>";
        self.table.insertBefore(thead, self.table.firstChild);

        var table = tabled.create(self.table, {
          data: [{ "foo": "t1" }, { "foo": "t2" }, { "foo": "t3" },
            { "foo": "t4" }, { "foo": "t5" }, { "foo": "t6" }, { "foo": "t7" },
            { "foo": "t8" }]
        });

        var links = table.paginationElement.getElementsByTagName("a");
        links[1].onclick();
        links[0].onclick();

        var rows = table.element.getElementsByTagName("tbody")[0]
          .getElementsByTagName("tr");
        var firstRow = rows[0].getElementsByTagName("td");

        expect(firstRow[0].innerText).to.equal("t1");
      });
    });

    it('does not insert duplicate pagination nodes', function() {
      var self = this;
      var thead = document.createElement("thead");
      thead.innerHTML =
        "<tr>" +
          "<th>Foo</th>" +
        "</tr>";
      self.table.insertBefore(thead, self.table.firstChild);

      var table = tabled.create(self.table, {
        data: [{ "foo": "t1" }, { "foo": "t2" }, { "foo": "t3" },
          { "foo": "t4" }, { "foo": "t5" }, { "foo": "t6" }, { "foo": "t7" },
          { "foo": "t8" }]
      });

      table.draw();

      var paginationElement = table.element.nextSibling;
      var nextElement = paginationElement.nextSibling;

      expect(paginationElement.id).to.equal("pagination");
      expect(nextElement.id).to.not.equal("pagination");
    });
  });
});
