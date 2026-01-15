function registrarMovimiento(tipo, monto, detalle) {
    const raw = localStorage.getItem('movimientos');
    let historial = [];
    try { historial = raw ? JSON.parse(raw) : []; } catch (e) { historial = []; }
    const mov = {
        fecha: new Date().toLocaleString(),
        tipo,
        monto: Number(monto),
        detalle: detalle || ''
    };
    historial.unshift(mov);
    localStorage.setItem('movimientos', JSON.stringify(historial));
}

function obtenerMovimientos() {
    try { return JSON.parse(localStorage.getItem('movimientos')) || []; } catch (e) { return []; }
}