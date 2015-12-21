# tabled

[![Build Status](https://travis-ci.org/divmgl/tabled.svg)](https://travis-ci.org/divmgl/tabled)

Data-driven HTML tables with vanilla JavaScript

## Usage

```html
<table>
  <thead>
    <tr>
      <th>First Name</td>
      <th>Last Name</td>
      <th>Age</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John</td>
      <td>Smith</td>
      <td>29</td>
    </tr>
    <tr>
      <td>Jane</td>
      <td>Doe</td>
      <td>26</td>
    </tr>
  </tbody>
</table>

<script>
  tabled.create(document.getElementByTag("table")[0]);
</script>
```

### UMD

```bash
$ npm install html-tabled
```

```javascript
var tabled = require('html-tabled');
tabled.create(document.getElementByTag("table")[0]);
```

### Schema specification

While it's very easy to specify a body for your table, you may want to
dynamically populate it using JavaScript. For this, you will need to specify
a schema.

At minimum, you will need to provide a `<thead></thead>` tag in your table.

```html
<table>
  <thead>
    <th>First Name</th> <!-- Column index 0 -->
    <th>Last Name</th>  <!-- Column index 1 -->
    <th>Age</th>        <!-- Column index 2 -->
  </thead>
</table>
```

`tabled` will use these tags to create an initial schema for the table. By
default, it will read these tags and convert them to camel case when creating
your schema. Assuming your table looks like the latter, your schema now looks
like this:

```javascript
table.headers = [ "firstName", "lastName", "age" ]
```

The table can now be populated.

```javascript
var tabled = require('html-tabled');
var table  = tabled.create(document.getElementByTag("table")[0], {
  data: [
    { firstName: "John", lastName: "Doe", age: "28" }
  ]
});
```

You can also update the table and it will adjust automatically.

```javascript
table.data = [
  { firstName: "Jane", lastName: "Doe", age: "26" }
]
```

### Interacting with `tabled`

You can toggle between pages by calling `page` and specifying a page number.

```javascript
table.page(1);
```

You can also filter by a string by calling `filter`. Filtering is
case-insensitive.

```javascript
table.filter("john");
```

## Roadmap

Feel free to open a pull-request and contribute to the development of
`tabled`. Currently, these items are on the roadmap.

* Hidden elements
* Column ordering
* Case-sensitive filtering

## Tests

The test suite is on Node.js and uses PhantomJS with Mocha.

```bash
$ npm install -g
$ npm test
```

## License

MIT
