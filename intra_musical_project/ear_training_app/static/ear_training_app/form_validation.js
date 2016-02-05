var formValidation = (function () {

    var MINLENGTH = 3;

    return {
        disableDefaultValidation: function() {
            document.forms[0].noValidate = true;
        },
        requiredFieldsFilled: function(form) {
            var formIsValid = true;
            var requiredFields = _.filter(form.elements,
                function(elem) { return elem.required; }
                );
            for(var i = 0; i < requiredFields.length; i++) {
                var field = requiredFields[i];
                if (field.value == '' || field.value == null) {
                    formIsValid = false;
                }
            }
            return formIsValid;
        },
        /*
        Validate input in required fields on "change" events.
        */
        validateMinLength: function (event) {
            return event.target.value.length >= MINLENGTH;
        }
    }
}());

formValidation.disableDefaultValidation();
var form = document.forms[0],
    elements = form.elements;
for (var i = 0; i < elements.length; i++) {
    var field = elements[i];
    if (field.required) {
        field.addEventListener("input", function (event) {
            if (!formValidation.validateMinLength(event)) {
                event.target.classList.add('invalid');
            } else {
                if (event.target.classList.contains("invalid")) {
                    event.target.classList.remove("invalid");
                }
            }
        });
    }
}
