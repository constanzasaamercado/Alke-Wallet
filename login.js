$(document).ready(function() {
    const emailCorrecto = "correo@gmail.com";
    const passwordCorrecta = '12345';

    $('#login').submit(function(event) {
        event.preventDefault();
        let datoEmail = $('#email').val();
        let datoPassword = $('#password').val();

        if (datoEmail === emailCorrecto && datoPassword === passwordCorrecta) {
            $('#login').fadeOut(300, function() {
                $('#loader').fadeIn(300);

                setTimeout(function() {
                    $('body').fadeOut(500, function() {
                        window.location.assign("menu.html");
                    });
                }, 1500); 
            });
        } else {
            alert('Datos incorrectos');
        }
    });
});