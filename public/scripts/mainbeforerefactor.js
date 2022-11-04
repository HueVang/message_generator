// Import data from JSON files
import guestInfo from '../data/Guests.json' assert {type: 'json'};
import companyInfo from '../data/Companies.json' assert {type: 'json'};
import messageTemplate from '../data/Templates.json' assert {type: 'json'};


$(function() {
  populateDropdownSelections();
}); // end doc ready

let date;
let greeting;
let adjustedDateForTimezone;
let guestJsonRawData;
let guestSelected = false;
let companySelected = false;
let templateSelected = false;
let customInput = false;
let templateIndex;
let messageOutput;

const currentGuest = {
  firstName: null,
  lastName: null,
  roomNumber: null,
  startTimestamp: null,
  endTimestamp: null
}

const currentCompany = {
  companyName: null,
  timezone: null,
  city: null
}

function populateDropdownSelections() {
  getJsonData(guestInfo);
  getJsonData(companyInfo);
  getJsonData(messageTemplate);
};


function getJsonData(array) {
  array.forEach(function(obj) {
    var index = array.indexOf(obj)
    if (array == guestInfo) {
      $('#selectGuest').append(`<option value="${index}"> ${obj.firstName} ${obj.lastName} </option>`);
    } else if (array == companyInfo) {
      $('#selectCompany').append(`<option value="${index}"> ${obj.company} - ${obj.city} (${obj.timezone}) </option>`);
    } else {
      $('#selectMessageTemplate').append(`<option value="${index}"> ${Object.values(obj)} </option>`);
    }
  });

  if (array == messageTemplate) {
    $('#selectMessageTemplate').append(`<option value="${'Custom'}"> Custom </option>`);
  };
};

function convertTimestampsToReadableDate() {
  currentGuest.startTimestamp = convertDate(guestJsonRawData.reservation.startTimestamp, currentCompany.timezone);
  currentGuest.endTimestamp = convertDate(guestJsonRawData.reservation.endTimestamp, currentCompany.timezone);
};

function clearAllObjectValues(obj) {
  Object.keys(obj).forEach(function(key) {
    obj[key] = null;
  });
}

function checkCompanyAndGuestSelections() {
  if (companySelected && guestSelected) {
      convertTimestampsToReadableDate();
  } else if (companySelected && !guestSelected) {
      clearAllObjectValues(currentGuest);
  } else if (!companySelected && guestSelected) {
      clearAllObjectValues(currentCompany);
      captureGuestInfo(guestJsonRawData);
  } else {
      clearAllObjectValues(currentGuest);
      clearAllObjectValues(currentCompany);
  }
};

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


function getTimeNow() {
  var hours = new Date().getHours();
  if (hours < 12) {
    greeting = 'Good morning';
  } else if (12 <= hours && hours < 17) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }
};
getTimeNow();

function fetchVariablesForCustomTemplate(obj, id) {
  console.log(obj, 'fetchVariablesForCustomTemplate object argument');
  document.getElementById(id).innerHTML = '<option>---</option>';
  console.log(Object.values(obj));
  checkCompanyAndGuestSelections();
  Object.values(obj).forEach(function(val) {
    if (val != null) {
      $('#' + id).append(`<option value="${val}"> ${val} </option>`);
    }
    console.log(val, ' tal');
  })
  console.log('done1');
}

function captureGuestInfo(guest) {
  console.log(guest, 'this g2');
  console.log(currentGuest, 'this ccg2 pre');

  currentGuest.firstName = guest.firstName;
  currentGuest.lastName = guest.lastName;
  currentGuest.roomNumber = guest.reservation.roomNumber;
  console.log(currentGuest, 'this ccg2 post');

  if (companySelected) {
    currentGuest.startTimestamp = guest.reservation.startTimestamp;
    currentGuest.endTimestamp = guest.reservation.endTimestamp;
  } else {
    currentGuest.startTimestamp = null;
    currentGuest.endTimestamp = null;
  }

/*  if (customInput) {
    fetchVariablesForCustomTemplate(currentGuest, 'guestVariables');
  }*/
};

function captureCompanyInfo(company) {
  currentCompany.companyName = company.company;
  currentCompany.timezone = company.timezone;
  currentCompany.city = company.city;
  /*if (customInput) {
    $('#guestVariables').removeClass("layerTwoInvisible");
    fetchVariablesForCustomTemplate(currentCompany, 'companyVariables');
    if (guestSelected) {
      captureGuestInfo(guestJsonRawData);
    }
  }*/
};

function createMessage() {
  console.log(messageTemplate, ' this is mes temp last');

  /*console.log(messageTemplate, ' template2');
  console.log(messageOutput, ' output2');*/

  $('#message').text(messageOutput);
  if (guestSelected) {
    console.log('guest selected... retrasmitting data');
    console.log(guestJsonRawData, 'this is raw guestjsondata');
    captureGuestInfo(guestJsonRawData);
  }
  console.log(messageOutput, 'this is mes output last');
};


