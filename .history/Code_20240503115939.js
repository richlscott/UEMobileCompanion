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
  //Logger.log(formattedData)
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

    // Check if all values in the row are empty
    var isRowEmpty = row.every(function(value) {
      return value === '';
    });

    // If the row is not empty, format it and add it to the array
    if (!isRowEmpty) {
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
      // Modify the "Last Updated" message based on the result
      rowData['Last_Updated'] = modifyLastUpdatedMessage(rowData['Last_Updated']);
      formattedData.push(rowData);
    }
  }

  return formattedData;
}

// Function to modify the "Last Updated" message based on the result
function modifyLastUpdatedMessage(lastUpdatedValue) {
  var message;
  // Convert last updated value to number for comparison
  var lastUpdatedNumber = parseFloat(lastUpdatedValue);
  if (lastUpdatedNumber <= 0) {
    message = "Today";
  } else if (lastUpdatedNumber === 1) {
    message = "1 day ago";
  } else {
    message = lastUpdatedNumber + " days ago";
  }
  return message;
}



function getTransactionsData() {
    var sheetName = 'Transactions';
    var sourceSpreadsheet = SpreadsheetApp.openById(sourceSpreadsheetID);
    var sheet = sourceSpreadsheet.getSheetByName(sheetName);

    // Define the starting row and column index
    var startRow = 1; // Start from row 1
    var startColumn = 2; // Start from column B

    var dataRange = sheet.getRange(startRow, startColumn, 1000, 4); // Adjust the range as needed
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
  Logger.log(month +" - " + year)
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


function updateTransactions(data) {
  // Assuming 'data' contains the updated transactions data

  // Open the spreadsheet
  var sourceSpreadsheet = SpreadsheetApp.openById(sourceSpreadsheetID); 
  
  // Access the Transactions sheet
  var sheet = sourceSpreadsheet.getSheetByName("Transactions"); // Assuming the sheet name is "Transactions"

  // Assuming the first row is header and we start updating from the second row
  var startRow = 2;

  // Assuming the structure of the 'data' parameter:
  // data should be an array of objects, where each object represents a transaction
  // Each object should have keys corresponding to the column headers in the sheet

  // Loop through each transaction in the data array and update the corresponding row in the sheet
  for (var i = 0; i < data.length; i++) {
    var transaction = data[i];
    
    // Assuming the structure of the transaction object matches the column headers in the sheet
    // For example, if the sheet has columns 'Date', 'Amount', 'Category', 'Description', etc.
    // The transaction object should have properties like 'Date', 'Amount', 'Category', 'Description', etc.

    // Assuming 'Transaction ID' is used to identify transactions
    var transactionId = transaction['Transaction ID'];

    // Find the row index of the transaction with the matching Transaction ID
    var rowIndex = getRowIndexByTransactionId(sheet, transactionId);

    if (rowIndex !== -1) {
      // Update the values in the corresponding row
      sheet.getRange(startRow + rowIndex, 2, 1, Object.keys(transaction).length).setValues([Object.values(transaction)]);
    }
  }
}

// Function to get the row index of a transaction by its Transaction ID
function getRowIndexByTransactionId(sheet, transactionId) {
  // Get the data range
  var range = sheet.getDataRange();
  var values = range.getValues();
  
  // Loop through the first row to find the Transaction ID column index
  var headerRow = values[0];
  var transactionIdColumnIndex = -1;
  for (var i = 0; i < headerRow.length; i++) {
    if (headerRow[i] === 'Transaction ID') { // Modify this condition to match the header of your Transaction ID column
      transactionIdColumnIndex = i + 1; // Adjust to 1-based index
      break;
    }
  }
  
  // If Transaction ID column is found, search for the transaction ID in that column
  if (transactionIdColumnIndex !== -1) {
    for (var j = 0; j < values.length; j++) {
      if (values[j][transactionIdColumnIndex - 1] === transactionId) {
        return j;
      }
    }
  }
  
  return -1; // Return -1 if transaction ID is not found
}


function getNetWorthData() {
  var sheetName = 'Account Calculations';
  var sourceSpreadsheet = SpreadsheetApp.openById(sourceSpreadsheetID);
  var sheet = sourceSpreadsheet.getSheetByName(sheetName);
  var assets = sheet.getRange('B6').getValue();
  var liabilities = sheet.getRange('B7').getValue();
  
  return { assets: assets, liabilities: liabilities };
}







