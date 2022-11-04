# Message Template Generator

## Author
 Hue Vang

## Description
Message template generator with the capability to add your own personalized message.


## Instructions
* Clone this repo into your local environment.
* Use the terminal to navigate to the destination folder.
```bash
cd destination-folder
```
* Run the command *npm install* to install necessary dependencies.
```bash
npm install
```
* Run the command *node server.js* to start the application.
```bash
node server.js
```
* Navigate to your browser window and input *localhost:3000* to view the app.

**_NOTE:_** This application was tested and working in Chrome on a desktop environment.

## Design Overview

### Frontend Portion
For this project I decided to create a GUI with dropdown menus for selecting the message template, company, and guest variables. The file structure is simple with a *public* folder containing the views, styles, logic, and data. There is no database involved and all of the information is handled and stored in the *main.js* file.

There is a mix of jQuery and vanilla JavaScript when handing the HTML DOM elements, and I used them interchangeably where I felt the most comfortable. I decided on using dropdown menus since it limits the chances of a user running into bugs due to the pre-filled selections, and also for scalability reasons as adding a ton of selections wouldn't disrupt much of the webpage layout.

There is a custom input section which can be toggled by selecting the "custom" message template option. The user can type a personalized message and choose which guest and company variables to include.

### Logic Portion

#### JSON Data

The *Templates.json* file's data is structured as an array of objects, with each object containing a *"style"* key that pertains to the type of template they represent. Each object contains snippets of sentences that are arranged to fit around the company and guest variables. I opted to have a different amount of keys/properties for each style type so the user could have more flexibility when creating their templates.


#### JavaScript Logic

I decided to create object instances to store the data for the currently selected guest and company variables. This enabled me to store revised data that I could reference and relay to the frontend while retaining the unmanipulated data for other calculations (e.g., date/time conversions).

I imported the JSON data into the JavaScript file and used a forEach loop to populate all the dropdown selections. This would help for scalability since no additional code would be needed if you wanted to add more message templates as long as they were one of the predefined styles.

The naming convention of functions, variables, and objects in the JavaScript file are aimed towards readability with an emphasis on being self-descriptive. Functions are defined with verbs to tell what they are doing, variables are named to describe what information they hold, and parameters are named to describe what arguments they will receive. Only minor comments were added to explain the *why* behind some code which might not be obvious on first glance.


## Language

This application is written in JavaScript because it's the language that I am the most comfortable using.  It also has a lot of nice event handlers for manipulating the DOM on the frontend.


## Bug testing process

There was a lot of manual tests involving the GUI dropdown selections to ensure everything worked correctly. Console logs were used extensively throughout the codebase to pinpoint and fix numerous issues.

## Stretch Goals

This project was created to showcase the logic behind the message templating feature, so the styling is not necessarily the best. I'd definitely like to add more styles to make the application look/feel more polished.

If I had more time, I'd like to dig deeper in finding a possible method to dynamically create the conditions for the *populateTemplate* function. The current logic uses a switch statement with predefined cases, and in order to add different template styles, you would need to manually edit the switch statement to include the new style and sentence structure.

Refactoring code is another thing I'd want to continue exploring with more time. *document.getElementById('selectGuest')* and *document.getElementById('selectCompany')* had very similar functions but they manipulated different variables that blocked me from currently finding a way to refactor them.

### Additional stretch goals

* Fixing the readability of the template dropdown selections
* Creating a different way to create custom templates
* Cleaning the readability of the template dropdown selection choices
* Adding a database and framework like Angular/React
* Exploring improvements for scalability and readability
