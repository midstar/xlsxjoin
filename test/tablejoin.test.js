const XLSX = require("../xlsx.full.min");
const { TableJoin } = require('../tablejoin');

test('HTML conversion', function() {
  const tj = new TableJoin(XLSX);
  const table = tj.addTableByRows([[1,2],['a','b']], '');
  expect(table.toHTML()).toEqual('<table><tr><th>1</th><th>2</th></tr><tr><td>a</td><td>b</td></tr></table>');
  const table2 = tj.addTableByRows([[1,2],[,'b']], '');
  expect(table2.toHTML()).toEqual('<table><tr><th>1</th><th>2</th></tr><tr><td></td><td>b</td></tr></table>');
});

test('Empty rows', function() {
  const tj = new TableJoin(XLSX);
  // Ending with empty rows
  expect(tj.addTableByRows([[1,2],['a','b'],[],[]], '').rows.length).toEqual(2);
  // Empty rows in middle
  expect(tj.addTableByRows([[1,2],['a','b'],[],[],['c','d']], '').rows.length).toEqual(3);
  // Empty heading
  expect(tj.addTableByRows([[],[1,2],['a','b']]).rows.length).toEqual(2);
  // Empty table (=Exception)
  expect(() => { tj.addTableByRows([]); }).toThrow('Table has 0 rows. At least two rows are required.');
  // Only one row (=Exception)
  expect(() => { tj.addTableByRows([[1,2]]); }).toThrow('Table has 1 rows. At least two rows are required.');
});

test('Identify key column', function() {
  const tj = new TableJoin(XLSX);
  const table = tj.addTableByRows([
    ['heading1',  'heading2',       ,'heading3','heading4'],
    ['a',         'b',       'c',    'x',       'd'],
    ['a',         'a',       'h',    'y'],
    ['b',         'c',       'a',    'z',       'e'],
    ['c',         'd',       'd',    'f',       'f']
  ], '');
  expect(table.isKey(0)).toEqual(false); // Reoccuring values
  expect(table.isKey(1)).toEqual(true);  // All unique
  expect(table.isKey(2)).toEqual(false); // Empty heading
  expect(table.isKey(3)).toEqual(true);  // All unique
  expect(table.isKey(4)).toEqual(false); // Empty cell (row 2)
});

test('Check if row exists in other rows', function() {
  const tj = new TableJoin(XLSX);
  const rows = [
    ['heading1',  'heading2',       ,'heading3','heading4'],
    ['a',         'b',       'c',    'x',       'd'],
    ['a',         'a',       'h',    'y'],
    ['b',         'c',       'a',    'z',       'e'],
    ['c',         'd',       'd',    'f',       'f']
  ];
  expect(tj.hasRow(rows,[1,2,3])).toEqual(false);
  expect(tj.hasRow(rows, ['heading1','heading2',,'heading3','heading4'])).toEqual(true);
  expect(tj.hasRow(rows, ['a','b','c','x','d'])).toEqual(true);
  expect(tj.hasRow(rows, ['a','b','c','x'])).toEqual(false);
  expect(tj.hasRow(rows, ['c','b','c','x','d'])).toEqual(false);
  expect(tj.hasRow(rows, ['a','a','h','y'])).toEqual(true);
  expect(tj.hasRow(rows, ['a','a','h','y','c'])).toEqual(false);
  expect(tj.hasRow(rows, ['c','d','d','f','f'])).toEqual(true);
});

test('Extend table', function() {
  const tj = new TableJoin(XLSX);
  const table1 = tj.addTableByRows([
    ['heading1',  'heading2',       ,'heading3','heading4'],
    ['a',         'b',       'c',    'x',       'd'],
    ['a',         'a',       'h',    'y'],
    ['b',         'c',       'a',    'z',       'e'],
    ['c',         'd',       'd',    'f',       'f']
  ], '');
  const table2 = tj.addTableByRows([
    ['heading1',  'heading2',       ,'heading3','heading4'], // Same
    ['a',         'b',       'c',    'x',       'd'],        // Same
    ['a',         'a',       'h',    'y'],                   // Same
    ['b',         'q',       'a',    'z',       'e'],        // New
    ['c',         'd',       'd',    'f',       'f'],        // Same
    ['a',         'b',       'c',    'd,',      'e']         // New
  ], '');
  table = tj.extendTable(table1, table2);
  expect(table.rows.length).toEqual(7); 
  expect(tj.hasRow(table.rows, ['heading1','heading2',,'heading3','heading4'])).toEqual(true);
  expect(tj.hasRow(table.rows, ['a','b','c','x','d'])).toEqual(true);
  expect(tj.hasRow(table.rows, ['a','b','c','x'])).toEqual(false);
  expect(tj.hasRow(table.rows, ['b','q','a','z','e'])).toEqual(true);
  expect(tj.hasRow(table.rows, ['c','d','d','f','f'])).toEqual(true);
  expect(tj.hasRow(table.rows, ['a','b','c','d,','e'])).toEqual(true);
});