/*!
 * Table.js
 * Javascript table component
 * (c) 2020 Joshua Adams
 */

/* ============================== Import Modules ============================ */

// N/A

/* ================================ Variables =============================== */

let singleClickedRow = {
  style: {}
};

let dblClickedRow = {
  style: {}
};

let onHoverRow = {
  style: {}
};

/* ============================= Private Methods ============================ */

function _addElement(parent, type) {
  const element = document.createElement(type);
  parent.appendChild(element);
  return element;
}

function _onHoverDefault(tr) {
  if (onHoverRow !== tr) {
    // clear current styling
    onHoverRow.style.color = '';
    onHoverRow.style.backgroundColor = '';
    // set new row
    onHoverRow = tr;
    // set default styling
    tr.style.backgroundColor = 'rgba(232,240,254)';
  }
}

function _onClickDefault(tr) {
  if (singleClickedRow !== tr) {
    // clear current styling
    singleClickedRow.style.color = '';
    // set new row
    singleClickedRow = tr;
    // set default styling
    tr.style.color = 'rgba(25,103,210)';
  }
}

function _onDblClickDefault(tr) {
  if (dblClickedRow !== tr) {
    // clear current styling
    dblClickedRow.style.fontWeight = null;
    // set new row
    dblClickedRow = tr;
    // set default styling
    tr.style.fontWeight = '600';
  }
}

function _onEvent(tr, td, defaultcb) {
  defaultcb(tr);
}

function _tableRenderer() {
  const table = {};
  table.className = 'table-table';
  table.style = {};
  table.style.fontFamily = 'Arial';
  table.style.fontSize = '13px';
  table.style.fontWeight = 500;
  table.style.overflow = 'scroll';
  table.style.margin = '15px';
  table.cellSpacing = '0';
  return table;
}

function _columnRenderer() {
  const col = {};
  col.className = 'table-table__column';
  col.style = {};
  col.style.height = '48px';
  col.style.width = '200px';
  col.style.textAlign = 'center';
  col.style.borderBottom = 'solid 1px rgba(218,220,224)';
  col.style.borderTop = 'solid 1px rgba(218,220,224)';
  return col;
}

function _rowRenderer() {
  const row = {};
  row.className = 'table-table__row';
  row.style = {};
  row.style.height = '48px';
  row.style.borderBottom = 'solid 1px #dadce0';
  return row;
}

function _cellRenderer() {
  const cell = {};
  cell.className = 'table-table__cell';
  cell.style = {};
  return cell;
}

function _applyRender(element, properties) {
  const arr = Object.keys(properties);
  for (let i = 0; i < arr.length; i++) {
    const prop = arr[i];
    if (typeof properties[prop] === 'object' && properties[prop] !== null) {
      Object.assign(element[prop], properties[prop]);
    } else {
      element[prop] = properties[prop];
    }
  }
  return element;
}

function _addCells(tr, data, rowno, options) {
  const cnf = {
    onClick: options.cells.onClick || _onEvent,
    onDblClick: options.cells.onDblClick || _onEvent,
    onHover: options.cells.onHover || _onEvent,
    renderer: options.cells.renderer || _cellRenderer,
  };
  const arr = Object.keys(data);
  for (let i = 0; i < arr.length; i++) {
    const prop = arr[i];
    const value = data[prop];
    // add dom element
    const td = _addElement(tr, 'td');
    // calculate element css styling with supplied or default renderer
    const render = cnf.renderer(value, rowno, prop);
    // configure element
    td.innerHTML = value;
    _applyRender(td, render);
    // apply cell functionality
    td.onclick = function onclick() {
      return cnf.onClick(tr, td, _onClickDefault);
    };
    td.ondblclick = function ondblclick() {
      return cnf.onDblClick(tr, td, _onDblClickDefault);
    };
    td.onmouseover = function onmouseover() {
      return cnf.onHover(tr, td, _onHoverDefault);
    };
  }
  return tr;
}

function _addRows(table, options) {
  const cnf = { renderer: options.rows.renderer || _rowRenderer };
  const tbody = _addElement(table, 'tbody');
  // Add table rows
  for (let i = 0; i < options.data.length; i++) {
    // add dom element
    const tr = _addElement(tbody, 'tr');
    // calculate element css styling with supplied or default renderer
    const render = cnf.renderer(i);
    _applyRender(tr, render);
    // add table cells
    const row = options.data[i];
    _addCells(tr, row, i, options);
  }
  return tbody;
}

function _addHeaders(table, options) {
  const cnf = {
    names: options.headers.names || Object.keys(options.data[0]),
    renderer: options.headers.renderer || _columnRenderer
  };
  const thead = _addElement(table, 'thead');
  for (let i = 0; i < cnf.names.length; i++) {
    // add element to header
    const th = _addElement(thead, 'th');
    // calculate element css styling with supplied or default renderer
    const render = cnf.renderer(i);
    // configure element
    th.innerHTML = cnf.names[i];
    _applyRender(th, render);
  }
  return thead;
}

function _addTable(frag, options) {
  const cnf = { renderer: options.renderer || _tableRenderer };
  const table = _addElement(frag, 'table');
  const render = cnf.renderer();
  _applyRender(table, render);
  return table;
}

/* ============================== Public Methods ============================ */


/**
  * init - constructor for generic table component
  *
  * @param  {type} options {
  *   'div': 'DOM element that table is to be loaded in',
  *   'data': dirData,
  *   'renderer': null,
  *   'headers': {
  *     'names': ['Data Depth', 'Item', 'Description'],
  *     'renderer': null
  *   },
  *   'rows': {
  *     'renderer': null
  *   }
  *   'cells': {
  *     'onClick': null,
  *     'onDblClick': null,
  *     'onHover': null,
  *     'renderer': null
  *   }
  * }
  * @return {}
  */
function init(options) {
  // Create DOM fragment
  const frag = document.createDocumentFragment();
  // Create table
  const table = _addTable(frag, options);
  // Add table headers
  _addHeaders(table, options);
  // Add table data
  _addRows(table, options);
  // Append fragment to DOM
  const div = document.getElementById(options.div);
  div.appendChild(table);
}

/* =========================== Export Public APIs =========================== */

export default {
  init
};
