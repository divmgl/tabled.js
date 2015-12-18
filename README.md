# tabled

Data-driven HTML tables with vanilla JavaScript

## Installation

```
$ npm install betabled
```

## Usage

```
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

tabled.create(document.getElementByTag("table")[0]);
```
