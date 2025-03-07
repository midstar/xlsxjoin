///////////////////////////////////////////////////////////////////////////////
// xlsxjoin command line tool
///////////////////////////////////////////////////////////////////////////////
const XLSX = require("./xlsx.full.min");
const { addTable } = require('./tablejoin');
const FS   = require("node:fs");

function excelToRows(fileData) {
  try {
    var wb = XLSX.read(fileData, {type: 'binary'});
  } catch (err) {
    console.log(err);
    return undefined;
  }

  var sheet = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, { header: 1 });
}

const fileData = FS.readFileSync('test/Test1.xlsx').buffer;
const rows = excelToRows(fileData);
const table = addTable(rows,'teams.xlsx')
console.log(table.toHTML())

