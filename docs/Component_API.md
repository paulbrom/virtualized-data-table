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

|Property Name|Data Type|Example Value|In Fixed-Data-Table?|Required?|Description|
|:-----------:|:-------:|:-----------:|:------------------:|:-------:|:---------:|
|<sub>rowCount</sub>|<sub>number</sub>|<sub>4</sub>|<sub>no</sub>|<sub>Either rowCount or rowsCount must be defined</sub>|<sub>The number of rows in the table</sub>|
|<sub>rowsCount</sub>|<sub>number</sub>|<sub>4</sub>|<sub>yes</sub>|<sub>Either rowCount or rowsCount must be defined</sub>|<sub>The number of rows in the table</sub>|
|<sub>rowGetter</sub>|<sub>func</sub>|<sub>({ rowIndex }) => data[rowIndex];</sub>|<sub>no</sub>|<sub>yes</sub>|<sub>returns the data for the given row.  This data must take the form of an object with a key for each columnKey.  This can be an Immutable.JS or regular JS object</sub>|
|<sub>height</sub>|<sub>number</sub>|<sub>450</sub>|<sub>yes</sub>|<sub>yes</sub>|<sub>The height of the table to render.  If the rows take up more vertical space, a scrollbar will appear.  If they take up less vertical space, empty rows will be drawn</sub>|
|<sub>width</sub>|<sub>number</sub>|<sub>800</sub>|<sub>yes</sub>|<sub>yes</sub>|<sub>The width of the table to render.  If the rows take up more horizontal space, a scrollbar will appear.  If they take up less horizontal space, apply flexGrow={1} to final column for it to take up remaining width</sub>|
|<sub>style</sub>|<sub>object</sub>|<sub>{ border: '1px solid black' }</sub>|<sub>yes</sub>|<sub>no</sub>|<sub>The style to apply to the outer frame of the table</sub>|
|<sub>rowHeight</sub>|<sub>number</sub>|<sub>45</sub>|<sub>yes</sub>|<sub>yes</sub>|<sub>The height of a row in the table.  Currently all rows must have the same height</sub>|
|<sub>headerHeight</sub>|<sub>number</sub>|<sub>60</sub>|<sub>yes</sub>|<sub>yes</sub>|<sub>The height of the header row of the table</sub>|
|<sub>groupHeaderHeight</sub>|<sub>number</sub>|<sub>55</sub>|<sub>no</sub>|<sub>yes</sub>|<sub>The height of the group header of the table (a header row above the header row which can span headers)</sub>|
|<sub>onColumnResizeEndCallback</sub>|<sub>func</sub>|<sub>(columnWidth, columnKey) => this.setState({ columnKey: columnWidth })</sub>|<sub>no</sub>|<sub>no</sub>|<sub>This function is called when the user finishes resizing a column.  The column key of the resized column and its new width will be provided</sub>|
|<sub>noHeaderScroll</sub>|<sub>bool</sub>|<sub>true</sub>|<sub>no</sub>|<sub>no</sub>|<sub>If true, the header will not show a scrollbar if their cells are taller than header height</sub>|
|<sub>allowRowSelect</sub>|<sub>bool</sub>|<sub>true</sub>|<sub>no</sub>|<sub>no</sub>|<sub>If true, then entire rows can be selected by clicking a cell</sub>|
|<sub>allowRangeSelect</sub>|<sub>bool</sub>|<sub>true</sub>|<sub>no</sub>|<sub>no</sub>|<sub>If true, then individual cells or rectangular groups of cells can be selected by clicking and then using shift-arrow keys</sub>|
|<sub>allowMultiSelect</sub>|<sub>bool</sub>|<sub>true</sub>|<sub>no</sub>|<sub>no</sub>|<sub>If true, then multiple rows or ranges can be selected by CTRL-clicking</sub>|
|<sub>focusStyle</sub>|<sub>object</sub>|<sub>{ border: '2px solid red' }</sub>|<sub>no</sub>|<sub>no</sub>|<sub>The style to apply to cells which have been focused (clicked)|
|<sub>selectionStyle</sub>|<sub>object</sub>|<sub>{ background: 'yellow' }</sub>|<sub>no</sub>|<sub>no</sub>|<sub>The style to apply to cells which have been selected</sub>|
|<sub>canSelectColumn</sub>|<sub>func</sub>|<sub>(columnKey) => false</sub>|<sub>no</sub>|<sub>no</sub>|<sub>Called when a selection is occurring in a particular column.  Returns whether selection should be allowed</sub>|
|<sub>canSelectRow</sub>|<sub>func</sub>|<sub>(rowIndex) => false</sub>|<sub>no</sub>|<sub>no</sub>|<sub>Called when a selection is occurring in a particular row.  Returns whether selection should be allowed</sub>|
|<sub>onSelectionChange</sub>|<sub>func</sub>|<sub>(ranges) => { ... do something ... }</sub>|<sub>no</sub>|<sub>no</sub>|<sub>Called when the selection in the table changes.  Ranges will be passed an Immutable.JS list of objects which have a rowStart, rowEnd, columnStart, and columnEnd which are all 0-based numbers</sub>|
|<sub>onCellClick</sub>|<sub>func</sub>|<sub>({ evt, rowIndex, columnIndex, columnKey, rowData }) => { ... do something ... }</sub>|<sub>no</sub>|<sub>no</sub>|<sub>Called when a cell is clicked</sub>|
|<sub>onCellDoubleClick</sub>|<sub>func</sub>|<sub>({ evt, rowIndex, columnIndex, columnKey, rowData }) => { ... do something ... }</sub>|<sub>no</sub>|<sub>no</sub>|<sub>Called when a cell is double-clicked</sub>|
|<sub>onCellHover</sub>|<sub>func</sub>|<sub>({ evt, rowIndex, columnIndex, columnKey, rowData }) => { ... do something ... }</sub>|<sub>no</sub>|<sub>no</sub>|<sub>Called when a cell is hovered</sub>|
|<sub>onCellFocus</sub>|<sub>func</sub>|<sub>({ evt, rowIndex, columnIndex, columnKey, rowData }) => { ... do something ... }</sub>|<sub>no</sub>|<sub>no</sub>|<sub>Called when a cell is focused (clicked or navigated to via arrow keys)</sub>|
|<sub>onCellCopy</sub>|<sub>func</sub>|<sub>({ rowIndex, columnIndex, columnKey, rowData }) => { return rowData[columnKey]; }</sub>|<sub>no</sub>|<sub>no</sub>|<sub>Called when a cell data needs to be copied to clipboard.  The data to be copied should be returned from this function as a string</sub>|
|<sub>onCellCut</sub>|<sub>func</sub>|<sub>({ rowIndex, columnIndex, columnKey, rowData }) => { return rowData[columnKey]; }</sub>|<sub>no</sub>|<sub>no</sub>|<sub>Called when a cell data needs to be cut to clipboard.  The data to be copied should be returned from this function as a string</sub>|
|<sub>onCellPaste</sub>|<sub>func</sub>|<sub>({ rowIndex, columnIndex, columnKey, text }) => { ... do something with text ... }</sub>|<sub>no</sub>|<sub>no</sub>|<sub>Called when a cell data needs to be pasted from the clipboard.</sub>|
|<sub>shouldHandleKeyEvent</sub>|<sub>func</sub>|<sub>(evt) => true</sub>|<sub>no</sub>|<sub>no</sub>|<sub>Whenever a keyboard event is seen by the data table, this function will be called to check to see if we should handle that key event</sub>|
|<sub>performingBulkUpdate</sub>|<sub>number</sub>|<sub>0</sub>|<sub>no</sub>|<sub>no</sub>|<sub>If > 0, then all rendering will be suppressed.  This is a performance improvement used when many cells are being bulk updated, like during a paste operation</sub>|
|<sub>evenRowBackgroundColor</sub>|<sub>string</sub>|<sub>#e0e0e0</sub>|<sub>no</sub>|<sub>no</sub>|<sub>The background color to use for even-numbered rows</sub>|
|<sub>oddRowBackgroundColor</sub>|<sub>string</sub>|<sub>#bbb</sub>|<sub>no</sub>|<sub>no</sub>|<sub>The background color to use for odd-numbered rows</sub>|
|<sub>highlightRowKey</sub>|<sub>string</sub>|<sub>widgetId</sub>|<sub>no</sub>|<sub>no</sub>|<sub>The key to be inspected in the object returned from rowGetter().  If that key value matches the highlightRowValue prop then the row will be a highlighted row</sub>|
|<sub>highlightRowValue</sub>|<sub>any</sub>|<sub>id_1</sub>|<sub>no</sub>|<sub>no</sub>|<sub>The value to be checked for in the row to see if this row should be a highlighted row</sub>|
|<sub>highlightRowColor</sub>|<sub>string</sub>|<sub>#00ffff</sub>|<sub>no</sub>|<sub>no</sub>|<sub>The background color to use for highlighted row(s).  If not defined, then color #b3e5fc will be used</sub>|

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
