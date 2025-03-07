const IN_JSON = [];
function processTable(table,fileName) {
  const data = {
    'table' : table,
    'head_row' : 0,
    'head_col' : 0,
    'columns' : {}
  };
  headRow = -1;
  headCol = -1;
  for (let row of table) {
    console.log(row);
  }

  IN_JSON.push(table);
  console.log(fileName);
  console.log(IN_JSON.length);
  return 1;
}

// To avoid module not defined error when running in browser
if (typeof module == 'undefined') { var module = {}; }
module.exports = { processTable }; 