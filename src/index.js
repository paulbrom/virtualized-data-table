import React from 'react';
import Cell from './table/cell';
import ClipboardHandler from './utils/clipboardHelper';
import Column from './table/column';
import ColumnGroup from './table/columnGroup';
import KeyHandler from './utils/keyHandler';
import VirtualizedDataTable from './table/virtualizedDataTable';

const overrideGridCSS = (noOutline, css) => {
  const noOutlineCSS = noOutline ? `
    .ReactVirtualized__Table__Grid:focus {
      outline: none !important;
    }

    .ReactVirtualized__Grid:focus {
      outline: none !important;
    }
  ` : '';
  return (
    <style>
      {noOutlineCSS}
      {css}
    </style>
  );
};

export {
  Cell,
  ClipboardHandler,
  Column,
  ColumnGroup,
  KeyHandler,
  VirtualizedDataTable,
  overrideGridCSS,
};

export default VirtualizedDataTable;
