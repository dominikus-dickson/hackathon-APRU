/* Laju website. Plain JavaScript, no libraries.
   1. helpers  2. phones  3. rain  4. jars and coins  5. scroll story
   6. savings pots  7. calculator  8. language  9. scroll effects and small things */
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

  /* ---------- 2. phones: a body with real thickness, plus the app's header and bottom bar ---------- */
  const TABS = [['i-home', 't.home', 'Home'], ['i-ladder', 't.lad', 'Ladder'], ['i-plus', 't.log', 'Log'], ['i-report', 't.rep', 'Report'], ['i-user', 't.pro', 'Profile']];
  function setTab(ph, i) { $$('span', ph._tb).forEach((s, k) => s.classList.toggle('on', k === i && k !== 2)); }
  $$('.phone').forEach(ph => {
    const kids = [...ph.children];
    const body = el('div', 'ph-body'), screen = el('div', 'ph-screen'), screens = el('div', 'screens');
    const status = el('div', 'ph-status');
    status.innerHTML = '<span>9:41</span><i class="island"></i><span class="ico"><i style="height:.4em"></i><i style="height:.6em"></i><i style="height:.8em"></i><i style="height:1em"></i><b></b></span>';
    const top = el('div', 'a-top');
    top.innerHTML = '<i class="a-back"><svg viewBox="0 0 24 24"><path d="M14 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></i><svg><use href="#mark-app"/></svg><b>Laju</b><span class="a-live">LIVE</span><span class="a-lang"><i data-al="id">ID</i><i data-al="en" class="on">EN</i></span>';
    const tb = el('div', 'ph-tabs');
    tb.innerHTML = TABS.map((t, i) => `<span class="${i === 2 ? 'plus' : ''}"><svg><use href="#${t[0]}"/></svg><em data-i="${t[1]}">${t[2]}</em></span>`).join('');
    screens.append(top);
    kids.forEach(k => screens.append(k));
    screen.append(status, screens, tb);
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

  /* ---------- 3. rain around the umbrella ---------- */
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
    g.append(svg('path', { d, fill: 'rgba(255,255,255,.10)' }));
    const coins = svg('g', { class: 'coins' });
    g.append(coins);
    g.append(svg('path', { d, fill: 'rgba(255,255,255,.04)', stroke: 'rgba(255,255,255,.9)', 'stroke-width': 3, 'stroke-linejoin': 'round' }));
    g.append(svg('path', { d: `M${x0 + 14} ${top + 12}V${bot - R - 4}`, stroke: '#fff', 'stroke-opacity': 0.6, 'stroke-width': 6, 'stroke-linecap': 'round', fill: 'none' }));
    g.append(svg('path', { d: `M${x0 + 30} ${top + 18}v${Math.min(44, (bot - top) * 0.22).toFixed(0)}`, stroke: '#fff', 'stroke-opacity': 0.35, 'stroke-width': 4, 'stroke-linecap': 'round', fill: 'none' }));
    g.append(svg('path', { d: `M${x1 - 15} ${bot - R - 8}v-${((bot - top) * 0.28).toFixed(0)}`, stroke: '#fff', 'stroke-opacity': 0.25, 'stroke-width': 4, 'stroke-linecap': 'round', fill: 'none' }));
    g.append(svg('rect', { x: cx - nw / 2 - 9, y: 1.5, width: nw + 18, height: rim, rx: rim / 2, fill: 'rgba(255,255,255,.35)', stroke: '#fff', 'stroke-width': 3 }));
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
        const v = rand(), kind = v < 0.58 ? 'lime' : v < 0.82 ? 'white' : 'logo';
        if (ok) line.push({ x, y: y + (rand() - 0.5) * 2.5, rot: (rand() - 0.5) * 50, kind });
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

  /* ---------- 5. the scroll story: stage holds still, phone tilts, coins fall ---------- */
  const story = $('.story'), stage = $('#stage'), steps = $$('article.step'), heroPhone = $('#heroPhone');
  const tag = $('#tag'), tagAmt = $('#tagAmt'), tagBar = $('#tagBar'), tagPct = $('#tagPct'), source = $('.source');
  const hero = buildJar($('#heroJar'), { W: 240, H: 300, nw: 150, nh: 20, sh: 36, R: 30, r: 15, seed: 11 });
  const INIT = 9, TOTAL = Math.min(33, hero.slots.length), A0 = 1250000, A1 = 4800000, GOAL = 6500000;
  let target = INIT, lastSwing = 0;
  for (let i = 0; i < INIT; i++) hero.add(false);

  hero.from = s => {                             // coins start at the "Deposits" chip
    const j = hero.node.getBoundingClientRect(), c = source.getBoundingClientRect(), k = j.width / 240 || 1;
    return { D: Math.max(80, (j.top + s.y * k - c.bottom) / k), SX: ((c.left + c.width / 2) - (j.left + s.x * k)) / k };
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

  /* ---------- 5a. the road: scroll drives a camera through a 3D night ride ---------- */
  const road = $('#why'), roadWorld = $('#roadWorld'), roadScene = $('#roadScene'), roadFloor = $('.road-floor i');
  const gates = $$('.gate'), railItems = $$('#roadRail li'), roadNo = $('#roadNo'), rider = $('#rider');
  const SP = 1300, ROAD_END = gates.length * SP - 380;
  let lastZ = 0, leanTimer = 0;
  if (road && !RM) {
    // light posts along both sides give the eye something to measure depth with
    for (let z = 300; z < ROAD_END + 2600; z += 520) [-430, 430].forEach(x => {
      const post = el('i', 'post');
      post.style.setProperty('--px', x + 'px'); post.style.setProperty('--pz', -z + 'px');
      roadWorld.append(post);
    });
  }
  function roadFrame() {
    if (!road || RM) return;
    const r = road.getBoundingClientRect(), vh = innerHeight;
    if (r.bottom < -100 || r.top > vh + 100) return;
    const p = clamp(-r.top / (r.height - vh)), z = p * ROAD_END;
    roadWorld.style.transform = `translateZ(${z.toFixed(1)}px)`;
    roadFloor.style.transform = `translateY(${(-(z % 160)).toFixed(1)}px)`;
    roadScene.style.setProperty('--rp', p.toFixed(3));
    let active = -1;
    gates.forEach((g, i) => {
      const d = z - (i + 1) * SP;                  // negative means the sign is still ahead
      const last = i === gates.length - 1;
      const o = d < -3000 ? 0 : d < -1900 ? (d + 3000) / 1100 : (d < -120 || last) ? 1 : d < 250 ? 1 - (d + 120) / 370 : 0;
      g.style.opacity = o.toFixed(3);
      g.style.visibility = o <= 0.01 ? 'hidden' : 'visible';
      if (d > -1150) active = i;
    });
    railItems.forEach((li, i) => li.classList.toggle('on', i <= active));
    const n = Math.min(Math.max(active, 0) + 1, gates.length - 1);
    roadNo.textContent = String(n).padStart(2, '0') + ' / ' + String(gates.length - 1).padStart(2, '0');
    // the rider leans a little with speed, then straightens up
    const v = z - lastZ; lastZ = z;
    if (Math.abs(v) > 0.5) {
      rider.style.setProperty('--lean', clamp(v * 0.05, -4, 4).toFixed(2) + 'deg');
      clearTimeout(leanTimer);
      leanTimer = setTimeout(() => rider.style.setProperty('--lean', '0deg'), 180);
    }
  }

  let step = -1;
  function setStep(i) {
    if (i === step) return;
    step = i; stage.dataset.step = i;
    $$('.scr', heroPhone).forEach((s, k) => { s.classList.toggle('on', k === i); s.classList.toggle('past', k < i); });
    setTab(heroPhone, heroPhone._tabs[i]);
  }
  const bgs = $$('.bg'), progressBar = $('#progress');
  let pending = [];
  function measure() {
    const vh = innerHeight, mob = innerWidth < 900, trig = vh * (mob ? 0.86 : 0.62);
    if (pending.length) pending = pending.filter(e => {
      const r = e.getBoundingClientRect();
      if (r.top < vh * 0.96 && r.bottom > 0) { e.classList.add('in'); return false; }
      return true;
    });
    const rects = steps.map(s => s.getBoundingClientRect());
    let idx = 0;
    rects.forEach((r, i) => { if (r.top < trig) idx = i + 1; });
    setStep(idx);
    const start = rects[0].top, end = rects[2].top + rects[2].height * (mob ? 0.2 : 0.38);
    const p = clamp((trig - start) / (end - start));
    target = INIT + Math.round(p * (TOTAL - INIT));
    story.style.setProperty('--glow', p.toFixed(3));
    // page progress line, hero drift and the slow drift of each section's glow
    const max = document.documentElement.scrollHeight - vh;
    progressBar.style.setProperty('--sp', max > 0 ? (scrollY / max).toFixed(4) : 0);
    document.documentElement.style.setProperty('--hs', clamp(scrollY / vh).toFixed(3));
    roadFrame();
    if (!RM) bgs.forEach(b => {
      const r = b.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      b.style.setProperty('--p', clamp((r.top + r.height / 2 - vh / 2) / vh, -1, 1).toFixed(3));
    });
  }
  let ticking = false;
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; measure(); }); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  measure();
  setInterval(() => {                            // one coin at a time so a fast scroll still looks like a stream
    if (hero.count < target) hero.add(true);
    else if (hero.count > target) { hero.remove(); syncTag(); }
  }, 85);

  /* ---------- 6. savings pots: select a jar, a coin drops in ---------- */
  const JARS = {
    a: { W: 200, H: 270, nw: 128, nh: 18, sh: 30, R: 26, r: 14, fill: 0.25, seed: 5 },
    b: { W: 240, H: 215, nw: 186, nh: 14, sh: 22, R: 30, r: 14, fill: 0.3, seed: 8 },
    c: { W: 214, H: 190, nw: 118, nh: 16, sh: 46, R: 52, r: 14, fill: 0.72, seed: 13 },
    d: { W: 186, H: 244, nw: 92, nh: 26, sh: 38, R: 18, r: 14, fill: 0.5, seed: 21 }
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
    en: { head: 'Saved in {t}', t6: '6 months', t12: '1 year', days: '{n} Days',
      sub: '<b>{s}</b> a day on <b>{d}</b> driving days a month. With a daily budget of <b>{b}</b>, that covers about <b>{n}</b> days of spending.',
      chip1: 'Mini Cushion Reached', chip2: 'Emergency Fund Range',
      title: 'Laju | Real Income. Real Proof.', loc: 'en-US' },
    id: { head: 'Terkumpul dalam {t}', t6: '6 bulan', t12: '1 tahun', days: '{n} Hari',
      sub: '<b>{s}</b> per hari pada <b>{d}</b> hari narik per bulan. Dengan budget harian <b>{b}</b>, jumlah itu cukup untuk sekitar <b>{n}</b> hari pengeluaran.',
      chip1: 'Bantalan Mini Tercapai', chip2: 'Rentang Dana Darurat',
      title: 'Laju | Penghasilan Nyata. Bukti Nyata.', loc: 'id-ID' }
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
    const now = new Date();
    monthsEl.innerHTML = Array.from({ length: months }, (_, i) => {
      const dt = new Date(now.getFullYear(), now.getMonth() + 1 + i, 1);
      return `<span>${dt.toLocaleDateString(T.loc, { month: 'short' })}</span>`;
    }).join('');
  }
  [rI, rC, rD, rS].forEach(r => r.addEventListener('input', calc));
  $$('#segLong .seg-opt').forEach(b => b.addEventListener('click', () => {
    months = +b.dataset.m;
    $$('#segLong .seg-opt').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    calc();
  }));

  /* ---------- 8. two languages. English is in the page, Indonesian is here ---------- */
  const ID = {
    'skip': 'Lewati ke cara kerja',
    'n.how': 'Cara Kerja', 'n.pots': 'Pos Tabungan', 'n.app': 'Aplikasi', 'n.calc': 'Kalkulator', 'n.safe': 'Keamanan', 'n.rev': 'Ulasan', 'n.cta': 'Coba Demo',
    'h.kick': 'Prototipe gratis untuk pengemudi ojol',
    'h.a': 'Penghasilan nyata.', 'h.b': 'Bukti nyata.',
    'h.lead': 'Tanpa slip gaji? Laju membaca riwayat e-wallet Anda dengan izin Anda, memberi skor kesehatan finansial dari 100, dan menuntun Anda melalui enam langkah jelas menuju rekam jejak yang bisa dibaca bank.',
    'h.cta1': 'Coba Demo', 'h.cta2': 'Cara Kerja',
    'h.note': 'Bukan pemberi pinjaman. Tanpa biaya. Tidak pernah meminta PIN.',
    'st.1': 'Poin Skor', 'st.2': 'Rupiah Biaya', 'st.3': 'Langkah Jelas', 'st.4': 'Hari Terbaca',
    'hc.l': 'Tangga Milestone', 'hc.done': 'Selesai', 'hc.act': 'Aktif', 'hc.lock': 'Terkunci', 'hc.c': 'Skor Kesehatan', 'hc.sample': 'Data Contoh', 'hc.fair': 'Cukup Sehat',
    'hc.r': 'Arus Kas Bulanan', 'hc.in': 'Pendapatan', 'hc.out': 'Pengeluaran', 'hc.inst': 'Cicilan', 'hc.save': 'Disisihkan',
    'lad.0': 'Rapikan Data', 'lad.1': 'Keluar Dari Minus', 'lad.2': 'Lunasi Utang Jangka Pendek', 'lad.3': 'Dana Darurat',
    'si.e': 'Cara Kerja', 'si.h': 'Tiga langkah menuju <em>siap bank.</em>',
    'si.p': 'Setiap langkah dibangun di atas langkah sebelumnya. Gulir untuk mengikuti seorang pengemudi dari sambungan pertama hingga rapor yang bisa dibaca bank.',
    's1.e': 'Hubungkan', 's1.h': 'Hubungkan e-wallet Anda.',
    's1.p': 'Transaksi 30 hari dibaca lewat penyedia open finance berlisensi, dengan akses hanya baca. Dari riwayat itu, Laju menghitung skor kesehatan dari 100 berdasarkan empat pilar.',
    's1.c': 'Atau unggah e-statement PDF.',
    's2.e': 'Sisihkan', 's2.h': 'Beri tempat untuk setiap rupiah.',
    's2.p': 'Tangga menunjukkan mana yang didahulukan: belanja dalam batas budget harian, lunasi utang yang paling mahal, lalu bangun bantalan. Setiap setoran dicatat di satu layar berpapan angka.',
    's2.c': 'Setor, ambil, atau bayar utang.',
    's3.e': 'Buktikan', 's3.h': 'Bawa rapor Anda ke bank.',
    's3.p': 'Setiap langkah yang selesai menjadi bagian dari rekam jejak keuangan yang bisa dinilai bank. Laju bukan pemberi pinjaman. Laju membantu pengemudi menjadi layak memperoleh kredit resmi.',
   
    'src': 'Setoran', 'j.of65': 'dari Rp 6.500.000',
   
    'po.e': 'Pos Tabungan', 'po.h': 'Satu pos <em>untuk setiap tujuan.</em>',
    'po.p': 'Setiap tujuan punya posnya sendiri, sehingga uang untuk rumah tidak tercampur dengan uang kebutuhan harian. Ketuk toples untuk menambah setoran.',
   
    'po.sample': 'Angka contoh. Setiap ketukan menambah Rp 10.000.',
   
   
    'a.e': 'Aplikasi', 'a.h': 'Langkah sederhana. <em>Kemajuan nyata.</em>',
    'a.p': 'Aplikasi mengubah satu tujuan besar menjadi enam langkah kecil, dengan satu langkah aktif dalam satu waktu. Selesaikan satu langkah dan langkah berikutnya terbuka. Di baliknya ada skor yang mengikuti kerangka FinHealth Score dari Financial Health Network.',
    'a.f1': 'Skor Kesehatan', 'a.f1p': 'Empat pilar dan dua belas komponen menghasilkan satu angka dari 100, sehingga Anda selalu tahu posisi Anda.',
    'a.f2': 'Tangga Milestone', 'a.f2p': 'Rapikan data, keluar dari minus, lunasi utang jangka pendek, bangun dana darurat, berinvestasi, lalu bertumbuh.',
    'a.f3': 'Budget Harian', 'a.f3p': 'Pendapatan dikurangi cicilan jangka panjang, dibagi 30. Satu angka yang dijaga setiap hari.',
    'a.f4': 'Pelunasan Utang', 'a.f4p': 'Pinjol, paylater, dan rentenir dilunasi lebih dulu. Cicilan motor boleh tetap berjalan.',
    'a.f5': 'Analisis AI', 'a.f5p': 'Ringkasan dalam bahasa sederhana tentang apa yang sudah baik, apa yang perlu dibenahi, dan apa yang dikerjakan 30 hari ke depan.',
    'a.f6': 'Dua Bahasa', 'a.f6p': 'Pakai aplikasi dalam bahasa Indonesia atau Inggris.',
    // inside the phones: the app's own Indonesian wording
    'x.dash': 'DASHBOARD', 'x.hi': 'Halo, Andi', 'x.sum': 'Ringkasan keuangan Anda. Data dari isian Anda dan 2 e-wallet terverifikasi.',
    'x.your': 'Step Anda', 'x.2of6': '2 dari 6 selesai', 'x.now': 'KERJAKAN SEKARANG', 'x.s2': 'Lunasi utang jangka pendek + Bantalan mini',
    'x.left': 'Sisa Rp1.200.000 untuk dilunasi', 'x.start': 'Kerjakan ›', 'x.next': 'Berikutnya · terbuka setelah step 2 selesai', 'x.s3': '3. Dana darurat + Mulai tujuan wajib',
    'x.prof': 'PROFIL', 'x.data': 'Data Andi', 'x.bank': 'Status data untuk bank', 'x.ver': 'Terverifikasi',
    'x.verp': 'Data berstatus Terverifikasi, bisa jadi bukti penghasilan ke bank', 'x.conn': 'Terhubung: e-wallet', 'x.ro': 'Hanya baca · riwayat 30 hari',
    'x.pdf': 'E-statement PDF', 'x.pdfp': 'Dibaca, lalu dibuang', 'x.toast': 'E-wallet terhubung',
    'x.log': 'Catat', 'x.dep': 'Setor', 'x.wd': 'Ambil', 'x.pay': 'Bayar utang', 'x.pot': 'MASUK KE POS MANA', 'x.safe': 'Tabungan aman', 'x.grow': 'Tabungan tumbuh', 'x.save': 'Simpan',
    'x.rep': 'RAPOR SEMENTARA · 30 HARI', 'x.reph': 'Rapor Andi', 'x.of100': 'dari 100', 'x.healthy': 'Sehat', 'x.since': 'sejak awal',
    'x.rept': 'Arus kas positif, ada bantalan, utang terkendali.', 'x.lad': 'Tangga', 'x.paid': 'Utang lunas', 'x.ent': 'Catatan',
    'x.focus': 'Fokus 30 hari', 'x.f1': 'Step 3: Dana darurat', 'x.f1p': 'Setor Rp20.000 setiap hari narik', 'x.open': 'Buka', 'x.ask': 'Minta AI menganalisa',
    'x.ml': 'TANGGA MILESTONE', 'x.mlh': 'Step 2 dari 5: Lunasi utang jangka pendek', 'x.debt': 'Pelunasan utang',
    'x.debtp': 'Utang jangka pendek harus lunas untuk menyelesaikan Step 2 · 60% lunas', 'x.tidy': 'Rapikan data', 'x.done': 'Selesai', 'x.red': 'Keluar dari minus', 'x.active': 'STEP AKTIF',
    'x.fh': 'Kesehatan finansial', 'x.fhp': 'Empat pilar, masing-masing maksimal 25 poin.', 'x.p1': 'Arus kas', 'x.p2': 'Tabungan', 'x.p3': 'Utang', 'x.p4': 'Perencanaan',
    'j.efU': 'DANA DARURAT',
    'j.houseT': 'Beli Rumah',
    'j.investT': 'Investasi',
    'j.efT': 'Dana Darurat',
    'j.dailyT': 'Keperluan Sehari-hari',
    'r.q': '"Ulasan pengemudi di sini."',
    'rd.e': 'Mengapa Laju',
    'rd.h': 'Setiap hari di jalan. <em>Tanpa bukti di atas kertas.</em>',
    'rd.p': 'Pengemudi ojol berstatus mitra, bukan karyawan, sehingga tidak ada slip gaji untuk ditunjukkan ke bank. Gulir untuk menyusuri datanya.',
    'rd.read': 'Titik Data',
    'rl.1': 'Pengemudi',
    'rl.2': 'Pendapatan',
    'rl.3': 'Utang',
    'rl.4': 'Telat Bayar',
    'rl.5': 'Tabungan',
    'g1n': '7 Juta+',
    'g1': 'Mitra ojol di seluruh Indonesia.',
    'g1s': 'Kemenhub, Juli 2025',
    'g2': 'Berpenghasilan bersih di bawah Rp100.000 per hari.',
    'gs.ideas': 'Survei IDEAS, Agustus 2026',
    'g3': 'Masih punya utang atau cicilan berjalan.',
    'g4n': '79,7%',
    'g4': 'Dari yang berutang, pernah telat bayar dalam tiga bulan terakhir.',
    'g5': 'Pekerja gig yang punya tabungan darurat.',
    'g5s': 'Bank Dunia 2023, Dikutip 360info',
    'g6': 'Laju mengubah perjalanan itu menjadi rekam jejak.',
    'g6b': 'Lihat Cara Kerja',
    'm1a': 'Hanya Baca',
    'm1ap': 'Laju hanya melihat. Tidak bisa memindahkan uang.',
    'm1b': '30 Hari',
    'm1bp': 'Satu bulan transaksi nyata.',
    'm1c': '4 Pilar',
    'm1cp': 'Arus kas, tabungan, utang, perencanaan.',
    'm2a': 'Budget Harian',
    'm2ap': 'Pendapatan dikurangi cicilan, dibagi 30.',
    'm2b': 'Utang Mahal Dulu',
    'm2bp': 'Pinjol dan paylater dilunasi lebih dulu.',
    'm2c': 'Bantalan Mini',
    'm2cp': 'Tiga hari pengeluaran pokok.',
    'm3a': 'Terverifikasi',
    'm3ap': 'Didukung data e-wallet, paling lama 30 hari.',
    'm3b': 'Izin Anda',
    'm3bp': 'Tidak ada yang dibagikan tanpa izin Anda.',
    'm3c': 'Bukan Pinjaman',
    'm3cp': 'Laju tidak meminjamkan uang.',
    't.home': 'Beranda', 't.lad': 'Tangga', 't.log': 'Catat', 't.rep': 'Rapor', 't.pro': 'Profil',
    'c.e': 'Kalkulator', 'c.h': 'Proyeksikan <em>tabungan Anda.</em>', 'c.p': 'Geser angkanya untuk melihat bagaimana setoran harian yang kecil terkumpul dalam enam bulan atau setahun.',
    'c.t': 'Proyeksi Tabungan', 'c.l5': 'PERIODE', 'c.m6': '6 Bulan', 'c.m12': '1 Tahun',
    'c.l1': 'Pendapatan Bulanan', 'c.l2': 'Cicilan Bulanan', 'c.l3': 'Hari Narik', 'c.l4': 'Setoran Harian',
    'c.fine': 'Perkiraan, bukan janji. Tidak ada bunga yang ditambahkan karena Laju tidak memberi bunga.',
    'sf.e': 'Keamanan', 'sf.h': 'Sedia payung <em>sebelum hujan.</em>',
    'sf.1': 'Hanya baca.', 'sf.1p': 'Akses e-wallet lewat penyedia open finance berlisensi. Laju hanya melihat, tidak bisa memindahkan uang.',
    'sf.2': 'Anda yang memegang kendali.', 'sf.2p': 'Cabut izin dan hapus seluruh data Anda kapan saja.',
    'sf.3': 'Tidak pernah meminta PIN.', 'sf.3p': 'Password tidak pernah disimpan, hanya hash dengan salt. Laju tidak pernah meminta PIN.',
    'sf.4': 'E-statement tidak disimpan.', 'sf.4p': 'E-statement PDF yang diunggah dibaca, lalu dibuang.',
    'sf.5': 'AI hanya melihat angka.', 'sf.5p': 'AI tidak pernah menerima nama, nomor ponsel, atau detail rekening Anda.',
    'sf.6': 'Tidak pernah dijual.', 'sf.6p': 'Laju bukan pemberi pinjaman dan tidak menjual data.',
    'sf.fine': 'Laju adalah prototipe yang berfungsi. Demo memakai sambungan e-wallet simulasi dan data contoh.',
    'r.e': 'Ulasan', 'r.h': 'Masukan <em>pengemudi.</em>', 'r.rate': 'Isi rating terverifikasi di sini.', 'r.who': '[Nama Pengemudi] · [Kota]',
   
   
   
   
   
   
   
   
    'g.e': 'Mulai', 'g.h': 'Langkah pertama tinggal <em>satu ketukan.</em>',
    'g.p': 'Laju gratis, tanpa biaya dan tanpa bunga. Buka demo di browser Anda. Demo memakai data contoh, jadi setiap langkah aman dijelajahi.',
    'g.soon': 'Tautan Diperlukan',
    'ft.tag': 'Kesehatan finansial untuk pengemudi ojol Indonesia.', 'ft.ex': 'Jelajahi', 'ft.tr': 'Kepercayaan', 'ft.demo': 'Demo', 'ft.ct': 'Kontak', 'ft.mail': 'Tambahkan email kontak di sini.',
    'ft.fine': 'Prototipe riset tim NUS untuk APRU 2026 Hackathon. Bukan bank. Bukan pemberi pinjaman. Layar menampilkan data contoh.'
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
    $$('[data-al]').forEach(i => i.classList.toggle('on', i.dataset.al === lang));   // the switch inside the phones follows
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

  /* ---------- 9. scroll effects and small things ---------- */
  // phone menu
  const menuBtn = $('#menuBtn'), navLinks = $('#navLinks');
  const closeMenu = () => { navLinks.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); };
  menuBtn.addEventListener('click', () => { const open = navLinks.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', String(open)); });
  navLinks.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  // store buttons are placeholders until real links exist
  $$('[data-placeholder]').forEach(a => a.addEventListener('click', e => e.preventDefault()));

  // the big spinning coin is the Laju logo, with a real edge
  const spin = $('#spinCoin');
  if (spin) {
    const T = 24, face = '<svg viewBox="0 0 40 40"><use href="#coin-logo"/></svg>';
    for (let i = 0; i <= T; i++) { const e = el('i', 'edge'); e.style.transform = `translateZ(${i - T / 2}px)`; spin.append(e); }
    const a = el('div'), b = el('div');
    a.innerHTML = face; b.innerHTML = face;
    a.style.transform = `translateZ(${T / 2 + 0.5}px)`; b.style.transform = `rotateY(180deg) translateZ(${T / 2 + 0.5}px)`;
    spin.append(a, b);
  }

  // glass cards in the hero lean toward the pointer
  const cards = $('#heroCards');
  if (cards && !RM && matchMedia('(hover:hover)').matches) {
    cards.addEventListener('pointermove', e => {
      const r = cards.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      cards.style.setProperty('--ry', (x * 9).toFixed(2) + 'deg');
      cards.style.setProperty('--rx', (-y * 7).toFixed(2) + 'deg');
    });
    cards.addEventListener('pointerleave', () => { cards.style.setProperty('--ry', '0deg'); cards.style.setProperty('--rx', '0deg'); });
  }

  // numbers count up when they arrive
  const counters = $$('[data-count]');
  function runCounter(e) {
    const to = +e.dataset.count, tw = tween(v => { e.textContent = Math.round(v); }, 1400);
    tw(0, true); tw(to);
  }

  // sections reveal as they arrive, lists arrive one row at a time
  const rv = $$('.step-intro > *,.sec .eyebrow, .sec .h2, .sec .display, .sec .sec-lead, .feats li, .safe-list li, .window, .calc-card, .calc-out, .ticks, .rating, .store-row, .sec-get .cta-row');
  $$('.feats li, .safe-list li').forEach(li => li.style.setProperty('--dl', ([...li.parentNode.children].indexOf(li) * 0.08).toFixed(2) + 's'));
  const fan = $('.fan');
  if ('IntersectionObserver' in window && !RM) {
    rv.forEach(e => e.classList.add('rv'));
    pending = rv.slice(); onScroll();           // a second, scroll based check so nothing can stay hidden
    const io =new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    rv.forEach(e => io.observe(e));
    const io2 = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      io2.unobserve(en.target);
      const t = en.target;
      if (t === fan || t === cards) t.classList.add('in');
      else if (t.dataset.count) runCounter(t);
      else sillJars.forEach((j, i) => { setTimeout(() => j.add(true), 300 + i * 260); setTimeout(() => j.add(true), 700 + i * 260); });
    }), { threshold: 0.3 });
    if (fan) io2.observe(fan);
    if (cards) io2.observe(cards);
    counters.forEach(c => io2.observe(c));
    io2.observe($('#window'));
  } else {
    if (fan) fan.classList.add('in');
    if (cards) cards.classList.add('in');
  }
})();
