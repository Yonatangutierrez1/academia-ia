/* ────────────────────────────────────────────
    Neural-network particle canvas & Blobs
──────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
    // Insert blobs if they don't exist
    if (!document.querySelector('.blob-1')) {
        const b1 = document.createElement('div'); b1.className = 'blob blob-1';
        const b2 = document.createElement('div'); b2.className = 'blob blob-2';
        const b3 = document.createElement('div'); b3.className = 'blob blob-3';
        document.body.insertBefore(b3, document.body.firstChild);
        document.body.insertBefore(b2, document.body.firstChild);
        document.body.insertBefore(b1, document.body.firstChild);
    }

    const canvas = document.getElementById('neural');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let W, H, nodes = [];
        const NODE_COUNT = 70;
        const MAX_DIST = 160;

        function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
        window.addEventListener('resize', resize); resize();
        function randomNode() { return { x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5, r: Math.random() * 2 + 1 }; }
        for (let i = 0; i < NODE_COUNT; i++) nodes.push(randomNode());

        function draw() {
            ctx.clearRect(0, 0, W, H);
            nodes.forEach(n => { n.x += n.vx; n.y += n.vy; if (n.x < 0 || n.x > W) n.vx *= -1; if (n.y < 0 || n.y > H) n.vy *= -1; });
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, dist = Math.hypot(dx, dy);
                    if (dist < MAX_DIST) {
                        const alpha = 1 - dist / MAX_DIST;
                        ctx.strokeStyle = `rgba(99, 102, 241, ${alpha * 0.6})`; ctx.lineWidth = alpha * 1.2;
                        ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
                    }
                }
            }
            nodes.forEach(n => {
                ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.fillStyle = '#818cf8'; ctx.shadowColor = '#818cf8'; ctx.shadowBlur = 8; ctx.fill(); ctx.shadowBlur = 0;
            });
            requestAnimationFrame(draw);
        }
        draw();
    }
});

const API_BASE = window.location.origin + '/api';
const API_URL = `${API_BASE}/enrollments`;

function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('currentStudent');
    window.location.href = 'index.html';
}
