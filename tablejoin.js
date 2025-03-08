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
    this.rows = rows;
    this.fileName = fileName;
  }

  toHTML() {
    let html = '<table>';
    // Heading row
    html += '<tr>';
    for (const col of this.rows[0]) {
      html += '<th>';
      html += String(col);
      html += '</th>';
    }
    html += '</tr>';
    // Remaining rows
    for (let i = 1 ; i < this.rows.length ; i++) {
      html += '<tr>';
      for (const col of this.rows[i]) {
        html += '<td>';
        html += String(col);
        html += '</td>';  
      }  
      html += '</tr>';    
    }
    html += '</table>';
    return html;
  }
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