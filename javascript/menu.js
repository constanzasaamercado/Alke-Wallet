$(document).ready(function () {
    $("#menu-toggle, #sidebar-overlay").on('click', function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
        $("#sidebar-overlay").toggleClass("d-none");
    });

    function redireccionar(pantalla, url) {
        const mensaje = `Redirigiendo a ${pantalla}...`;
        $('#mensaje-redireccion').text(mensaje).removeClass('d-none alert-danger').addClass('alert alert-info').fadeIn();
        setTimeout(function () { window.location.href = url; }, 1500);
    }

    $('#btn-depositar').on('click', () => redireccionar("Depositar", "deposit.html"));
    $('#btn-enviar').on('click', () => redireccionar("Enviar Dinero", "sendmoney.html"));
    $('#btn-movimientos').on('click', () => redireccionar("Últimos Movimientos", "transactions.html"));
    
    $('#btn-logout').on('click', function (e) {
        e.preventDefault(); 
        localStorage.removeItem('usuarioLogueado'); 
        redireccionar("Login", "login.html");
    });

    function updateSaldoDisplay() {
        let saldo = localStorage.getItem('saldo') || "60000"; 
        $('#saldo-display').text(new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(saldo));
    }
    updateSaldoDisplay();
});