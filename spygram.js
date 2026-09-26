(async () => {
  'use strict';
  /*
   * Spygram v1.2
   * Descubre quién no te sigue de vuelta en Instagram y deja de seguir con pausas seguras.
   * Uso: ejecutar en https://www.instagram.com con la sesión iniciada.
   *
   * Autor: Panditax727 (https://github.com/Panditax727)
   * © 2026 Panditax727. Todos los derechos reservados.
   */
  const VERSION = '1.2';
  const AUTOR = 'Panditax727';
  if (!/(^|\.)instagram\.com$/.test(location.hostname)) { alert('Abre https://www.instagram.com, inicia sesión y vuelve a ejecutar el script.'); return; }
  if (window.__spygram) { window.__spygram.host.style.display = ''; return; }

  const cookie = n => (document.cookie.match('(?:^|;)\\s*' + n + '=([^;]*)') || [])[1];
  const myId = cookie('ds_user_id');
  if (!myId) { alert('No encuentro tu sesión. Inicia sesión en instagram.com y vuelve a ejecutar el script.'); return; }

  const H = { 'X-IG-App-ID': '936619743392459', 'X-Requested-With': 'XMLHttpRequest' };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const rnd = (a, b) => a + Math.random() * (b - a);
  const LS = {
    get(k, d) { try { const v = localStorage.getItem('spygram:' + k) || localStorage.getItem('radarIG:' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('spygram:' + k, JSON.stringify(v)); } catch (e) {} }
  };

  const S = {
    following: new Map(), followers: new Map(), lost: [],
    whitelist: new Set(LS.get('whitelist', [])),
    selected: new Set(), tab: 'nofollow', q: '', hideVerified: false, hideWl: true,
    busy: false, stop: false
  };

  /* ---------- UI (sin innerHTML, compatible con Trusted Types) ---------- */
  const h = (tag, props, ...kids) => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (k === 'on') for (const [ev, fn] of Object.entries(v)) el.addEventListener(ev, fn);
      else if (k === 'class') el.className = v;
      else if (k in el && k !== 'style') el[k] = v;
      else el.setAttribute(k, v);
    }
    kids.flat().forEach(c => c != null && c !== false && el.append(c.nodeType ? c : String(c)));
    return el;
  };

  const host = h('div', { id: 'spygram-host' });
  host.style.cssText = 'position:fixed;inset:0;z-index:2147483647;pointer-events:none';
  const root = host.attachShadow({ mode: 'open' });
  root.append(h('style', {}, `
    :host{all:initial}
    .p{pointer-events:auto;position:fixed;top:12px;right:12px;bottom:12px;width:min(460px,calc(100vw - 24px));background:#17131a;color:#f3ecef;border:1px solid #3a2f36;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.5);display:flex;flex-direction:column;font:14px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;overflow:hidden}
    header{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid #3a2f36}
    h1{font-size:16px;margin:0;font-weight:800}
    h1 span{color:#ff6a98}
    button{font:inherit;color:inherit;background:#2a2229;border:1px solid #3a2f36;border-radius:8px;padding:6px 10px;cursor:pointer}
    button:hover{border-color:#8a7a83}
    button:disabled{opacity:.45;cursor:not-allowed}
    .pri{background:#ff6a98;color:#1a0b11;border-color:#ff6a98;font-weight:700}
    .dang{background:#c23a2b;border-color:#c23a2b;color:#fff;font-weight:700}
    .sec{padding:10px 14px;display:flex;flex-direction:column;gap:8px;border-bottom:1px solid #3a2f36}
    .row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
    .tabs{display:flex;gap:2px 4px;flex-wrap:wrap}
    .ini{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;font-weight:800;color:#fff}
    .tab{background:none;border:0;border-bottom:2px solid transparent;border-radius:0;padding:6px 8px;color:#a79ba2;font-weight:600;white-space:nowrap}
    .tab.on{color:#f3ecef;border-bottom-color:#ff6a98}
    input[type=search],input[type=number],select{font:inherit;color:inherit;background:#221c21;border:1px solid #3a2f36;border-radius:8px;padding:6px 8px}
    input[type=search]{flex:1;min-width:120px}
    input[type=number]{width:64px}
    label{display:inline-flex;gap:5px;align-items:center;color:#a79ba2;font-size:13px;cursor:pointer}
    input[type=checkbox]{accent-color:#ff6a98}
    .list{flex:1;overflow-y:auto}
    .it{display:grid;grid-template-columns:22px 36px 1fr auto;gap:10px;align-items:center;padding:8px 14px;border-bottom:1px solid #2a2229}
    .it img{width:36px;height:36px;border-radius:50%;background:#2a2229;object-fit:cover}
    .u a{color:#f3ecef;font-weight:700;text-decoration:none;word-break:break-all}
    .u a:hover{color:#ff6a98}
    .u small{display:block;color:#a79ba2;font-size:12px}
    .b{font-size:10.5px;padding:1px 6px;border-radius:99px;margin-left:4px;background:#2a2229;color:#a79ba2}
    .b.v{background:#12304a;color:#6cb6ff}
    .b.w{background:#2e2412;color:#f0b44a}
    .star{background:none;border:0;font-size:18px;color:#6f646a;padding:2px 6px}
    .star.on{color:#f0b44a}
    .done{opacity:.4;text-decoration:line-through}
    .log{max-height:110px;overflow-y:auto;font:12px/1.4 ui-monospace,Consolas,monospace;color:#a79ba2;padding:8px 14px;background:#120f14;border-top:1px solid #3a2f36;white-space:pre-wrap}
    .firma{display:flex;justify-content:space-between;gap:8px;padding:6px 14px;font-size:11.5px;color:#8a7a83;background:#120f14;border-top:1px solid #2a2229}
    .firma a{color:#ff6a98;text-decoration:none;font-weight:700}
    .firma a:hover{text-decoration:underline}
    .by{font-size:11px;font-weight:500;color:#8a7a83;margin-left:6px}
    .empty{padding:30px 14px;text-align:center;color:#a79ba2}
    .warn{font-size:12.5px;color:#f0b44a}
  `));

  const logBox = h('div', { class: 'log' });
  const log = msg => { const t = new Date().toLocaleTimeString('es-ES'); logBox.append(h('div', {}, `[${t}] ${msg}`)); logBox.scrollTop = 1e9; };

  const tabsBox = h('div', { class: 'tabs' });
  const listBox = h('div', { class: 'list' }, h('div', { class: 'empty' }, 'Pulsa «Escanear» para empezar. Puede tardar unos minutos si sigues a muchas cuentas.'));
  const scanBtn = h('button', { class: 'pri', on: { click: scan } }, 'Escanear');
  const stopBtn = h('button', { disabled: true, on: { click: () => { S.stop = true; log('Deteniendo…'); } } }, 'Detener');
  const search = h('input', { type: 'search', placeholder: 'Buscar @usuario o nombre', on: { input: e => { S.q = e.target.value.toLowerCase().replace(/^@/, ''); render(); } } });
  const cbVer = h('input', { type: 'checkbox', on: { change: e => { S.hideVerified = e.target.checked; render(); } } });
  const cbWl = h('input', { type: 'checkbox', checked: true, on: { change: e => { S.hideWl = e.target.checked; render(); } } });
  const selAllBtn = h('button', { on: { click: selectAll } }, 'Seleccionar visibles');
  const copyBtn = h('button', { on: { click: copyList } }, 'Copiar lista');
  const maxIn = h('input', { type: 'number', min: 1, max: 150, value: LS.get('max', 40), on: { change: e => LS.set('max', +e.target.value) } });
  const speedSel = h('select', {},
    h('option', { value: 'safe' }, 'Muy seguro (45–90 s)'),
    h('option', { value: 'normal' }, 'Normal (25–50 s)'));
  const unfBtn = h('button', { class: 'dang', disabled: true, on: { click: unfollowSelected } }, 'Dejar de seguir (0)');

  const panel = h('div', { class: 'p' },
    h('header', {}, h('h1', {}, 'Spy', h('span', {}, 'gram'), h('span', { class: 'by' }, 'v' + VERSION + ' · por ' + AUTOR)),
      h('div', { class: 'row' }, h('button', { on: { click: () => { host.style.display = 'none'; } } }, 'Ocultar'),
        h('button', { on: { click: () => { host.remove(); delete window.__spygram; } } }, 'Cerrar'))),
    h('div', { class: 'sec' }, h('div', { class: 'row' }, scanBtn, stopBtn), tabsBox),
    h('div', { class: 'sec' }, h('div', { class: 'row' }, search),
      h('div', { class: 'row' }, h('label', {}, cbVer, 'Ocultar verificados'), h('label', {}, cbWl, 'Ocultar lista blanca'))),
    listBox,
    h('div', { class: 'sec', style: 'border-top:1px solid #3a2f36;border-bottom:0' },
      h('div', { class: 'row' }, selAllBtn, copyBtn),
      h('div', { class: 'row' }, h('label', {}, 'Máx. por sesión', maxIn), speedSel),
      h('div', { class: 'row' }, unfBtn),
      h('div', { class: 'warn' }, 'Consejo: no pases de 100–150 al día. Si Instagram muestra un aviso, para y espera 24–48 h.')),
    logBox,
    h('div', { class: 'firma' },
      h('span', {}, '© 2026 ', h('a', { href: 'https://github.com/' + AUTOR, target: '_blank', rel: 'noopener' }, AUTOR), '. Todos los derechos reservados.'),
      h('span', {}, 'Spygram v' + VERSION)));
  root.append(panel);
  document.body.append(host);
  window.__spygram = { host };

  /* ---------- API ---------- */
  async function api(url, opts = {}) {
    for (let intento = 1; intento <= 4; intento++) {
      if (S.stop) throw new Error('detenido');
      const r = await fetch(url, { credentials: 'include', ...opts, headers: { ...H, ...(opts.headers || {}) } });
      if (r.status === 429) {
        const espera = 120 * intento;
        log(`Instagram pide ir más despacio. Espero ${espera} s (intento ${intento}/4)…`);
        await sleep(espera * 1000); continue;
      }
      const txt = await r.text();
      let j; try { j = JSON.parse(txt); } catch (e) { j = null; }
      if (j && (j.message === 'feedback_required' || j.spam)) { const err = new Error('feedback_required'); err.block = true; throw err; }
      if (j && j.message === 'login_required') throw new Error('Se cerró la sesión. Vuelve a iniciar sesión.');
      if (!r.ok) throw new Error(`HTTP ${r.status}${j && j.message ? ' – ' + j.message : ''}`);
      return j || { __http: r.status, __redirect: r.redirected ? r.url : '', __raw: txt.slice(0, 120).replace(/\s+/g, ' ') };
    }
    throw new Error('Demasiados intentos. Prueba más tarde.');
  }

  async function fetchList(kind) {
    const out = new Map(); let maxId = ''; let pag = 0;
    do {
      const url = `/api/v1/friendships/${myId}/${kind}/?count=100` + (maxId ? `&max_id=${encodeURIComponent(maxId)}` : '');
      const j = await api(url);
      (j.users || []).forEach(u => out.set(String(u.pk || u.pk_id || u.id), {
        pk: String(u.pk || u.pk_id || u.id), username: u.username, name: u.full_name || '',
        pic: u.profile_pic_url || '', verified: !!u.is_verified, private: !!u.is_private
      }));
      maxId = j.next_max_id || '';
      pag++;
      log(`${kind === 'following' ? 'Seguidos' : 'Seguidores'}: ${out.size}…`);
      await sleep(rnd(900, 2200));
      if (pag % 12 === 0) { log('Pausa corta para no saturar…'); await sleep(rnd(8000, 15000)); }
    } while (maxId);
    return out;
  }

  const resumen = j => {
    if (!j) return 'sin respuesta';
    if (j.__http) return `HTTP ${j.__http}${j.__redirect ? ', redirigido a ' + j.__redirect : ''}: ${j.__raw || '(vacío)'}`;
    return JSON.stringify(j).slice(0, 160);
  };
  const siguiendo = j => {
    const f = j && (j.friendship_status || j);
    return f && typeof f.following === 'boolean' ? f.following : null;
  };
  async function unfollow(pk) {
    let claim = '0';
    try { claim = sessionStorage.getItem('www-claim-v2') || '0'; } catch (e) {}
    const intentos = [
      { url: `https://www.instagram.com/web/friendships/${pk}/unfollow/`, body: '' },
      { url: `https://www.instagram.com/api/v1/friendships/destroy/${pk}/`, body: `container_module=profile&nav_chain=&user_id=${pk}` }
    ];
    let j, errores = [];
    for (const it of intentos) {
      try {
        j = await api(it.url, {
          method: 'POST', mode: 'cors',
          headers: { 'X-CSRFToken': cookie('csrftoken'), 'X-IG-WWW-Claim': claim, 'Content-Type': 'application/x-www-form-urlencoded' },
          body: it.body
        });
        if (j && j.status === 'ok' && siguiendo(j) !== true) return { ok: true };
        errores.push(new URL(it.url).pathname.split('/').slice(1, 3).join('/') + ' → ' + resumen(j).slice(0, 90));
      } catch (e) {
        if (e.block || e.message === 'detenido') throw e;
        errores.push(new URL(it.url).pathname.split('/').slice(1, 3).join('/') + ' → ' + e.message);
      }
      await sleep(rnd(1200, 2500));
    }
    await sleep(rnd(1500, 3000));
    try {
      const chk = await api(`/api/v1/friendships/show/${pk}/`);
      if (siguiendo(chk) === false) return { ok: true };
    } catch (e) { if (e.block) throw e; }
    return { ok: false, info: errores.join(' | ') };
  }

  /* ---------- Lógica ---------- */
  function lists() {
    const nofollow = [], fans = [], wl = [];
    S.following.forEach((u, pk) => { if (!S.followers.has(pk)) nofollow.push(u); });
    S.followers.forEach((u, pk) => { if (!S.following.has(pk)) fans.push(u); });
    S.following.forEach(u => { if (S.whitelist.has(u.username)) wl.push(u); });
    return { nofollow, fans, lost: S.lost, wl };
  }

  function visible() {
    const L = lists()[S.tab] || [];
    return L.filter(u => (!S.q || u.username.toLowerCase().includes(S.q) || u.name.toLowerCase().includes(S.q))
      && !(S.hideVerified && u.verified)
      && !(S.hideWl && S.tab !== 'wl' && S.whitelist.has(u.username)))
      .sort((a, b) => a.username.localeCompare(b.username));
  }

  function render() {
    const L = lists();
    const T = [['nofollow', 'No te siguen'], ['fans', 'No sigues de vuelta'], ['lost', 'Te dejaron de seguir'], ['wl', 'Lista blanca']];
    tabsBox.replaceChildren(...T.map(([id, label]) => h('button', { class: 'tab' + (S.tab === id ? ' on' : ''), on: { click: () => { S.tab = id; render(); } } }, `${label} (${L[id].length})`)));
    const V = visible();
    const canSelect = S.tab === 'nofollow' || S.tab === 'wl';
    if (!S.following.size) { unfBtn.textContent = 'Dejar de seguir (0)'; unfBtn.disabled = true; return; }
    const shown = V.slice(0, 500);
    listBox.replaceChildren(...(shown.length ? shown.map(u => {
      const cb = h('input', { type: 'checkbox', checked: S.selected.has(u.pk), disabled: !canSelect, on: { change: e => { e.target.checked ? S.selected.add(u.pk) : S.selected.delete(u.pk); updBtn(); } } });
      const star = h('button', { class: 'star' + (S.whitelist.has(u.username) ? ' on' : ''), title: 'Lista blanca (nunca dejar de seguir)', on: { click: () => {
        S.whitelist.has(u.username) ? S.whitelist.delete(u.username) : (S.whitelist.add(u.username), S.selected.delete(u.pk));
        LS.set('whitelist', [...S.whitelist]); render();
      } } }, '★');
      return h('div', { class: 'it' + (u.done ? ' done' : ''), 'data-pk': u.pk },
        canSelect ? cb : h('span'),
        avatar(u),
        h('div', { class: 'u' },
          h('a', { href: `/${u.username}/`, target: '_blank', rel: 'noopener' }, '@' + u.username),
          u.verified ? h('span', { class: 'b v' }, 'verificado') : null,
          u.private ? h('span', { class: 'b' }, 'privada') : null,
          S.whitelist.has(u.username) ? h('span', { class: 'b w' }, 'lista blanca') : null,
          h('small', {}, u.name || ' ')),
        star);
    }) : [h('div', { class: 'empty' }, S.tab === 'nofollow' ? '¡Todos los que sigues te siguen de vuelta!' : S.tab === 'lost' ? 'Nadie nuevo desde tu escaneo anterior.' : 'No hay cuentas aquí.')]),
    ...(V.length > 500 ? [h('div', { class: 'empty' }, `Mostrando 500 de ${V.length}. Usa el buscador para acotar.`)] : []));
    updBtn();
  }
  const picCache = new Map();
  function initials(u) {
    let hue = 0; for (const c of u.username) hue = (hue * 31 + c.charCodeAt(0)) % 360;
    const d = h('div', { class: 'ini' }, (u.username.replace(/[^a-z0-9]/gi, '').charAt(0) || '@').toUpperCase());
    d.style.background = `hsl(${hue} 55% 42%)`;
    return d;
  }
  function avatar(u) {
    if (!u.pic || picCache.get(u.pic) === 'fail') return initials(u);
    const img = h('img', { alt: '', loading: 'lazy', decoding: 'async' });
    let tried = false;
    img.style.opacity = '0';
    img.addEventListener('load', () => { img.style.opacity = '1'; });
    img.addEventListener('error', async () => {
      if (!tried) {
        tried = true;
        try {
          const r = await fetch(u.pic, { credentials: 'omit' });
          if (!r.ok) throw new Error();
          const url = URL.createObjectURL(await r.blob());
          picCache.set(u.pic, url); img.src = url; return;
        } catch (e) {}
      }
      picCache.set(u.pic, 'fail');
      img.replaceWith(initials(u));
    });
    img.src = picCache.get(u.pic) || u.pic;
    return img;
  }

  function updBtn() {
    [...S.selected].forEach(pk => { if (!S.following.has(pk) || S.following.get(pk).done) S.selected.delete(pk); });
    unfBtn.textContent = `Dejar de seguir (${S.selected.size})`;
    unfBtn.disabled = S.busy || !S.selected.size;
  }
  function selectAll() {
    if (S.tab !== 'nofollow') { log('Solo puedes seleccionar en «No te siguen».'); return; }
    const V = visible().filter(u => !u.done && !S.whitelist.has(u.username));
    const all = V.every(u => S.selected.has(u.pk));
    V.forEach(u => all ? S.selected.delete(u.pk) : S.selected.add(u.pk));
    render();
  }
  async function copyList() {
    const txt = visible().map(u => '@' + u.username).join('\n');
    try { await navigator.clipboard.writeText(txt); log(`Copiadas ${visible().length} cuentas.`); }
    catch (e) { console.log(txt); log('No se pudo copiar; la lista está en la consola.'); }
  }
  function setBusy(b) { S.busy = b; S.stop = false; scanBtn.disabled = b; stopBtn.disabled = !b; updBtn(); }

  async function scan() {
    setBusy(true);
    try {
      log('Leyendo a quién sigues…');
      S.following = await fetchList('following');
      log('Leyendo quién te sigue…');
      S.followers = await fetchList('followers');
      const prev = LS.get('snapshot:' + myId, null);
      S.lost = [];
      if (prev) {
        prev.followers.forEach(p => { if (!S.followers.has(p.pk)) S.lost.push({ ...p, name: p.name || '', pic: p.pic || '' }); });
        log(`Comparado con tu escaneo del ${new Date(prev.date).toLocaleString('es-ES')}: ${S.lost.length} te dejaron de seguir.`);
      }
      LS.set('snapshot:' + myId, { date: Date.now(), followers: [...S.followers.values()].map(u => ({ pk: u.pk, username: u.username, name: u.name })) });
      S.selected.clear();
      log(`Listo. Sigues a ${S.following.size}, te siguen ${S.followers.size}. No te siguen: ${lists().nofollow.length}.`);
    } catch (e) {
      log(e.block ? 'Instagram ha limitado tu actividad temporalmente. Para y espera 24–48 h.' : 'Error: ' + e.message);
    }
    setBusy(false); render();
  }

  async function unfollowSelected() {
    const max = Math.max(1, Math.min(150, +maxIn.value || 40));
    const queue = [...S.selected].map(pk => S.following.get(pk)).filter(u => u && !u.done && !S.whitelist.has(u.username)).slice(0, max);
    if (!queue.length) return;
    const [a, b] = speedSel.value === 'safe' ? [45, 90] : [25, 50];
    const mins = Math.round(queue.length * (a + b) / 2 / 60 + Math.floor(queue.length / 10) * 5);
    if (!confirm(`Vas a dejar de seguir a ${queue.length} cuentas.\nTiempo estimado: ~${mins} min. Deja esta pestaña abierta.\n\n¿Continuar?`)) return;
    setBusy(true);
    let ok = 0, fallosSeguidos = 0;
    for (let i = 0; i < queue.length; i++) {
      if (S.stop) { log('Detenido por ti.'); break; }
      const u = queue[i];
      try {
        const res = await unfollow(u.pk);
        if (res.ok) {
          ok++; fallosSeguidos = 0; u.done = true; S.selected.delete(u.pk);
          log(`(${i + 1}/${queue.length}) Dejaste de seguir a @${u.username}`);
          const hist = LS.get('historial', []); hist.push({ u: u.username, t: Date.now() }); LS.set('historial', hist.slice(-2000));
        } else {
          fallosSeguidos++;
          log(`No se pudo con @${u.username}. Respuesta de Instagram: ${res.info}`);
          console.warn('[Spygram] Falló el unfollow de @' + u.username, res.info);
        }
      } catch (e) {
        if (e.block) { log('Aviso: Instagram ha bloqueado temporalmente esta acción. Me detengo. Espera 24–48 h antes de seguir.'); break; }
        if (e.message === 'detenido') { log('Detenido por ti.'); break; }
        fallosSeguidos++;
        log(`Error con @${u.username}: ${e.message}`);
      }
      render();
      if (fallosSeguidos >= 3) {
        log('3 fallos seguidos: me detengo para no insistir. Copia estas líneas del log y revisa en el perfil si de verdad los sigues aún.');
        break;
      }
      if (i < queue.length - 1) {
        const wait = (i + 1) % 10 === 0 ? rnd(240, 360) : rnd(a, b);
        log(`Esperando ${Math.round(wait)} s…`);
        const end = Date.now() + wait * 1000;
        while (Date.now() < end && !S.stop) await sleep(500);
      }
    }
    log(`Terminado: ${ok} cuentas dejadas de seguir.`);
    setBusy(false); render();
  }

  console.log(`%cSpygram v${VERSION}%c por ${AUTOR} · © 2026 Todos los derechos reservados`, 'color:#ff6a98;font-weight:800;font-size:14px', 'color:inherit');
  log(`Spygram v${VERSION} por ${AUTOR}. Pulsa «Escanear».`);
})();
