/**
 * @file tablejoin javascript library.
 * See {@link https://github.com/midstar/xlsxjoin} for a full description.
 * @copyright Joel Midstjärna 2025
 * @license MIT
 */

/** Class representing a table.
 *
 */

class Table {

  constructor(rows,fileName) {
    this.rows = [];
    for (const row of rows) {
      if (row.length > 0) {
        this.rows.push(row);
      }
    }
    if (this.rows.length < 2) {
      throw new Error(`Table has ${this.rows.length} rows. At least two rows are required.`);
    }
    this.fileName = fileName;
  }

  isKey(colIndex) {
    const values = new Set([]);
    for (const row of this.rows) {
      if (colIndex >= row.length) {
        return false;
      }
      const value = row[colIndex];
      if (value == undefined || values.has(value)) {
        return false;
      }
      values.add(value);
    }
    return true;
  }

  toHTML() {
    let html = '<table>';
    // Heading row
    html += '<tr>';
    for (const col of this.rows[0]) {
      html += '<th>';
      html += strVal(col);
      html += '</th>';
    }
    html += '</tr>';
    // Remaining rows
    for (let i = 1 ; i < this.rows.length ; i++) {
      html += '<tr>';
      for (const col of this.rows[i]) {
        html += '<td>';
        html += strVal(col);
        html += '</td>';  
      }  
      html += '</tr>';    
    }
    html += '</table>';
    return html;
  }
}

function strVal(val) {
  if (val == undefined) {
    return '';
  }
  return String(val);
}

const TABLES = [];

function addTable(rows,fileName) {
  const table = new Table(rows,fileName);
  TABLES.push(table);
  return table;
}

// To avoid module not defined error when running in browser
if (typeof module == 'undefined') { var module = {}; }
module.exports = { addTable }; 