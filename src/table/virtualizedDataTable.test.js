import React from 'react';
import { configure, shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import _ from 'lodash';
import VirtualizedDataTable from './VirtualizedDataTable';

configure({ adapter: new Adapter() });

const ROW_COUNT = 100;
const COLUMN_COUNT = 100;

const generateGUID = () => {
  let retGUID = '';
  for (let charOn = 0; charOn < 32; charOn++) {
    if ([8, 12, 16, 20].indexOf(charOn) >= 0) {
      retGUID += '-';
    }
    const valCur = Math.floor(Math.random() * 16);
    retGUID += String.fromCharCode((valCur < 10) ? (48 + valCur) : (87 + valCur));
  }
  return retGUID;
};

const dataArray = _.fill(Array(ROW_COUNT), () =>
  _.fill(Array(COLUMN_COUNT), generateGUID()));
const getRowDataFromDataArray = ({ rowIndex }) => dataArray[rowIndex];


test('virtualized data table basic initialization', () => {
  const component = shallow(
    <VirtualizedDataTable
      headerHeight={30}
      rowHeight={15}
      rowCount={ROW_COUNT}
      columnCount={COLUMN_COUNT}
      height={500}
      width={1000}
      rowGetter={getRowDataFromDataArray}
    />
  );
  expect(component).toBeDefined();
});
