// Real Genetic Algorithm Demo — called when demo_ga module loads
window.renderGADemo = function(wrapper) {
  wrapper.innerHTML = `
    <div class="tool-box" style="text-align:left;">
      <h3 style="color:var(--accent);margin-bottom:0.3rem;">Demo: Algoritmo Genetico en Vivo</h3>
      <p style="color:var(--muted);font-size:0.85rem;margin-bottom:1.25rem;">
        40 individuos evolucionan para encontrar el <strong style="color:#fbbf24;">maximo global</strong>
        de f(x) = x·sin(3x) + cos(x)·(x/2) en el intervalo [0, 10].
      </p>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:0.75rem;margin-bottom:1.25rem;">
        <div style="background:rgba(10,15,30,0.8);border:1px solid rgba(99,102,241,0.3);border-radius:8px;padding:0.9rem;text-align:center;">
          <div style="font-size:1.6rem;font-weight:900;color:#6366f1;font-family:'Share Tech Mono',monospace;" id="ga-gen">0</div>
          <div style="font-size:0.7rem;color:var(--muted);margin-top:0.2rem;">GENERACION</div>
        </div>
        <div style="background:rgba(10,15,30,0.8);border:1px solid rgba(251,191,36,0.3);border-radius:8px;padding:0.9rem;text-align:center;">
          <div style="font-size:1.6rem;font-weight:900;color:#fbbf24;font-family:'Share Tech Mono',monospace;" id="ga-best">-</div>
          <div style="font-size:0.7rem;color:var(--muted);margin-top:0.2rem;">MEJOR FITNESS</div>
        </div>
        <div style="background:rgba(10,15,30,0.8);border:1px solid rgba(16,185,129,0.3);border-radius:8px;padding:0.9rem;text-align:center;">
          <div style="font-size:1.6rem;font-weight:900;color:#10b981;font-family:'Share Tech Mono',monospace;" id="ga-avg">-</div>
          <div style="font-size:0.7rem;color:var(--muted);margin-top:0.2rem;">FITNESS PROM.</div>
        </div>
        <div style="background:rgba(10,15,30,0.8);border:1px solid rgba(239,68,68,0.3);border-radius:8px;padding:0.9rem;text-align:center;">
          <div style="font-size:1.6rem;font-weight:900;color:#ef4444;font-family:'Share Tech Mono',monospace;" id="ga-bestx">-</div>
          <div style="font-size:0.7rem;color:var(--muted);margin-top:0.2rem;">MEJOR X</div>
        </div>
      </div>
      <canvas id="ga-canvas" style="width:100%;border-radius:8px;background:#060d1a;border:1px solid rgba(99,102,241,0.2);display:block;"></canvas>
      <div style="display:flex;gap:0.75rem;margin-top:1.25rem;align-items:center;flex-wrap:wrap;">
        <button id="ga-playpause" class="cta" style="padding:0.55rem 1.5rem;font-size:0.9rem;">▶ Iniciar</button>
        <button id="ga-reset" class="btn-small" style="padding:0.55rem 1rem;">↺ Reiniciar</button>
        <label style="color:var(--muted);font-size:0.82rem;display:flex;align-items:center;gap:0.5rem;">
          Velocidad: <input type="range" id="ga-speed" min="100" max="950" value="300" step="50" style="width:100px;accent-color:var(--accent);">
        </label>
        <label style="color:var(--muted);font-size:0.82rem;display:flex;align-items:center;gap:0.5rem;">
          Mutacion: <input type="range" id="ga-mutation" min="1" max="50" value="15" step="1" style="width:80px;accent-color:#10b981;">
          <span id="ga-mut-label" style="color:#10b981;font-family:'Share Tech Mono',monospace;min-width:30px;">15%</span>
        </label>
      </div>
      <div style="margin-top:1rem;padding:0.75rem 1rem;background:rgba(10,15,30,0.5);border-radius:6px;font-size:0.78rem;color:var(--muted);">
        Azul = individuos | Dorado = mejor solucion encontrada | Prueba subir la mutacion para ver como pierde convergencia
      </div>
    </div>
  `;

  setTimeout(() => {
    const canvas = document.getElementById('ga-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const DPR = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * DPR;
    canvas.height = 320 * DPR;
    canvas.style.height = '320px';
    ctx.scale(DPR, DPR);
    const W = canvas.offsetWidth, H = 320;

    const f = x => x * Math.sin(3 * x) + Math.cos(x) * (x / 2);
    const X_MIN = 0, X_MAX = 10, POP_SIZE = 40;
    let mutRate = 0.15;

    // Pre-compute function curve
    const curve = [];
    let minF = Infinity, maxF = -Infinity;
    for (let i = 0; i <= 300; i++) {
      const x = X_MIN + (X_MAX - X_MIN) * (i / 300);
      const y = f(x);
      curve.push({ x, y });
      if (y < minF) minF = y;
      if (y > maxF) maxF = y;
    }
    const range = maxF - minF;
    minF -= range * 0.15;
    maxF += range * 0.1;

    const toX = x => ((x - X_MIN) / (X_MAX - X_MIN)) * (W - 60) + 30;
    const toY = y => H - 40 - ((y - minF) / (maxF - minF)) * (H - 70);

    let pop = [], gen = 0, bestEver = null, running = false, ivId = null;
    let histBest = [], histAvg = [];

    function init() {
      pop = Array.from({ length: POP_SIZE }, () => ({ x: X_MIN + Math.random() * (X_MAX - X_MIN), fit: 0 }));
      evaluate();
      gen = 0; bestEver = null; histBest = []; histAvg = [];
    }

    function evaluate() {
      pop.forEach(p => { p.fit = f(p.x); });
      pop.sort((a, b) => b.fit - a.fit);
    }

    function select(k = 3) {
      let best = null;
      for (let i = 0; i < k; i++) {
        const c = pop[Math.floor(Math.random() * pop.length)];
        if (!best || c.fit > best.fit) best = c;
      }
      return best;
    }

    function evolve() {
      const next = [{ x: pop[0].x, fit: pop[0].fit }, { x: pop[1].x, fit: pop[1].fit }];
      while (next.length < POP_SIZE) {
        const a = Math.random();
        let cx = a * select().x + (1 - a) * select().x;
        if (Math.random() < mutRate) cx += (Math.random() - 0.5) * 2 * 1.5;
        cx = Math.max(X_MIN, Math.min(X_MAX, cx));
        next.push({ x: cx, fit: 0 });
      }
      pop = next;
      evaluate();
      gen++;
      const avg = pop.reduce((s, p) => s + p.fit, 0) / pop.length;
      if (!bestEver || pop[0].fit > bestEver.fit) bestEver = { ...pop[0] };
      histBest.push(bestEver.fit);
      histAvg.push(avg);
      if (histBest.length > 80) { histBest.shift(); histAvg.shift(); }
      document.getElementById('ga-gen').textContent = gen;
      document.getElementById('ga-best').textContent = bestEver.fit.toFixed(2);
      document.getElementById('ga-avg').textContent = avg.toFixed(2);
      document.getElementById('ga-bestx').textContent = bestEver.x.toFixed(3);
      draw();
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Grid lines
      ctx.strokeStyle = 'rgba(99,102,241,0.07)'; ctx.lineWidth = 1;
      for (let i = 0; i <= 10; i++) {
        const px = toX(i);
        ctx.beginPath(); ctx.moveTo(px, 10); ctx.lineTo(px, H - 40); ctx.stroke();
      }

      // Function curve (filled)
      ctx.beginPath();
      ctx.moveTo(toX(curve[0].x), toY(curve[0].y));
      curve.forEach(p => ctx.lineTo(toX(p.x), toY(p.y)));
      ctx.strokeStyle = '#818cf8'; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.lineTo(toX(X_MAX), toY(minF));
      ctx.lineTo(toX(X_MIN), toY(minF));
      ctx.closePath();
      ctx.fillStyle = 'rgba(99,102,241,0.08)'; ctx.fill();

      // X-axis labels
      ctx.fillStyle = 'rgba(148,163,184,0.6)';
      ctx.font = '10px Outfit'; ctx.textAlign = 'center';
      for (let i = 0; i <= 10; i++) ctx.fillText(i, toX(i), H - 22);
      ctx.textAlign = 'left';
      ctx.fillText('f(x)', 5, 20);

      // Mini history chart
      if (histBest.length > 2) {
        const hW = 110, hH = 45, hX = W - hW - 8, hY = 8;
        ctx.fillStyle = 'rgba(10,15,30,0.8)';
        ctx.beginPath(); ctx.roundRect(hX, hY, hW, hH, 4); ctx.fill();
        ctx.strokeStyle = 'rgba(99,102,241,0.2)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.roundRect(hX, hY, hW, hH, 4); ctx.stroke();

        const lo = Math.min(...histAvg);
        const hi = Math.max(...histBest);
        const rng = Math.max(hi - lo, 0.01);
        const hx = i => hX + 4 + (i / 80) * (hW - 8);
        const hy = v => hY + hH - 4 - ((v - lo) / rng) * (hH - 8);

        ctx.beginPath();
        histAvg.forEach((v, i) => i ? ctx.lineTo(hx(i), hy(v)) : ctx.moveTo(hx(i), hy(v)));
        ctx.strokeStyle = '#10b981'; ctx.lineWidth = 1; ctx.stroke();

        ctx.beginPath();
        histBest.forEach((v, i) => i ? ctx.lineTo(hx(i), hy(v)) : ctx.moveTo(hx(i), hy(v)));
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.5; ctx.stroke();

        ctx.fillStyle = 'rgba(148,163,184,0.5)'; ctx.font = '8px Outfit'; ctx.textAlign = 'left';
        ctx.fillText('historial fitness', hX + 3, hY + 8);
      }

      // Population vertical drop lines + dots
      pop.forEach((ind, i) => {
        const cx = toX(ind.x), cy = toY(ind.fit);
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, toY(minF));
        ctx.strokeStyle = 'rgba(99,102,241,0.1)'; ctx.lineWidth = 1; ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy, i < 3 ? 5 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = i < 3 ? 'rgba(129,140,248,0.95)' : 'rgba(99,102,241,0.5)';
        ctx.fill();
        if (i < 3) { ctx.strokeStyle = '#c7d2fe'; ctx.lineWidth = 1.5; ctx.stroke(); }
      });

      // Best ever — golden marker
      if (bestEver) {
        const bx = toX(bestEver.x), by = toY(bestEver.fit);
        const grd = ctx.createRadialGradient(bx, by, 0, bx, by, 18);
        grd.addColorStop(0, 'rgba(251,191,36,0.4)');
        grd.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(bx, by, 18, 0, Math.PI * 2);
        ctx.fillStyle = grd; ctx.fill();
        ctx.beginPath(); ctx.arc(bx, by, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#fbbf24'; ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 10px Outfit'; ctx.textAlign = 'center';
        ctx.fillText('x=' + bestEver.x.toFixed(2) + '  f=' + bestEver.fit.toFixed(2), bx, by - 14);
      }
    }

    function getDelay() { return 1000 - parseInt(document.getElementById('ga-speed').value); }

    document.getElementById('ga-playpause').addEventListener('click', () => {
      if (gen === 0 && !running) init();
      running = !running;
      document.getElementById('ga-playpause').textContent = running ? '⏸ Pausar' : '▶ Continuar';
      if (running) ivId = setInterval(evolve, getDelay());
      else clearInterval(ivId);
    });

    document.getElementById('ga-reset').addEventListener('click', () => {
      clearInterval(ivId); running = false;
      document.getElementById('ga-playpause').textContent = '▶ Iniciar';
      init(); draw();
      ['ga-gen','ga-best','ga-avg','ga-bestx'].forEach(id =>
        document.getElementById(id).textContent = id === 'ga-gen' ? '0' : '-'
      );
    });

    document.getElementById('ga-speed').addEventListener('input', () => {
      if (running) { clearInterval(ivId); ivId = setInterval(evolve, getDelay()); }
    });

    document.getElementById('ga-mutation').addEventListener('input', function() {
      mutRate = parseInt(this.value) / 100;
      document.getElementById('ga-mut-label').textContent = this.value + '%';
    });

    init();
    draw();
  }, 100);
};
