///////////////////////////////////////////////////////////////////////////////
// xlsxjoin command line tool
///////////////////////////////////////////////////////////////////////////////
const XLSX = require("./xlsx.full.min");
const { processTable } = require('./tablejoin');
const FS   = require("node:fs");

async function excelToJson(fileData) {
  try {
    var wb = XLSX.read(fileData, {type: 'binary'});
  } catch (err) {
    console.log(err);
    return undefined;
  }

  var sheet = wb.Sheets[wb.SheetNames[0]];
  var rows = await XLSX.utils.sheet_to_json(sheet, { header: 1 });
  return rows;
}

(async() => {
  const fileData = FS.readFileSync('test/Test1.xlsx').buffer;
  const json = await excelToJson(fileData);
  processTable(json,'teams.xlsx')
})();

