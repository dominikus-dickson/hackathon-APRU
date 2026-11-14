/* Laju website. Plain JavaScript, no libraries.
   1. helpers  2. phones  3. rain  4. jars and coins  5. scroll story
   6. windowsill  7. calculator  8. language  9. small things */
(() => {
  'use strict';

  /* ---------- 1. helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';
  const svg = (t, a = {}) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); return e; };
  const el = (t, c) => { const e = document.createElement(t); if (c) e.className = c; return e; };
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const rng = seed => () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
  const rp = n => 'Rp ' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const canAnimate = !RM && 'animate' in Element.prototype;
  // count a number up or down over a fixed time, always landing on the exact value
  function tween(paint, dur = 450) {
    let cur = null, raf = 0;
    return (to, instant) => {
      if (cur === null || instant || RM || document.hidden) { cur = to; cancelAnimationFrame(raf); raf = 0; paint(to); return; }
      const from = cur, t0 = performance.now();
      cancelAnimationFrame(raf);
      const step = now => {
        const k = clamp((now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        cur = from + (to - from) * e; paint(cur);
        raf = k < 1 ? requestAnimationFrame(step) : 0;
      };
      raf = requestAnimationFrame(step);
    };
  }

  /* ---------- 2. phones: wrap each one in a body with real thickness ---------- */
  const TABS = [['i-home', 't.home', 'Home'], ['i-ladder', 't.lad', 'Ladder'], ['i-plus', 't.log', 'Log'], ['i-report', 't.rep', 'Report'], ['i-user', 't.pro', 'Profile']];
  function setTab(ph, i) { $$('span', ph._tb).forEach((s, k) => s.classList.toggle('on', k === i && k !== 2)); }
  $$('.phone').forEach(ph => {
    const kids = [...ph.children];
    const body = el('div', 'ph-body'), screen = el('div', 'ph-screen'), screens = el('div', 'screens');
    const status = el('div', 'ph-status');
    status.innerHTML = '<span>9:41</span><i class="island"></i><span class="ico"><i style="height:.4em"></i><i style="height:.6em"></i><i style="height:.8em"></i><i style="height:1em"></i><b></b></span>';
    const tb = el('div', 'ph-tabs');
    tb.innerHTML = TABS.map((t, i) => `<span class="${i === 2 ? 'plus' : ''}"><svg><use href="#${t[0]}"/></svg><em data-i="${t[1]}">${t[2]}</em></span>`).join('');
    screen.append(status, screens, tb);
    kids.forEach(k => (k.classList.contains('scr') ? screens : screen).append(k));
    body.append(screen);
    const layers = ph.id === 'heroPhone' ? 9 : 6;
    for (let i = layers; i >= 1; i--) {
      const e = el('div', 'ph-edge' + (i === layers ? ' last' : ''));
      e.style.transform = `translateZ(${(-i * 0.16).toFixed(2)}em)`;
      ph.append(e);
    }
    ['b1', 'b2', 'b3', 'b4'].forEach(b => { const e = el('i', 'ph-btn ' + b); e.style.transform = `translateZ(${(-layers * 0.08).toFixed(2)}em)`; ph.append(e); });
    ph.append(body);
    ph._tb = tb; ph._tabs = (ph.dataset.tabs || '0').split(',').map(Number);
    setTab(ph, ph._tabs[0]);
  });

  /* ---------- 3. rain ---------- */
  $$('[data-rain]').forEach(box => {
    if (RM) return;
    const n = +box.dataset.rain, r = rng(n * 7 + 3), dry = box.dataset.umbrella;
    for (let i = 0; i < n; i++) {
      const d = el('i');
      let left = r() * 112;
      if (dry) left = r() < 0.5 ? r() * 16 : 92 + r() * 22;   // keep it dry under the umbrella
      d.style.left = left.toFixed(1) + '%';
      d.style.height = (24 + r() * 34).toFixed(0) + 'px';
      d.style.setProperty('--d', (0.9 + r() * 1.1).toFixed(2) + 's');
      d.style.setProperty('--dl', (-r() * 2).toFixed(2) + 's');
      d.style.setProperty('--o', (0.22 + r() * 0.42).toFixed(2));
      box.append(d);
    }
  });

  /* ---------- 4. jars and coins ---------- */
  function buildJar(node, o) {
    const { W, H, nw, nh, sh, R, r } = o;
    const rim = 16, cx = W / 2, x0 = 6, x1 = W - 6, top = rim + nh + sh, bot = H - 5;
    node.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const d = `M${cx - nw / 2} ${rim - 2}V${rim + nh}C${cx - nw / 2} ${rim + nh + sh * 0.55} ${x0} ${rim + nh + sh * 0.35} ${x0} ${top}V${bot - R}Q${x0} ${bot} ${x0 + R} ${bot}H${x1 - R}Q${x1} ${bot} ${x1} ${bot - R}V${top}C${x1} ${rim + nh + sh * 0.35} ${cx + nw / 2} ${rim + nh + sh * 0.55} ${cx + nw / 2} ${rim + nh}V${rim - 2}Z`;
    const g = svg('g', { class: 'jar-g' });
    g.append(svg('path', { d, fill: 'rgba(255,255,255,.17)' }));
    const coins = svg('g', { class: 'coins' });
    g.append(coins);
    g.append(svg('path', { d, fill: 'rgba(255,255,255,.06)', stroke: 'rgba(255,255,255,.88)', 'stroke-width': 3.5, 'stroke-linejoin': 'round' }));
    g.append(svg('path', { d: `M${x0 + 14} ${top + 12}V${bot - R - 4}`, stroke: '#fff', 'stroke-opacity': 0.72, 'stroke-width': 7, 'stroke-linecap': 'round', fill: 'none' }));
    g.append(svg('path', { d: `M${x0 + 30} ${top + 18}v${Math.min(44, (bot - top) * 0.22).toFixed(0)}`, stroke: '#fff', 'stroke-opacity': 0.45, 'stroke-width': 5, 'stroke-linecap': 'round', fill: 'none' }));
    g.append(svg('path', { d: `M${x1 - 15} ${bot - R - 8}v-${((bot - top) * 0.28).toFixed(0)}`, stroke: '#fff', 'stroke-opacity': 0.3, 'stroke-width': 4, 'stroke-linecap': 'round', fill: 'none' }));
    g.append(svg('rect', { x: cx - nw / 2 - 9, y: 1.5, width: nw + 18, height: rim, rx: rim / 2, fill: 'rgba(255,255,255,.55)', stroke: '#fff', 'stroke-width': 3 }));
    node.append(g);

    // where each coin comes to rest: staggered rows from the bottom up
    const slots = [], rand = rng(o.seed || W + H);
    const dx = 2 * r + 1.5, xa = x0 + r + 6, xb = x1 - r - 6, n = Math.floor((xb - xa) / dx) + 1;
    let row = 0;
    for (let y = bot - r - 5; y > top + r * 0.4; y -= r * 1.72, row++) {
      const m = row % 2 ? n - 1 : n, off = ((xb - xa) - (m - 1) * dx) / 2, line = [];
      for (let i = 0; i < m; i++) {
        const x = xa + off + i * dx + (rand() - 0.5) * 3;
        let ok = true;
        if (y > bot - R) {                       // stay inside the rounded bottom corners
          const cy = bot - R, cl = x0 + R, cr = x1 - R;
          if (x < cl && Math.hypot(x - cl, y - cy) > R - r + 1) ok = false;
          if (x > cr && Math.hypot(x - cr, y - cy) > R - r + 1) ok = false;
        }
        const v = rand(), kind = v < 0.55 ? 'sun' : v < 0.8 ? 'drop' : 'mark';
        if (ok) line.push({ x, y: y + (rand() - 0.5) * 2.5, rot: (rand() - 0.5) * 70, kind });
      }
      for (let i = line.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [line[i], line[j]] = [line[j], line[i]]; }
      slots.push(...line);
    }

    const jar = {
      node, g, slots, r, cx, count: 0, els: [], onLand: null, from: null,
      add(animate) {
        if (this.count >= slots.length) return false;
        const s = slots[this.count++];
        const outer = svg('g', { transform: `translate(${s.x.toFixed(1)} ${s.y.toFixed(1)})` });
        const inner = svg('g', { class: 'c' });
        inner.append(svg('use', { href: '#coin-' + s.kind, x: -r, y: -r, width: 2 * r, height: 2 * r, transform: `rotate(${s.rot.toFixed(0)})` }));
        outer.append(inner); coins.append(outer); this.els.push(outer);
        if (animate && canAnimate) {
          const f = this.from ? this.from(s) : null;
          const D = f ? f.D : s.y + 70, SX = f ? f.SX : (cx - s.x) * 0.6;
          const L = 0.72, N = 9, kf = [];
          for (let k = 0; k <= N; k++) {         // gravity: slow start, fast finish, flipping on the way
            const t = k / N, y = -D * (1 - t * t), x = SX * (1 - t);
            const sc = k === N ? 1 : 0.14 + 0.86 * Math.abs(Math.cos(t * Math.PI * 2.5));
            kf.push({ offset: t * L, opacity: k === 0 ? 0 : 1, transform: `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) scaleX(${sc.toFixed(2)}) rotate(${((1 - t) * -200).toFixed(0)}deg)` });
          }
          kf.push({ offset: L + 0.11, transform: `translate(0px,${(-r * 0.9).toFixed(1)}px) scaleX(1) rotate(7deg)` });
          kf.push({ offset: L + 0.2, transform: 'translate(0px,0px) scaleX(1) rotate(0deg)' });
          kf.push({ offset: L + 0.25, transform: `translate(0px,${(-r * 0.25).toFixed(1)}px) scaleX(1) rotate(0deg)` });
          kf.push({ offset: 1, transform: 'translate(0px,0px) scaleX(1) rotate(0deg)' });
          const dur = 760 + Math.min(420, D * 1.1);
          inner.animate(kf, { duration: dur, easing: 'linear', fill: 'backwards' });
          setTimeout(() => this.onLand && this.onLand(), dur * L);
        } else if (this.onLand) this.onLand(true);
        return true;
      },
      remove() {
        if (!this.count) return;
        this.count--;
        const e = this.els.pop();
        if (!canAnimate) { e.remove(); return; }
        e.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150 }).onfinish = () => e.remove();
      }
    };
    return jar;
  }
  function squash(jar) {
    if (!canAnimate) return;
    jar.g.animate([{ transform: 'scale(1,1)' }, { transform: 'scale(1.035,.962)' }, { transform: 'scale(.99,1.014)' }, { transform: 'scale(1,1)' }], { duration: 330, easing: 'ease-out' });
  }

  /* ---------- 5. the scroll story: stage holds still, phone tilts, coins rain ---------- */
  const story = $('.story'), stage = $('#stage'), steps = $$('.step'), heroPhone = $('#heroPhone');
  const tag = $('#tag'), tagAmt = $('#tagAmt'), tagBar = $('#tagBar'), tagPct = $('#tagPct'), cloud = $('.sky .cloud');
  const hero = buildJar($('#heroJar'), { W: 240, H: 300, nw: 150, nh: 20, sh: 36, R: 30, r: 15, seed: 11 });
  const INIT = 9, TOTAL = Math.min(33, hero.slots.length), A0 = 1250000, A1 = 4800000, GOAL = 6500000;
  let target = INIT, lastSwing = 0;
  for (let i = 0; i < INIT; i++) hero.add(false);

  hero.from = s => {                             // coins start at the cloud
    const j = hero.node.getBoundingClientRect(), c = cloud.getBoundingClientRect(), k = j.width / 240 || 1;
    return { D: Math.max(80, (j.top + s.y * k - (c.top + c.height * 0.7)) / k), SX: ((c.left + c.width / 2) - (j.left + s.x * k)) / k };
  };
  const tagTween = tween(v => {
    v = Math.round(v / 5000) * 5000;
    const pct = Math.round(v / GOAL * 100);
    tagAmt.textContent = rp(v); tagPct.textContent = pct; tagBar.style.width = pct + '%';
  }, 380);
  function syncTag(instant) { tagTween(A0 + (hero.count - INIT) / (TOTAL - INIT) * (A1 - A0), instant); }
  hero.onLand = quiet => {
    syncTag(quiet);
    if (quiet || !canAnimate) return;
    squash(hero);
    const now = performance.now();
    if (now - lastSwing > 420) {
      lastSwing = now;
      tag.animate([{ transform: 'rotate(-8deg)' }, { transform: 'rotate(-14deg)' }, { transform: 'rotate(-4.5deg)' }, { transform: 'rotate(-9.5deg)' }, { transform: 'rotate(-8deg)' }], { duration: 760, easing: 'ease-out' });
    }
  };

  let step = -1;
  function setStep(i) {
    if (i === step) return;
    step = i; stage.dataset.step = i;
    $$('.scr', heroPhone).forEach((s, k) => { s.classList.toggle('on', k === i); s.classList.toggle('past', k < i); });
    setTab(heroPhone, heroPhone._tabs[i]);
  }
  function measure() {
    const vh = innerHeight, mob = innerWidth < 900, trig = vh * (mob ? 0.86 : 0.62);
    const rects = steps.map(s => s.getBoundingClientRect());
    let idx = 0;
    rects.forEach((r, i) => { if (r.top < trig) idx = i + 1; });
    setStep(idx);
    const start = rects[0].top, end = rects[2].top + rects[2].height * (mob ? 0.2 : 0.38);
    const p = clamp((trig - start) / (end - start));
    target = INIT + Math.round(p * (TOTAL - INIT));
    story.style.setProperty('--sun', clamp((p - 0.5) / 0.42).toFixed(3));
    story.style.setProperty('--rain', (1 - clamp((p - 0.3) / 0.5)).toFixed(3));
  }
  let ticking = false;
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; measure(); }); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  measure();
  setInterval(() => {                            // one coin at a time so a fast scroll still looks like rain
    if (hero.count < target) hero.add(true);
    else if (hero.count > target) { hero.remove(); syncTag(); }
  }, 85);

  /* ---------- 6. the windowsill: tap a jar, a coin drops in ---------- */
  const JARS = {
    a: { W: 200, H: 270, nw: 128, nh: 18, sh: 30, R: 26, r: 14, fill: 0.42, seed: 5 },
    b: { W: 240, H: 215, nw: 186, nh: 14, sh: 22, R: 30, r: 14, fill: 0.3, seed: 8 },
    c: { W: 214, H: 190, nw: 118, nh: 16, sh: 46, R: 52, r: 14, fill: 0.5, seed: 13 },
    d: { W: 186, H: 244, nw: 92, nh: 26, sh: 38, R: 18, r: 14, fill: 0.24, seed: 21 }
  };
  const sillJars = $$('.jarbtn').map(btn => {
    const o = JARS[btn.dataset.jar], jar = buildJar($('.jar', btn), o);
    btn.style.setProperty('--jw', (o.W / 250 * 100).toFixed(0) + '%');
    const n = Math.round(jar.slots.length * o.fill);
    for (let i = 0; i < n; i++) jar.add(false);
    jar.onLand = quiet => { if (!quiet) squash(jar); };
    const amtEl = $('.amt', btn.closest('.jar-cell'));
    let amt = +amtEl.dataset.amt;
    btn.addEventListener('click', () => {
      if (jar.add(true)) { amt += 10000; amtEl.textContent = rp(amt); }
      else if (canAnimate) btn.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(0)' }], { duration: 260 });
    });
    return jar;
  });
  const safeJarNode = $('#safeJar');
  if (safeJarNode) { const j = buildJar(safeJarNode, { W: 200, H: 230, nw: 124, nh: 18, sh: 30, R: 26, r: 14, seed: 4 }); for (let i = 0; i < Math.round(j.slots.length * 0.55); i++) j.add(false); }

  /* ---------- 7. calculator ---------- */
  const STR = {
    en: { head: 'In {t} you would have set aside', t6: '6 months', t12: '1 year', t24: '2 years', days: '{n} days',
      sub: 'That is <b>{s}</b> on each of <b>{d}</b> driving days a month. Your daily budget is <b>{b}</b>, so this covers about <b>{n}</b> days of spending.',
      chip1: 'Mini cushion covered (3 days)', chip2: 'In emergency fund range (3 to 6 months)',
      title: 'Laju | Real income. Real proof.', loc: 'en-US' },
    id: { head: 'Dalam {t} Anda sudah menyisihkan', t6: '6 bulan', t12: '1 tahun', t24: '2 tahun', days: '{n} hari',
      sub: 'Itu <b>{s}</b> di tiap <b>{d}</b> hari narik per bulan. Budget harian Anda <b>{b}</b>, jadi ini cukup untuk sekitar <b>{n}</b> hari belanja.',
      chip1: 'Bantalan mini tercapai (3 hari)', chip2: 'Masuk rentang dana darurat (3 sampai 6 bulan)',
      title: 'Laju | Penghasilan nyata. Bukti nyata.', loc: 'id-ID' }
  };
  let lang = 'en', months = 12;
  const rI = $('#rIncome'), rC = $('#rInst'), rD = $('#rDays'), rS = $('#rSave');
  const cTotal = $('#cTotal'), stacksEl = $('#stacks'), monthsEl = $('#months');
  const totalTween = tween(v => { cTotal.textContent = rp(v); }, 500);
  function calc() {
    const T = STR[lang], I = +rI.value, C = +rC.value, D = +rD.value, S = +rS.value;
    const total = S * D * months, budget = Math.max(0, (I - C) / 30), days = budget > 0 ? Math.floor(total / budget) : 0;
    [rI, rC, rD, rS].forEach(r => r.style.setProperty('--p', ((r.value - r.min) / (r.max - r.min) * 100).toFixed(1) + '%'));
    $('#oIncome').textContent = rp(I); $('#oInst').textContent = rp(C);
    $('#oDays').textContent = T.days.replace('{n}', D); $('#oSave').textContent = rp(S);
    $('#cHead').textContent = T.head.replace('{t}', T['t' + months]);
    $('#cSub').innerHTML = T.sub.replace('{s}', rp(S)).replace('{d}', D).replace('{b}', rp(budget)).replace('{n}', days);
    $('#cChips').innerHTML = (days >= 3 ? `<span>${T.chip1}</span>` : '') + (days >= 90 ? `<span>${T.chip2}</span>` : '');
    totalTween(total);
    // one coin stack per month
    while (stacksEl.children.length > months) stacksEl.lastChild.remove();
    while (stacksEl.children.length < months) stacksEl.append(el('div', 'stack'));
    const f = clamp(Math.sqrt(total / (100000 * 30 * months)), 0.12, 1);
    [...stacksEl.children].forEach((c, i) => c.style.setProperty('--h', ((i + 1) / months * f * 100).toFixed(1) + '%'));
    const now = new Date(), every = months > 12 ? 3 : 1;
    monthsEl.innerHTML = Array.from({ length: months }, (_, i) => {
      const dt = new Date(now.getFullYear(), now.getMonth() + 1 + i, 1);
      return `<span>${i % every === 0 ? dt.toLocaleDateString(T.loc, { month: 'short' }) : ''}</span>`;
    }).join('');
  }
  [rI, rC, rD, rS].forEach(r => r.addEventListener('input', calc));
  $$('#segLong button').forEach(b => b.addEventListener('click', () => {
    months = +b.dataset.m;
    $$('#segLong button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    calc();
  }));

  /* ---------- 8. two languages. English is in the page, Indonesian is here ---------- */
  const ID = {
    'skip': 'Lewati ke cara kerja',
    'n.how': 'Cara kerja', 'n.pots': 'Pos tabungan', 'n.app': 'Aplikasi', 'n.calc': 'Kalkulator', 'n.safe': 'Keamanan', 'n.rev': 'Ulasan', 'n.cta': 'Coba demo',
    'h.badge': 'Prototipe gratis untuk pengemudi ojol',
    'h.a': 'Penghasilan nyata.', 'h.b': 'Bukti nyata',
    'h.lead': 'Laju membaca riwayat e-wallet Anda dengan izin Anda, memberi skor kesehatan finansial dari 100, lalu menuntun Anda menaiki enam langkah yang jelas. Hasilnya rekam jejak yang bisa dibaca bank. Tanpa slip gaji.',
    'h.cta1': 'Coba demo langsung', 'h.cta2': 'Cara kerjanya',
    'h.note': '<b>Bukan aplikasi pinjaman.</b> Tanpa biaya. Tidak pernah meminta PIN.',
    'p.date': 'Kamis', 'p.hi': 'Pagi, Budi', 'p.score': 'Skor kesehatan finansial', 'p.fair': 'Cukup sehat', 'p.today': 'Budget hari ini',
    'p.active': 'Langkah aktif', 'p.see': 'Lihat tangga', 'p.step2': 'Lunasi utang jangka pendek', 'p.pots': 'Pos Anda',
    'j.safe': 'Tabungan aman', 'j.grow': 'Tabungan tumbuh', 'j.school': 'Biaya sekolah',
    'p.wallet': 'E-wallet', 'p.ro': 'Hanya baca', 'p.in30': 'Uang masuk, 30 hari terakhir',
    'p.t1': 'Pendapatan narik', 'p.t1s': 'Hari ini', 'p.t2': 'Bensin', 'p.t3': 'Makan siang', 'p.t4': 'Cicilan motor', 'p.t4s': 'Jangka panjang', 'p.t5s': 'Utang jangka pendek',
    'p.start': 'Skor awal', 'p.log': 'Catat', 'p.dep': 'Setor', 'p.wd': 'Ambil', 'p.pay': 'Bayar utang', 'p.depbtn': 'Setor Rp 20.000',
    'p.proof': 'Bukti 30 hari', 'p.saved': 'Terkumpul', 'p.of65': 'dari Rp 6.500.000', 'p.efund': 'Dana darurat terisi 74%',
    'p.sc': 'Skor', 'p.debt': 'Utang pendek', 'p.clear': 'Lunas', 'p.stepn': 'Langkah', 'p.ready': 'Rapor siap dibawa ke bank',
    'p.now': 'baru saja', 'p.notif': 'E-wallet terhubung. Riwayat 30 hari terbaca. Akses hanya baca.',
    'j.safeU': 'TABUNGAN AMAN', 'j.growU': 'TABUNGAN TUMBUH', 'j.schoolU': 'BIAYA SEKOLAH', 'j.tiresU': 'BAN BARU', 'j.of65': 'dari Rp 6.500.000',
    's1.e': 'Tahu posisi Anda', 's1.h': 'Hubungkan e-wallet Anda.',
    's1.p': 'Transaksi 30 hari terbaca otomatis lewat penyedia open finance berlisensi. Aksesnya hanya baca. Anda mendapat skor kesehatan dari 100, disusun dari empat pilar dan dua belas komponen. Tidak ingin menghubungkan? Unggah e-statement PDF saja.',
    's1.c': 'Hanya baca. Riwayat 30 hari.',
    's2.e': 'Satu langkah dalam satu waktu', 's2.h': 'Taruh tiap rupiah di posnya.',
    's2.p': 'Tangga memberi tahu mana yang didahulukan. Belanja di bawah budget harian. Lunasi utang yang mencekik. Bangun bantalan kecil. Catat tiap setoran di satu layar berpapan angka, lalu lihat posnya terisi.',
    's2.c': 'Setor, ambil, atau bayar utang',
    's3.e': 'Bukti, bukan janji', 's3.h': 'Bawa rapor Anda ke bank.',
    's3.p': 'Setiap langkah yang selesai menjadi bagian dari rekam jejak keuangan yang bisa dibaca bank. Laju bukan pemberi pinjaman. Laju membuat pengemudi layak dipinjami.',
    's3.c': 'Hujan reda. Matahari keluar.',
    'po.e': 'Pos tabungan', 'po.h': 'Satu pos untuk tiap tujuan.',
    'po.p': 'Tabungan aman menampung bantalan dan dana darurat. Tabungan tumbuh untuk investasi setelah fondasi kuat. Tiap tujuan punya posnya sendiri. Coba ketuk salah satu.',
    'po.j1': 'dari Rp 6.500.000. Dana darurat.', 'po.j2': 'Untuk investasi, mulai Step 4.', 'po.j3': 'dari Rp 2.000.000. Tujuan wajib.', 'po.j4': 'dari Rp 600.000. Sebelum musim hujan.',
    'po.sample': 'Angka contoh. Tiap ketukan menambah Rp 10.000.',
    'po.m0': 'Contoh tujuan pengemudi:', 'po.m1': 'Servis motor', 'po.m2': 'Biaya sekolah', 'po.m3': 'Mudik Lebaran', 'po.m4': 'Helm baru', 'po.m5': 'Servis HP', 'po.m6': 'Uang kontrakan', 'po.m7': 'Ban baru', 'po.m8': 'Ulang tahun anak', 'po.m9': 'Jas hujan',
    'po.t1': 'Setiap catatan bisa dibatalkan', 'po.t2': 'Saldo mengikuti catatan Anda', 'po.t3': 'Tujuan wajib didahulukan sebelum tujuan tumbuh',
    'a.e': 'Aplikasi', 'a.h': 'Seru seperti gim. Terbaca seperti catatan bank.',
    'a.p': 'Enam langkah, satu yang aktif dalam satu waktu. Tiap langkah yang selesai membuka langkah berikutnya. Di baliknya ada skor yang mengikuti kerangka FinHealth Score dari Financial Health Network.',
    'a.f1': 'Skor kesehatan', 'a.f1p': 'Empat pilar, dua belas komponen, satu angka dari 100. Arus kas, tabungan, utang, dan rencana.',
    'a.f2': 'Tangga milestone', 'a.f2p': 'Rapikan data, keluar dari merah, lunasi utang jangka pendek, bangun dana darurat, investasi, lalu tumbuh.',
    'a.f3': 'Budget harian', 'a.f3p': 'Pendapatan dikurangi cicilan jangka panjang, dibagi 30. Satu angka untuk dijaga tiap hari.',
    'a.f4': 'Jalur pelunasan utang', 'a.f4p': 'Pinjol, paylater, dan rentenir didahulukan. Cicilan motor tidak harus lunas untuk lanjut.',
    'a.f5': 'Analisis AI', 'a.f5p': 'Ringkasan dengan bahasa sehari-hari tentang apa yang sudah baik, apa yang perlu dibenahi, dan apa yang dikerjakan 30 hari ke depan.',
    'a.f6': 'Dua bahasa', 'a.f6p': 'Pakai aplikasi dalam bahasa Indonesia atau Inggris.',
    'f.ladder': 'Tangga', 'f.2of6': '2 dari 6 selesai', 'f.s0': 'Rapikan data', 'f.s1': 'Keluar dari merah', 'f.s2': 'Lunasi utang jangka pendek + bantalan mini', 'f.s3': 'Dana darurat', 'f.s4': 'Investasi 10% selama 3 bulan', 'f.s5': 'Tujuan tumbuh',
    'f.done': 'Selesai', 'f.lock': 'Terkunci', 'f.rep': 'RAPOR ANDA', 'f.p1': 'Arus kas', 'f.p2': 'Tabungan', 'f.p3': 'Utang', 'f.p4': 'Rencana', 'f.ask': 'Minta AI menganalisis',
    'f.ai': 'Analisis AI', 'f.ain': 'Hanya angka. Tanpa nama, tanpa nomor HP.',
    'f.a1': 'SUDAH BAIK', 'f.a1p': 'Belanja di bawah budget selama 24 dari 30 hari.', 'f.a2': 'BENAHI DULU', 'f.a2p': 'Paylater adalah utang termahal. Lunasi lebih dulu.', 'f.a3': '30 HARI KE DEPAN', 'f.a3p': 'Sisihkan Rp 20.000 di tiap hari narik.',
    'c.e': 'Kalkulator', 'c.h': 'Lihat tumpukannya.', 'c.p': 'Geser koinnya. Angka Anda, ritme Anda.',
    'c.l1': 'Pendapatan per bulan', 'c.l2': 'Cicilan jangka panjang per bulan', 'c.l3': 'Hari narik per bulan', 'c.l4': 'Disisihkan per hari narik', 'c.l5': 'Berapa lama',
    'c.m6': '6 bln', 'c.m12': '1 thn', 'c.m24': '2 thn',
    'c.fine': 'Perkiraan, bukan janji. Tidak ada bunga yang ditambahkan karena Laju tidak memberi bunga. Budget harian memakai aturan aplikasi: pendapatan dikurangi cicilan jangka panjang, dibagi 30.',
    'sf.e': 'Keamanan, dengan bahasa sederhana', 'sf.h': 'Sedia payung sebelum hujan.',
    'sf.1': 'Kami bisa melihat. Tidak bisa menyentuh.', 'sf.1p': 'Akses e-wallet hanya baca dan lewat penyedia open finance berlisensi.',
    'sf.2': 'Tombol mati ada di tangan Anda.', 'sf.2p': 'Cabut izin dan hapus semua data Anda kapan saja.',
    'sf.3': 'Password tidak disimpan.', 'sf.3p': 'Yang disimpan hanya hash acak. Laju tidak pernah meminta PIN.',
    'sf.4': 'PDF dibaca, lalu dibuang.', 'sf.4p': 'E-statement yang diunggah dibaca lalu dibuang. Berkasnya tidak disimpan.',
    'sf.5': 'AI hanya melihat angka.', 'sf.5p': 'Tidak pernah nama, nomor HP, atau detail rekening Anda.',
    'sf.6': 'Data Anda tidak dijual.', 'sf.6p': 'Laju bukan pemberi pinjaman dan tidak pernah menjual data.',
    'sf.fine': 'Laju masih berupa prototipe. Di demo langsung, sambungan e-wallet adalah simulasi dan memakai data contoh.',
    'r.e': 'Ulasan', 'r.h': 'Pengemudi yang menilai.', 'r.rate': 'Isi dengan rating dan jumlah ulasan asli Anda di sini.', 'r.who': '[Nama pengemudi] · [Kota]',
    'r.q1': '"Ulasan contoh. Ganti dengan kata-kata pengemudi sendiri tentang pertama kali melihat skornya."',
    'r.q2': '"Ulasan contoh. Ganti dengan kata-kata pengemudi sendiri tentang melunasi utang paylater."',
    'r.q3': '"Ulasan contoh. Ganti dengan kata-kata pengemudi sendiri tentang budget harian."',
    'r.q4': '"Ulasan contoh. Ganti dengan kata-kata pengemudi sendiri tentang membawa rapor ke bank."',
    'r.q5': '"Ulasan contoh. Ganti dengan kata-kata pengemudi sendiri tentang catatan berpapan angka."',
    'r.q6': '"Ulasan contoh. Ganti dengan kata-kata pengemudi sendiri tentang rasa aman berbagi data."',
    'r.q7': '"Ulasan contoh. Ganti dengan kata-kata pengemudi sendiri tentang analisis AI."',
    'r.q8': '"Ulasan contoh. Ganti dengan kata-kata pengemudi sendiri tentang dana daruratnya."',
    'g.h': 'Langkah pertama tinggal <em>satu ketukan</em>.',
    'g.p': 'Gratis dipakai. Tanpa biaya dan tanpa bunga. Buka demo langsung di browser Anda. Demo memakai data contoh, jadi semua langkah aman dijelajahi.',
    'g.soon': 'Tautan belum ada',
    'ft.tag': 'Kesehatan finansial untuk pengemudi ojol Indonesia.', 'ft.ex': 'Jelajahi', 'ft.tr': 'Kepercayaan', 'ft.demo': 'Demo langsung', 'ft.ct': 'Kontak', 'ft.mail': 'Isi email kontak Anda di sini.',
    'ft.fine': 'Laju adalah prototipe riset tim NUS untuk APRU 2026 Hackathon: Financial Health Frontiers. Laju bukan bank dan bukan pemberi pinjaman. Layar di halaman ini menampilkan data contoh.',
    't.home': 'Beranda', 't.lad': 'Tangga', 't.log': 'Catat', 't.rep': 'Rapor', 't.pro': 'Profil'
  };

  // drifting rows: copy the content once so the loop has no seam
  if (!RM) $$('.marquee .track').forEach(t => { [...t.children].forEach(c => { const k = c.cloneNode(true); k.setAttribute('aria-hidden', 'true'); t.append(k); }); });

  const i18nEls = $$('[data-i]'), EN = {};
  i18nEls.forEach(e => { if (!(e.dataset.i in EN)) EN[e.dataset.i] = e.innerHTML; });
  function setLang(l, save) {
    lang = l === 'id' ? 'id' : 'en';
    document.documentElement.lang = lang;
    i18nEls.forEach(e => { const k = e.dataset.i, v = lang === 'id' && ID[k] != null ? ID[k] : EN[k]; if (e.innerHTML !== v) e.innerHTML = v; });
    $$('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    document.title = STR[lang].title;
    calc();
    onScroll();
    if (save) { try { localStorage.setItem('laju-lang', lang); } catch (e) { /* private window */ } }
  }
  $$('.lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang, true)));
  let first = 'en';
  try { first = localStorage.getItem('laju-lang') || ((navigator.language || '').toLowerCase().startsWith('id') ? 'id' : 'en'); } catch (e) { /* keep English */ }
  setLang(first, false);
  window.__lajuMissing = () => Object.keys(EN).filter(k => !(k in ID));   // for checking translations

  /* ---------- 9. small things ---------- */
  // phone menu
  const menuBtn = $('#menuBtn'), navLinks = $('#navLinks');
  const closeMenu = () => { navLinks.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); };
  menuBtn.addEventListener('click', () => { const open = navLinks.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', String(open)); });
  navLinks.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  // store buttons are placeholders until real links exist
  $$('[data-placeholder]').forEach(a => a.addEventListener('click', e => e.preventDefault()));

  // big spinning coin with a real edge
  const spin = $('#spinCoin');
  if (spin) {
    const T = 24, face = '<svg viewBox="0 0 40 40"><use href="#coin-sun"/></svg>';
    for (let i = 0; i <= T; i++) { const e = el('i', 'edge'); e.style.transform = `translateZ(${i - T / 2}px)`; spin.append(e); }
    const a = el('div'), b = el('div');
    a.innerHTML = face; b.innerHTML = face;
    a.style.transform = `translateZ(${T / 2 + 0.5}px)`; b.style.transform = `rotateY(180deg) translateZ(${T / 2 + 0.5}px)`;
    spin.append(a, b);
  }

  // gentle reveal as sections arrive, and a few coins for the windowsill
  const rv = $$('.sec .eyebrow, .sec .big, .sec .sec-lead, .feats li, .safe-list li, .window, .calc-out, .field, .ticks, .sec-get .mega, .sec-get .lead, .rating');
  const fan = $('.fan');
  if ('IntersectionObserver' in window && !RM) {
    rv.forEach(e => e.classList.add('rv'));
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(e => io.observe(e));
    const io2 = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      io2.unobserve(en.target);
      if (en.target === fan) fan.classList.add('in');
      else sillJars.forEach((j, i) => { setTimeout(() => j.add(true), 300 + i * 260); setTimeout(() => j.add(true), 700 + i * 260); });
    }), { threshold: 0.35 });
    if (fan) io2.observe(fan);
    io2.observe($('#window'));
  } else if (fan) fan.classList.add('in');
})();
