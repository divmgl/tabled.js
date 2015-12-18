beforeEach(function() {
  var table = this.table = document.createElement("table");
  document.body.insertBefore(table, document.body.firstChild);
});

describe('tabled', function(){
  describe('basic functionality', function () {
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

    it('constructs rows when schema built from thead', function() {
      var self = this;
      var thead = document.createElement("thead");
      thead.innerHTML =
        "<tr>" +
          "<th>Test</th>" +
          "<th>Data</th>" +
        "</tr>";
      self.table.insertBefore(thead, self.table.firstChild);

      var table = tabled.create(self.table);

      table.data = [{
        "test": "HAI",
        "data": "GURL"
      }, {
        "data": "HAI",
        "test": "BOI"
      }];

      var rows = table.element.getElementsByTagName("tbody")[0]
        .getElementsByTagName("tr");

      expect(rows.length).to.equal(2);
      expect(rows[0].getElementsByTagName("td").length).to.equal(2);

      expect(rows[0].getElementsByTagName("td")[0].innerText).to.equal("HAI");
      expect(rows[0].getElementsByTagName("td")[1].innerText).to.equal("GURL");
      expect(rows[1].getElementsByTagName("td")[0].innerText).to.equal("BOI");
      expect(rows[1].getElementsByTagName("td")[1].innerText).to.equal("HAI");
    });

    it('constructs rows when schema built from provided schema', function(){
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
});