function populateTemplate(index) {
  //console.log(messageTemplate, ' this is mes temp1');
  getTimeNow();
  checkCompanyAndGuestSelections();


  let template = messageTemplate[index];

  if (index == 'Custom') {
    console.log('Custom');
    showCustomInput();
  } else {
    hideCustomInput();
    console.log(currentGuest ,'guest obj populateTemplate');
    console.log(currentGuest.startTimestamp ,'guest obj populateTemplate startTimestamp');
    console.log(currentGuest.endTimestamp ,'guest obj populateTemplate endTimestamp');

    switch (template.style) {
      case 'shortAndSweet':
        messageOutput =`${greeting} ${currentGuest.firstName || '{firstName}'} ${currentGuest.lastName || '{lastName}'}, ${currentCompany.city || '{cityName}'} ${template.beginning} ${currentGuest.roomNumber || '{roomNumber}'} ${template.end}`;
        break;
      case 'includeDates':
        messageOutput = `${greeting} ${currentGuest.firstName || '{firstName}'} ${template.beginning} ${currentCompany.companyName || '{companyName}'}${template.oneFourth} ${currentGuest.roomNumber || '{roomNumber}'} ${template.middle} ${currentGuest.startTimestamp || '{startTimestamp}'} ${template.threeFourths} ${currentGuest.endTimestamp || '{endTimestamp}'}${template.end}`;
        break;
      case 'welcoming':
        messageOutput = `${greeting}${template.beginning} ${currentCompany.companyName  || '{companyName}'}${template.middle} ${currentGuest.roomNumber || '{roomNumber}'}${template.end}`;
        break;

    }
    createMessage();
  };
};

/*
function populateTemplate(index) {
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
    console.log(messageTemplate, ' template3');
    console.log(messageTemplate.startTimestamp, ' startTimestamp3');
    messageOption2 = `${greeting} ${messageTemplate.firstName || '{firstName}'}, and welcome to ${messageTemplate.companyName || '{companyName}'}! It looks like we have you in room ${messageTemplate.roomNumber || '{roomNumber}'} from ${messageTemplate.startTimestamp || '{startTimestamp}'} to ${messageTemplate.endTimestamp || '{endTimestamp}'}. We hope you enjoy your stay!`;
    messageOutput = messageOption2
    //console.log(messageOutput);
    createMessage();
  } else if (index == 'Custom') {
    console.log('Custom');
    showCustomInput();
  }
}; */

function clearMessage() {
  document.getElementById('message').innerHTML = 'Your message will appear here.';
};

function showCustomInput() {
  customInput = true;
  $('#customTemplateInterface').removeClass("invisible");
  clearMessage();
  if (guestSelected) {
    fetchVariablesForCustomTemplate(currentGuest, 'guestVariables');
  }

  if (companySelected) {
    fetchVariablesForCustomTemplate(currentCompany, 'companyVariables');
  }
  /*$('#customInput').removeClass("invisible");
  $('#confirmButton').removeClass("invisible");*/
};

function hideCustomInput() {

  customInput = false;
  $('#customTemplateInterface').addClass("invisible");
  /*$('#customInput').addClass("invisible");
  document.getElementById('companyVariables').selectedIndex = 0;
  document.getElementById('guestVariables').selectedIndex = 0;
  $('#confirmButton').addClass("invisible");*/
  $('#customInput').val("");
}



document.getElementById('selectGuest').onchange = function() {
  let guest = document.getElementById('selectGuest').value;
  if (guest != 'placeholder') {
    guestSelected = true;
    guestJsonRawData = guestInfo[guest];
    console.log(guestJsonRawData, 'this guest selected');
    captureGuestInfo(guestJsonRawData);
    //checkInTime(messageTemplate.startTimestamp);
    //console.log(greeting);
    if (templateSelected) {
      //console.log(messageOutput);
      populateTemplate(templateIndex);

    }
  } else {
    guestSelected = false;
    document.getElementById('guestVariables').innerHTML = '<option>Guest Variables</option>';
    populateTemplate(templateIndex);
    console.log('Placeholder guest');
  }

};

document.getElementById('confirmButton').onclick = function() {
  messageOutput = document.getElementById('customInput').value;
  createMessage();
  console.log('clicked');
};

document.getElementById('selectCompany').onchange = function() {
  let company = document.getElementById('selectCompany').value;
  if (company != 'placeholder') {
    companySelected = true;
    captureCompanyInfo(companyInfo[company]);
    //console.log(company);
    if (templateSelected) {
      populateTemplate(templateIndex);
    }
  } else {
    companySelected = false;
    document.getElementById('companyVariables').innerHTML = '<option>Company Variables</option>';
    populateTemplate(templateIndex);
    console.log('Placeholder company');
  }


/*  if (guestSelected) {
    createMessage();
  } else {
    companySelected = true;
  }*/
};

document.getElementById('selectMessageTemplate').onchange = function() {
  templateIndex = document.getElementById('selectMessageTemplate').value;
  if (templateIndex != 'placeholder') {
    templateSelected = true;
    console.log(templateIndex, 'te sty');
    console.log(currentGuest, 'currentGuest on new template');
    //console.log('This is template: ' , templateIndex );
    populateTemplate(templateIndex);
    //console.log(templateIndex);
  } else {
    templateSelected = false;
    hideCustomInput();
    clearMessage();
  }
};

document.getElementById('guestVariables').onchange = function() {
  document.getElementById('guestVariables').value;
  console.log(document.getElementById('guestVariables').value,'guest variable selected');
  appendVariableToCustomInput('guest');
};

document.getElementById('companyVariables').onchange = function() {
  document.getElementById('companyVariables').value;
  console.log(document.getElementById('companyVariables').value,'company variable selected');
  appendVariableToCustomInput('company');
};

function appendVariableToCustomInput(selection) {
  let variable = document.getElementById(selection + 'Variables').value;
  if (variable != '---') {
    document.getElementById('customInput').value += variable;
    document.getElementById("customInput").focus();
  }
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
