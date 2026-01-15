$(document).ready(() => {
    const tabla = $('#tabla-movimientos');
    const historial = JSON.parse(localStorage.getItem('movimientos')) || [];

    if (historial.length === 0) {
        tabla.html('<tr><td colspan="4" style="text-align:center;">No hay movimientos registrados.</td></tr>');
        return;
    }

    historial.forEach(mov => {
        const fila = $('<tr>');
        const colorMonto = mov.tipo === "Depósito" ? "green" : "red";
        const simbolo = mov.tipo === "Depósito" ? "+" : "-";

        fila.html(`
            <td>${mov.fecha}</td>
            <td>${mov.tipo}</td>
            <td>${mov.detalle}</td>
            <td style="color: ${colorMonto}; font-weight: bold;">
                ${simbolo} $${mov.monto}
            </td>
        `);
        tabla.append(fila);
    });

    $('#btn-volver').on('click', () => {
        window.location.href = 'menu.html';
    });
});