import guestInfoList from '../data/Guests.json' assert {type: 'json'};
import companyInfoList from '../data/Companies.json' assert {type: 'json'};
import messageTemplateList from '../data/Templates.json' assert {type: 'json'};


let greeting;
let guestJsonRawData;
let templateIndex;
let messageOutput;
let guestSelected = false;
let companySelected = false;
let templateSelected = false;
let customInput = false;


const currentGuest = {
  firstName: null,
  lastName: null,
  roomNumber: null,
  startTimestamp: null,
  endTimestamp: null
};


const currentCompany = {
  companyName: null,
  timezone: null,
  city: null
};


$(function() {
  populateDropdownSelections();
});


function populateDropdownSelections() {
  getJsonData(guestInfoList);
  getJsonData(companyInfoList);
  getJsonData(messageTemplateList);
};


function getJsonData(array) {
  array.forEach(function(obj) {
    let index = array.indexOf(obj)
    if (array == guestInfoList) {
      $('#selectGuest').append(`<option value="${index}"> ${obj.firstName} ${obj.lastName} </option>`);
    } else if (array == companyInfoList) {
      $('#selectCompany').append(`<option value="${index}"> ${obj.company} - ${obj.city} (${obj.timezone}) </option>`);
    } else {
      $('#selectMessageTemplate').append(`<option value="${index}"> ${Object.values(obj)} </option>`);
    }
  });
  if (array == messageTemplateList) {
    $('#selectMessageTemplate').append(`<option value="${'Custom'}"> Custom </option>`);
  };
};


// new Date(0) sets the date to the beginning of epoch time which is Jan 1, 1970 00:00:00 GMT.
function epochToLocalDate(epochTime) {
  let utcSeconds = epochTime;
  let date = new Date(0);
  date.setUTCSeconds(utcSeconds);
  return date;
};


function timezoneOffset(date, timezone) {
  let adjustedDateForTimezone = date.toLocaleString("en-US", {timeZone: timezone});
  return adjustedDateForTimezone;
};


function convertDate(date, timezone) {
  let convertedDate = timezoneOffset(epochToLocalDate(date), timezone);
  return convertedDate;
};


// The guestJsonRawData.reservation timestamps are used in the date/time calculations to avoid any "invalid data" results.
function convertTimestampsToReadableDate() {
  currentGuest.startTimestamp = convertDate(guestJsonRawData.reservation.startTimestamp, currentCompany.timezone);
  currentGuest.endTimestamp = convertDate(guestJsonRawData.reservation.endTimestamp, currentCompany.timezone);
};


function getTimeNow() {
  let hours = new Date().getHours();
  if (hours < 12) {
    greeting = 'Good morning';
  } else if (12 <= hours && hours < 17) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  };
};
getTimeNow();


function captureGuestInfo(guest) {
  currentGuest.firstName = guest.firstName;
  currentGuest.lastName = guest.lastName;
  currentGuest.roomNumber = guest.reservation.roomNumber;
  if (companySelected) {
    currentGuest.startTimestamp = guest.reservation.startTimestamp;
    currentGuest.endTimestamp = guest.reservation.endTimestamp;
  } else {
    currentGuest.startTimestamp = null;
    currentGuest.endTimestamp = null;
  };
};


function captureCompanyInfo(company) {
  currentCompany.companyName = company.company;
  currentCompany.timezone = company.timezone;
  currentCompany.city = company.city;
};


function clearAllObjectValues(obj) {
  Object.keys(obj).forEach(function(key) {
    obj[key] = null;
  });
};


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
  };
};


function populateTemplate(index) {
  getTimeNow();
  checkCompanyAndGuestSelections();
  let template = messageTemplateList[index];
  if (index == 'Custom') {
    showCustomInput();
  } else {
    hideCustomInput();
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
    };
    createMessage();
  };
};


function createMessage() {
  $('#message').text(messageOutput);
};


function clearMessage() {
  document.getElementById('message').innerHTML = 'Your message will appear here.';
};


function fetchVariablesForCustomTemplate(obj, id) {
  document.getElementById(id).innerHTML = '<option>---</option>';
  checkCompanyAndGuestSelections();
  Object.values(obj).forEach(function(val) {
    if (val != null) {
      $('#' + id).append(`<option value="${val}"> ${val} </option>`);
    };
  });
};


function showCustomInput() {
  customInput = true;
  $('#customTemplateInterface').removeClass("invisible");
  clearMessage();
  if (guestSelected) {
    fetchVariablesForCustomTemplate(currentGuest, 'guestVariablesForCustomTemplate');
  }
  if (companySelected) {
    fetchVariablesForCustomTemplate(currentCompany, 'companyVariablesForCustomTemplate');
  };
};


function hideCustomInput() {
  customInput = false;
  $('#customTemplateInterface').addClass("invisible");
  $('#customInput').val("");
};


document.getElementById('selectGuest').onchange = function() {
  let guestIndex = document.getElementById('selectGuest').value;
  if (guestIndex != 'placeholder') {
    guestSelected = true;
    guestJsonRawData = guestInfoList[guestIndex];
    captureGuestInfo(guestJsonRawData);
    if(templateSelected) {
      populateTemplate(templateIndex);
    };
  } else {
    guestSelected = false;
    document.getElementById('guestVariablesForCustomTemplate').innerHTML = '<option>Guest Variables</option>';
    populateTemplate(templateIndex);
  };
};


document.getElementById('selectCompany').onchange = function() {
  let companyIndex = document.getElementById('selectCompany').value;
  if (companyIndex != 'placeholder') {
    companySelected = true;
    captureCompanyInfo(companyInfoList[companyIndex]);
    if(templateSelected) {
      populateTemplate(templateIndex);
    };
  } else {
    companySelected = false;
    document.getElementById('companyVariablesForCustomTemplate').innerHTML = '<option>Company Variables</option>';
    populateTemplate(templateIndex);
  };
};


document.getElementById('selectMessageTemplate').onchange = function() {
  templateIndex = document.getElementById('selectMessageTemplate').value;
  if (templateIndex != 'placeholder') {
    templateSelected = true;
    populateTemplate(templateIndex);
  } else {
    templateSelected = false;
    hideCustomInput();
    clearMessage();
  };
};


document.getElementById('guestVariablesForCustomTemplate').onchange = function() {
  document.getElementById('guestVariablesForCustomTemplate').value;
  appendVariableToCustomInput('guest');
};


document.getElementById('companyVariablesForCustomTemplate').onchange = function() {
  document.getElementById('companyVariablesForCustomTemplate').value;
  appendVariableToCustomInput('company');
};


function appendVariableToCustomInput(companyOrGuest) {
  let variable = document.getElementById(companyOrGuest + 'VariablesForCustomTemplate').value;
  let currentLength = document.getElementById('customInput').value.length;
  let totalStringLength = currentLength + variable.length;
  if (variable != '---' && totalStringLength <= 400) {
    document.getElementById('customInput').value += variable;
    document.getElementById("customInput").focus();
  } else if (variable != '---' && totalStringLength > 400) {
    alert('Message is longer than 400 characters. Please try again.');
  };
};


document.getElementById('confirmButton').onclick = function() {
  messageOutput = document.getElementById('customInput').value;
  createMessage();
};
