const { processTable } = require('../tablejoin');

test('should add numbers correctly', function() {
  console.log('Hello')
  expect(processTable([[1,2,3,4],['a','b','c','d']], 'joel.xlsx')).toEqual(1);
});