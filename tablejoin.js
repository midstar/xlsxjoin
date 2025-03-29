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
    this.keyHeadings = undefined;
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
   * 
   * @param {Object[]} row1 - first row
   * @param {Object[]} row2 - second row
   * @returns {boolean} - True if equal
   */
  rowEquals(row1,row2) {
    if (row1.length == row2.length) {
      for (let i = 0 ; i < row1.length ; i++) {
        if (row1[i] != row2[i]) {
          return false;
        }
        if (i == (row1.length - 1)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Check if rows has row
   * 
   * @param {Object[][]} rows - An array rows where each row is an array of columns 
   * @param {Object[]} row - row to check
   * @returns {boolean} - True if row found
   */
  hasRow(rows, row) {
    for (const row2 of rows) {
      if (this.rowEquals(row,row2)) {
        return true;
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
    return new Table(rows,'new.xlsx');
  }

  /**
   * Set key columns. If more than one, the combination of
   * them is the unique key for each row.
   * 
   * If not set, the key columns will be auto detected.
   * 
   * @param {Object[]} keyHeadings - Set predefined key columns
   */
  setKeyHeadings(keyHeadings) {
    this.keyHeadings = keyHeadings;
  }

  /**
   * Get the key headings. 
   * 
   * If predefined (with setKeyHeadings) it will be validated that 
   * all tables have these headings or an Exception will be thrown.
   * 
   * If not predefined, it will be auto detected.
   * 
   * @return {Object[]} Key headings
   */
  getKeyHeadings() {
    if (this.keyHeadings != undefined) {
      // All tables needs to have these column(s) or else it is
      // an error
      for (const table of this.tables) {
        const headings = table.getHeadings();
        for (const keyHeading of this.keyHeadings) {
          if (headings.includes(keyHeading) == false) {
            throw Error(`${table.fileName} is missing column ${keyHeading}`);
          }
        }
      }
      return this.keyHeadings;
    } else {
      // Identify common key heading in all tables. 
      const firstKeyHeadings = this.tables[0].getKeyHeadings();
      let keyHeadings = new Set(firstKeyHeadings);
      for (let i = 1 ; i < this.tables.length ; i++) {
        const otherKeyHeadings = new Set(this.tables[i].getKeyHeadings());
        keyHeadings = new Set([...keyHeadings].filter((j) => otherKeyHeadings.has(j)));
        if (keyHeadings.size == 0) {
          throw Error('No common key column identified');
        }
      }

      // Return first common key heading in first table
      for (const keyHeading of firstKeyHeadings) {
        keyHeadings.has(keyHeading);
        return [keyHeading];
      }
    }
  }

  /**
   * Join all tables
   */
  join() {
    if (this.tables.length == 0) {
      return undefined;
    }
    var table = this.tables[0];
    for (let i = 1 ; i < this.tables.length ; i++) {
      if (this.rowEquals(table.rows[0],this.tables[i].rows[0])) {
        table = this.extendTable(table, this.tables[i]);
      } else {
        throw Error('Merge not implemented yet');
      }
    }
    return table;
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

  /**
   * Check if column "could" be a key column, i.e.
   * all values are unique and non is undefined.
   * 
   * @param {int} colIndex - Column to check
   * @return {boolean} True if key column
   */
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

  /**
   * Get all headings (column 0 value)
   */
  getHeadings() {
    const result = [];
    for (const heading of this.rows[0]) {
      result.push(heading);
    }
    return result;
  }

  /**
   * Get headings of all key columns
   * 
   * @return {Object[]} Headings (= column 0 value) for all key columns
   */
  getKeyHeadings() {
    const result = [];
    for (let i = 0 ; i < this.rows[0].length ; i++) {
      if (this.isKey(i)) {
        result.push(this.rows[0][i]);
      }
    }
    return result;
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