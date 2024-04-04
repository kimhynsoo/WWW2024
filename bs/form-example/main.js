$(document).ready(function() {
    $("#warning-alert").hide();

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();

          $("#warning-alert").fadeTo(2000, 500).slideUp(500, function() {
            $("#warning-alert").slideUp(500);
         });
        }

        form.classList.add('was-validated');
      }, false);
    });
  });
