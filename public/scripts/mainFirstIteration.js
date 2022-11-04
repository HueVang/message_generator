// Import data from JSON files
import guestInfo from '../data/Guests.json' assert {type: 'json'};
import companyInfo from '../data/Companies.json' assert {type: 'json'};
import messageTemplate from '../data/Messages.json' assert {type: 'json'};


$(function() {
  //console.log('Document Loaded');
  getList(guestInfo);
  getList(companyInfo);
  getList(messageTemplate);
}); // end doc ready

let guest;
let company;
let template;
let date;
let greeting;
let adjustedDateForTimezone;
let guestSelected = false;
let companySelected = false;
let templateSelected = false;
let customInput = false;
let templateIndex;
let messageOption1;
let messageOption2;
let messageOutput;


// CREATE GUEST AND COMPANY OBJECTS!!!!!!!!!!!!!!!!!!!!!

function getList(arr) {
  arr.forEach(function(obj) {
    var index = arr.indexOf(obj)
    if (arr == guestInfo) {
      $('#selectGuest').append(`<option value="${index}"> ${obj.firstName} ${obj.lastName} </option>`);
    } else if (arr == companyInfo) {
      $('#selectCompany').append(`<option value="${index}"> ${obj.company} - ${obj.city} </option>`);
    } else {
      $('#selectMessageTemplate').append(`<option value="${index}"> ${Object.values(obj)} </option>`);
    }
  });

  if (arr == messageTemplate) {
    $('#selectMessageTemplate').append(`<option value="${'Custom'}"> Custom </option>`);
  };
};

/*function getGuests(guestList) {
  guestList.forEach(function(guest) {
    var index = guestInfo.indexOf(guest);
    $('#selectGuest').append(`<option value="${index}"> ${guest.firstName} ${guest.lastName} </option>`);
  }); // end forEach function
}; // end displayTasks function

function getCompanies(companyList) {
  companyList.forEach(function(company) {
    var index = companyInfo.indexOf(company);
    $('#selectCompany').append(`<option value="${index}"> ${company.company} - ${company.city} </option>`);
  }); // end forEach function
}; // end displayTasks function

function getMessageTemplates(templateList) {
  templateList.forEach(function(template) {
    var index = messageTemplate.indexOf(template);
    $('#selectMessageTemplate').append(`<option value="${index}"> ${Object.values(template)} </option>`);
  }); // end forEach function
}; // end displayTasks function*/

function epochToLocalDate(time) {
  var utcSeconds = time;
  date = new Date(0);
  date.setUTCSeconds(utcSeconds);
  return date;
};

function timezoneOffset(date, timezone) {
  adjustedDateForTimezone = date.toLocaleString("en-US", {timeZone: timezone});
  return adjustedDateForTimezone;
};

function convertDate(date, timezone) {
  var convertedDate = timezoneOffset(epochToLocalDate(date), timezone);
  return convertedDate;
};


function timeOfDay() {
  var hours = new Date().getHours();
  if (hours < 12) {
    greeting = 'Good morning';
  } else if (12 <= hours && hours < 17) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }
};
timeOfDay();

function fetchVariablesForCustomTemplate(obj) {
  document.getElementById('guestVariables').innerHTML = null;
  console.log(Object.values(obj));
  Object.values(obj).forEach(function(val) {
    $('#variables').append(`<option value="${val}"> ${val} </option>`);
    console.log(val);
  })
}

function captureGuestInfo(guest) {
  messageTemplate.firstName = guest.firstName;
  messageTemplate.lastName = guest.lastName;
  messageTemplate.roomNumber = guest.reservation.roomNumber;
  messageTemplate.startTimestamp = guest.reservation.startTimestamp;
  messageTemplate.endTimestamp = guest.reservation.endTimestamp;
  if (guestSelected) {
    console.log(messageTemplate);
    fetchVariablesForCustomTemplate(messageTemplate);
  }
};

function captureCompanyInfo(company) {
  messageTemplate.companyName = company.company;
  messageTemplate.timezone = company.timezone;
  messageTemplate.city = company.city;
  if (companySelected) {
    console.log(messageTemplate);
    fetchVariablesForCustomTemplate(messageTemplate);
  }
};

function createMessage() {
  console.log(messageTemplate, ' this is mes temp last');

  /*console.log(messageTemplate, ' template2');
  console.log(messageOutput, ' output2');*/

  $('#message').text(messageOutput);
  if (guestSelected) {
    captureGuestInfo(guest);
  }
  console.log(messageOutput, 'this is mes output last');
};

