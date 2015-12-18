# tabled

Data-driven HTML tables with vanilla JavaScript

## Installation

```bash
$ npm install html-tabled
```

## Usage

```html
<table>
  <thead>
    <th>
      <td>First Name</td>
      <td>Last Name</td>
      <td>Age</td>
    </th>
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

You can also use it through UMD.

```javascript
var tabled = require('html-tabled');
tabled.create(document.getElementByTag("table")[0]);
```
