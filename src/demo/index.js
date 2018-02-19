/* eslint react/jsx-filename-extension: "off" */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import _ from 'lodash';
import {
  VirtualizedDataTable,
  Column,
  Cell,
  overrideGridCSS,
} from './../index';

const ROW_COUNT = 100;
const COLUMN_1 = 'Col-1';
const COLUMN_2 = 'Col-2';
const COLUMN_3 = 'Col-3';
const COLUMN_KEYS = [
  COLUMN_1,
  COLUMN_2,
  COLUMN_3,
];

const generateGUID = () => {
  let retGUID = '';
  for (let charOn = 0; charOn < 32; charOn += 1) {
    if ([8, 12, 16, 20].indexOf(charOn) >= 0) {
      retGUID += '-';
    }
    const valCur = Math.floor(Math.random() * 16);
    retGUID += String.fromCharCode((valCur < 10) ? (48 + valCur) : (87 + valCur));
  }
  return retGUID;
};

const dataArray = _.map(Array(ROW_COUNT), () =>
  _.reduce(COLUMN_KEYS, (columnCur, keyCur) => {
    const columnRet = columnCur;
    columnRet[keyCur] = generateGUID();
    return columnRet;
  }, {}));
const getRowDataFromDataArray = ({ index }) => dataArray[index];

const MyCustomCell = (props) => {
  const { rowData, columnKey } = props;
  return (
    <Cell
      style={{
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        background: 'yellow',
        color: 'red',
        fontStyle: 'italic',
      }}
    >
      My custom cell has data: { rowData[columnKey] }
    </Cell>
  );
};

MyCustomCell.propTypes = {
  rowData: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  columnKey: PropTypes.string,
};

MyCustomCell.defaultProps = {
  rowData: undefined,
  columnKey: undefined,
};

class DemoApp extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      columnWidths: {
        [COLUMN_1]: 200,
        [COLUMN_2]: 500,
        [COLUMN_3]: 500,
      },
    };

    this.prvColumnResizeEnd = this.prvColumnResizeEnd.bind(this);
  }

  prvColumnResizeEnd(newWidth, columnKey) {
    const { columnWidths } = this.state;
    this.setState({
      columnWidths: _.assign(columnWidths, {
        [columnKey]: newWidth,
      }),
    });
  }

  render() {
    const { columnWidths } = this.state;
    const tableWidth = _.reduce(columnWidths, (totalWidth, widthCur) =>
      (totalWidth + widthCur), 0);

    return (
      <div>
        {overrideGridCSS(true /* noOutline */)}
        <VirtualizedDataTable
          rowHeight={25}
          rowCount={dataArray.length}
          width={tableWidth}
          height={500}
          headerHeight={50}
          rowGetter={getRowDataFromDataArray}
          onColumnResizeEndCallback={this.prvColumnResizeEnd}
        >
          <Column
            columnKey={COLUMN_1}
            header={<Cell>Column 1</Cell>}
            cell={<Cell>Column 1 static content</Cell>}
            width={columnWidths[COLUMN_1]}
            isResizable
          />
          <Column
            columnKey={COLUMN_2}
            header={<Cell>Column 2</Cell>}
            cell={<MyCustomCell />}
            width={columnWidths[COLUMN_2]}
            isResizable
          />
          <Column
            columnKey={COLUMN_3}
            header={<Cell>Column 3</Cell>}
            cell={({ rowData, columnKey, ...props }) => (
              <Cell {...props}>
                Data for column 3: { rowData[columnKey] }
              </Cell>
            )}
            width={columnWidths[COLUMN_3]}
            isResizable
          />
        </VirtualizedDataTable>
      </div>
    );
  }
}

render(<DemoApp />, document.getElementById('root'));
