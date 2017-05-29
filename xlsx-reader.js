var xls = require('xlsx');
var Config = require('../config');


module.exports = {
  // Asynchronous function creating a JSON list from the data of Config.xlsx.Config.xlsx.filename
  createJSON: function(callback){
    setTimeout(function(){
      // Open XLSX file and get list of rows from the selected sheet:
      var workbook = xls.readFile(Config.xlsx.filename);
      var sheet_name = workbook.SheetNames[Config.xlsx.sheet_number];
      var sheet = workbook.Sheets[sheet_name];
      var rows = xls.utils.sheet_to_json(sheet);

      // Loop over all rows, for each elemet create a JSON element and add
      // it to persons_list
      var persons_list = [];
      person_id = 0;
      rows.slice(Config.xlsx.number_of_rows_until_data).forEach(function(row) {
          persons_list.push(createJSONElement(row, person_id));
          person_id++;
      });
      callback(persons_list);
    }, 0 );
  }
}
// Help function using the Config.xlsx.map_excel_name_db to create the same JSON as the
// database would have
function createJSONElement(row, id){
  return {
    'startDate': row[Config.xlsx.map_excel_name_db.startDate],
    'stopDate': row[Config.xlsx.map_excel_name_db.stopDate],
    'personId': id,
    'personNumber': row[Config.xlsx.map_excel_name_db.personNumber],
    'startJob': row[Config.xlsx.map_excel_name_db.startJob],
    'startCode': row[Config.xlsx.map_excel_name_db.startCode],
    'stopJob': row[Config.xlsx.map_excel_name_db.stopJob],
    'stopCode': row[Config.xlsx.map_excel_name_db.stopCode],
    'svfType': row[Config.xlsx.map_excel_name_db.svfType],
  };
}
