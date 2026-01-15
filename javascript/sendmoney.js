$(document).ready(function() {
    const $btnGuardar = $('#btn-guardar-contacto');
    const $btnEnviar = $('#btn-enviar-dinero');
    const $listaUL = $('#lista-contactos-ul');
    const $listaSelect = $('#lista-contactos-select');
    const $searchInput = $('#search');
    const $btnBuscar = $('#btn-buscar');
    const $datalist = $('#datalistOptions');
    const $searchResults = $('#search-results');

    function formatCLPLocal(value) {
        const n = Math.round(Number(value) || 0);
        if (typeof formatCLP === 'function') return formatCLP(n);
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);
    }

    function populateContactSources() {
        if ($listaSelect.length) $listaSelect.html('<option value="">Seleccione un contacto...</option>');
        if ($datalist.length) $datalist.empty();
        if (!$listaUL.length) return;
        $listaUL.find('li').each(function() {
            const text = $(this).text().trim();
            if ($listaSelect.length) {
                const $opt = $('<option>').val(text).text(text);
                $listaSelect.append($opt);
            }
            if ($datalist.length) {
                const $opt2 = $('<option>').val(text);
                $datalist.append($opt2);
            }
        });
    }

    function buscarContacto() {
        const q = ($searchInput.length ? $searchInput.val() : '').trim().toLowerCase();
        if (!q) {
            if ($searchResults.length) $searchResults.text('Ingresa un término para buscar.');
            return;
        }
        const opciones = $listaSelect.length ? $listaSelect.find('option').slice(1).toArray() : [];
        const matches = opciones.filter(o => o.value.toLowerCase().includes(q));
        if (matches.length === 0) {
            if ($searchResults.length) $searchResults.text('No se encontraron contactos.');
            return;
        }
        $listaSelect.val(matches[0].value);
        if ($searchResults.length) $searchResults.text(`${matches.length} resultado(s) — seleccionado: ${matches[0].value}`);
        if ($listaUL.length) {
            const $liMatch = $listaUL.find('li').filter(function() {
                return $(this).text().trim() === matches[0].value;
            }).first();
            if ($liMatch.length) $liMatch[0].scrollIntoView({ block: 'nearest' });
        }
    }

    populateContactSources();

    if ($btnGuardar.length) {
        $btnGuardar.on('click', function() {
            const $nombreEl = $('#nombre');
            const $cbuEl = $('#cbu');
            const nombre = $nombreEl.length ? $nombreEl.val().trim() : '';
            const cbu = $cbuEl.length ? $cbuEl.val().trim() : '';

            if (!nombre || !cbu) {
                alert('Completa nombre y CBU.');
                return;
            }

            const text = `${nombre} (CBU: ${cbu})`;
            if ($listaUL.length) {
                const $li = $('<li>').addClass('list-group-item').text(text);
                $listaUL.append($li);
            }
            populateContactSources();

            if ($nombreEl.length) $nombreEl.val('');
            if ($cbuEl.length) $cbuEl.val('');
            alert('Contacto guardado exitosamente.');
        });
    }

    if ($btnBuscar.length) $btnBuscar.on('click', buscarContacto);
    if ($searchInput.length) $searchInput.on('keydown', function(e) { if (e.key === 'Enter') { e.preventDefault(); buscarContacto(); } });

    if ($btnEnviar.length) {
        $btnEnviar.on('click', function(e) {
            e.preventDefault();
            const $montoEl = $('#monto-enviar');
            const monto = $montoEl.length ? parseFloat(String($montoEl.val()).replace(',', '.')) : NaN;
            const contacto = $listaSelect.length ? $listaSelect.val().trim() : '';

            if (!contacto) return alert('Selecciona un contacto.');
            if (isNaN(monto) || monto <= 0) return alert('Ingresa un monto válido.');

            let saldo = Number.parseFloat(localStorage.getItem('saldo'));
            if (!Number.isFinite(saldo)) {
                const $display = $('#saldo-display');
                saldo = $display.length ? Number.parseFloat($display.text().replace(/[^\d.-]/g, '')) || 0 : 0;
            }

            if (monto > saldo) return alert('Saldo insuficiente.');

            const nuevoSaldo = Number((saldo - monto).toFixed(2));
            localStorage.setItem('saldo', String(nuevoSaldo));

            if (typeof registrarMovimiento === 'function') {
                registrarMovimiento('Transferencia', monto, `A: ${contacto} — ${formatCLPLocal(monto)}`);
            }
            const $display = $('#saldo-display');
            if ($display.length) $display.text(formatCLPLocal(nuevoSaldo));

            showMessage('Transferencia realizada. Redirigiendo...', 'success', 1400);
            setTimeout(() => window.location.href = 'menu.html', 1400);
        });
    }
});

function registrarMovimiento(tipo, monto, detalle) {
    let historial = JSON.parse(localStorage.getItem('movimientos')) || [];

    const nuevoMovimiento = {
        tipo: tipo, 
        monto: monto,
        detalle: detalle,
        fecha: new Date().toLocaleString() 
    };

    historial.unshift(nuevoMovimiento);
    localStorage.setItem('movimientos', JSON.stringify(historial));
}

    function showMessage(text, type = 'info', timeout = 1400) {
        let $el = $('#mensaje-redireccion');
        if (!$el.length) {
            $el = $('<div>').attr({
                'id': 'mensaje-redireccion',
                'role': 'status',
                'aria-live': 'polite'
            }).addClass('alert alert-info d-none mt-2');
            $('body').append($el);
        }
        $el.text(text);
        $el.removeClass('d-none alert-info alert-success alert-warning alert-danger');
        $el.addClass('alert ' + `alert-${type}`);
        if (timeout > 0) setTimeout(() => $el.addClass('d-none'), timeout);
    }