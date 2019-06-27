import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { List as list, fromJS } from 'immutable';
import shallowCompare from 'react-addons-shallow-compare';
import Delay from 'react-delay';
import Draggable from 'react-draggable';
import { Grid } from 'react-virtualized';
import _debounce from 'lodash/debounce';
import _isFunction from 'lodash/isFunction';
import _isNumber from 'lodash/isNumber';
import _omit from 'lodash/omit';
import Cell from './cell';
import Column from './column';
import ColumnGroup from './columnGroup';
import ClipboardHelper from '../utils/clipboardHelper';
import KeyHandler from '../utils/keyHandler';
import renderIf from '../utils/renderIf';

const ROW_START = 'rowStart';
const ROW_END = 'rowEnd';
const COLUMN_START = 'columnStart';
const COLUMN_END = 'columnEnd';

const DEFAULT_HIGHLIGHT_ROW_COLOR = '#B3E5FC';

export const IGNORE_EVENT = 'ignore-event';

const KEYS_TO_SNIFF = [
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Backquote',
  'Backslash',
  'Backspace',
  'BracketLeft',
  'BracketRight',
  'Comma',
  'Delete',
  'Enter',
  'Equal',
  'Escape',
  'Minus',
  'Period',
  'Quote',
  'Semicolon',
  'Slash',
  'Space',
  'Tab',
];
for (let keyOn = 0; keyOn < 10; keyOn += 1) {
  KEYS_TO_SNIFF.push(`Digit${keyOn}`);
}
for (let keyOn = 48; keyOn < 91; keyOn += 1) {
  KEYS_TO_SNIFF.push(`Key${String.fromCharCode(keyOn)}`);
}

const STYLES = {
  outerDiv: {
    overflow: 'hidden',
  },
  table: {
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
  },
  tableAllowSelect: {},
  headerTable: {
    overflow: 'initial',
    border: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
  },
  tableHeader: {
    fontSize: 16,
    borderBottom: '1px solid #d3d3d3',
    backgroundImage: 'linear-gradient(#fff,#efefef)',
    padding: 0,
    margin: 0,
  },
  tableGrid: {
    fontSize: 16,
  },
  headerDiv: {
    display: 'flex',
    border: '1px solid #d3d3d3',
    borderBottom: 'none',
    overflowX: 'hidden',
    overflowY: 'scroll',
  },
  tableDiv: {
    display: 'flex',
    border: '1px solid #d3d3d3',
  },
  headerCell: {
    borderRight: '1px solid #d3d3d3',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    fontWeight: 700,
    backgroundImage: 'linear-gradient(#fff, #efefef)',
    height: '100%',
  },
  tableCell: {
    borderRight: '1px solid #d3d3d3',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    height: '100%',
  },
  evenRows: {
    background: 'white',
  },
  oddRows: {
    background: '#f6f7f8',
  },
  resizer: {
    cursor: 'ew-resize',
    position: 'relative',
    width: 4,
    left: 'calc(100% - 4px)',
  },
  column: {
    margin: 0,
    paddingLeft: 10,
  },
  lastRow: {
    borderBottom: '1px solid #d3d3d3',
  },
  tallDragLine: {
    cursor: 'ew-resize',
    position: 'absolute',
    marginLeft: 1,
    width: 2,
    backgroundColor: 'blue',
    zIndex: 9999999,
  },
  groupHeader: {
    display: 'flex',
    flexDirection: 'row',
  },
  groupOuter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 16,
    paddingRight: 16,
    flexGrow: 0,
    flexShrink: 0,
    background: 'linear-gradient(#fff,#efefef)',
    border: '1px solid #d3d3d3',
    borderBottom: 'none',
  },
  hiddenGroupOuter: {
    background: 'transparent',
    border: 'none',
  },
  groupFarOuter: {
    overflow: 'hidden',
  },
};

