const { addTable } = require('../tablejoin');

test('html conversion', function() {
  const table = addTable([[1,2],['a','b']], 'test.xlsx');
  expect(table.toHTML()).toEqual('<table><tr><th>1</th><th>2</th></tr><tr><td>a</td><td>b</td></tr></table>');
});