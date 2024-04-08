var sourceSpreadsheetID = getSheetIdFromProperties()


// Google Apps Script code



// Function to serve HTML content
function doGet() {
  // Retrieve accent color property value
  var sheetId = getSheetIdFromProperties();
  var sheetName = getSheetNameFromId(sheetId);
  var accentColor = getAccentColorProperty();
  
  // Retrieve month and year values from the Envelopes sheet
  var envelopeValues = getMonthAndYearValues(sheetId);
  var month = envelopeValues.month;
  var year = envelopeValues.year;
  
  // Create HTML template
  var template = HtmlService.createTemplateFromFile('index');
  template.accentColor = accentColor; // Pass accent color to template
  template.sheetId = sheetId; // Pass sheet ID to template
  template.sheetName = sheetName; // Pass sheet name to template
  template.year = year; // Pass year to template
  template.month = month; // Pass month to template

  
  // Evaluate and return HTML content
  return template.evaluate()
    .setTitle('Ultimate Envelopes')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}




function getSheetNameFromId(sheetId) {
  var spreadsheet = SpreadsheetApp.openById(sheetId);
  return spreadsheet.getName();
}

function getCookieValue(request, name) {
  var cookie = request ? request.parameter.headers.Cookie : null;
  if (cookie) {
    var cookies = cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookieParts = cookies[i].trim().split('=');
      if (cookieParts[0] === name) {
        return decodeURIComponent(cookieParts[1]);
      }
    }
  }
  return null;
}



function getSheetIdFromProperties() {
  var properties = PropertiesService.getScriptProperties();
  return properties.getProperty('sheetId');
}

function setSheetId(newSheetId) {
  var properties = PropertiesService.getScriptProperties();
  properties.setProperty('sheetId', newSheetId);
}

function setAccentColorToProperty(accentColor) {
  var properties = PropertiesService.getScriptProperties();
  properties.setProperty('accentColor', accentColor);
}
// Function to get accent color property value
function getAccentColorProperty() {
   var properties = PropertiesService.getScriptProperties();
  return properties.getProperty('accentColor');
}

function getEnvelopesData() {
  var sheetName = 'Envelope Calculations';
  var sourceSpreadsheet = SpreadsheetApp.openById(sourceSpreadsheetID);
  var sheet = sourceSpreadsheet.getSheetByName(sheetName);

    // Define the starting row and column index
  var startRow = 3; // Start from row 3 (D3)
  var startColumn = 4; // Start from column D (index 4)

  // Calculate the number of rows and columns in the data range
  var numRows = sheet.getLastRow() - startRow + 1;
  var numColumns = sheet.getLastColumn() - startColumn + 1;
   // Get the range containing data starting from D3
  var dataRange = sheet.getRange(startRow, startColumn, numRows, 20);
  var values = dataRange.getValues();

  // Extract headers from the first row
  var headers = values[0];
  //Logger.log(headers)

  // Prepare an array to hold the formatted data
  var formattedData = [];

  // Iterate over the remaining rows and format each row as an object
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    var rowData = {};

    // Iterate over each header and replace spaces with underscores
    for (var j = 0; j < headers.length; j++) {
      var header = headers[j];
      if (typeof header === 'string') {
        // Replace spaces with underscores in the header
        var formattedHeader = header.replace(/\s+/g, '_');
        rowData[formattedHeader] = row[j];
      } else {
        rowData[header] = row[j];
      }
    }
    formattedData.push(rowData);
  }
  Logger.log(formattedData)
  return formattedData;
 
}

function getBalancesData() {
  var sheetName = 'Account Calculations';
  var sourceSpreadsheet = SpreadsheetApp.openById(sourceSpreadsheetID);
  var sheet = sourceSpreadsheet.getSheetByName(sheetName);

      // Define the starting row and column index
  var startRow = 3; // Start from row 3 (D3)
  var startColumn = 4; // Start from column D (index 4)

  // Calculate the number of rows and columns in the data range
  var numRows = sheet.getLastRow() - startRow + 1;
  var numColumns = sheet.getLastColumn() - startColumn + 1;
  

  // Get the range containing data starting from D3
  var dataRange = sheet.getRange(startRow, startColumn, numRows, 10);
  var values = dataRange.getValues();


// Extract headers from the first row
  var headers = values[0];

  // Prepare an array to hold the formatted data
  var formattedData = [];

  // Iterate over the remaining rows and format each row as an object
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    var rowData = {};

    // Iterate over each header and replace spaces with underscores
    for (var j = 1; j < headers.length; j++) {
      var header = headers[j];
      if (typeof header === 'string') {
        // Replace spaces with underscores in the header
        var formattedHeader = header.replace(/\s+/g, '_');
        rowData[formattedHeader] = row[j];
      } else {
        rowData[header] = row[j];
      }
    }
    formattedData.push(rowData);
  }
 Logger.log(formattedData)
  return formattedData;
}


function getTransactionsData() {
    var sheetName = 'Transactions';
    var sourceSpreadsheet = SpreadsheetApp.openById(sourceSpreadsheetID);
    var sheet = sourceSpreadsheet.getSheetByName(sheetName);

    // Define the starting row and column index
    var startRow = 1; // Start from row 1
    var startColumn = 2; // Start from column B

    var dataRange = sheet.getRange(startRow, startColumn, 200, 4); // Adjust the range as needed
    var values = dataRange.getValues();

    // Extract headers from the first row
    var headers = values[0];

    // Prepare an array to hold the formatted data
    var formattedData = [];

    // Iterate over the remaining rows and format each row as an object
    for (var i = 1; i < values.length; i++) {
        var row = values[i];
        var rowData = {};

        // Iterate over each header and replace spaces with underscores
        for (var j = 0; j < headers.length; j++) {
            var header = headers[j];
            if (typeof header === 'string') {
                // Replace spaces with underscores in the header
                var formattedHeader = header.replace(/\s+/g, '_');
                rowData[formattedHeader] = row[j];
            } else {
                rowData[header] = row[j];
            }
        }
        // Log the type of the "Date" field
      
        // Check if rowData['Date'] is a Date object before formatting
        if (rowData['Date'] instanceof Date) {
            // Convert the date to text in the format "MM/DD/YYYY"
            var formattedDate = Utilities.formatDate(rowData['Date'], Session.getScriptTimeZone(), 'MM/dd/yyyy');
            // Enclose the formatted date in quotes
            rowData['Date'] = formattedDate;
        }

        formattedData.push(rowData);
    }
    
    return formattedData;
}


function updateSheetValues(year, month) {
  var sourceSpreadsheet = SpreadsheetApp.openById(sourceSpreadsheetID); 
  var sheet = sourceSpreadsheet.getSheetByName('Envelope'); // Replace 'Sheet1' with the name of your sheet
  
  // Update the cells with the new year and month values
  sheet.getRange('B5').setValue(year);
  sheet.getRange('B6').setValue(month);
}

// Function to get month and year values from the Envelopes sheet by sheet ID
function getMonthAndYearValues(sheetId) {
  var ss = SpreadsheetApp.openById(sheetId);
  var envelopeSheet = ss.getSheetByName("Envelope");
  var monthRange = envelopeSheet.getRange("B6");
  var yearRange = envelopeSheet.getRange("B5");
  var month = monthRange.getValue();
  var year = yearRange.getValue();
  return { month: month, year: year };
}






//{Amount:7890.01, Date:"04/01/2024", Description:"Deposit Informatica Corp", Category:""}, 
//{Description:"Chick-fil-a #x4062", Date:"03/29/2024", Amount:-8.47, Category:"Test"}, 



