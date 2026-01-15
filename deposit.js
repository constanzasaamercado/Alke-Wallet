$(document).ready(function() {
    function mostrarSaldoActual() {
        let saldo = localStorage.getItem('saldo') || "0";
        let saldoFormateado = new Intl.NumberFormat('es-CL', { 
            style: 'currency', 
            currency: 'CLP', 
            maximumFractionDigits: 0 
        }).format(saldo);
        
        $('#saldo-display').text(saldoFormateado);
    }

    mostrarSaldoActual();

    $('#btn-realizar-deposito').on('click', function(e) {
        e.preventDefault();

        const montoIngresado = parseInt($('#depositAmount').val());

        if (isNaN(montoIngresado) || montoIngresado <= 0) {
            alert('Ingrese un monto válido');
            return;
        }

        const saldoActual = parseInt(localStorage.getItem('saldo')) || 0;
        const nuevoSaldo = saldoActual + montoIngresado;
        localStorage.setItem('saldo', nuevoSaldo);

        if (typeof registrarMovimiento === 'function') {
            const detalle = `Depósito ${formatCLP(montoIngresado)}`;
            registrarMovimiento('Depósito', montoIngresado, detalle);
        }

        const mensajeExito = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>¡Depósito exitoso!</strong> Has depositado ${montoIngresado}.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;

        $('#alert-container').html(mensajeExito);

        $('#confirmacion-monto').text(`Último depósito realizado: $${montoIngresado}`).fadeIn();

        mostrarSaldoActual();
        $('#depositAmount').val(''); 

        setTimeout(function() {
            window.location.href = 'menu.html';
        }, 2000);
    });
});