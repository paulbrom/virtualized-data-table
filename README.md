[![Build Status](https://travis-ci.org/paulbrom/virtualized-data-table.png?branch=master)](https://travis-ci.org/paulbrom/virtualized-data-table)

<div align="center">
  <a href="https://github.com/paulbrom/virtualized-data-table">
    <img src="https://raw.githubusercontent.com/paulbrom/virtualized-data-table/master/assets/virtualized-data-table-logo.png">
  </a>
  <h3><i>A flexible, performant table for <a href="https://reactjs.org/">React</a></i></h3>
  <h4>
    <p>&nbsp;</p>
  </h4>
</div>

## Basic Usage
### installation
```javascript
npm install virtualized-data-table --save
```

### API

Virtualized Data Table has an interface based on Facebook's now deprecated [Fixed Data Table](https://github.com/facebookarchive/fixed-data-table),
but improves the performance (poor performance being the main reason for its deprecation) by basing the implementation on [React Virtualized](https://github.com/bvaughn/react-virtualized) `<Grid>`.

It supports much of, but not all, markup supported by Fixed Data Table.  In particular, it supports the concept of a `<Table>` with
`<Column>` children that have both a header and cell renderer based on a `<Cell>`.  It should support the example shown on the front of
Fixed Data Table:


```javascript
  <Table
    rowHeight={50}
    rowsCount={rows.length}
    width={5000}
    height={5000}
    headerHeight={50}>
    <Column
      header={<Cell>Col 1</Cell>}
      cell={<Cell>Column 1 static content</Cell>}
      width={2000}
    />
    <Column
      header={<Cell>Col 2</Cell>}
      cell={<MyCustomCell mySpecialProp="column2" />}
      width={1000}
    />
    <Column
      header={<Cell>Col 3</Cell>}
      cell={({rowIndex, ...props}) => (
        <Cell {...props}>
          Data for column 3: {rows[rowIndex][2]}
        </Cell>
      )}
      width={2000}
    />
  </Table>
```

It should also support Cell classes built for use with fixed-data-table.

This package could be a drop-in replacement for fixed-data-table in your project that could provide better performance than
fixed-data-table with minimal code changes.  That was the motivation for its creation.  However, this package is not guaranteed
to handle all possible use cases of fixed-data-table, so if this package doesn't provide support for your use case, feel free
to add support for it!

### Additional features

Some features were implemented beyond those which were supported by fixed-data-table (documentation to be provided soon):

1) Table column resizability
2) Row/column selectability
3) Group headers (another header that can span multiple columns)
4) Copy/paste support (Google sheets-esque)

<h2>Maintainers</h2>

<div>
  <img width="100" height="100"
    src="https://avatars.githubusercontent.com/paulbrom">
  <div>
    <a href="https://github.com/paulbrom">Paul Broman</a>
    <div><sub>Senior Front-End Engineer</sub></div>
    <div><sup>PureCars/Raycom Media</sup></div>
  </div>
</div>

<h2>LICENSE</h2>

(c)2017 Raycom Media, Inc.
Released under the MIT license.

#### [MIT](./LICENSE)

[travis-url]: http://travis-ci.org/paulbrom/virtualized-data-table
[travis-image]: https://secure.travis-ci.org/paulbrom/virtualized-data-table.png?branch=master
[npm-url]: https://npmjs.org/package/virtualized-data-table
[npm-image]: https://badge.fury.io/js/virtualized-data-table.svg