function chosenTemplate(index) {
  //console.log(messageTemplate, ' this is mes temp1');
  timeOfDay();
  if (companySelected && guestSelected) {
    messageTemplate.startTimestamp = convertDate(messageTemplate.startTimestamp, messageTemplate.timezone);
    messageTemplate.endTimestamp = convertDate(messageTemplate.endTimestamp, messageTemplate.timezone);
  }

  if (index == 0) {
    hideCustomInput();
    messageOption1 = `${greeting} ${messageTemplate.firstName || '{firstName}'} ${messageTemplate.lastName || '{lastName}'}, ${messageTemplate.city || '{cityName}'} welcomes you! Room ${messageTemplate.roomNumber || '{roomNumber}'} is now ready for you. We hope that you enjoy your stay and please let us know if you need anything!`;
    messageOutput = messageOption1;
    //console.log(messageOutput);
    createMessage();
  } else if (index == 1) {
    hideCustomInput();
    /*console.log(messageTemplate, ' template3');
    console.log(messageTemplate.startTimestamp, ' startTimestamp3');*/
    messageOption2 = `${greeting} ${messageTemplate.firstName || '{firstName}'}, and welcome to ${messageTemplate.companyName || '{companyName}'}! It looks like we have you in room ${messageTemplate.roomNumber || '{roomNumber}'} from ${messageTemplate.startTimestamp || '{startTimestamp}'} to ${messageTemplate.endTimestamp || '{endTimestamp}'}. We hope you enjoy your stay!`;
    messageOutput = messageOption2
    //console.log(messageOutput);
    createMessage();
  } else if (index == 'Custom') {
    console.log('Custom');
    showCustomInput();
  }
};

function showCustomInput() {
  customInput = true;
  $('#customTemplateInterface').removeClass("invisible");
  /*$('#customInput').removeClass("invisible");
  $('#confirmButton').removeClass("invisible");*/
};

function hideCustomInput() {
  customInput = false;
  $('#customTemplateInterface').addClass("invisible");
  /*$('#customInput').addClass("invisible");
  $('#confirmButton').addClass("invisible");*/
  $('#customInput').val("");
}

document.getElementById('confirmButton').onclick = function() {
  messageOutput = document.getElementById('customInput').value;
  createMessage();
  console.log('clicked');
};

document.getElementById('selectGuest').onchange = function() {
  guestSelected = true;
  guest = guestInfo[document.getElementById('selectGuest').value];
  //console.log(guest);
  captureGuestInfo(guest);
  //checkInTime(messageTemplate.startTimestamp);
  //console.log(greeting);
  if (templateSelected) {
    //console.log(messageOutput);
    chosenTemplate(templateIndex);

  } else {
    //console.log('no template selected');
  }
};



document.getElementById('selectCompany').onchange = function() {
  companySelected = true;
  company = companyInfo[document.getElementById('selectCompany').value];
  captureCompanyInfo(company);
  //console.log(company);
  if (templateSelected) {
    chosenTemplate(templateIndex);
  }

/*  if (guestSelected) {
    createMessage();
  } else {
    companySelected = true;
  }*/
};

document.getElementById('selectMessageTemplate').onchange = function() {
  templateSelected = true;
  templateIndex = document.getElementById('selectMessageTemplate').value;
  //console.log('This is template: ' , templateIndex );
  chosenTemplate(templateIndex);
  //console.log(templateIndex);
};





// Use this logic for making the message template

//let finalMessageOutput = greeting + ' ' + messageTemplate.firstName + ', and welcome to ' + messageTemplate.companyName + '! Room ' + messageTemplate.roomNumber + ' is now ready for you. We hope that you enjoy your stay and please let us know if you need anything!';



/* "Good morning Ethan, and welcome to Hotel California!
Room 304 is now ready you. Enjoy your stay, and let us know if you need anything." */


// Use this logic for converting the date/time

//.getHours() to find hours and provide an if/else for checking morning/afternoon/evening
/*
var utcSeconds = 1486654792;
var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
d.setUTCSeconds(utcSeconds);

console.log(d);

var utcSeconds2 = 1486852373;
var b = new Date(0); // The 0 there is the key, which sets the date to the epoch
b.setUTCSeconds(utcSeconds2);

console.log(b);


var dateNow = new Date();
dateNow.getUTCSeconds;
console.log(dateNow);
*/
