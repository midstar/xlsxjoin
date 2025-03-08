const { addTable } = require('../tablejoin');

test('HTML conversion', function() {
  const table = addTable([[1,2],['a','b']], '');
  expect(table.toHTML()).toEqual('<table><tr><th>1</th><th>2</th></tr><tr><td>a</td><td>b</td></tr></table>');
  const table2 = addTable([[1,2],[,'b']], '');
  expect(table2.toHTML()).toEqual('<table><tr><th>1</th><th>2</th></tr><tr><td></td><td>b</td></tr></table>');
});

test('Empty rows', function() {
  // Ending with empty rows
  expect(addTable([[1,2],['a','b'],[],[]], '').rows.length).toEqual(2);
  // Empty rows in middle
  expect(addTable([[1,2],['a','b'],[],[],['c','d']], '').rows.length).toEqual(3);
  // Empty heading
  expect(addTable([[],[1,2],['a','b']]).rows.length).toEqual(2);
  // Empty table (=Exception)
  expect(() => { addTable([]); }).toThrow('Table has 0 rows. At least two rows are required.');
  // Only one row (=Exception)
  expect(() => { addTable([[1,2]]); }).toThrow('Table has 1 rows. At least two rows are required.');

});