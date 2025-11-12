/**
 * Google Apps Script for Nepal Jyotish Contact Form
 * 
 * This script receives POST requests from the Cloudflare Worker
 * and writes contact form submissions to a Google Sheet.
 * 
 * Setup Instructions:
 * 1. Create a new Google Sheet
 * 2. Add headers in row 1: Timestamp, Name, Email, Description, Source, User Agent, IP
 * 3. Go to Extensions > Apps Script
 * 4. Replace the default code with this script
 * 5. Deploy as a web app with execute permissions set to "Anyone"
 * 6. Copy the deployment URL and use it as GOOGLE_SHEETS_WEBHOOK_URL in Cloudflare Worker
 */

// Main function to handle POST requests
function doPost(e) {
  try {
    // Get the active sheet (first sheet in the spreadsheet)
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Validate required fields
    if (!data.name || !data.email || !data.description) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Missing required fields'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Add row to the sheet
    // Format: Timestamp, Name, Email, Description, Source, User Agent, IP
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.name,
      data.email,
      data.description,
      data.source || 'Contact Form',
      data.userAgent || 'Unknown',
      data.ip || 'Unknown'
    ]);
    
    // Log for debugging (optional)
    console.log('Contact form submission added:', data.name, data.email);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Contact form submitted successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log the error
    console.error('Error processing contact form:', error);
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'Failed to process contact form submission'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: Function to set up the sheet with proper headers
function setupSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Clear existing content (optional)
  sheet.clear();
  
  // Set headers
  const headers = [
    'Timestamp',
    'Name', 
    'Email',
    'Description',
    'Source',
    'User Agent',
    'IP Address'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#f0f0f0');
  
  // Set column widths for better readability
  sheet.setColumnWidth(1, 150); // Timestamp
  sheet.setColumnWidth(2, 150); // Name
  sheet.setColumnWidth(3, 200); // Email
  sheet.setColumnWidth(4, 400); // Description
  sheet.setColumnWidth(5, 150); // Source
  sheet.setColumnWidth(6, 250); // User Agent
  sheet.setColumnWidth(7, 120); // IP
  
  console.log('Sheet setup completed with headers');
}

// Optional: Function to get recent submissions (for testing)
function getRecentSubmissions(limit = 10) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();
  
  if (lastRow <= 1) {
    return 'No submissions found';
  }
  
  const startRow = Math.max(2, lastRow - limit + 1);
  const numRows = lastRow - startRow + 1;
  
  const data = sheet.getRange(startRow, 1, numRows, 7).getValues();
  
  console.log('Recent submissions:');
  data.forEach((row, index) => {
    console.log(`${startRow + index}: ${row[0]} - ${row[1]} (${row[2]})`);
  });
  
  return `Found ${data.length} recent submissions`;
}

// Optional: Test function to simulate a form submission
function testSubmission() {
  const testData = {
    timestamp: new Date().toISOString(),
    name: 'Test User',
    email: 'test@example.com',
    description: 'This is a test submission to verify the Google Apps Script is working correctly.',
    source: 'Manual Test',
    userAgent: 'Test Script',
    ip: '127.0.0.1'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  console.log('Test result:', result.getContent());
  
  return result.getContent();
}

/**
 * DEPLOYMENT INSTRUCTIONS:
 * 
 * 1. Create a new Google Sheet for collecting contact form submissions
 * 2. Go to Extensions > Apps Script in your Google Sheet
 * 3. Delete the existing code and paste this script
 * 4. Save the script with a name like "Nepal Jyotish Contact Form Handler"
 * 5. Run the setupSheet() function once to create proper headers
 * 6. Deploy the script:
 *    - Click "Deploy" > "New deployment"
 *    - Choose "Web app" as the type
 *    - Set execute as "Me"
 *    - Set access to "Anyone" (this allows the Cloudflare Worker to send data)
 *    - Click "Deploy"
 * 7. Copy the web app URL and use it as GOOGLE_SHEETS_WEBHOOK_URL in your Cloudflare Worker
 * 8. Test using the testSubmission() function
 * 
 * SECURITY NOTES:
 * - The web app is set to "Anyone" access to allow external requests
 * - Consider adding additional validation if needed
 * - Monitor the sheet for spam or abuse
 * - You can always revoke the deployment if needed
 * 
 * TROUBLESHOOTING:
 * - If you get permission errors, make sure the script has access to Google Sheets
 * - Check the execution transcript in Apps Script for detailed error logs
 * - Use the testSubmission() function to verify the script works
 * - Use getRecentSubmissions() to view recent form submissions
 */