const XLSX = require("../xlsx.full.min");
const { TableJoin } = require('../tablejoin');
const FS   = require("node:fs");

test('Binary read', function() {
  const tj = new TableJoin(XLSX);

  // CSV
  const csvData = FS.readFileSync('test/Test1.csv',{encoding: "binary", flag: "r"});
  const csvTable = tj.addTableByBinary(csvData,'Test1.csv');
  expect(tj.hasRow(csvTable.rows,['OEZAA','44','Paityn Harmon [C]','Speciality Engineering'])).toEqual(true);

  // XLSX
  const xlsxData = FS.readFileSync('test/Test2.xlsx',{encoding: "binary", flag: "r"});
  const xlsxTable = tj.addTableByBinary(xlsxData,'Test2.xlsx');
  expect(tj.hasRow(xlsxTable.rows,['Orlando Wright','7','OEZABB'])).toEqual(true);
});

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

  // Check for headings
  const headings = table.getHeadings();
  expect(headings.length).toEqual(5); 
  expect(headings[0]).toEqual('heading1'); 
  expect(headings[1]).toEqual('heading2'); 
  expect(headings[2]).toEqual(undefined); 
  expect(headings[3]).toEqual('heading3'); 
  expect(headings[4]).toEqual('heading4'); 

  // Check for key headings
  const keyHeadings = table.getKeyHeadings();
  expect(keyHeadings.length).toEqual(2); 
  expect(keyHeadings[0]).toEqual('heading2'); 
  expect(keyHeadings[1]).toEqual('heading3'); 
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

test('Identify common key heading', function() {
  const tj = new TableJoin(XLSX);
  const table1 = tj.addTableByRows([
    ['heading1',  'heading2', 'heading3'],
    ['a',         'd',        'g'],
    ['b',         'e',        'h'],
    ['c',         'f',        'i']
  ], '');
  const table2 = tj.addTableByRows([
    ['headingA',  'heading1', 'headingC'],
    ['e',         'c',        'i'],
    ['w',         'd',        'h'],
    ['a',         'e',        'i']
  ], '');
  let keyHeadings = tj.getKeyHeadings();
  expect(keyHeadings.length).toEqual(1);
  expect(keyHeadings[0]).toEqual('heading1');
});

test('Identify common key heading failure', function() {
  const tj = new TableJoin(XLSX);
  const table1 = tj.addTableByRows([
    ['heading1',  'heading2', 'heading3'],
    ['a',         'd',        'g'],
    ['b',         'e',        'h'],
    ['c',         'f',        'i']
  ], '');
  const table2 = tj.addTableByRows([
    ['headingA',  'heading1', 'headingC'],
    ['e',         'c',        'i'],
    ['w',         'c',        'h'], // Heading 1 not unique
    ['a',         'e',        'i']
  ], '');
  expect(() => { tj.getKeyHeadings(); }).toThrow('No common key column identified');
});

test('Predefined key heading', function() {
  const tj = new TableJoin(XLSX);
  const table1 = tj.addTableByRows([
    ['heading1',  'heading2', 'heading3'],
    ['a',         'a',        'a'],
    ['b',         'b',        'b'],
    ['a',         'c',        'a']
  ], 't1');
  const table2 = tj.addTableByRows([
    ['heading1',  'heading2', 'heading4'],
    ['c',         'a',        'a'],
    ['d',         'b',        'b'],
    ['c',         'c',        'a']
  ], 't2');
  tj.keyHeadings = ['heading1'];
  let keyHeadings = tj.getKeyHeadings();
  expect(keyHeadings.length).toEqual(1);
  expect(keyHeadings[0]).toEqual('heading1');

  tj.keyHeadings = ['heading2'];
  keyHeadings = tj.getKeyHeadings();
  expect(keyHeadings.length).toEqual(1);
  expect(keyHeadings[0]).toEqual('heading2');

  tj.keyHeadings = ['heading1','heading2'];
  keyHeadings = tj.getKeyHeadings();
  expect(keyHeadings.length).toEqual(2);
  expect(keyHeadings[0]).toEqual('heading1');
  expect(keyHeadings[1]).toEqual('heading2');

  tj.keyHeadings = ['heading1','heading3'];
  expect(() => { tj.getKeyHeadings(); }).toThrow('t2 is missing column heading3');
});