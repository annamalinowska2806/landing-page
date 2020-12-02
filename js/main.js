$(document).ready(function(){
  var apiUrlAutka = "https://autka2.mfind.pl/cars";
  var $list = $('.make-name');
  $('.make-name').ready(function() {
    $.ajax({
      url : apiUrlAutka,
      type: "get",
      dataType : 'json'
    })
    .done(function(res) {
      res.sort(function(a, b){
        if(a.make_name < b.make_name) { return -1; }
        if(a.make_name > b.make_name) { return 1; }
        return 0;
      });
      res.forEach(function(el) {
        $list.append("<option value="+ el.make_name +">"+el.make_name+"</option>");
      })
    })
  });

  $('.openmodale').click(function (e) {
    e.preventDefault();
    $('.modale').addClass('opened');
  });
  $('.closemodale').click(function (e) {
    e.preventDefault();
    $('.modale').removeClass('opened');
  });
});


  var app = {
    init: function(){
      this.cacheDOM();
      this.setupAria();
      this.nextButton();
      this.prevButton();
      this.startOver();
      this.editForm();
      this.killEnterKey();
      this.handleStepClicks();
    },

    cacheDOM: function(){
      if($(".multi-step-form").size() === 0){ return; }
      this.$formParent = $(".multi-step-form");
      this.$form = this.$formParent.find("form");
      this.$formStepParents = this.$form.find("fieldset"),

      this.$nextButton = this.$form.find(".btn-next");
      this.$prevButton = this.$form.find(".btn-prev");
      this.$editButton = this.$form.find(".btn-edit");
      this.$resetButton = this.$form.find("[type='reset']");

      this.$stepsParent = $(".steps");
      this.$steps = this.$stepsParent.find("button");
    },

    htmlClasses: {
      activeClass: "active",
      hiddenClass: "hidden",
      visibleClass: "visible",
      editFormClass: "edit-form",
      animatedVisibleClass: "animated fadeIn",
      animatedHiddenClass: "animated fadeOut",
      animatingClass: "animating"
    },

    setupAria: function(){
      this.$formStepParents.eq(0).attr("aria-hidden",false);
      this.$formStepParents.not(":first").attr("aria-hidden",true);
      app.handleAriaExpanded();
    },

    nextButton: function() {
      this.$nextButton.on("click", function(e){
      e.preventDefault();
      var $this = $(this),
      currentParent = $this.closest("fieldset"),
      nextParent = currentParent.next();

      if(app.checkForValidForm()){
      currentParent.removeClass(app.htmlClasses.visibleClass);
      app.showNextStep(currentParent, nextParent);
    }
  });
},

prevButton: function(){
  this.$prevButton.on("click", function(e){
    e.preventDefault();
    var $this = $(this),
    currentParent = $(this).closest("fieldset"),
    prevParent = currentParent.prev();
    currentParent.removeClass(app.htmlClasses.visibleClass);
    app.showPrevStep(currentParent, prevParent);
  });
},

showNextStep: function(currentParent,nextParent) {
  currentParent
  .addClass(app.htmlClasses.hiddenClass)
  .attr("aria-hidden",true);
  nextParent
  .removeClass(app.htmlClasses.hiddenClass)
  .addClass(app.htmlClasses.visibleClass)
  .attr("aria-hidden",false);
  nextParent.focus();
  app.handleState(nextParent.index());
  app.handleAriaExpanded();
},

showPrevStep: function(currentParent,prevParent){
  currentParent
  .addClass(app.htmlClasses.hiddenClass)
  .attr("aria-hidden",true);
  prevParent
  .removeClass(app.htmlClasses.hiddenClass)
  .addClass(app.htmlClasses.visibleClass)
  .attr("aria-hidden",false);
  prevParent.focus();
  app.handleState(prevParent.index());
  app.handleAriaExpanded();
},

handleAriaExpanded: function() {
  $.each(this.$nextButton, function(idx,item){
    var controls = $(item).attr("aria-controls");
    if($("#"+controls).attr("aria-hidden") == "true"){
      $(item).attr("aria-expanded",false);
    } else {
      $(item).attr("aria-expanded",true);
    }
  });

  $.each(this.$prevButton, function(idx,item){
    var controls = $(item).attr("aria-controls");
    if($("#"+controls).attr("aria-hidden") == "true") {
      $(item).attr("aria-expanded",false);
    } else {
      $(item).attr("aria-expanded",true);
    }
  });
},

checkForValidForm: function(){
  if(this.$form.valid()){
    return true;
  }
},

startOver: function(){
  var $parents = this.$formStepParents,
  $firstParent = this.$formStepParents.eq(0),
  $formParent = this.$formParent,
  $stepsParent = this.$stepsParent;
  this.$resetButton.on("click", function(e){
    $parents
    .removeClass(app.htmlClasses.visibleClass)
    .addClass(app.htmlClasses.hiddenClass)
    .eq(0).removeClass(app.htmlClasses.hiddenClass)
    .eq(0).addClass(app.htmlClasses.visibleClass);
    $formParent.removeClass(app.htmlClasses.editFormClass);
    app.handleState(0);
    app.setupAria();
    setTimeout(function(){
      $firstParent.focus();
    },200);
  });
},

  handleState: function(step){
    this.$steps.eq(step).prevAll().removeAttr("disabled");
    this.$steps.eq(step).addClass(app.htmlClasses.activeClass);
    if(step === 0){
      this.$steps
      .removeClass(app.htmlClasses.activeClass)
      .attr("disabled","disabled");
      this.$steps.eq(0).addClass(app.htmlClasses.activeClass)
    }
  },

  editForm: function(){
    var $formParent = this.$formParent,
    $formStepParents = this.$formStepParents,
    $stepsParent = this.$stepsParent;
    this.$editButton.on("click",function(){
      $formParent.toggleClass(app.htmlClasses.editFormClass);
      $formStepParents.attr("aria-hidden",false);
      $formStepParents.eq(0).find("input").eq(0).focus();
      app.handleAriaExpanded();
    });
  },

  killEnterKey: function(){
    $(document).on("keypress", ":input:not(textarea,button)", function(event) {
      return event.keyCode != 13;
    });
  },

  handleStepClicks: function(){
    var $stepTriggers = this.$steps,
    $stepParents = this.$formStepParents;
    $stepTriggers.on("click", function(e){
      e.preventDefault();
      var btnClickedIndex = $(this).index();
      $stepTriggers.nextAll()
      .removeClass(app.htmlClasses.activeClass)
      .attr("disabled",true);
      $(this)
      .addClass(app.htmlClasses.activeClass)
      .attr("disabled",false)
      $stepParents
      .removeClass(app.htmlClasses.visibleClass)
      .addClass(app.htmlClasses.hiddenClass)
      .attr("aria-hidden",true);
      $stepParents.eq(btnClickedIndex)
      .removeClass(app.htmlClasses.hiddenClass)
      .addClass(app.htmlClasses.visibleClass)
      .attr("aria-hidden",false)
      .focus();
    });
  }
};
app.init();

