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