// this is an implementation of a react-virtualized table that is styled like a fixed-data-table,
// and supports column resizability using the same callbacks as fixed-data-table
class VirtualizedDataTable extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([ // from react
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    rowCount: PropTypes.number,
    rowsCount: PropTypes.number,
    rowGetter: PropTypes.func.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    rowHeight: PropTypes.number.isRequired,
    headerHeight: PropTypes.number.isRequired,
    groupHeaderHeight: PropTypes.number,
    onColumnResizeEndCallback: PropTypes.func,
    freezeLeftCount: PropTypes.number,
    constrainWidth: PropTypes.bool,
    noHeaderScroll: PropTypes.bool,
    allowRowSelect: PropTypes.bool,
    allowMultiSelect: PropTypes.bool,
    allowRangeSelect: PropTypes.bool,
    selectionStyle: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    focusStyle: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    canSelectColumn: PropTypes.func,
    canSelectRow: PropTypes.func,
    onSelectionChange: PropTypes.func,
    onCellClick: PropTypes.func,
    onCellDoubleClick: PropTypes.func,
    onCellHover: PropTypes.func,
    onCellFocus: PropTypes.func,
    onCellCut: PropTypes.func,
    onCellCopy: PropTypes.func,
    onCellPaste: PropTypes.func,
    scrollToColumn: PropTypes.number,
    scrollToRow: PropTypes.number,
    shouldHandleKeyEvent: PropTypes.func,
    performingBulkUpdate: PropTypes.number,
    evenRowBackgroundColor: PropTypes.string,
    oddRowBackgroundColor: PropTypes.string,
    highlightRowValue: PropTypes.any, // eslint-disable-line react/forbid-prop-types
    highlightRowKey: PropTypes.string,
    highlightRowColor: PropTypes.string,
    wheelDelta: PropTypes.number,
  };

  static defaultProps = {
    freezeLeftCount: 0,
    wheelDelta: 20,
  };

  static getDerivedStateFromProps({
    children,
    constrainWidth,
    freezeLeftCount,
    gridStyle,
    groupHeaderHeight,
    headerHeight,
    headerStyle,
    height,
    onCellCopy,
    onCellCut,
    onCellPaste,
    rowCount,
    rowsCount,
    rowHeight,
    width: widthRaw,
  }) {
    const rowCountUse = _isNumber(rowCount) ? rowCount : rowsCount;
    const useDefaultClipboard = !(onCellCut || onCellCopy || onCellPaste);
    const width = constrainWidth ? widthRaw : widthRaw - 2;
    const tableProps = {
      rowHeight,
      headerHeight,
      width,
    };

    const tableStyle = (constrainWidth ? {
      ...(useDefaultClipboard ? STYLES.tableAllowSelect : STYLES.table),
      width,
    } : STYLES.table);

    // ensure we will draw blank rows in the gap between height and the final renderable
    // row by calculating the number of rows needed to fill the available space and setting
    // the row count to that value
    const rowCountWithEmptySpace = Math.max(
      Math.floor((height - headerHeight) / rowHeight),
      rowCountUse,
    );

    const columnInfo = [];
    const groups = [];
    let columnLeft = 0;

    const calcColumnWidth = (column) => {
      const { props: { flexGrow, width: columnWidth = 0 } } = column;
      const isLastColumn = ((columnLeft + columnWidth) >= tableProps.width);
      // clip the last column slightly to accommodate table borders
      return flexGrow
        ? Math.max(tableProps.width - (columnLeft + 2), columnWidth)
        : columnWidth - (isLastColumn ? 16 : 0);
    };

    // scan all columns, skipping over any ColumnGroups and directly rendering their column
    // children
    React.Children.forEach(children, (child) => {
      if (child) {
        const { props: { columnKey: childKey, children: grandChildren }, type: childType } = child;
        if (childType && ((childType === ColumnGroup) || (childType.name === 'ColumnGroup'))) {
          let groupWidth = 0;

          React.Children.forEach(grandChildren, (grandChild) => {
            if (grandChild) {
              const { props: { columnKey: grandChildKey }, type: grandChildType } = grandChild;
              if (grandChildType && ((grandChildType !== Column) && (grandChildType.name !== 'Column'))) {
                throw new Error('unexpected child - only Columns can be children of ColumnGroups!');
              }

              const grandChildWidth = calcColumnWidth(grandChild);
              columnInfo.push({
                tableProps,
                column: grandChild,
                columnKey: grandChildKey,
                columnLeft,
                width: grandChildWidth,
              });

              groupWidth += grandChildWidth;
              columnLeft += grandChildWidth;
            }
          });

          groups.push({
            group: child,
            groupWidth,
          });
        } else if (childType && ((childType === Column) || (childType.name === 'Column'))) {
          const childWidth = calcColumnWidth(child);
          columnInfo.push({
            tableProps,
            column: child,
            columnKey: childKey,
            columnLeft,
            width: childWidth,
          });

          columnLeft += childWidth;
        } else {
          throw new Error('unexpected child - only Columns or ColumnGroups can be children of VirtualizedDataTable!');
        }
      }
    });

    const freezeWidth = columnInfo.reduce((_freezeWidth, columnCur, columnIdx) =>
      _freezeWidth + ((columnIdx < freezeLeftCount) ? columnCur.width : 0), 0);

    return {
      columnInfo,
      columnLeft,
      freezeWidth,
      headerStyle: {
        ...STYLES.tableHeader,
        ...(headerStyle || {}),
      },
      gridStyle: {
        ...STYLES.tableGrid,
        ...(gridStyle || {}),
      },
      groupFarOuterStyle: {
        ...STYLES.groupFarOuter,
        width,
      },
      groupHeaderStyle: {
        ...STYLES.groupHeader,
        height: groupHeaderHeight,
      },
      groupOuterStyle: {
        ...STYLES.groupOuter,
        height: groupHeaderHeight,
      },
      groups,
      rowCount: rowCountUse,
      rowCountWithEmptySpace,
      tableStyle,
      useDefaultClipboard,
      width,
    };
  }

  state = {
    arrowSelectionRange: null,
    columnInfo: [],
    columnLeft: 0,
    editMode: false,
    focusedCell: {
      rowIndex: -1,
      columnIndex: -1,
    },
    freezeWidth: 0,
    headerStyle: {},
    gridStyle: {},
    groups: [],
    recentDragEnd: null,
    resizeDrag: null,
    resizeHover: null,
    rowCount: 0,
    rowCountWithEmptySpace: 0,
    selectionRanges: list(),
    tableStyle: {},
    useDefaultClipboard: true,
    width: 0,
  };

  constructor(...args) {
    super(...args);

    this.prvCellRefs = {};
    this.prvDragRefs = {};
    this.prvCellGridRef = null;
    this.prvCellGridDOM = null;
    this.prvCellGridFreezeRef = null;
    this.prvGroupHeaderRef = null;
    this.prvHeaderGridRef = null;
    this.prvHeaderGridFreezeRef = null;

    this.prvRecomputeTablesBouncy = _debounce(() => this.prvRecomputeTables(), 50);
  }

  /* ------ Lifecycle Methods ------ */

  shouldComponentUpdate(nextProps, nextState) {
    // checking performingBulkUpdate gives us a major perf boost when cutting or pasting
    return !nextProps.performingBulkUpdate && shallowCompare(this, nextProps, nextState);
  }

  componentDidUpdate() {
    this.prvCellRefs = {};

    const { recentDragEnd } = this.state;
    if (recentDragEnd !== null) {
      const refName = recentDragEnd;
      // snap drag position after drag end, or else the resize control will float in
      // space where drag ended
      if (this.prvDragRefs[refName]) {
        this.prvDragRefs[refName].setState({
          dragging: false,
          x: 0,
          y: 0,
          clientX: 0,
          clientY: 0,
        });
      }

      setTimeout(() => {
        this.setState({
          recentDragEnd: null,
        });
      });
    }

    this.prvRecomputeTables();
  }

  componentWillUnmount() {
    this.prvHookGridRef();
  }

  /* ------ END Lifecycle Methods ------ */

  /* ------ Event handlers ------ */

  prvHookRef = (grid, refName) => {
    this[refName] = grid;
    if (grid) {
      this.prvRecomputeTables();
    }
  };

  prvHookGridRef = (cellGrid) => {
    this.prvHookRef(cellGrid, 'prvCellGridRef');

    const cellGridDOMOld = this.prvCellGridDOM;
    // eslint-disable-next-line react/no-find-dom-node
    this.prvCellGridDOM = ReactDOM.findDOMNode(cellGrid);

    if (this.prvCellGridDOM) {
      this.prvCellGridDOM.addEventListener('wheel', this.prvHandleWheel);
      this.prvCellGridDOM.addEventListener('mousewheel', this.prvHandleWheel);
      this.prvCellGridDOM.addEventListener('onmousewheel', this.prvHandleWheel);
    } else if (cellGridDOMOld) {
      cellGridDOMOld.removeEventListener('wheel', this.prvHandleWheel);
      cellGridDOMOld.removeEventListener('mousewheel', this.prvHandleWheel);
      cellGridDOMOld.removeEventListener('onmousewheel', this.prvHandleWheel);
    }
  };

  // handles the resizable column mouse enter event
  prvHandleResizeMouseEnter = columnKey =>
    () => {
      const { resizeDrag } = this.state;
      if (!resizeDrag) {
        this.setState({
          resizeHover: columnKey,
        });
      }
    };

  // handles the resizable column mouse leave event
  prvHandleResizeMouseLeave = columnKey =>
    () => {
      const { resizeDrag, resizeHover } = this.state;
      if (!resizeDrag && (resizeHover === columnKey)) {
        this.setState({
          resizeHover: null,
        });
      }
    };

  // handles the resizable column drag start
  prvHandleResizeDragStart = (columnKey, origWidth) =>
    (evt) => {
      this.setState({
        resizeDrag: {
          dragColumn: columnKey,
          dragStart: evt.clientX,
          origWidth,
        },
      });
    };

  // handles the resizable column drag end
  prvHandleResizeDragStop = (evt) => {
    const { onColumnResizeEndCallback } = this.props;
    const { resizeDrag: { dragColumn, dragStart, origWidth } } = this.state;
    const newColumnWidth = origWidth + (evt.clientX - dragStart);
    if (newColumnWidth > 0) {
      onColumnResizeEndCallback(newColumnWidth, dragColumn);
    }

    this.prvRecomputeTables();

    this.setState({
      resizeDrag: null,
      recentDragEnd: dragColumn,
    });
  };

  // handles mouse wheel.
  prvHandleWheel = (evt) => {
    if (this.prvCellGridDOM) {
      evt.preventDefault();

      const { wheelDelta } = this.props;
      const { state: { scrollTop, scrollLeft } } = this.prvCellGridRef;
      const delta = evt.deltaY || evt.detail || evt.wheelDelta;
      const newScrollTop = Math.max(0, scrollTop + ((delta > 0) ? wheelDelta : -wheelDelta));
      this.prvCellGridDOM.scrollTop = newScrollTop;

      this.prvCellGridRef.handleScrollEvent({
        scrollLeft,
        scrollTop: newScrollTop,
      });
    }
  };

  // handles scrolling in the Grid
  // TODO: we are compensating for a bug in Chrome or React where issuing a React update cycle
  // (setState) under a scroll event can cause laggy scroll performance, and temporary misalignment
  // of the grids.  Once Chrome or React fixes this issue, we should switch to use MultiGrid and
  // stop directly setting transforms here
  prvHandleScroll = ({ scrollLeft, scrollTop }) => {
    try {
      const handleLeft = () => {
        const transformStyle = `translate(-${scrollLeft}px, 0px)`;
        const groupHeader = ReactDOM.findDOMNode(this.prvGroupHeaderRef); // eslint-disable-line max-len, react/no-find-dom-node
        if (groupHeader) {
          groupHeader.style.transform = transformStyle;
        }
        const headerGrid = ReactDOM.findDOMNode(this.prvHeaderGridRef); // eslint-disable-line max-len, react/no-find-dom-node
        if (headerGrid) {
          headerGrid.style.transform = transformStyle;
        } else if (this.prvHeaderGridRef && this.prvHeaderGridRef._scrollingContainer) { // eslint-disable-line max-len, no-underscore-dangle
          this.prvHeaderGridRef._scrollingContainer.style.transform = transformStyle; // eslint-disable-line max-len, no-underscore-dangle
        }
      };

      const handleTop = () => {
        if (this.prvCellGridFreezeRef) {
          this.prvCellGridFreezeRef.setState({ scrollTop });

          const transformStyle = `translate(0px, -${scrollTop}px)`;
          const freezeGrid = ReactDOM.findDOMNode(this.prvCellGridFreezeRef); // eslint-disable-line max-len, react/no-find-dom-node
          if (freezeGrid) {
            freezeGrid.style.transform = transformStyle;
          } else if (this.prvCellGridFreezeRef && this.prvCellGridFreezeRef._scrollingContainer) { // eslint-disable-line max-len, no-underscore-dangle
            this.prvCellGridFreezeRef._scrollingContainer.style.transform = transformStyle; // eslint-disable-line max-len, no-underscore-dangle
          }
        }
      };

      handleLeft();
      handleTop();

      if (this.prvScrollTimeout) {
        window.clearTimeout(this.prvScrollTimeout);
      }
      this.prvScrollTimeout = window.setTimeout(() => {
        // this force update seems necessary to ensure we handle clicks after scroll
        if (this.prvCellGridRef) {
          this.prvCellGridRef.forceUpdate();
        }
        if (this.prvCellGridFreezeRef) {
          this.prvCellGridFreezeRef.forceUpdate();
        }
      }, 100);

      this.prvRecentScroll = true;
    } catch (e) {
      // ignore scroll errors, sometimes we may have findDOMNode errors coming from React due to the
      // vagarities of mounting/unounting
    }
  };

  // handles clicking in the Grid
  prvHandleCellClick = ({
    rowIndex,
    columnIndex,
    columnKey,
    columnCount,
    rowData,
  }) =>
    (evt) => {
      const {
        allowRowSelect,
        allowRangeSelect,
        allowMultiSelect,
        onSelectionChange,
        onCellClick,
      } = this.props;
      const { rowCount } = this.state;
      let { focusedCell, selectionRanges } = this.state;
      let claimedFocus = false;

      if (rowCount <= rowIndex) {
        return;
      }

      if (!evt.shiftKey && onCellClick) {
        claimedFocus = onCellClick({
          evt,
          rowIndex,
          columnIndex,
          columnKey,
          rowData,
        });
        if (claimedFocus === IGNORE_EVENT) {
          return;
        }
        if (claimedFocus) {
          const cellRef = this.prvCellRefs[`${rowIndex}_${columnKey}`];
          if (cellRef && _isFunction(cellRef.claimFocus)) {
            cellRef.claimFocus();
          }
        }
      }

      if (allowRowSelect) {
        const newSelection = {
          [ROW_START]: rowIndex,
          [ROW_END]: rowIndex,
          [COLUMN_START]: 0,
          [COLUMN_END]: columnCount - 1,
        };

        if (allowMultiSelect) {
          if (evt.ctrlKey || evt.metaKey) {
            const existingRangeIdx = selectionRanges.reduce((
              existingRangeIdxRet,
              rangeCur,
              rangeIdx,
            ) => {
              if (existingRangeIdxRet === -1) {
                if ((rowIndex >= rangeCur.get(ROW_START)) && (rowIndex <= rangeCur.get(ROW_END))) {
                  return rangeIdx;
                }
              }
              return existingRangeIdxRet;
            }, -1);

            if (existingRangeIdx !== -1) {
              const existingSelection = selectionRanges.get(existingRangeIdx);
              if (existingSelection.get(ROW_START) === existingSelection.get(ROW_END)) {
                selectionRanges = selectionRanges.delete(existingRangeIdx);
              } else {
                selectionRanges = selectionRanges.setIn([existingRangeIdx, ROW_END], rowIndex);
              }

              newSelection[ROW_START] = rowIndex + 1;
              newSelection[ROW_END] = existingSelection.get(ROW_END);
            }

            if (newSelection[ROW_START] <= newSelection[ROW_END]) {
              selectionRanges = selectionRanges.push(fromJS(newSelection));
            }
          } else if (evt.shiftKey && selectionRanges.size) {
            const lastSelection = selectionRanges.get(selectionRanges.size - 1);
            let rowStart = lastSelection.get(ROW_START);
            let rowEnd = lastSelection.get(ROW_END);

            if ((rowIndex >= rowStart) && (rowIndex <= rowEnd)) {
              rowStart = rowIndex;
            } else {
              rowStart = Math.min(rowStart, rowIndex);
              rowEnd = Math.max(rowEnd, rowIndex);
            }

            selectionRanges = selectionRanges.set(
              selectionRanges.size - 1,
              lastSelection
                .set(ROW_START, rowStart)
                .set(ROW_END, rowEnd),
            );
          } else {
            selectionRanges = fromJS([newSelection]);
          }
        } else {
          selectionRanges = fromJS([newSelection]);
        }
      } else if (allowRangeSelect) {
        if (evt.shiftKey) {
          selectionRanges = fromJS([{
            [ROW_START]: Math.min(rowIndex, focusedCell.rowIndex),
            [ROW_END]: Math.max(rowIndex, focusedCell.rowIndex),
            [COLUMN_START]: Math.min(columnIndex, focusedCell.columnIndex),
            [COLUMN_END]: Math.max(columnIndex, focusedCell.columnIndex),
          }]);
        } else {
          if (allowMultiSelect && (evt.ctrlKey || evt.metaKey)) {
            selectionRanges = selectionRanges.push(fromJS({
              [ROW_START]: Math.min(rowIndex, rowIndex),
              [ROW_END]: Math.max(rowIndex, rowIndex),
              [COLUMN_START]: Math.min(columnIndex, columnIndex),
              [COLUMN_END]: Math.max(columnIndex, columnIndex),
            }));
          } else {
            selectionRanges = list();
          }

          focusedCell = {
            rowIndex,
            columnIndex,
          };
        }
      }

      selectionRanges = this.prvValidateSelectionRanges(selectionRanges);
      selectionRanges = allowRowSelect ?
        this.prvConsolidateRowRanges(selectionRanges) :
        this.prvConsolidateContainedRanges(selectionRanges);
      if (onSelectionChange) {
        onSelectionChange(selectionRanges);
      }

      this.prvRecentScroll = false;

      this.setState({
        arrowSelectionRange: null,
        selectionRanges,
        focusedCell,
        editMode: claimedFocus,
      });
    };

  // handles double-clicking in the Grid
  prvHandleCellDoubleClick = ({
    rowIndex,
    columnIndex,
    columnKey,
    rowData,
  }) =>
    (evt) => {
      this.prvRecentScroll = false;

      const { onCellDoubleClick } = this.props;
      if (onCellDoubleClick) {
        onCellDoubleClick({
          evt,
          rowIndex,
          columnIndex,
          columnKey,
          rowData,
        });
      }
    };

  prvHandleCellHover = ({
    rowIndex,
    columnIndex,
    columnKey,
    rowData,
  }) =>
    (evt) => {
      const { onCellHover } = this.props;
      if (onCellHover) {
        onCellHover({
          evt,
          rowIndex,
          columnIndex,
          columnKey,
          rowData,
        });
      }
    };

  // handles arrow and other keypresses
  prvHandleKeyPress = (evt) => {
    const { shouldHandleKeyEvent } = this.props;
    if (shouldHandleKeyEvent && !shouldHandleKeyEvent(evt)) {
      return;
    }
    let {
      arrowSelectionRange,
      selectionRanges,
      editMode,
      focusedCell,
    } = this.state;
    let { rowIndex, columnIndex } = focusedCell;
    const focusRowIndex = rowIndex;
    const focusColumnIndex = columnIndex;
    const aslRowStart = arrowSelectionRange ?
      arrowSelectionRange.get(ROW_START) : rowIndex;
    const aslColumnStart = arrowSelectionRange ?
      arrowSelectionRange.get(COLUMN_START) : columnIndex;
    let rowStart = true;
    let columnStart = true;

    if (arrowSelectionRange && evt.shiftKey) {
      if (rowIndex <= aslRowStart) {
        if (columnIndex <= aslColumnStart) {
          rowStart = false;
          columnStart = false;
        } else {
          rowStart = false;
          columnStart = true;
        }
      } else if (columnIndex <= aslColumnStart) {
        rowStart = true;
        columnStart = false;
      } else {
        rowStart = true;
        columnStart = true;
      }

      rowIndex = arrowSelectionRange.get(rowStart ? ROW_START : ROW_END);
      columnIndex = arrowSelectionRange.get(columnStart ? COLUMN_START : COLUMN_END);
    }

    if ((rowIndex > -1) && (columnIndex > -1)) {
      const { rowCount } = this.state;
      const columnCount = (
        (this.prvCellGridRef ? this.prvCellGridRef.props.columnCount : 0) +
        (this.prvCellGridFreezeRef ? this.prvCellGridFreezeRef.props.columnCount : 0)
      );

      switch (evt.code) {
        case 'ArrowDown':
          editMode = false;
          rowIndex += 1;
          break;
        case 'ArrowUp':
          editMode = false;
          rowIndex -= 1;
          break;
        case 'ArrowLeft':
          // left arrow can scroll to previous row
          if (columnIndex > 0) {
            columnIndex -= 1;
          } else {
            columnIndex = columnCount - 1;
            rowIndex -= 1;
          }
          break;
        case 'Tab':
          editMode = false;
        case 'ArrowRight': // eslint-disable-line no-fallthrough
          // tab and right arrow both move to right, and can scroll to next row.
          // Tabbing also leaves edit mode
          if (columnIndex < columnCount - 1) {
            columnIndex += 1;
          } else {
            columnIndex = 0;
            rowIndex += 1;
          }
          break;
        case 'Enter':
          // enter toggles cell focus mode and clears any selections
          if (!editMode && this.prvFocusCell(rowIndex, columnIndex)) {
            editMode = true;
          } else {
            editMode = false;
            if (rowIndex < rowCount - 1) {
              rowIndex += 1;
            }
          }
          selectionRanges = list();
          break;
        case 'Escape':
          // escape exits cell focus mode and clears any selections
          editMode = false;
          selectionRanges = list();
          break;
        case 'Backspace':
          if (editMode && !selectionRanges.size) {
            return;
          }
        case 'Delete': // eslint-disable-line no-fallthrough
          editMode = false;
          this.prvBlitTextIntoSelectedCells('');
          break;
        default:
          if (evt.ctrlKey || evt.metaKey) {
            // this is probably a control key sequence not meant for us to handle
            return;
          }

          // spacebar or any text key forces edit mode and clears any selections
          if (!editMode) {
            this.prvFocusCell(rowIndex, columnIndex, evt);

            // absorb this event so that search overlay and table won't grab it
            evt.stopPropagation();
            evt.preventDefault();

            editMode = true;
          }
          selectionRanges = list();
          break;
      }

      if (!editMode &&
        (rowIndex < rowCount) && (rowIndex >= 0) &&
        (columnIndex < columnCount) && (columnIndex >= 0)) {
        // we plan to handle this key.  Don't propagate
        evt.stopPropagation();
        evt.preventDefault();

        // focus undefined cell means remove focus
        this.prvFocusCell();

        if (evt.shiftKey) {
          // create or extend the selection range if shift key
          arrowSelectionRange = {
            [ROW_START]: (rowIndex >= focusRowIndex ? focusRowIndex : rowIndex),
            [ROW_END]: (rowIndex <= focusRowIndex ? focusRowIndex : rowIndex),
            [COLUMN_START]: (columnIndex >= focusColumnIndex ? focusColumnIndex : columnIndex),
            [COLUMN_END]: (columnIndex <= focusColumnIndex ? focusColumnIndex : columnIndex),
          };

          if ((arrowSelectionRange[ROW_START] === arrowSelectionRange[ROW_END]) &&
            (arrowSelectionRange[COLUMN_START] === arrowSelectionRange[COLUMN_END])) {
            // single cell arrow selection is not allowed
            arrowSelectionRange = null;
          } else {
            arrowSelectionRange = this.prvValidateSelectionRanges(fromJS([arrowSelectionRange]))
              .first();
          }
        } else {
          // if no shift key, kill the selection range and move focus
          arrowSelectionRange = null;
          focusedCell = {
            rowIndex,
            columnIndex,
          };
        }
      }

      this.prvRecentScroll = false;

      this.setState({
        selectionRanges,
        arrowSelectionRange,
        focusedCell,
        editMode,
      });
    }
  };

  // handles cut or copy requests
  prvHandleCutOrCopy = isCut =>
    (evt) => {
      if (evt.clipboardData) {
        const { onCellCut, onCellCopy, rowGetter } = this.props;
        const { columnInfo } = this.state;
        const tabChar = String.fromCharCode(9);
        const selectionRangeToUse = this.prvGetSelectionRangesForCopyPaste(false /* forPaste */)
          .last();
        const rowStart = selectionRangeToUse.get(ROW_START);
        const rowEnd = selectionRangeToUse.get(ROW_END);
        const columnStart = selectionRangeToUse.get(COLUMN_START);
        const columnEnd = selectionRangeToUse.get(COLUMN_END);
        if (rowStart > -1) {
          const selectionColumnCount = ((columnEnd - columnStart) + 1);
          const dataArr = [];

          // loop over all cells in the selection range and either call onCellCut/onCellCopy to
          // get the copy data, or, assume the cells support getValue() and clearValue() calls on
          // the cell reference and use those calls to get the copy data
          for (let rowIndex = rowStart; rowIndex <= rowEnd; rowIndex += 1) {
            const rowData = rowGetter({ index: rowIndex });
            for (let columnIndex = columnStart; columnIndex <= columnEnd; columnIndex += 1) {
              const { columnKey } = columnInfo[columnIndex];
              const cellFunc = isCut ? onCellCut : onCellCopy;
              const cellRef = this.prvCellRefs[`${rowIndex}_${columnKey}`];
              // if we have a valid cell ref, then try to call getValue/clearValue on it.
              // Otherwise, call onCellCut or onCellCopy on the parent to paste the copy data
              const cellData = (cellRef && _isFunction(cellRef.getValue)) ? cellRef.getValue() :
                cellFunc({
                  rowIndex,
                  columnIndex,
                  columnKey,
                  rowData,
                });
              if (isCut && cellRef && _isFunction(cellRef.clearValue)) {
                cellRef.clearValue();
              }
              dataArr.push(cellData);
            }
          }

          // generate table markup, in the form of a <table> (HTML) or tab & crlf delimited table
          // (plain text).  This matches behavior of Google Sheets, which puts a table on the HTML
          // clipboard and a tab/crlf delimited table on the plain text clipboard
          const tableMarkup = dataArr.reduce((tableMarkupCur, dataCur, dataIdx) => {
            const tableMarkupRet = tableMarkupCur;
            // need a row delimiter?
            if (dataIdx && !(dataIdx % selectionColumnCount)) {
              tableMarkupRet.html += '</tr><tr>';
              tableMarkupRet.text += '\r\n';
            }
            tableMarkupRet.html += `<td>${dataCur}</td>`;
            tableMarkupRet.text += `${dataCur}${tabChar}`;
            return tableMarkupRet;
          }, {
            html: '<html><body><table><tbody><tr>',
            text: '',
          });

          evt.preventDefault(); // must call this to prevent someone else from handling this copy
          evt.clipboardData.setData('text/html', `${tableMarkup.html}</tr></tbody></table></body></html>`);
          evt.clipboardData.setData('text/plain', tableMarkup.text);
        }
      }
    };

  prvHandlePaste = (evt, evtTargetIsRefDescendant) => {
    if (evt.clipboardData) {
      this.prvRecentScroll = false;

      let stoppedDefaultEventHandling = false;
      const ensureStopDefaultEventHandling = () => {
        if (!stoppedDefaultEventHandling) {
          stoppedDefaultEventHandling = true;

          evt.stopPropagation();
          evt.preventDefault();
        }
      };

      const { onCellPaste } = this.props;
      const { columnInfo } = this.state;
      const selectionRangesToUse = this.prvGetSelectionRangesForCopyPaste(true /* forPaste */);
      let html = evt.clipboardData.getData('text/html');
      if (html) {
        try {
          const parser = new DOMParser(); // eslint-disable-line no-undef
          const clipboardDoc = parser.parseFromString(html, 'text/html');
          const table = clipboardDoc.querySelector('table tbody');
          if (table) {
            // if we find a <table> in the HTML data (like Google Sheets), then paste the table
            // into the selected range of cells allowing for duplication of the data if the selected
            // range is larger than the pasted table.  e.g., if you copy:
            //
            //   A    B
            //
            //   C    D
            //
            // and then paste those 4 cells into a 6x5 cell selection, you should get:
            //
            //   A    B    A    B    A    B
            //
            //   C    D    C    D    C    D
            //
            //   A    B    A    B    A    B
            //
            //   C    D    C    D    C    D
            //
            //   A    B    A    B    A    B
            //
            selectionRangesToUse.forEach((selectionCur) => {
              const rowStart = selectionCur.get(ROW_START);
              const rowEnd = selectionCur.get(ROW_END);
              const columnStart = selectionCur.get(COLUMN_START);
              const columnEnd = selectionCur.get(COLUMN_END);
              if (rowStart > -1) {
                const pasteRows = table.querySelectorAll('tr');
                pasteRows.forEach((pasteRowCur, pasteRowIndex) => {
                  const pasteColumns = pasteRowCur.querySelectorAll('td');
                  const inMultiCellPaste = (pasteRows.length > 1) || (pasteColumns.length > 1);
                  if (evtTargetIsRefDescendant || inMultiCellPaste) {
                    ensureStopDefaultEventHandling();

                    pasteColumns.forEach((pasteColumnCur, pasteColumnIndex) => {
                      // these while loops handle duplication of the current row/column in the
                      // paste data (see above)
                      let rowIndex = rowStart + pasteRowIndex;
                      while (
                        rowIndex <= ((rowEnd === -1) ?
                          (rowStart + (pasteRows.length - 1)) :
                          rowEnd)
                      ) {
                        let columnIndex = columnStart + pasteColumnIndex;
                        while (
                          columnIndex <= ((columnEnd === -1) ?
                            (columnStart + (pasteColumns.length - 1)) :
                            columnEnd)
                        ) {
                          const { columnKey } = columnInfo[columnIndex];
                          const cellText = pasteColumnCur.innerText;
                          // if we have a valid cell ref, then try to call setValue on it.
                          // Otherwise, call onCellPaste on the parent to paste the copy data
                          const cellRef = this.prvCellRefs[`${rowIndex}_${columnKey}`];
                          if (cellRef && _isFunction(cellRef.setValue)) {
                            cellRef.setValue(cellText, inMultiCellPaste);
                          } else {
                            onCellPaste({
                              rowIndex,
                              columnIndex,
                              columnKey,
                              inMultiCellPaste,
                              text: cellText,
                            });
                          }
                          // see if we should duplicate this column into the current selection
                          columnIndex += pasteColumns.length;
                        }
                        // see if we should duplicate this row into the current selection
                        rowIndex += pasteRows.length;
                      }
                    });
                  }
                });
              }
            });
          } else {
            // no table in paste html.  use plain text
            html = null;
          }
        } catch (e) {
          // unparseable html content on clipboard.  ignore and use plain text
          html = null;
        }
      }

      if (evtTargetIsRefDescendant && !html) {
        ensureStopDefaultEventHandling();

        // no HTML data, unparseable html data, or not a table.  Take the paste data as
        // plain text and blit it into every cell of all selections
        const text = evt.clipboardData.getData('text/plain');
        if (text) {
          this.prvBlitTextIntoSelectedCells(text);
        }
      }
    }
  };

  prvBlitTextIntoSelectedCells = (text) => {
    const { onCellPaste } = this.props;
    const { columnInfo } = this.state;
    const selectionRangesToUse = this.prvGetSelectionRangesForCopyPaste(true /* forPaste */);
    selectionRangesToUse.forEach((selectionCur) => {
      const rowStart = selectionCur.get(ROW_START);
      const rowEnd = selectionCur.get(ROW_END);
      const columnStart = selectionCur.get(COLUMN_START);
      const columnEnd = selectionCur.get(COLUMN_END);

      for (
        let rowIndex = rowStart;
        rowIndex <= ((rowEnd === -1) ? rowStart : rowEnd);
        rowIndex += 1
      ) {
        for (
          let columnIndex = columnStart;
          columnIndex <= ((columnEnd === -1) ? columnStart : columnEnd);
          columnIndex += 1
        ) {
          const { columnKey } = columnInfo[columnIndex];
          // if we have a valid cell ref, then try to call setValue on it. Otherwise, call
          // onCellPaste on the parent to paste the copy data
          const cellRef = this.prvCellRefs[`${rowIndex}_${columnKey}`];
          if (cellRef && _isFunction(cellRef.setValue)) {
            cellRef.setValue(text, true /* inMultiCellPaste */);
          } else {
            onCellPaste({
              rowIndex,
              columnIndex,
              columnKey,
              text,
            });
          }
        }
      }
    });
  };

  /* ------ END Event Handlers ------ */

  /* ------ Selection Range Management Methods ------ */

  // issues a focus change to the table, based on keyboard selections
  prvFocusCell = (rowIndex, columnIndex, evt) => {
    const { onCellFocus, rowGetter } = this.props;
    if (onCellFocus) {
      // releaseFocus() is needed because the onCellFocus() call in many table implementations
      // modifies state in a way that prevents the normal saving of data upon focus release, so we
      // force the cell to handle the focus release
      const { columnInfo, focusedCell } = this.state;
      if ((focusedCell.rowIndex > -1) && (focusedCell.columnIndex > -1)) {
        const { columnKey } = columnInfo[focusedCell.columnIndex];
        const cellRef = this.prvCellRefs[`${focusedCell.rowIndex}_${columnKey}`];
        if (cellRef && _isFunction(cellRef.releaseFocus)) {
          cellRef.releaseFocus();
        }
      }

      const rowData = rowGetter({ index: rowIndex });
      return onCellFocus({
        rowData,
        rowIndex,
        columnIndex,
        columnKey: ((columnIndex > -1) ? columnInfo[columnIndex].columnKey : null),
        evt,
      });
    }

    return false;
  };

  // this method uses the canSelectRow function provided by the user of this table to determine
  // if all the selection ranges are valid, and removes rows which are not valid to select
  prvValidateSelectionRanges = (selectionRanges) => {
    const { canSelectRow, canSelectColumn } = this.props;
    return selectionRanges.reduce((validatedRanges, rangeCur) => {
      let validatedRangesRet = validatedRanges;
      let rowStart = rangeCur.get(ROW_START);
      let rowEnd = rangeCur.get(ROW_END);
      let columnStart = rangeCur.get(COLUMN_START);
      let columnEnd = rangeCur.get(COLUMN_END);

      if (canSelectRow) {
        let rowCur = rowEnd;
        while ((rowCur >= rowStart) && !canSelectRow(rowCur)) {
          rowCur -= 1;
        }
        rowEnd = rowCur;

        while ((rowCur >= rowStart) && canSelectRow(rowCur)) {
          rowCur -= 1;
        }
        rowStart = rowCur + 1;
      }

      if (canSelectColumn) {
        let columnCur = columnEnd;
        while ((columnCur >= columnStart) && !canSelectColumn(columnCur)) {
          columnCur -= 1;
        }
        columnEnd = columnCur;

        while ((columnCur >= columnStart) && canSelectColumn(columnCur)) {
          columnCur -= 1;
        }
        columnStart = columnCur + 1;
      }

      if ((rowStart <= rowEnd) && (columnStart <= columnEnd)) {
        validatedRangesRet = validatedRangesRet.push(fromJS({
          [ROW_START]: rowStart,
          [ROW_END]: rowEnd,
          [COLUMN_START]: columnStart,
          [COLUMN_END]: columnEnd,
        }));
      }

      return validatedRangesRet;
    }, list());
  };

  // this method takes a range of selections and consolidates them into a minimal set of ranges
  // for example, if we have a range to select rows 1-3, another range to select row 4, and
  // another range to select rows 6-7, then the end result of this function should be a range to
  // select rows 1-4 and another range to select rows 6-7
  prvConsolidateRowRanges = (selectionRanges) => {
    let nextRangeToPush = null;
    return selectionRanges.size ? selectionRanges
      .sortBy(rangeCur => rangeCur.get(ROW_START))
      .reduce((consolidatedRanges, rangeCur) => {
        let consolidatedRangesRet = consolidatedRanges;
        if (nextRangeToPush) {
          if (rangeCur.get(ROW_START) > nextRangeToPush.get(ROW_END) + 1) {
            consolidatedRangesRet = consolidatedRangesRet.push(nextRangeToPush);
            nextRangeToPush = rangeCur;
          } else {
            nextRangeToPush = nextRangeToPush.set(
              ROW_END,
              Math.max(nextRangeToPush.get(ROW_END), rangeCur.get(ROW_END)),
            );
          }
        } else {
          nextRangeToPush = rangeCur;
        }
        return consolidatedRangesRet;
      }, list())
      .push(nextRangeToPush) : selectionRanges;
  };

  // this method takes a range of selections and eliminates any ranges which are subsets of
  // other ranges
  prvConsolidateContainedRanges = selectionRanges =>
    selectionRanges.reduce((consolidatedRanges, range1) => {
      const isContainedByOtherRange = selectionRanges
        .reduce((isContainedByOtherRangeRet, range2) => (
          isContainedByOtherRangeRet ||
          ((range1 !== range2) &&
          (range1.get(ROW_START) >= range2.get(ROW_START)) &&
          (range1.get(ROW_END) <= range2.get(ROW_END)) &&
          (range1.get(COLUMN_START) >= range2.get(COLUMN_START)) &&
          (range1.get(COLUMN_END) <= range2.get(COLUMN_END)))
        ), false);
      return isContainedByOtherRange ? consolidatedRanges : consolidatedRanges.push(range1);
    }, list());

  // this method gets the range(s) to be used for copy or paste.
  prvGetSelectionRangesForCopyPaste = (forPaste) => {
    // where to cut/copy/paste from or to?  use the arrow selection range first, if it exists.
    // Otherwise, use the mouse selection ranges, if any exist.  Finally, try the focused cell,
    // if it exists.  This behavior appears to match Google Sheets' logic for finding the
    // cut/copy/paste source/dest (use final selected range if multiple selections exist,
    // otherwise focused cell if no selections)
    const { selectionRanges, arrowSelectionRange, focusedCell } = this.state;
    return arrowSelectionRange ? fromJS([arrowSelectionRange]) : ( // eslint-disable-line max-len, no-nested-ternary
      selectionRanges.size ? selectionRanges : fromJS([{
        [ROW_START]: focusedCell.rowIndex,
        // -1 is special value indicating we want to ensure we grow to fit a tabular paste.
        [ROW_END]: forPaste ? -1 : focusedCell.rowIndex,
        [COLUMN_START]: focusedCell.columnIndex,
        // -1 is special value indicating we want to ensure we grow to fit a tabular paste.
        [COLUMN_END]: forPaste ? -1 : focusedCell.columnIndex,
      }])
    );
  };

  /* ------ END Selection Range Management Methods ------ */

  /* ------ Rendering Methods ------ */

  prvRecomputeTables = () => {
    const recomputeTable = (grid, forceOverflowInitial) => {
      if (grid) {
        grid.recomputeGridSize();
        if (forceOverflowInitial) {
          // eslint-disable-next-line react/no-find-dom-node
          const domGrid = ReactDOM.findDOMNode(grid);
          if (domGrid) {
            domGrid.style.overflow = 'initial';
          }
        }
      }
    };

    recomputeTable(this.prvHeaderGridRef, true /* forceOverflowInitial */);
    recomputeTable(this.prvHeaderGridFreezeRef, true /* forceOverflowInitial */);
    recomputeTable(this.prvCellGridRef);
    recomputeTable(this.prvCellGridFreezeRef, true /* forceOverflowInitial */);
  };

  // this method renders a single header cell, with the resize drag line, if desired
  prvRenderHeaderCell = ({
    cell,
    cellWidth,
    cellHeight,
    isResizable,
  }) =>
    (props) => {
      const { height } = this.props;
      const { resizeDrag, resizeHover } = this.state;
      const { columnKey } = props; // eslint-disable-line react/prop-types
      const isResizing = (resizeDrag && (resizeDrag.dragColumn === columnKey));
      const resizerBackground = (
        ((resizeHover === columnKey) && !isResizing) ? 'blue' : 'transparent'
      );
      const { props: cellProps } = cell;
      const { style: cellStyleRaw } = cellProps;
      const cellStyle = resizeDrag ? {
        ...cellStyleRaw,
        pointerEvents: 'none', // performance fix when dragging over header
      } : cellStyleRaw;

      return (
        <div
          style={{
            ...STYLES.headerCell,
            height: cellHeight,
          }}
        >
          {renderIf(isResizable, () => (
            <Delay wait={250}>
              <Draggable
                ref={(draggable) => { this.prvDragRefs[columnKey] = draggable; }}
                axis="x"
                zIndex={999999}
                bounds={{ left: -(cellWidth - 2) }}
                onStart={this.prvHandleResizeDragStart(columnKey, cellWidth)}
                onStop={this.prvHandleResizeDragStop}
              >
                <div
                  style={{
                    ...STYLES.resizer,
                    height: cellHeight,
                    backgroundColor: resizerBackground,
                  }}
                  onMouseEnter={this.prvHandleResizeMouseEnter(columnKey)}
                  onMouseLeave={this.prvHandleResizeMouseLeave(columnKey)}
                >
                  {renderIf(isResizing, () => (
                    <div
                      style={{
                        ...STYLES.tallDragLine,
                        height,
                      }}
                    />
                  ))}
                </div>
              </Draggable>
            </Delay>
          ))}
          {renderIf(cell, () => React.cloneElement(cell, {
            ...cellProps,
            ...props,
            style: cellStyle,
            columnKey,
            cellWidth,
            cellHeight,
          }))}
        </div>
      );
    };

  // this method renders a single table cell in the Grids
  prvRenderTableCell = ({
    cell,
    cellWidth,
    cellHeight,
  }) =>
    (props) => {
      const { rowGetter } = this.props;
      const { rowCount } = this.state;
      const { rowIndex, columnKey } = props; // eslint-disable-line react/prop-types
      const nonStyleProps = _omit(props, ['style']);
      if (rowIndex < rowCount) {
        let cellUse = cell;
        if (_isFunction(cell)) {
          const rowData = rowGetter({ index: rowIndex });
          cellUse = cell({ rowIndex, columnKey, rowData });
        }
        const { props: cellProps } = cellUse;
        const { style: cellStyleRaw } = cellProps;
        const cellStyle = _isFunction(cellStyleRaw) ?
          cellStyleRaw({ rowIndex, columnKey }) :
          cellStyleRaw;
        return (
          <div style={STYLES.tableCell}>
            {React.cloneElement(cellUse, {
              ...cellProps,
              ...nonStyleProps,
              ref: (cellRef) => {
                this.prvCellRefs[`${rowIndex}_${columnKey}`] = cellRef;
              },
              style: cellStyle,
              columnKey,
              cellWidth,
              cellHeight,
            })}
          </div>
        );
      }
      return (
        <div />
      );
    };

  // this method sets up header + cell renderers for a given column in the Grid
  prvRenderTableColumn = ({
    tableProps,
    column,
    columnLeft,
  }) => {
    const {
      isResizable,
      cell,
      header,
      columnKey,
      ...columnProps
    } = column.props;
    const isLastColumn = ((columnLeft + columnProps.width) >= tableProps.width);
    const columnWidth = columnProps.flexGrow ?
      Math.max(tableProps.width - (columnLeft + 16), columnProps.width) :
      columnProps.width - (isLastColumn ? 16 : 0);
      // clip the last column slightly to accommodate table borders
    const headerRenderer = this.prvRenderHeaderCell({
      cell: header || <Cell />,
      cellWidth: columnWidth,
      cellHeight: tableProps.headerHeight - 2,
      isResizable,
    });
    const cellRenderer = this.prvRenderTableCell({
      cell,
      cellWidth: columnWidth,
      cellHeight: tableProps.rowHeight - 2,
    });
    return {
      ...columnProps,
      columnKey,
      cellRenderer,
      headerRenderer,
      flexShrink: 0,
      style: STYLES.column,
      width: columnWidth,
    };
  };

  render() {
    const {
      className,
      evenRowBackgroundColor,
      focusStyle,
      freezeLeftCount,
      headerHeight,
      height,
      highlightRowColor,
      highlightRowKey,
      highlightRowValue,
      noHeaderScroll,
      oddRowBackgroundColor,
      rowHeight,
      rowGetter,
      selectionStyle,
      style,
      ...remainingProps
    } = this.props;
    let { scrollToColumn, scrollToRow } = this.props;
    const {
      arrowSelectionRange,
      columnLeft,
      columnInfo,
      focusedCell,
      freezeWidth,
      gridStyle,
      groupFarOuterStyle,
      groupHeaderStyle,
      groupOuterStyle,
      groups,
      headerStyle,
      rowCountWithEmptySpace,
      selectionRanges,
      tableStyle,
      useDefaultClipboard,
      width,
    } = this.state;
    const cellGridHeight = height - (headerHeight + 2); // subtract 2 because of borders
    const columns = columnInfo.map(columnInfoCur => this.prvRenderTableColumn(columnInfoCur));

    // this function is local to the render function so we can use the values computed above
    // in a closure
    const cellRenderer = (forHeader, forFreeze) => (props) => {
      const { rowIndex, columnIndex } = props; // eslint-disable-line react/prop-types
      const columnIndexUse = forFreeze ? columnIndex : columnIndex + freezeLeftCount;
      const rowData = rowGetter({ index: rowIndex });
      const columnProps = columns[columnIndexUse];

      const propsUse = {
        ...props,
        rowData,
        rowIndex,
        columnKey: columnProps.columnKey,
      };

      const rendererFunc = forHeader ? columnProps.headerRenderer : columnProps.cellRenderer;
      const mergedSelections = arrowSelectionRange ?
        selectionRanges.push(arrowSelectionRange) : selectionRanges;
      const cellIsSelected = mergedSelections.reduce((cellIsSelectedRet, rangeCur) => (
        cellIsSelectedRet ||
        ((rangeCur.get(COLUMN_START) <= columnIndexUse) &&
        (rangeCur.get(COLUMN_END) >= columnIndexUse) &&
        (rangeCur.get(ROW_START) <= rowIndex) &&
        (rangeCur.get(ROW_END) >= rowIndex))
      ), false);
      const cellIsFocused = !forHeader &&
        (focusedCell.rowIndex === rowIndex) &&
        (focusedCell.columnIndex === columnIndexUse);
      let cellBackground = (rowIndex % 2) ?
        (evenRowBackgroundColor || STYLES.evenRows.background) :
        (oddRowBackgroundColor || STYLES.oddRows.background);
      if (highlightRowKey && highlightRowValue) {
        const highlightKeyVal = (
          rowData.get ? rowData.get(highlightRowKey) : rowData[highlightRowKey]
        );
        if (highlightKeyVal === highlightRowValue) {
          cellBackground = highlightRowColor || DEFAULT_HIGHLIGHT_ROW_COLOR;
        }
      }
      const cellOuterStyle = {
        ...propsUse.style,
        ...(forHeader ? headerStyle : gridStyle),
        background: cellBackground,
        ...((cellIsSelected && selectionStyle) || {}),
        ...((cellIsFocused && focusStyle) || {}),
      };
      const eventParams = {
        rowIndex,
        columnIndex: columnIndexUse,
        columnKey: columnProps.columnKey,
        columnCount: columns.length,
        rowData,
      };

      return (
        <div // eslint-disable-line jsx-a11y/click-events-have-key-events
          key={propsUse.key}
          style={cellOuterStyle}
          onClick={forHeader ? undefined : this.prvHandleCellClick(eventParams)}
          onDoubleClick={forHeader ? undefined : this.prvHandleCellDoubleClick(eventParams)}
          onMouseEnter={this.prvHandleCellHover(eventParams)}
        >
          {rendererFunc(propsUse)}
        </div>
      );
    };

    if (
      (scrollToRow === undefined) ||
      (scrollToColumn === undefined) ||
      (scrollToRow === -1) ||
      (scrollToColumn === -1)
    ) {
      if (arrowSelectionRange) {
        // ensure active part of arrow selection is within scroll view
        scrollToRow = ((arrowSelectionRange.get(ROW_START) < focusedCell.rowIndex) ?
          arrowSelectionRange.get(ROW_START) : arrowSelectionRange.get(ROW_END));
        scrollToColumn = ((arrowSelectionRange.get(COLUMN_START) < focusedCell.rowIndex) ?
          arrowSelectionRange.get(COLUMN_START) : arrowSelectionRange.get(COLUMN_END));
      } else if (
        (focusedCell.rowIndex > -1) &&
        (focusedCell.columnIndex > -1) &&
        !this.prvRecentScroll
      ) {
        // ensure focused cell is within scroll view
        scrollToRow = focusedCell.rowIndex;
        scrollToColumn = focusedCell.columnIndex;
      }
    }

    if (scrollToColumn > -1 && freezeLeftCount) {
      if (scrollToColumn < freezeLeftCount) {
        scrollToColumn = -1;
      } else {
        scrollToColumn -= freezeLeftCount;
      }
    }

    return (
      <div
        className={className}
        style={{
          ...STYLES.outerDiv,
          ...style,
        }}
      >
        {renderIf(!useDefaultClipboard, () => (
          <Fragment>
            <ClipboardHelper
              onCut={this.prvHandleCutOrCopy(true /* isCut */)}
              onCopy={this.prvHandleCutOrCopy(false /* isCut */)}
              onPaste={this.prvHandlePaste}
              getInputRef={() => this.prvCellGridRef}
              allowInputCutCopy={false}
              allowEditableCutCopy={false}
              allowInputPaste={false}
              allowEditablePaste={false}
            />
            {renderIf(freezeLeftCount, () => (
              <ClipboardHelper
                onCut={this.prvHandleCutOrCopy(true /* isCut */)}
                onCopy={this.prvHandleCutOrCopy(false /* isCut */)}
                onPaste={this.prvHandlePaste}
                getInputRef={() => this.prvCellGridFreezeRef}
                allowInputCutCopy={false}
                allowEditableCutCopy={false}
                allowInputPaste={false}
                allowEditablePaste={false}
              />
            ))}
          </Fragment>
        ))}
        <KeyHandler
          keys={KEYS_TO_SNIFF}
          onKey={this.prvHandleKeyPress}
          getInputRef={() => [this.prvCellGridRef, this.prvCellGridFreezeRef]}
        />
        {renderIf(groups.length, () => (
          <div style={groupFarOuterStyle}>
            <div
              ref={(groupHeader) => { this.prvGroupHeaderRef = groupHeader; }}
              style={groupHeaderStyle}
            >
              {groups.map((groupCur) => {
                const { group: { props: groupProps } } = groupCur;
                const { key, hidden, header } = groupProps;
                return (
                  <div
                    key={`group_${key}`}
                    style={{
                      ...groupOuterStyle,
                      ...(hidden ? STYLES.hiddenGroupOuter : {}),
                      width: groupCur.groupWidth,
                    }}
                  >
                    {header}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <div
          style={{
            ...STYLES.headerDiv,
            width,
            overflowY: noHeaderScroll ? 'hidden' : 'scroll',
          }}
        >
          {renderIf(freezeLeftCount, () => (
            <Grid
              {...remainingProps}
              ref={(grid) => { this.prvHookRef(grid, 'prvHeaderGridFreezeRef'); }}
              style={{
                ...tableStyle,
                ...STYLES.headerTable,
                width: freezeWidth,
                zIndex: 1,
              }}
              gridStyle={gridStyle}
              height={headerHeight}
              // at this point, columnLeft is the native width of all columns
              width={freezeWidth}
              rowCount={1}
              rowHeight={headerHeight}
              columnCount={freezeLeftCount}
              columnWidth={({ index }) => columns[index].width}
              cellRenderer={cellRenderer(true /* forHeader */, true /* forFreeze */)}
            />
          ))}
          <Grid
            {...remainingProps}
            ref={(grid) => { this.prvHookRef(grid, 'prvHeaderGridRef'); }}
            style={{
              ...tableStyle,
              ...STYLES.headerTable,
              overflow: 'initial',
              width: Math.max(width, columnLeft),
              flex: 1,
            }}
            gridStyle={gridStyle}
            height={headerHeight}
            // at this point, columnLeft is the native width of all columns
            width={Math.max(width, columnLeft) - freezeWidth}
            rowCount={1}
            rowHeight={headerHeight}
            columnCount={columns.length - freezeLeftCount}
            columnWidth={({ index }) => columns[index + freezeLeftCount].width}
            cellRenderer={cellRenderer(true /* forHeader */, false /* forFreeze */)}
          />
        </div>
        <div
          style={{
            ...STYLES.tableDiv,
            width,
          }}
        >
          {renderIf(freezeLeftCount, () => (
            <Grid
              {...remainingProps}
              ref={(grid) => { this.prvHookRef(grid, 'prvCellGridFreezeRef'); }}
              style={tableStyle}
              gridStyle={gridStyle}
              height={cellGridHeight}
              width={freezeWidth}
              rowCount={rowCountWithEmptySpace}
              rowHeight={rowHeight}
              columnCount={freezeLeftCount}
              columnWidth={({ index }) => columns[index].width}
              cellRenderer={cellRenderer(false /* forHeader */, true /* forFreeze */)}
              scrollToRow={scrollToRow}
            />
          ))}
          <Grid
            {...remainingProps}
            ref={(grid) => { this.prvHookGridRef(grid); }}
            style={tableStyle}
            gridStyle={gridStyle}
            height={cellGridHeight}
            width={width - freezeWidth}
            rowCount={rowCountWithEmptySpace}
            rowHeight={rowHeight}
            columnCount={columns.length - freezeLeftCount}
            columnWidth={({ index }) => columns[index + freezeLeftCount].width}
            cellRenderer={cellRenderer(false /* forHeader */, false /* forFreeze */)}
            scrollToRow={scrollToRow}
            scrollToColumn={scrollToColumn}
            onScroll={this.prvHandleScroll}
          />
        </div>
      </div>
    );
  }

  /* ------ End Rendering Methods ------ */
}

export default VirtualizedDataTable;
