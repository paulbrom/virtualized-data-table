/* eslint react/jsx-filename-extension: "off" */
import React from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import _ from 'lodash';
import VirtualizedDataTable from './../table/virtualizedDataTable';
import Column from './../table/column';
import Cell from './../table/cell';

const ROW_COUNT = 100;
const COLUMN_KEYS = [
  'Col',
  'Col2',
  'Col3',
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
  rowData: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
  columnKey: PropTypes.string.isRequired,
};

const App = () => (
  <VirtualizedDataTable
    rowHeight={25}
    rowCount={dataArray.length}
    width={1200}
    height={500}
    headerHeight={50}
    rowGetter={getRowDataFromDataArray}
  >
    <Column
      columnKey="Col1"
      header={<Cell>Column 1</Cell>}
      cell={<Cell>Column 1 static content</Cell>}
      width={200}
    />
    <Column
      columnKey="Col2"
      header={<Cell>Column 2</Cell>}
      cell={<MyCustomCell />}
      width={500}
    />
    <Column
      columnKey="Col3"
      header={<Cell>Column 3</Cell>}
      cell={({ rowData, columnKey, ...props }) => (
        <Cell {...props}>
          Data for column 3: { rowData[columnKey] }
        </Cell>
      )}
      width={500}
    />
  </VirtualizedDataTable>
);

render(<App />, document.getElementById('root'));
