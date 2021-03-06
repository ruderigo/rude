// Base code source from https://blog.gsmart.in/send-email-when-cell-value-changes-in-google-sheets/
// The code is modified to handle HTML in the body of the email 
// This is the first time I succeeded in overhauling a code on my own, I am sorry if I cannot explain everything. I will get there!
// Note that you should not try to call on merged cells, you will end up with empty data

//A = Trigger function 
function triggerOnEdit(e)
{
  showMessageOnApproval(e);
}
function showMessageOnApproval(e)
{
  var edited_row = checkStatusIsApproved(e);
  if(edited_row > 0)
  {
    SpreadsheetApp.getUi().alert("Event on row# "+edited_row+" is validated, time to book!");
  }
}

//B = Data Validation on the key "Validated" for trigger
function checkStatusIsApproved(e)
{
  var range = e.range;
  //1 Here we specify which column to look into
  if(range.getColumn() <= 6 && 
     range.getLastColumn() >=6 )
  {
    //2 Here we assign function to read the row 
    var edited_row = range.getRow();
    
    //3 IF in 1+2 = Validated 
    var status = SpreadsheetApp.getActiveSheet().getRange(edited_row,6).getValue();
    if(status == 'Validated')
    {
      return edited_row;
    }
  }
  return 0;
}

//C = Email data - Take B and put it in the function to send it by email
function sendEmailOnApproval(e)
{
  var approved_row = checkStatusIsApproved(e);
  
  if(approved_row <= 0)
  {
    return;
  }
  
  sendEmailByRow(approved_row);
}

//Gather the result from the Row and send the email
function sendEmailByRow(row)
{
    //Range of data to define in order to create content
    var values = SpreadsheetApp.getActiveSheet().getRange(row,1,row,8).getValues();
  
    var row_values = values[0];
    
    //All "row_values" called as "mail"
    var mail = composeApprovedEmail(row_values);
    
    //Function to send the email and it's content *This is the modified bit for the HTML BODY* 
    MailApp.sendEmail({
    to: admin_email,
    subject: mail.subject,
    message: mail.message,
    htmlBody : mail.message,
  });
}

//Email Content from the getRow function once validate through the key "validated"
function composeApprovedEmail(row_values)
{
    //fetch specific cell starting from the left of the row - first cell = 0
    var event_name = row_values[2];
    var time = row_values[4];
    var date = row_values[1];
    var hours = row_values[7];
    var month = row_values[0];
    var venue = row_values[3];
    //Body of the email
    var message = "The following event time is confirmed by the bout committee <br><strong>Event:</strong> "+event_name+" <br><strong>Date:</strong> "+date+" "+month+" "+time+"<br><strong>Venue:</strong> "+venue;
    //Subect of the email
    var subject = "Bout confirmed hours for event "+event_name+" "+date+" "+month+" "+time
    
    //Don't know - another loop?
    return({
    message:message,
    subject:subject
  });
}

//Send Email function on trigger
function triggerOnEdit(e)
{
  sendEmailOnApproval(e);
}

//Create Variable to use as email in all functions  
var admin_email='destination@email.com';
