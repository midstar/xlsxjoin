///////////////////////////////////////////////////////////////////////////////
// xlsxjoin command line tool
///////////////////////////////////////////////////////////////////////////////
const XLSX = require("./xlsx.full.min");
const { TableJoin } = require('./tablejoin');
const FS   = require("node:fs");

//const fileData = FS.readFileSync('test/Test1.csv').buffer;
const fileData = FS.readFileSync('test/Test1.csv',{encoding: "binary", flag: "r"});
const tableJoin = new TableJoin(XLSX);
const table = tableJoin.addTableByBinary(fileData,'Test1.xlsx');
console.log(table);
//console.log(table.toHTML());

