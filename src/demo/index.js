/* eslint react/jsx-filename-extension: "off" */
/* eslint react/jsx-one-expression-per-line: "off" */
/* eslint react/no-multi-comp: "off" */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import _times from 'lodash/times';
import {
  VirtualizedDataTable,
  Column,
  Cell,
  overrideGridCSS,
} from '../index';

const ROW_COUNT = 100;
const COLUMN_1 = 'Col-1';
const COLUMN_2 = 'Col-2';
const COLUMN_3 = 'Col-3';
const COLUMN_4 = 'Col-4';
const COLUMN_KEYS = [
  COLUMN_1,
  COLUMN_2,
  COLUMN_3,
  COLUMN_4,
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

const dataArray = _times(ROW_COUNT).map(() => (
  COLUMN_KEYS.reduce((columnCur, keyCur) => {
    columnCur[keyCur] = generateGUID(); // eslint-disable-line no-param-reassign
    return columnCur;
  }, {})
));
const getRowDataFromDataArray = ({ index }) => dataArray[index];

class MyCustomCell extends PureComponent {
  static propTypes = {
    rowData: PropTypes.any, // eslint-disable-line react/forbid-prop-types
    columnKey: PropTypes.string,
    backgroundColor: PropTypes.string,
    textColor: PropTypes.string,
    leftText: PropTypes.string,
  };

  static defaultProps = {
    backgroundColor: 'yellow',
    textColor: 'red',
    leftText: 'My custom cell has data:',
  };

  render() {
    const {
      rowData,
      columnKey,
      textColor,
      backgroundColor,
      leftText,
    } = this.props;
    return (
      <Cell
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          background: backgroundColor,
          color: textColor,
          fontStyle: 'italic',
        }}
      >
        {leftText}&nbsp;
        {rowData[columnKey]}
      </Cell>
    );
  }
}

class DemoApp extends PureComponent {
  state = {
    columnWidths: {
      [COLUMN_1]: 200,
      [COLUMN_2]: 500,
      [COLUMN_3]: 500,
      [COLUMN_4]: 600,
    },
  };

  prvColumnResizeEnd = (newWidth, columnKey) => {
    this.setState(({ columnWidths }) => ({
      columnWidths: {
        ...columnWidths,
        [columnKey]: newWidth,
      },
    }));
  };

  render() {
    const { columnWidths } = this.state;
    return (
      <div>
        {overrideGridCSS(true /* noOutline */)}
        <VirtualizedDataTable
          rowHeight={25}
          rowCount={dataArray.length}
          freezeLeftCount={1}
          width={1024}
          height={500}
          headerHeight={50}
          rowGetter={getRowDataFromDataArray}
          onColumnResizeEndCallback={this.prvColumnResizeEnd}
        >
          <Column
            columnKey={COLUMN_1}
            header={<Cell>Column 1 (frozen)</Cell>}
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
          <Column
            columnKey={COLUMN_4}
            header={<Cell>Column 4</Cell>}
            cell={(
              <MyCustomCell
                backgroundColor="blue"
                textColor="white"
                leftText="With custom left text and colors:"
              />
            )}
            width={columnWidths[COLUMN_4]}
          />
        </VirtualizedDataTable>
      </div>
    );
  }
}

render(<DemoApp />, document.getElementById('root'));
