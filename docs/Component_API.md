# Virtualized Data Table Component Documentation

<h3>Table of contents</h3>

* **[&lt;VirtualizedDataTable&gt;](#user-content-&lt;VirtualizedDataTable&gt;)**
* **[&lt;Column&gt;](#user-content-&lt;Column&gt;)**
* **[&lt;ColumnGroup&gt;](#user-content-&lt;ColumnGroup&gt;)**
* **[&lt;Cell&gt;](#user-content-&lt;Cell&gt;)**
* **[&lt;ClipboardHelper&gt;](#user-content-&lt;ClipboardHelper&gt;)**
* **[&lt;KeyHandler&gt;](#user-content-&lt;KeyHandler&gt;)**

---

<h3>&lt;VirtualizedDataTable&gt;</h3>

This is the core table component which supports Fixed Data Table style properties and markup.
<h5>Example:</h5>

``` javascript
<VirtualizedDataTable></VirtualizedDataTable>
```

<h5>Properties:</h5>

<p style="font-size: 10px">
|Property Name|Data Type|Example Value|In Fixed-Data-Table?|Required?|Description|
|:-----------:|:-------:|:-----------:|:------------------:|:-------:|:---------:|
|rowCount|number|4|no|Either rowCount or rowsCount must be defined|The number of rows in the table|
|rowsCount|number|4|yes|Either rowCount or rowsCount must be defined|The number of rows in the table|
|rowGetter|func|({ rowIndex }) => data[rowIndex];|no|yes|returns the data for the given row.  This data must take the form of an object with a key for each columnKey.  This can be an Immutable.JS or regular JS object|
|height|number|450|yes|yes|The height of the table to render.  If the rows take up more vertical space, a scrollbar will appear.  If they take up less vertical space, empty rows will be drawn|
|width|number|800|yes|yes|The width of the table to render.  If the rows take up more horizontal space, a scrollbar will appear.  If they take up less horizontal space, apply flexGrow={1} to final column for it to take up remaining width|
|style|object|{ border: '1px solid black' }|yes|no|The style to apply to the outer frame of the table|
|rowHeight|number|45|yes|yes|The height of a row in the table.  Currently all rows must have the same height|
|headerHeight|number|60|yes|yes|The height of the header row of the table|
|groupHeaderHeight|number|55|no|yes|The height of the group header of the table (a header row above the header row which can span headers)|
|onColumnResizeEndCallback|func|(columnWidth, columnKey) => this.setState({ columnKey: columnWidth })|no|no|This function is called when the user finishes resizing a column.  The column key of the resized column and its new width will be provided|
|noHeaderScroll|bool|true|no|no|If true, the header will not show a scrollbar if their cells are taller than header height|
|allowRowSelect|bool|true|no|no|If true, then entire rows can be selected by clicking a cell|
|allowRangeSelect|bool|true|no|no|If true, then individual cells or rectangular groups of cells can be selected by clicking and then using shift-arrow keys|
|allowMultiSelect|bool|true|no|no|If true, then multiple rows or ranges can be selected by CTRL-clicking|
|focusStyle|object|{ border: '2px solid red' }|no|no|The style to apply to cells which have been focused (clicked)
|selectionStyle|object|{ background: 'yellow' }|no|no|The style to apply to cells which have been selected|
|canSelectColumn|func|(columnKey) => false|no|no|Called when a selection is occurring in a particular column.  Returns whether selection should be allowed|
|canSelectRow|func|(rowIndex) => false|no|no|Called when a selection is occurring in a particular row.  Returns whether selection should be allowed|
|onSelectionChange|func|(ranges) => { ... do something ... }|no|no|Called when the selection in the table changes.  Ranges will be passed an Immutable.JS list of objects which have a rowStart, rowEnd, columnStart, and columnEnd which are all 0-based numbers|
|onCellClick|func|({ evt, rowIndex, columnIndex, columnKey, rowData }) => { ... do something ... }|no|no|Called when a cell is clicked|
|onCellDoubleClick|func|({ evt, rowIndex, columnIndex, columnKey, rowData }) => { ... do something ... }|no|no|Called when a cell is double-clicked|
|onCellHover|func|({ evt, rowIndex, columnIndex, columnKey, rowData }) => { ... do something ... }|no|no|Called when a cell is hovered|
|onCellFocus|func|({ evt, rowIndex, columnIndex, columnKey, rowData }) => { ... do something ... }|no|no|Called when a cell is focused (clicked or navigated to via arrow keys)|
|onCellCopy|func|({ rowIndex, columnIndex, columnKey, rowData }) => { return rowData[columnKey]; }|no|no|Called when a cell data needs to be copied to clipboard.  The data to be copied should be returned from this function as a string|
|onCellCut|func|({ rowIndex, columnIndex, columnKey, rowData }) => { return rowData[columnKey]; }|no|no|Called when a cell data needs to be cut to clipboard.  The data to be copied should be returned from this function as a string|
|onCellPaste|func|({ rowIndex, columnIndex, columnKey, text }) => { ... do something with text ... }|no|no|Called when a cell data needs to be pasted from the clipboard.|
|shouldHandleKeyEvent|func|(evt) => true|no|no|Whenever a keyboard event is seen by the data table, this function will be called to check to see if we should handle that key event|
|performingBulkUpdate|number|0|no|no|If > 0, then all rendering will be suppressed.  This is a performance improvement used when many cells are being bulk updated, like during a paste operation|
|evenRowBackgroundColor|string|#e0e0e0|no|no|The background color to use for even-numbered rows|
|oddRowBackgroundColor|string|#bbb|no|no|The background color to use for odd-numbered rows|
|highlightRowKey|string|widgetId|no|no|The key to be inspected in the object returned from rowGetter().  If that key value matches the highlightRowValue prop then the row will be a highlighted row|
|highlightRowValue|any|id_1|no|no|The value to be checked for in the row to see if this row should be a highlighted row|
|highlightRowColor|string|#00ffff|no|no|The background color to use for highlighted row(s).  If not defined, then color #b3e5fc will be used|
</p>

<h3>&lt;Column&gt;</h3>

This component is used to define a column in the table.
<h5>Example:</h5>

``` javascript
<Column></Column>
```

<h5>Properties:</h5>

|Property Name|Data Type|Example Value|In Fixed-Data-Table?|Required?|Description|
|:-----------:|:-------:|:-----------:|:------------------:|:-------:|:---------:|
|columnKey|string|spendColumn|yes|yes|The key to associate with this column, which will appear in callbacks associated with this column|
|width|number|100|yes|yes|The width of this column|
|header|element|<Cell>Spend</Cell>|yes|no|The header cell to apply to this column|
|cell|element|({ rowData, columnKey, ...props }) => (<Cell {...props}>Spend: { rowData[columnKey] }</Cell>|yes|yes|The cell to apply for regular rows in this column|

<h3>&lt;ColumnGroup&gt;</h3>

This component is used to define a column in the table.
<h5>Example:</h5>

``` javascript
<ColumnGroup></ColumnGroup>
```

<h5>Properties:</h5>

|Property Name|Data Type|Example Value|In Fixed-Data-Table?|Required?|Description|
|:-----------:|:-------:|:-----------:|:------------------:|:-------:|:---------:|
|header|element|<Cell>Spend</Cell>|no|no|The header cell to apply to this column group|
|hidden|bool|true|no|no|If true, then hide this column group but render vertical space for it|

<h3>&lt;Cell&gt;</h3>

This is the base cell component for cells in the table.
<h5>Example:</h5>

``` javascript
<Cell></Cell>
```

<h5>Properties:</h5>

|Property Name|Data Type|Example Value|In Fixed-Data-Table?|Required?|Description|
|:-----------:|:-------:|:-----------:|:------------------:|:-------:|:---------:|
|allowOverflow|bool|true|no|no|If true, then contents of the cell will not be clipped to the cell boundary|
|className|string|my-cool-cell|no|no|A CSS class name to assign to this cell|
|onClick|func|(evt, rowData rowIndex, columnKey) => { ... do something ... }|no|no|Callback for clicks in this cell|
|onMouseEnter|func|(evt, rowData rowIndex, columnKey) => { ... do something ... }|no|no|Callback for mouseEnter event in this cell|
|onMouseLeave|func|(evt, rowData rowIndex, columnKey) => { ... do something ... }|no|no|Callback for mouseLeave event in this cell|
|style|func OR object|{ fontSize: '14px' }|no|no|Style to use for this cell.  If style should vary based on rowIndex or columnKey, then implement a function and it will be called with (rowData, rowIndex, columnKey)|
|mountRenderDelay|number|50|no|no|A delay timeout in msec between cell mount and when the cell contents are rendered.  Useful if your cell is expensive to render as this can help avoid rendering you cell while the user is scrolling past it|

<h3>&lt;ClipboardHelper&gt;</h3>

This is a non-rendering helper component which can handle copy/paste messages
<h5>Example:</h5>

``` javascript
<ClipboardHelper></ClipboardHelper>
```

<h5>Properties:</h5>

|Property Name|Data Type|Example Value|In Fixed-Data-Table?|Required?|Description|
|:-----------:|:-------:|:-----------:|:------------------:|:-------:|:---------:|
|onCopy|func|(evt) => { ... add data to evt clipboard ... }|no|no|Called when a clipboard copy operation happens|
|onCut|func|(evt) => { ... add data to evt clipboard ... }|no|no|Called when a clipboard cut operation happens|
|onPaste|func|(evt) => { ... do something with evt clipboard ... }|no|no|Called when a clipboard paste operation happens|
|getInputRef|func|() => this._gridRef;|no|no|If defined, it returns a reference to a React component which needs to contain the clipboard event target in order for the component to issue the onCut/onCopy/onPaste events|
|allowInputCutCopy|bool|true|no|no|If true, allow cut/copy from input DOM elements|
|allowEditableCutCopy|bool|true|no|no|If true, allow cut/copy from editable DOM elements|
|allowInputPaste|bool|true|no|no|If true, allow paste to input DOM elements|
|allowEditablePaste|bool|true|no|no|If true, allow paste to editable DOM elements|
|pushBulkUpdate|func|() => this.setState({ bulk: this.state.bulk + 1 })|no|no|If defined, this callback will be called when a bulk paste operation begins.  You should use this to send performingBulkUpdate to the VirtualizedDataTable for performance reasons on paste|
|popBulkUpdate|func|() => this.setState({ bulk: this.state.bulk - 1 })|no|no|If defined, this callback will be called when a bulk paste operation ends.  You should use this to send performingBulkUpdate to the VirtualizedDataTable for performance reasons on paste|

<h3>&lt;KeyHandler&gtl</h3>

This is a non-rendering helper component which can handle keyboard messages
<h5>Example:</h5>

``` javascript
<KeyHandler></KeyHandler>
```

<h5>Properties:</h5>

|Property Name|Data Type|Example Value|In Fixed-Data-Table?|Required?|Description|
|:-----------:|:-------:|:-----------:|:------------------:|:-------:|:---------:|
|keys|array of strings|['ArrowUp', 'ArrowDown']|no|no|If provided, only handle key events for the given key codes|
|onKey|func|(evt) => { ... do something with this key event ... }|no|yes|called when a keyboard event occurs
|ignoreInput|bool|true|no|no|if true, ignore keyboard events coming from input DOM elements|
|getInputRef|func|() => this._keySrcRef;|no|no|If defined, then only consider key events coming from within the React component returned from this callback|
