function formValidation() {
  let firstname = document.registration.vorname;
  let lastname = document.registration.nachname;
  let address = document.registration.address;
  let country = document.registration.country;
  let password = document.registration.pass;
  let confpassword = document.registration.pass2;
  let user_id = document.registration.userid;
  let email = document.registration.email;
  let mCustomer = document.registration.mCustomer;
  let cCustomer = document.registration.cCustomer;
  let worker = document.registration.worker;
  let admin = document.registration.admin;

  if (checkSurname(firstname)) {
    if (checkLastname(lastname)) {
      if (isAddressValid(address)) {
        if (isCountrySelected(country)) {
          if (isPasswordValid(password, confpassword, 7, 10)) {
            if (isUserIdValid(user_id, 6, 11)) {
              if (isEmailValid(email)) {
                if (isCheckboxValid(mCustomer, cCustomer, worker, admin)) {
                  return true;
                }
              }
            }
          }
        }
      }
    }
  }
  return false;
}


//checks if input.length == 0
function isEmpty(input) {
  let len = input.length;
  return (len == 0);
}

//returns length of input
function lengthOf(input) {
  return (input.length);
}


//Vor - und Nachname Validation (nicht gefragt aber von mir als Sinnvoll erachtet)
function checkSurname(firstname) {
  let regexletters = /^[A-Za-z]+$/;
  if (isEmpty(firstname.value)) {
    alert('"Vorname" must not be empty!');
    firstname.focus();
    return false;
  }
  if (firstname.value.match(regexletters)) {         //One way to do it
    return true;
  } else {
    alert('"Vorname" must have alphabet characters only');
    firstname.focus();
    return false;
  }
}

function checkLastname(lastname) {
  let regexletters = /^[A-Za-z]+$/;
  if (isEmpty(lastname.value)) {
    alert('"Lastname" must not be empty!');
    lastname.focus();
    return false;
  } else if (regexletters.exec(lastname.value) != null) {         //Other way to do it
    return true;
  } else {
    alert('"Nachname" must have alphabet characters only');
    lastname.focus();
    return false;
  }
}

// User adress
function isAddressValid(address) {
  let letters = /^[0-9a-zA-Z]+$/;
  if (isEmpty(address.value)) {
    alert('"Address" must not be empty!')
    address.focus();
    return false;
  } else if (address.value.match(letters)) {
    return true;
  } else {
    alert('User address must have alphanumeric characters only');
    address.focus();
    return false;
  }
}

//Country
function isCountrySelected(country) {
  if (country.value == "Default") {
    alert('Select your country from the list');
    country.focus();
    return false;
  } else {
    return true;
  }
}

//Password
function isPasswordValid(password, confpassword, min, max) {
  let regexPass = /^[a-zA-Z][a-zA-Z0-9_]+$/;
  if (isEmpty(password.value) || lengthOf(password.value) > max || lengthOf(password.value) < min) {
    alert("Password should not be empty / length be between " + (min - 1) + " to " + (max + 1));
    password.focus();
    return false;
  } else if (!password.value.match(regexPass)) {
    alert("Password doesn't match requirements");
    password.focus();
    return false;
  } else if (!password.value.match(confpassword.value)) {
    alert("Both Passwords doesn't match");
    password.focus();
    return false;
  }
  return true;
}

//User ID
function isUserIdValid(user_id, min, max) {
  let regexUserId = /^[a-zA-Z_]+$/;
  if (isEmpty(user_id.value) || lengthOf(user_id.value) > max || lengthOf(user_id.value) < min) {
    alert("User Id should not be empty / length be between " + (min - 1) + " to " + (max + 1));
    user_id.focus();
    return false;
  } else if (regexUserId.exec(user_id.value) == null) {   // same as .match but needs the != null condition.
    alert("UserId doesn't match requirements");
    user_id.focus();
    return false;
  } else {
    return true;
  }
}

//Email
function isEmailValid(email) {
  let regexMail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if(isEmpty(email.value)){
    alert('"Email" must not be empty!')
    email.focus();
    return false;
  }
  if (regexMail.exec(email.value) != null) {
    return true;
  } else {
    alert("You have entered an invalid email address!");
    email.focus();
    return false;
  }
}

//ValidCostumer  (optional)
function isCheckboxValid(mCustomer, cCustomer, worker, admin) {
  customerCounter = 0;
  if (mCustomer.checked) {
    customerCounter++;
  }
  if (cCustomer.checked) {
    customerCounter++;
  }

  if (customerCounter == 0) {
    alert('Select a Costumer');
    mCustomer.focus();
    cCustomer.focus();
    return false;
  } else if (customerCounter > 1) {
    alert("You can only select customer age group");
    mCustomer.focus();
    cCustomer.focus();
    worker.focus();
    return false
  } else if (customerCounter == 1) {
    alert('Registration Successfull !');
    window.location.reload();
    return true;
  }
}





//VALIDATION COMPLETE
