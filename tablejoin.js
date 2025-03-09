/**
 * @file tablejoin javascript library.
 * See {@link https://github.com/midstar/xlsxjoin} for a full description.
 * @copyright Joel Midstjärna 2025
 * @license MIT
 */

/** Main class.
 *
 */
class TableJoin {

  /**
   * @param {Object} sheetJsLib - SheetJs library (XLSX)
   */
  constructor(sheetJsLib) {
    this.xlsxlib = sheetJsLib;
    this.tables = [];
  }

  /**
   * Convert a 'binary' in CSV or Excel format to a row matrix
   * @param {binary} binaryData - Binary data in CSV or Excel format
   * @return {Object[][]} An array rows where each row is an array of columns
   */
  binaryToRows(binaryData) {
    const wb = this.xlsxlib.read(binaryData, {type: 'binary'});
    const sheet = wb.Sheets[wb.SheetNames[0]];
    return this.xlsxlib.utils.sheet_to_json(sheet, { header: 1 });
  }

  /**
   * Create and add a table based binary CSV or EXcel data. Add it to the internal
   * Table memory.
   * @param {binary} binaryData - Binary data in CSV or Excel format
   * @return {Table} The created table
   */
  addTableByBinary(binaryData,fileName) {
    return this.addTableByRows(this.binaryToRows(binaryData),fileName);
  }

  /**
   * Create and add a table based on row matrix. Add it to the internal
   * Table memory.
   * @param {Object[][]} rows - An array rows where each row is an array of columns
   * @return {Table} The created table
   */
  addTableByRows(rows,fileName) {
    const table = new Table(rows,fileName);
    this.tables.push(table);
    return table;
  }

  /**
   * Check if rows has row
   * 
   * @param {Object[][]} rows - An array rows where each row is an array of columns 
   * @param {Object[]} row - row to check
   */
  hasRow(rows, row) {
    for (const row2 of rows) {
      if (row.length == row2.length) {
        for (let i = 0 ; i < row.length ; i++) {
          if (row[i] != row2[i]) {
            break;
          }
          if (i == (row.length - 1)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * Extend table 1 with table 2. This is only suitable for tables
   * that has exactly the same columns. Duplicated rows in table1
   * are ignored.
   * 
   * @param {Table} table1 - First table
   * @param {Table} table2 - Second table
   * @return {Table} The new table
   */
  extendTable(table1, table2) {
    const rows = [];
    for (const row of table1.rows) {
      rows.push(row);
    }
    for (const row of table2.rows) {
      if (this.hasRow(rows,row) == false) {
        rows.push(row);
      }
    }
    return new Table(rows,'new.xlsx')
  }
}

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

// Helper function (returns undefined as empty string)
function strVal(val) {
  if (val == undefined) {
    return '';
  }
  return String(val);
}

// To avoid module not defined error when running in browser
if (typeof module == 'undefined') { var module = {}; }
module.exports = { TableJoin }; 