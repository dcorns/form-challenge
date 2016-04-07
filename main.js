/**
 * main
 * Created by dcorns on 4/3/16
 * Copyright © 2016 Dale Corns
 */
'use strict';
(function () {
//Make Form Objects
  var formDom = {
    btnTogglePhysician: new FormObject(document.getElementById('btn-toggle-physician')),
    sectionPhysician: new FormObject(document.getElementById('physician-section')),
    btnSectionAll: new FormObject(document.getElementById('btn-toggle-all')),
    patientName: new FormObject(document.getElementById('patient-name'), true),
    disabilityDate: new FormObject(document.getElementById('disability-date'), true),
    disabilityDescription: new FormObject(document.getElementById('disability-description'), true),
    specificReasons: new FormObject(document.getElementById('specific-reasons'), true),
    physicianName: new FormObject(document.getElementById('physician-name'), true),
    physicianPhone: new FormObject(document.getElementById('physician-phone'), true),
    licensedPhysician: new FormObject(document.getElementById('licensed-physician')),
    licensedSurgeon: new FormObject(document.getElementById('licensed-surgeon')),
    physicianSpecialty: new FormObject(document.getElementById('physician-specialty')),
    physicianSignature: new FormObject(document.getElementById('physician-signature')),
    btnPhysicianSignature: new FormObject(document.getElementById('btn-physician-signature')),
    physiciansSignatureDate: new FormObject(document.getElementById('physician-signature-date')),
    btnSubmitPhysician: new FormObject(document.getElementById('submit-physician-portion')),
    btnToggleClaimant: new FormObject(document.getElementById('btn-toggle-claimant')),
    sectionClaimant: new FormObject(document.getElementById('claimant-section')),
    formCompletedBy: new FormObject(document.getElementById('completed-by-choices'), true),
    claimantOrGuardianName: new FormObject(document.getElementById('claimant-name'), true),
    spouseName: new FormObject(document.getElementById('spouse-name')),
    propertyStreetAddress: new FormObject(document.getElementById('street-address'), true),
    propertyCity: new FormObject(document.getElementById('city'), true),
    propertyZipCode: new FormObject(document.getElementById('zip-code'), true),
    propertyParcelNumber: new FormObject(document.getElementById('parcel-number'), true),
    partAOrBChoice: new FormObject(document.getElementById('a-or-b'), true),
    descriptionA: new FormObject(document.getElementById('description-A')),
    certA: new FormObject(document.getElementById('certification-a')),
    certB: new FormObject(document.getElementById('certification-b')),
    claimantOrGuardianEsignature: new FormObject(document.getElementById('claimant-guardian-signature')),
    claimantOrGuardianSignatureDate: new FormObject(document.getElementById('claimant-guardian-signature-date')),
    btnClaimantOrGuardianEsigned: new FormObject(document.getElementById('btn-claimant-guardian-signature')),
    claimantOrGuardianPhone: new FormObject(document.getElementById('claimant-phone'), true),
    spouseEsignature: new FormObject(document.getElementById('spouse-signature')),
    spouseSignatureDate: new FormObject(document.getElementById('spouse-signature-date')),
    btnSpouseEsigned: new FormObject(document.getElementById('btn-spouse-signature')),
    spousePhone: new FormObject(document.getElementById('spouse-phone')),
    formEmail: new FormObject(document.getElementById('form-completed-by-email'), true),
    btnSubmitClaimant: new FormObject(document.getElementById('submit-claimant-portion')),
    btnSubmitAllButton: new FormObject(document.getElementById('submit-all'))
  };

  //Define FormObjects
  function FormObject(el, required) {
    this.el = el;
    this.isDirty = false;
    this.isValid = false;
    this.required = required || false;
    this.data = '';
  }

  //FormObject Inherited Methods
  //Define FormObject initialization
  FormObject.prototype.init = function () {
    var self = this;
    //Set required class
    if (this.required) {
      this.el.classList.add('required');
      this.el.setAttribute('aria-label', 'This entry is required');
    }
    //bind data and validate values on inputs with change onChange
    if (this.el.nodeName && this.el.nodeName === 'INPUT' || this.el.nodeName === 'TEXTAREA') {
      this.el.addEventListener('change', function (e) {
        self.isDirty = true;
        //bind element value for text, data, email and textarea
        if (self.el.type === 'text' || self.el.type === 'date' || self.el.type === 'textarea' || self.el.type === 'email' || self.el.type === 'number') {
          self.data = e.target.value;
        }
        if (self.el.type === 'checkbox') {
          self.data = e.target.checked;
        }
        self.validate();
      });
    }
    //bind data from radio group
    if (this.el.nodeName && this.el.nodeName === 'UL') {
      this.el.addEventListener('click', function (e) {
        self.data = e.target.value;
        self.isValid = true;
        self.isDirty = true;
        if (self.data === 'A') {
          formDom.descriptionA.required = true;
          formDom.descriptionA.el.classList.add('required');
          formDom.descriptionA.el.setAttribute('aria-label', 'This entry is required');
        }
        else {
          formDom.descriptionA.required = false;
          formDom.descriptionA.el.classList.remove('required');
          formDom.descriptionA.el.setAttribute('aria-label', '');
        }
        self.markStatus();
        displayChoiceNodes(e.target.parentNode.parentNode, self.data);
      });
    }

    //setup validation and bind data for input:text and textarea onkeyup
    if (this.el.type === 'text' || this.el.type === 'textarea' || this.el.type === 'email' || this.el.type === 'number') {
      this.el.addEventListener('keyup', function (e) {
        self.data = e.target.value;
        self.isDirty = true;
        self.validate();
      });
    }
  };

  FormObject.prototype.validate = function () {
    var regX = /\S+/;
    if (this.el.type === 'text') {
      regX = /^[\w ]+$/;
      this.isValid = regX.test(this.data);//this regX is also to restrictive
    }
    if (this.el.type === 'textarea') {
      this.isvalid = this.data.length > 20; //++++++++++++need to change this accept only certain characters, but more characters than what is allowed in type text
      this.isValid = regX.test(this.data);
    }
    if (this.el.type === 'email') {
      regX = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(]?)$/;
      this.isValid = regX.test(this.data);
    }
    if (this.el.type === 'date') {
      var test = new Date(this.data);
      if (test.getDate()) this.isValid = true;
      else this.isValid = false;
    }
    if (this.el.classList.contains('valid-phone')) {
      this.isValid = this.data.length === 10; //phone number
    }
    if (this.el.classList.contains('digital-signature')) {
      if (!(this.data.length > 12)) this.isValid = false;//Would be changed to whatever a valid digital signature hash requires
      else this.isValid = true;
    }
    this.markStatus();
  };

  FormObject.prototype.markStatus = function () {
    if (this.isValid) {
      this.el.classList.add('isvalid');
      this.el.classList.remove('invalid');
      this.el.classList.remove('required');
      if (this.required) {
        this.el.classList.add('required-isvalid');
        this.el.classList.remove('required-invalid');
      }
    }
    else {
      if (this.isDirty) {
        this.el.classList.add('invalid');
        this.el.classList.remove('isValid');
        this.el.classList.remove('required');
        if (this.required) {
          this.el.classList.add('required-invalid');
          this.el.classList.remove('required-isvalid');
        }
      }
    }
  };


  //View methods*******************************************************************************************************
  //set up form section visibility buttons
  formDom.btnTogglePhysician.el.addEventListener('click', function (e) {
    if (formDom.sectionPhysician.el.classList.contains('hide')) toggleVisibility(formDom.sectionPhysician.el);
    if (!(formDom.sectionClaimant.el.classList.contains('hide'))) toggleVisibility(formDom.sectionClaimant.el);
    formDom.patientName.el.focus();
  }.bind(this));

  formDom.btnToggleClaimant.el.addEventListener('click', function (e) {
    if (formDom.sectionClaimant.el.classList.contains('hide')) toggleVisibility(formDom.sectionClaimant.el);
    if (!(formDom.sectionPhysician.el.classList.contains('hide'))) toggleVisibility(formDom.sectionPhysician.el);
    formDom.formCompletedBy.el.focus();
  }.bind(this));

  formDom.btnSectionAll.el.addEventListener('click', function (e) {
    if (formDom.sectionClaimant.el.classList.contains('hide')) toggleVisibility(formDom.sectionClaimant.el);
    if (formDom.sectionPhysician.el.classList.contains('hide')) toggleVisibility(formDom.sectionPhysician.el);
    formDom.patientName.el.focus();
  }.bind(this));
  //Digital signing buttons
  formDom.btnPhysicianSignature.el.addEventListener('click', function (e) {
    handleESign(formDom.physicianSignature, formDom.physiciansSignatureDate, e);
  }.bind(this), event);

  formDom.btnClaimantOrGuardianEsigned.el.addEventListener('click', function (e) {
    handleESign(formDom.claimantOrGuardianEsignature, formDom.claimantOrGuardianSignatureDate, e);
  }.bind(this), event);

  formDom.btnSpouseEsigned.el.addEventListener('click', function (e) {
    handleESign(formDom.spouseEsignature, formDom.spouseSignatureDate, e);
  }.bind(this), event);
  //Submit Buttons
  formDom.btnSubmitAllButton.el.addEventListener('click', function (e) {
    sendData('all');
  }.bind(this), event);

  formDom.btnSubmitPhysician.el.addEventListener('click', function (e) {
    sendData('physician');
  }.bind(this), event);

  formDom.btnSubmitClaimant.el.addEventListener('click', function (e) {
    sendData('claimant');
  }.bind(this), event);

  //helpers
  function toggleVisibility(el) {
    if (el.classList.contains('hide')) {
      el.classList.remove('hide');
    }
    else el.classList.add('hide');
  }

  //Modify the view based on claimant section filer and choice certification criteria
  function displayChoiceNodes(grandFatherEl, choice) {
    switch (grandFatherEl.id) {
      case 'completed-by-choices':
        var lbl;
        switch (choice) {
          case 'Claimant':
            lbl = 'Enter claimant\'s email address';
            break;
          case 'Spouse':
            lbl = 'Enter spouse\'s email address';
            break;
          case 'Guardian':
            lbl = 'Enter guardian\'s email address';
            break;
        }
        formDom.formEmail.el.setAttribute('aria-label', lbl);
        formDom.formEmail.el.setAttribute('placeholder', lbl);
        break;
      case 'a-or-b':
        switch (choice) {
          case 'A':
            if (formDom.descriptionA.el.classList.contains('hide')) {
              toggleVisibility(formDom.descriptionA.el);
              toggleVisibility(formDom.certA.el);
            }
            if (!(formDom.certB.el.classList.contains('hide'))) toggleVisibility(formDom.certB.el);
            formDom.descriptionA.required = true;
            break;
          case 'B':
            if (formDom.certB.el.classList.contains('hide')) toggleVisibility(formDom.certB.el);
            if (!(formDom.certA.el.classList.contains('hide'))) {
              toggleVisibility(formDom.descriptionA.el);
              toggleVisibility(formDom.certA.el);
            }
            formDom.descriptionA.required = false;
            break;
        }
        break;
    }
  }

  //Pre-validate and digital signature requirements and if valid lock down signature otherwise respond with decorations
  function handleESign(objSignature, objDate, event) {
    if (objSignature.el.value.length < 12) {
      objSignature.isValid = false;
      objSignature.required = true;
      objSignature.el.classList.add('required');
      objSignature.isDirty = true;
      objSignature.markStatus();
    }
    objDate.required = true;
    objDate.el.classList.add('required');
    objDate.isDirty = true;
    objDate.validate();
    if (objDate.isValid && objSignature.isValid) {
      objDate.el.setAttribute('readonly', 'true');
      objSignature.el.value = 'Document Signed';
      objSignature.el.setAttribute('readonly', 'true');
      objDate.el.classList.add('document-signed');
      objSignature.el.classList.add('document-signed');
      event.target.setAttribute('disabled', 'true');
      event.target.classList.add('document-signed');
      event.target.classList.remove('sign');
      //then call digital signature algorithms
    }
  }

  //Insure required fields and selections are made prior to upload, if not react with decorations
  function validateFormRequired(data) {
    var isValid = true, required;
    for (var prop in data) {
      if (data.hasOwnProperty(prop)) {
        required = formDom[prop].required;
        if (required && !data[prop]) {
          isValid = false;
          setRequiredError(formDom[prop].el);
        }
      }
    }
    return isValid;
  }

  //enhance decorations on required fields and selectors
  function setRequiredError(el) {
    //handle required decoration
    el.classList.add('required-missing');
    el.classList.add('required-invalid');
  }

  //Initiate pre-upload and if successful, invoke upload mock
  function sendData(portion) {
    var dataOut = {};
    dataOut.formEmail = formDom.formEmail.data;
    var dataIsValid = false;
    switch (portion) {
      case 'all':
        dataOut = collectClaimant(dataOut);
        dataOut = collectPhysician(dataOut);
        dataIsValid = validateFormRequired(dataOut);
        break;
      case 'physician':
        dataOut = collectPhysician(dataOut);
        dataIsValid = validateFormRequired(dataOut);
        break;
      case 'claimant':
        dataOut = collectClaimant(dataOut);
        dataIsValid = validateFormRequired(dataOut);
        break;
      default:
        return null;
        break;
    }
    if (dataIsValid) uploadData(dataOut);
  }

  //Mock data upload
  function uploadData(data) {
    alert('Your data has been uploaded to the console log');
    console.dir(data);
  }

  //Import data from formDom objects into new object for upload
  function collectPhysician(dataOut) {
    dataOut.patientName = formDom.patientName.data;
    dataOut.disabilityDate = formDom.disabilityDate.data;
    dataOut.disabilityDescription = formDom.disabilityDescription.data;
    dataOut.specificReasons = formDom.specificReasons.data;
    dataOut.physicianName = formDom.physicianName.data;
    dataOut.physicianPhone = formDom.physicianPhone.data;
    dataOut.licensedPhysician = formDom.licensedPhysician.data;
    dataOut.licensedSurgeon = formDom.licensedSurgeon.data;
    dataOut.physicianSpecialty = formDom.physicianSpecialty.data;
    dataOut.physicianSignature = formDom.physicianSignature.data;
    dataOut.physiciansSignatureDate = formDom.physiciansSignatureDate.data;
    return dataOut;
  }

  function collectClaimant(dataOut) {
    dataOut.formCompletedBy = formDom.formCompletedBy.data;
    dataOut.claimantOrGuardianName = formDom.claimantOrGuardianName.data;
    dataOut.spouseName = formDom.spouseName.data;
    dataOut.propertyStreetAddress = formDom.propertyStreetAddress.data;
    dataOut.propertyCity = formDom.propertyCity.data;
    dataOut.propertyZipCode = formDom.propertyZipCode.data;
    dataOut.propertyParcelNumber = formDom.propertyParcelNumber.data;
    dataOut.partAOrBChoice = formDom.partAOrBChoice.data;
    dataOut.descriptionA = formDom.descriptionA.data;
    dataOut.claimantOrGuardianEsignature = formDom.claimantOrGuardianEsignature.data;
    dataOut.claimantOrGuardianSignatureDate = formDom.claimantOrGuardianSignatureDate.data;
    dataOut.claimantOrGuardianPhone = formDom.claimantOrGuardianPhone.data;
    dataOut.spouseEsignature = formDom.spouseEsignature.data;
    dataOut.spouseSignatureDate = formDom.spouseSignatureDate.data;
    dataOut.spousePhone = formDom.spousePhone.data;
    return dataOut;
  }

  //Import view and set view startup preferences
  function domInit() {
    for (var prop in formDom) {
      if (formDom.hasOwnProperty(prop)) {
        formDom[prop].init();
      }
    }
    formDom.patientName.el.focus();
  }

//Load the Dom
  domInit();


  //testing responsive points
  // window.addEventListener('resize', function(e){
  //   console.clear();
  //   console.log(innerHeight, innerWidth);
  //   console.log(outerHeight, outerWidth);
  // })
})();