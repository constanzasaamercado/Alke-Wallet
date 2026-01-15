$(document).ready(function () {
    function redireccionar(pantalla, url) {
        const mensaje = `Redirigiendo a ${pantalla}...`;

        $('#mensaje-redireccion')
            .text(mensaje)
            .removeClass('d-none alert-danger')
            .addClass('alert alert-info')
            .fadeIn();

        setTimeout(function () {
            window.location.href = url;
        }, 1500);
    }

    $('#btn-depositar').on('click', function () {
        redireccionar("Depositar", "../html/deposit.html");
    });

    $('#btn-enviar').on('click', function () {
        redireccionar("Enviar Dinero", "../html/sendmoney.html");
    });

    $('#btn-movimientos').on('click', function () {
        redireccionar("Últimos Movimientos", "../html/transactions.html");
    });

    function updateSaldoDisplay() {
        let saldo = localStorage.getItem('saldo');
        if (saldo === null) {
            saldo = "60000"; 
            localStorage.setItem('saldo', saldo);
        }
        $('#saldo-display').text(new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(saldo));
    }

    updateSaldoDisplay();
});