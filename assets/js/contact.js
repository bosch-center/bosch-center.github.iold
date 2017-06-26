/* On form validation */
var form = $("form#contactForm").submit(function(event) {
  // No page reload
  event.preventDefault();

  // Client side reCaptcha check
  if (grecaptcha.getResponse().length == 0) {
    return captchaEmpty();
  }

  // Disable button and reset result message
  form.find("button").text("Sending...");
  $(".submit-btn").toggleClass('disabled');
  $("#result").removeClass();
  $("#result").text("");

  // Get fields data and replace newlines in message content
  var params = form.serializeArray().reduce(function(obj, item) {
      obj[item.name] = item.value;
      return obj;
  }, {});
  params.message = params.message.replace(/(?:\r\n|\r|\n)/g, '<br/>');

  // Send request
  emailjs.send("default_service", "mjsform", params).then(
    function(){
      formSuccess();
    },
    function(err) {
      formError(err);
  });
});

/* Shake dat captcha */
function captchaEmpty() {
  $(".g-recaptcha").removeClass().addClass('g-recaptcha shake animated')
    .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
    function () {
      $(".g-recaptcha").removeClass().addClass('g-recaptcha');
  });
}

function formSuccess() {
  // Reset captcha + button + form fields
  grecaptcha.reset();
  form.find("button").text("Send !");
  $(".submit-btn").toggleClass('disabled');
  $("#contactForm")[0].reset();
  $(".active").removeClass();
  document.getElementById('message').style.height = "22px";

  // Display result message
  var msg = "Your message has been sent ! Thanks for using this form. :)";
  $("#result").removeClass().addClass("h3 text-center fadeInUp animated text-success").text(msg);
}

function formError(err) {
  // Reset button & display result message
  $(".submit-btn").toggleClass('disabled');
  form.find("button").text("Send again ?");
  var msg = "Oops! Something went wrong.. Your message was not sent, sorry. :/";
  $("#result").removeClass().addClass("h3 text-center fadeInUp animated text-danger").text(msg);

  // Shake dat form
  $("#contactForm").removeClass().addClass('shake animated')
    .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
    function () {
      $("#contactForm").removeClass();
  });
}
