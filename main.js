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
    formCompletedBy: new FormObject(document.getElementById('completed-by-choices')),
    claimantOrGuardianName: new FormObject(document.getElementById('claimant-name'), true),
    spouseName: new FormObject(document.getElementById('spouse-name')),
    propertyStreetAddress: new FormObject(document.getElementById('street-address'), true),
    propertyCity: new FormObject(document.getElementById('city'), true),
    propertyZipCode: new FormObject(document.getElementById('zip-code'), true),
    propertyParcelNumber: new FormObject(document.getElementById('parcel-number'), true),
    partAOrBChoice: new FormObject(document.getElementById('a-or-b')),
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

  //Define FormObject initialization
  FormObject.prototype.init = function () {
    var self = this;
    //Set required class
    if(this.required){
      this.el.classList.add('required');
    }
    //bind data and validate values on inputs with change onChange
    if(this.el.nodeName && this.el.nodeName === 'INPUT' || this.el.nodeName === 'TEXTAREA'){
      this.el.addEventListener('change', function (e) {
        self.isDirty = true;
        //bind element value for text, data, email and textarea
        if(self.el.type === 'text' || self.el.type === 'date' || self.el.type === 'textarea' || self.el.type === 'email' || self.el.type ==='number'){
          self.data = e.target.value;
        }
        if(self.el.type === 'checkbox'){
          self.data = e.target.checked;
        }
        self.validate();
      });
    }
    //bind data from radio group
    if(this.el.nodeName && this.el.nodeName === 'UL'){
      this.el.addEventListener('click', function(e){
        self.data = e.target.value;
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
      this.isValid = regX.test(this.data);
    }
    if (this.el.type === 'textarea') {
      this.isvalid = this.data.length > 20; //++++++++++++need to change this accept only certain characters, but more characters than what is allowed in type text
      this.isValid = regX.test(this.data);
    }
    if (this.el.type === 'email'){
      console.log(this.data);
      regX = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(]?)$/;
      this.isValid = regX.test(this.data);
    }
    if (this.el.type === 'date'){
      var test = new Date(this.data);
      if(test.getDate()) this.isValid = true;
      else this.isValid = false;
    }
    if (this.el.getAttribute('placeholder') === 'Numbers Only'){
      this.isValid = this.data.length === 7; //phone number
    }
    if(this.el.classList.contains('digital-signature')){
      if(!(this.data.length > 12)) this.isValid = false;//Would be changed to whatever a valid digital signature hash requires
      else this.isValid = true;
    }
    this.markStatus();
  };

  FormObject.prototype.markStatus = function () {
    if (this.isValid) {
      this.el.classList.add('isvalid');
      this.el.classList.remove('invalid');
      this.el.classList.remove('required');
      if(this.required){
        this.el.classList.add('required-isvalid');
        this.el.classList.remove('required-invalid');
      }
    }
    else {
      if (this.isDirty) {
        this.el.classList.add('invalid');
        this.el.classList.remove('isValid');
        this.el.classList.remove('required');
        if(this.required){
          this.el.classList.add('required-invalid');
          this.el.classList.remove('required-isvalid');
        }
      }
    }
  };


  //View methods*******************************************************************************************************
  //set up form section visibility
  formDom.btnTogglePhysician.el.addEventListener('click', function(e){
    if(formDom.sectionPhysician.el.classList.contains('hide')) toggleVisibility(formDom.sectionPhysician.el);
    if(!(formDom.sectionClaimant.el.classList.contains('hide'))) toggleVisibility(formDom.sectionClaimant.el);
  }.bind(this));

  formDom.btnToggleClaimant.el.addEventListener('click', function(e){
    if(formDom.sectionClaimant.el.classList.contains('hide')) toggleVisibility(formDom.sectionClaimant.el);
    if(!(formDom.sectionPhysician.el.classList.contains('hide'))) toggleVisibility(formDom.sectionPhysician.el);
  }.bind(this));

  formDom.btnSectionAll.el.addEventListener('click', function(e){
    if(formDom.sectionClaimant.el.classList.contains('hide')) toggleVisibility(formDom.sectionClaimant.el);
    if(formDom.sectionPhysician.el.classList.contains('hide')) toggleVisibility(formDom.sectionPhysician.el);
  }.bind(this));

  

  

  //Buttons
  formDom.btnPhysicianSignature.el.addEventListener('click', function(e){
    handleESign(formDom.physicianSignature, formDom.physiciansSignatureDate, e);
  }.bind(this), event);

  formDom.btnClaimantOrGuardianEsigned.el.addEventListener('click', function(e){
    handleESign(formDom.claimantOrGuardianEsignature, formDom.claimantOrGuardianSignatureDate, e);
  }.bind(this), event);

  formDom.btnSpouseEsigned.el.addEventListener('click', function(e){
    handleESign(formDom.spouseEsignature, formDom.spouseSignatureDate, e);
  }.bind(this), event);

  //helpers
  function toggleVisibility(el){
    if(el.classList.contains('hide')){
      el.classList.remove('hide');
    }
    else el.classList.add('hide');
  }

  function displayChoiceNodes(grandFatherEl, choice){
    switch(grandFatherEl.id){
      case 'completed-by-choices':
        var lbl;
        switch (choice){
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
        switch (choice){
          case 'A':
            if(formDom.descriptionA.el.classList.contains('hide')){
              toggleVisibility(formDom.descriptionA.el);
              toggleVisibility(formDom.certA.el);
            }
            if(!(formDom.certB.el.classList.contains('hide'))) toggleVisibility(formDom.certB.el);
            formDom.descriptionA.required = true;
            break;
          case 'B':
            if(formDom.certB.el.classList.contains('hide')) toggleVisibility(formDom.certB.el);
            if(!(formDom.certA.el.classList.contains('hide'))){
              toggleVisibility(formDom.descriptionA.el);
              toggleVisibility(formDom.certA.el);
            }
            formDom.descriptionA.required = false;
            break;
        }
        break;
    }
  }
  
  function handleESign(objSignature, objDate, event){
    if(objSignature.el.value.length < 12){
      objSignature.isValid = false;
      objSignature.required = true;
      objSignature.isDirty = true;
      objSignature.init();
      objSignature.markStatus();
    }
    objDate.required = true;
    objDate.isDirty = true;
    objDate.init();
    objDate.validate();
    if(objDate.isValid && objSignature.isValid){
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
  
//Load the Dom
  for (var prop in formDom) {
    if (formDom.hasOwnProperty(prop)) {
      formDom[prop].init();
    }
  }


  //testing
  window.addEventListener('resize', function(e){
    console.clear();
    console.log(innerHeight, innerWidth);
    console.log(outerHeight, outerWidth);
  })
})();