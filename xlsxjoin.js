///////////////////////////////////////////////////////////////////////////////
// xlsxjoin command line tool
///////////////////////////////////////////////////////////////////////////////
const XLSX = require("./xlsx.full.min");
const { TableJoin } = require('./tablejoin');
const FS   = require("node:fs");

//const fileData = FS.readFileSync('test/Test1.csv').buffer;
const fileData = FS.readFileSync('test/Test1.csv',{encoding: "binary", flag: "r"});
const tableJoin = new TableJoin(XLSX);
//console.log(fileData);
//const rows = excelToRows(fileData);
const rows = tableJoin.binaryToRows(fileData);
const table = tableJoin.addTableByRows(rows,'Test1.xlsx');
console.log(table);
//console.log(table.toHTML());