var apiUrl = "https://api.mfind.pl/calculations/auto/create" + window.location.search;
var errorMessage = function() {
  $('.multi-step-form').hide();
  $('#krok-5').removeClass('hide');
};

var formHandler = function(form) {
  var submitBtn = $(form).find('button');
  submitBtn.addClass('loading').prop('disabled', true);
  $.ajax({
    url: apiUrl,
    method : 'POST',
    dataType : 'json',
    data : $(form).serialize(),
    headers: {
      'Authorization': 'Basic bWZpbmRfYXBpOjdEMVNFZDVMNHdqNg==',
      'Accept': 'application/json'
    },
    success: function(response) {
      if (response.success) {
        $('.multi-step-form').hide();
        $('#krok-5').removeClass('hide');
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'calculationCreated',
          calculation_id: response.id
        });
      } else {
        errorMessage();
      }
    },
    error: errorMessage
  })
  .always(function() {
    submitBtn.removeClass('loading').prop('disabled', false);
  });
};

$('#contactForm1').validate({
  rules: {
    phone: {
      required: true
    },
    'agreements[]': {
      required: true
    }
  },
  submitHandler: formHandler
});

$('#contactForm2').validate({
  rules: {
    phone: {
      required: true
    },
    'agreements[]': {
      required: true
    }
  },
  messages: {
    phone: "Pole wymagane.",
    'agreements[]': "Proszę zaznaczyć zgodę."
  },
  submitHandler: formHandler
});

$.extend($.validator.messages, {
  required: 'Należy podać jedną z opcji',
  phone: 'Proszę wpisać prawidłowy numer',
  maxlength: $.validator.format('Proszę wpisać nie więcej niż {0} znaków.'),
  minlength: $.validator.format('Proszę wpisać przynajmniej {0} znaków.'),
});
