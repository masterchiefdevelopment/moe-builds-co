import { useState, useEffect } from 'react';

const css = `
.mbc-page {
  --gold: #F5A623;
  --gold-light: #FFD700;
  --bg: #080808;
  --bg-card: rgba(255,255,255,0.03);
  --border: rgba(255,255,255,0.08);
  --text: #f0f0f0;
  --text-muted: #888;
  --text-dim: #3a3a3a;
  --green: #22C55E;
  --red: #EF4444;
  font-family: 'Inter', -apple-system, sans-serif;
  background: var(--bg);
  color: var(--text);
  overflow-x: hidden;
  min-height: 100vh;
}

/* ── NAV ─────────────────────────────────────────────── */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  padding: 20px 60px; display: flex; align-items: center; justify-content: space-between;
  background: rgba(8,8,8,0.85); backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border); transition: background .3s;
}
.nav-logo { font-size: 20px; font-weight: 800; letter-spacing: -.5px; color: #fff; }
.nav-logo span { color: var(--gold); }
.nav-links { display: flex; gap: 40px; list-style: none; }
.nav-links a { color: var(--text-muted); text-decoration: none; font-size: 14px; font-weight: 500; transition: color .2s; }
.nav-links a:hover { color: #fff; }
.nav-cta { background: var(--gold); color: #000; font-weight: 700; font-size: 13px; padding: 10px 22px; border-radius: 6px; text-decoration: none; transition: all .2s; }
.nav-cta:hover { background: var(--gold-light); transform: translateY(-1px); }

/* ── HERO ────────────────────────────────────────────── */
.hero {
  min-height: 100vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  position: relative; overflow: hidden; padding: 0 60px; text-align: center;
  background-image: url('/sa-skyline.jpg');
  background-size: cover;
  background-position: center 40%;
}
.hero::before {
  content: ''; position: absolute; inset: 0; z-index: 0;
  background: linear-gradient(to top, #080808 0%, rgba(8,8,8,0.82) 40%, rgba(8,8,8,0.55) 100%);
}
/* night sky gradient (fallback when no photo) */
.hero-bg-fallback {
  position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background:
    radial-gradient(ellipse 120% 60% at 50% 0%, rgba(245,166,35,0.045) 0%, transparent 65%),
    radial-gradient(ellipse 80% 40% at 20% 80%, rgba(245,166,35,0.025) 0%, transparent 55%),
    radial-gradient(ellipse 80% 40% at 80% 80%, rgba(245,100,35,0.018) 0%, transparent 55%);
}
.hero-glow {
  position: absolute; top: 38%; left: 50%; transform: translate(-50%,-50%);
  width: 1000px; height: 500px;
  background: radial-gradient(ellipse, rgba(245,166,35,0.09) 0%, transparent 68%);
  pointer-events: none; z-index: 0;
}
.hero-content { position: relative; z-index: 2; max-width: 940px; }

.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(245,166,35,0.07); border: 1px solid rgba(245,166,35,0.2);
  color: var(--gold); font-size: 12px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;
  padding: 8px 18px; border-radius: 100px; margin-bottom: 36px;
  animation: fadeUp .8s ease both;
}
.badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.7)} }
@keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

.hero h1 {
  font-size: clamp(54px, 8.5vw, 100px);
  font-weight: 900; letter-spacing: -4px; line-height: .95; margin-bottom: 28px;
  animation: fadeUp .9s .12s ease both;
}
.hero h1 .l1 { display: block; color: #fff; }
.hero h1 .grad {
  display: block;
  background: linear-gradient(130deg, #F5A623 0%, #FFD700 40%, #F5A623 100%);
  background-size: 200% auto;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  animation: shimmer 5s linear infinite, fadeUp .9s .12s ease both;
}
@keyframes shimmer { 0%{background-position:0% center} 100%{background-position:200% center} }

.hero-sub {
  font-size: 19px; color: var(--text-muted); max-width: 580px;
  margin: 0 auto 50px; line-height: 1.65;
  animation: fadeUp .9s .28s ease both;
}
.hero-sub strong { color: #ddd; font-weight: 600; }

.hero-ctas { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; animation: fadeUp .9s .42s ease both; }
.btn-primary { background: var(--gold); color: #000; font-weight: 700; font-size: 15px; padding: 16px 36px; border-radius: 8px; text-decoration: none; transition: all .2s; display: inline-block; }
.btn-primary:hover { background: var(--gold-light); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(245,166,35,.35); }
.btn-secondary { background: transparent; color: #fff; font-weight: 600; font-size: 15px; padding: 16px 36px; border-radius: 8px; text-decoration: none; border: 1px solid var(--border); transition: all .2s; display: inline-block; }
.btn-secondary:hover { border-color: rgba(255,255,255,.25); background: rgba(255,255,255,.04); transform: translateY(-2px); }


.scroll-hint {
  position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%);
  z-index: 3; display: flex; flex-direction: column; align-items: center; gap: 8px;
  color: #555; font-size: 11px; letter-spacing: 2.5px; text-transform: uppercase;
  animation: fadeUp 1s 1.1s ease both;
}
.scroll-mouse { width: 22px; height: 36px; border: 1.5px solid #2a2a2a; border-radius: 11px; position: relative; }
.scroll-mouse::after {
  content: ''; width: 3px; height: 7px; background: #444; border-radius: 2px;
  position: absolute; top: 6px; left: 50%; transform: translateX(-50%);
  animation: sdwn 1.8s ease-in-out infinite;
}
@keyframes sdwn { 0%{top:6px;opacity:1} 100%{top:22px;opacity:0} }

/* ── TRUST BAR ───────────────────────────────────────── */
.trust-bar {
  padding: 18px 60px; background: rgba(245,166,35,.04);
  border-top: 1px solid rgba(245,166,35,.12); border-bottom: 1px solid rgba(245,166,35,.12);
  display: flex; align-items: center; overflow: hidden;
}
.trust-label { font-size: 10px; font-weight: 800; letter-spacing: 2.5px; text-transform: uppercase; color: var(--gold); white-space: nowrap; margin-right: 48px; flex-shrink: 0; }
.trust-track { display: flex; gap: 48px; animation: marquee 22s linear infinite; white-space: nowrap; }
@keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
.trust-item { font-size: 13px; color: var(--text-muted); font-weight: 500; display: flex; align-items: center; gap: 10px; }
.trust-item::before { content: '✦'; color: var(--gold); font-size: 9px; }

/* ── STATS ───────────────────────────────────────────── */
.stats-wrap { max-width: 1200px; margin: 0 auto; padding: 80px 60px; }
.stats-grid { display: grid; grid-template-columns: repeat(4,1fr); background: var(--border); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; gap: 1px; }
.stat-box { background: var(--bg); padding: 48px 36px; text-align: center; }
.stat-num { font-size: 54px; font-weight: 900; letter-spacing: -3px; line-height: 1; background: linear-gradient(135deg, #fff 0%, var(--gold) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 10px; }
.stat-lbl { font-size: 13px; color: var(--text-muted); line-height: 1.4; }

/* ── DIVIDER ─────────────────────────────────────────── */
.div { height: 1px; background: linear-gradient(90deg, transparent, var(--border), transparent); margin: 0 60px; }

/* ── SHARED SECTION LABELS ───────────────────────────── */
.section-label { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--gold); margin-bottom: 14px; }
.section-title { font-size: clamp(34px, 4.5vw, 56px); font-weight: 800; letter-spacing: -2px; line-height: 1.05; color: #fff; margin-bottom: 16px; }
.section-sub { font-size: 17px; color: var(--text-muted); line-height: 1.65; max-width: 500px; }

/* ── DEMOS ───────────────────────────────────────────── */
.demos-wrap { max-width: 1300px; margin: 0 auto; padding: 120px 60px; }
.demos-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 56px; }
.demos-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }

.demo-card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 16px; overflow: hidden; text-decoration: none; display: block;
  transition: all .3s ease; position: relative;
}
.demo-card:hover {
  border-color: rgba(245,166,35,.28); transform: translateY(-6px);
  box-shadow: 0 24px 60px rgba(0,0,0,.6), 0 0 0 1px rgba(245,166,35,.06);
}

/* ── DEMO CARD PREVIEWS (mini website mockups) ───────── */
.demo-preview {
  aspect-ratio: 16/10; position: relative; overflow: hidden;
  font-family: 'Inter', sans-serif;
}

/* Browser chrome */
.browser-bar {
  position: absolute; top: 0; left: 0; right: 0; height: 26px; z-index: 10;
  background: rgba(0,0,0,.6); display: flex; align-items: center; padding: 0 10px; gap: 5px;
}
.bdot { width: 7px; height: 7px; border-radius: 50%; }
.bdot:nth-child(1){background:#FF5F57} .bdot:nth-child(2){background:#FEBC2E} .bdot:nth-child(3){background:#28C840}
.burl { flex: 1; margin: 0 10px; height: 14px; background: rgba(255,255,255,.07); border-radius: 3px; font-size: 9px; color: #444; display: flex; align-items: center; padding: 0 8px; }

/* DEMO CARD shimmer sweep on hover */
.demo-card::before {
  content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(245,166,35,0.04) 50%, transparent 100%);
  z-index: 5; transition: left .55s ease; pointer-events: none;
}
.demo-card:hover::before { left: 150%; }
/* URL bar edge fade */
.burl { mask-image: linear-gradient(90deg, black 70%, transparent 100%); }

/* RESTAURANT MOCKUP */
.mock-restaurant {
  background: linear-gradient(160deg, #0e0400 0%, #1a0800 50%, #0f0300 100%);
  width: 100%; height: 100%; padding-top: 26px; box-sizing: border-box; overflow: hidden;
}
.mr-nav {
  display: flex; align-items: center; justify-content: space-between;
  padding: 6px 12px; border-bottom: 1px solid rgba(245,166,35,.12);
}
.mr-logo { font-size: 8px; font-weight: 800; color: var(--gold); letter-spacing: .5px; text-transform: uppercase; }
.mr-nav-links { display: flex; gap: 8px; }
.mr-nav-links span { font-size: 7px; color: rgba(255,255,255,.4); font-weight: 500; }
.mr-hero { padding: 10px 12px 8px; }
.mr-eyebrow { font-size: 6px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--gold); margin-bottom: 4px; }
.mr-h1 { font-size: 14px; font-weight: 900; color: #fff; letter-spacing: -.5px; line-height: 1.1; margin-bottom: 3px; }
.mr-sub { font-size: 7px; color: rgba(255,255,255,.45); margin-bottom: 8px; }
.mr-btns { display: flex; gap: 6px; margin-bottom: 10px; }
.mr-btn-main { background: var(--gold); color: #000; font-size: 7px; font-weight: 800; padding: 5px 10px; border-radius: 4px; }
.mr-btn-sec { border: 1px solid rgba(255,255,255,.15); color: rgba(255,255,255,.6); font-size: 7px; font-weight: 600; padding: 5px 10px; border-radius: 4px; }
.mr-menu-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 5px; padding: 0 12px; }
.mr-menu-item { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07); border-radius: 5px; padding: 6px; position: relative; }
.mr-menu-item:first-child::after { content: '★ Popular'; position: absolute; top: 3px; right: 3px; font-size: 5px; font-weight: 800; color: #000; background: var(--gold); padding: 1px 4px; border-radius: 2px; letter-spacing: .3px; }
.mr-item-img { height: 24px; background: linear-gradient(135deg, rgba(245,166,35,.25), rgba(200,80,20,.15)); border-radius: 3px; margin-bottom: 4px; position: relative; overflow: hidden; }
.mr-item-img::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,.08) 50%, transparent 100%); background-size: 200% 100%; animation: imgShimmer 2.2s ease-in-out infinite; }
@keyframes imgShimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
.mr-item-name { font-size: 6px; font-weight: 700; color: rgba(255,255,255,.8); margin-bottom: 2px; }
.mr-item-price { font-size: 6px; color: var(--gold); font-weight: 700; }
.mr-bar { display: flex; gap: 10px; padding: 6px 12px; border-top: 1px solid rgba(255,255,255,.04); margin-top: 6px; }
.mr-bar-item { display: flex; align-items: center; gap: 3px; font-size: 6px; color: rgba(255,255,255,.3); }

/* FOOD TRUCK MOCKUP */
.mock-foodtruck {
  background: linear-gradient(160deg, #020410 0%, #050820 50%, #030615 100%);
  width: 100%; height: 100%; padding-top: 26px; box-sizing: border-box; overflow: hidden;
}
.mf-nav {
  display: flex; align-items: center; justify-content: space-between;
  padding: 6px 12px; border-bottom: 1px solid rgba(100,100,255,.1);
}
.mf-logo { font-size: 8px; font-weight: 800; color: #7C9FFF; letter-spacing: .5px; text-transform: uppercase; }
.mf-live { display: flex; align-items: center; gap: 4px; }
.mf-live-dot { width: 5px; height: 5px; border-radius: 50%; background: #22C55E; animation: pulse 1.5s ease-in-out infinite; box-shadow: 0 0 6px rgba(34,197,94,.7); }
.mf-live-text { font-size: 7px; color: #22C55E; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
.mf-location { padding: 7px 12px; background: rgba(34,197,94,.07); border-bottom: 1px solid rgba(34,197,94,.1); display: flex; align-items: center; gap: 5px; }
.mf-pin { font-size: 9px; }
.mf-loc-text { font-size: 7px; font-weight: 700; color: rgba(255,255,255,.8); }
.mf-hero { padding: 8px 12px; }
.mf-h1 { font-size: 13px; font-weight: 900; color: #fff; letter-spacing: -.5px; line-height: 1.1; margin-bottom: 3px; }
.mf-sub { font-size: 7px; color: rgba(255,255,255,.4); margin-bottom: 8px; }
.mf-menu { display: grid; grid-template-columns: repeat(2,1fr); gap: 5px; padding: 0 12px; }
.mf-item { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07); border-radius: 5px; padding: 7px 8px; display: flex; justify-content: space-between; align-items: flex-start; }
.mf-item-info {}
.mf-item-name { font-size: 7px; font-weight: 700; color: rgba(255,255,255,.85); margin-bottom: 2px; }
.mf-item-desc { font-size: 6px; color: rgba(255,255,255,.35); }
.mf-item-price { font-size: 8px; font-weight: 800; color: #7C9FFF; }
.mf-btn-row { padding: 8px 12px 0; }
.mf-btn { background: #7C9FFF; color: #000; font-size: 7px; font-weight: 800; padding: 6px 0; border-radius: 4px; width: 100%; text-align: center; display: block; }

/* BARBER MOCKUP */
.mock-barber {
  background: linear-gradient(160deg, #010d02 0%, #031005 50%, #020b02 100%);
  width: 100%; height: 100%; padding-top: 26px; box-sizing: border-box; overflow: hidden;
}
.mb-nav {
  display: flex; align-items: center; justify-content: space-between;
  padding: 6px 12px; border-bottom: 1px solid rgba(34,197,94,.1);
}
.mb-logo { font-size: 8px; font-weight: 800; color: #22C55E; letter-spacing: 1px; text-transform: uppercase; }
.mb-hero { padding: 10px 12px 8px; }
.mb-eyebrow { font-size: 6px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #22C55E; margin-bottom: 3px; }
.mb-h1 { font-size: 13px; font-weight: 900; color: #fff; letter-spacing: -.5px; line-height: 1.1; margin-bottom: 3px; }
.mb-sub { font-size: 7px; color: rgba(255,255,255,.4); margin-bottom: 8px; }
.mb-avail { display: flex; align-items: center; gap: 4px; background: rgba(34,197,94,.07); border: 1px solid rgba(34,197,94,.15); border-radius: 4px; padding: 4px 8px; margin-bottom: 8px; display: inline-flex; }
.mb-avail-dot { width: 5px; height: 5px; background: #22C55E; border-radius: 50%; animation: pulse 2s ease-in-out infinite; }
.mb-avail-text { font-size: 6px; font-weight: 700; color: #22C55E; }
.mb-barbers { display: grid; grid-template-columns: repeat(3,1fr); gap: 5px; padding: 0 12px; }
.mb-barber { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07); border-radius: 5px; padding: 7px; text-align: center; }
.mb-book-btn { background: #22C55E; color: #000; font-size: 6px; font-weight: 800; padding: 4px 8px; border-radius: 3px; animation: bookGlow 2.5s ease-in-out infinite; }
@keyframes bookGlow { 0%,100%{box-shadow:0 0 4px rgba(34,197,94,.4)} 50%{box-shadow:0 0 10px rgba(34,197,94,.75)} }
.mb-avatar { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, rgba(34,197,94,.22), rgba(34,197,94,.06)); margin: 0 auto 4px; display: flex; align-items: center; justify-content: center; font-size: 12px; box-shadow: 0 0 8px rgba(34,197,94,.2); }
.mb-name { font-size: 6px; font-weight: 700; color: rgba(255,255,255,.8); margin-bottom: 2px; }
.mb-role { font-size: 5px; color: rgba(255,255,255,.35); }
.mb-services { display: flex; gap: 4px; padding: 7px 12px 0; flex-wrap: wrap; }
.mb-service { background: rgba(34,197,94,.06); border: 1px solid rgba(34,197,94,.12); border-radius: 3px; font-size: 6px; color: rgba(255,255,255,.5); padding: 3px 6px; }

/* DEMO CARD BODY */
.demo-body { padding: 22px 24px; }
.demo-tag { display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--gold); background: rgba(245,166,35,.1); padding: 4px 10px; border-radius: 4px; margin-bottom: 12px; }
.demo-title { font-size: 21px; font-weight: 700; color: #fff; margin-bottom: 8px; letter-spacing: -.5px; }
.demo-desc { font-size: 14px; color: var(--text-muted); line-height: 1.5; margin-bottom: 20px; }
.demo-link { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: var(--gold); transition: gap .2s; }
.demo-card:hover .demo-link { gap: 10px; }

/* ── ROI CALCULATOR ──────────────────────────────────── */
.roi-outer { background: linear-gradient(180deg, var(--bg) 0%, #0b0800 50%, var(--bg) 100%); }
.roi-inner { max-width: 1200px; margin: 0 auto; padding: 120px 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }

.calc-box {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; overflow: hidden;
}
.calc-header { padding: 24px 28px; border-bottom: 1px solid var(--border); }
.calc-title { font-size: 14px; font-weight: 700; color: #fff; }
.calc-sub { font-size: 13px; color: var(--text-muted); margin-top: 4px; }
.calc-body { padding: 28px; }
.calc-row { margin-bottom: 24px; }
.calc-label { font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; display: flex; justify-content: space-between; }
.calc-label span { color: #fff; font-size: 13px; text-transform: none; letter-spacing: 0; }
input[type=range] {
  width: 100%; appearance: none; height: 3px; background: rgba(255,255,255,.1); border-radius: 2px; outline: none; cursor: pointer;
}
input[type=range]::-webkit-slider-thumb {
  appearance: none; width: 18px; height: 18px; border-radius: 50%; background: var(--gold); cursor: pointer; border: 3px solid #000; box-shadow: 0 0 0 2px rgba(245,166,35,.3);
}
.calc-results { border-top: 1px solid var(--border); padding: 24px 28px; display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--border); }
.calc-result-item { background: var(--bg); padding: 20px 24px; }
.calc-result-item.bad-bg { background: rgba(239,68,68,.04); }
.calc-result-item.good-bg { background: rgba(34,197,94,.04); }
.crn { font-size: 28px; font-weight: 900; letter-spacing: -1.5px; line-height: 1; margin-bottom: 4px; }
.crn.red { color: var(--red); }
.crn.green { color: var(--green); }
.crl { font-size: 12px; color: var(--text-muted); line-height: 1.4; }
.calc-cta { padding: 20px 28px; border-top: 1px solid var(--border); background: rgba(245,166,35,.03); }
.calc-cta-text { font-size: 13px; color: var(--text-muted); margin-bottom: 12px; }
.calc-cta-text strong { color: var(--gold); }
.calc-cta a { display: block; background: var(--gold); color: #000; text-align: center; padding: 12px; border-radius: 8px; font-size: 14px; font-weight: 700; text-decoration: none; transition: all .2s; }
.calc-cta a:hover { background: var(--gold-light); }

/* ── PROCESS ─────────────────────────────────────────── */
.process-wrap { max-width: 1200px; margin: 0 auto; padding: 120px 60px; }
.process-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 28px; margin-top: 64px; }
.process-card {
  padding: 40px; background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 16px; position: relative; overflow: hidden; transition: all .3s;
}
.process-card:hover { border-color: rgba(245,166,35,.2); background: rgba(245,166,35,.015); }
.process-card::before {
  content: attr(data-n); position: absolute; top: -24px; right: 20px;
  font-size: 130px; font-weight: 900; color: rgba(255,255,255,.018); line-height: 1; pointer-events: none;
}
.p-icon { width: 48px; height: 48px; background: rgba(245,166,35,.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 24px; }
.p-num { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--gold); margin-bottom: 12px; }
.p-title { font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 12px; letter-spacing: -.5px; }
.p-desc { font-size: 14px; color: var(--text-muted); line-height: 1.6; }

/* ── PRICING ─────────────────────────────────────────── */
.pricing-wrap { max-width: 1200px; margin: 0 auto; padding: 120px 60px; }
.pricing-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; margin-top: 64px; }
.price-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 40px; }
.price-card.featured { background: rgba(245,166,35,.04); border-color: rgba(245,166,35,.28); position: relative; }
.feat-badge { position: absolute; top: -13px; left: 50%; transform: translateX(-50%); background: var(--gold); color: #000; font-size: 10px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 5px 16px; border-radius: 100px; white-space: nowrap; }
.price-tier { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 16px; }
.price-card.featured .price-tier { color: var(--gold); }
.price-num { font-size: 52px; font-weight: 900; letter-spacing: -2px; color: #fff; line-height: 1; margin-bottom: 4px; }
.price-note { font-size: 13px; color: #333; margin-bottom: 32px; }
.price-features { list-style: none; display: flex; flex-direction: column; gap: 12px; }
.price-features li { font-size: 14px; color: var(--text-muted); display: flex; gap: 10px; align-items: flex-start; }
.ck { color: var(--green); flex-shrink: 0; }

/* ── CTA ─────────────────────────────────────────────── */
.cta-wrap { max-width: 1200px; margin: 0 auto; padding: 80px 60px 140px; }
.cta-box {
  background: linear-gradient(135deg, rgba(245,166,35,.07), rgba(245,166,35,.02));
  border: 1px solid rgba(245,166,35,.18); border-radius: 24px;
  padding: 90px 80px; text-align: center; position: relative; overflow: hidden;
}
.cta-box::before {
  content: ''; position: absolute; top: -80px; left: 50%; transform: translateX(-50%);
  width: 500px; height: 220px;
  background: radial-gradient(ellipse, rgba(245,166,35,.12), transparent 70%); pointer-events: none;
}
.cta-box h2 { font-size: clamp(36px, 5vw, 62px); font-weight: 900; letter-spacing: -2.5px; color: #fff; margin-bottom: 16px; position: relative; }
.cta-box p { font-size: 18px; color: var(--text-muted); margin: 0 auto 48px; max-width: 480px; position: relative; }
.cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-bottom: 28px; position: relative; }
.cta-fine { font-size: 13px; color: #333; position: relative; }

/* ── FOOTER ──────────────────────────────────────────── */
.footer-inner {
  border-top: 1px solid var(--border); padding: 48px 60px;
  display: flex; align-items: center; justify-content: space-between;
}
.f-logo { font-size: 18px; font-weight: 800; color: #fff; letter-spacing: -.5px; }
.f-logo span { color: var(--gold); }
.f-sub { font-size: 13px; color: var(--text-muted); margin-top: 4px; }
.f-links { display: flex; gap: 32px; }
.f-links a { font-size: 13px; color: var(--text-muted); text-decoration: none; transition: color .2s; }
.f-links a:hover { color: #fff; }
.f-right { font-size: 13px; color: #333; text-align: right; line-height: 1.6; }

/* ── REVEAL ANIMATIONS ───────────────────────────────── */
.reveal { opacity: 0; transform: translateY(26px); transition: opacity .65s ease, transform .65s ease; }
.reveal.visible { opacity: 1; transform: translateY(0); }
.d1 { transition-delay: .1s; } .d2 { transition-delay: .2s; } .d3 { transition-delay: .3s; }

/* ── RESPONSIVE ─────────────────────────────────────── */
@media (max-width: 1024px) {
  .demos-grid { grid-template-columns: repeat(2,1fr); }
  .pricing-grid { grid-template-columns: repeat(2,1fr); }
  .process-grid { grid-template-columns: 1fr; }
  .roi-inner { gap: 48px; }
}
@media (max-width: 768px) {
  nav { padding: 16px 20px; }
  .nav-links { display: none; }
  .nav-cta { font-size: 12px; padding: 9px 16px; white-space: nowrap; }
  .hero { padding: 100px 24px 80px; min-height: 100svh; background-position: 60% 40%; }
  .hero h1 { font-size: clamp(40px, 11vw, 68px); letter-spacing: -2px; }
  .hero-sub { font-size: 15px; margin-bottom: 36px; }
  .hero-ctas { flex-direction: column; align-items: center; gap: 10px; }
  .hero-badge { font-size: 11px; padding: 6px 14px; margin-bottom: 24px; }
  .btn-primary, .btn-secondary { width: 100%; max-width: 280px; text-align: center; padding: 15px 24px; }
  .scroll-hint { display: none; }
  .trust-bar { padding: 14px 20px; }
  .founder-outer { padding: 60px 20px 0 !important; }
  .founder-section { grid-template-columns: 1fr !important; gap: 32px !important; padding: 36px 24px !important; }
  .stats-wrap { padding: 60px 20px; }
  .stats-grid { grid-template-columns: repeat(2,1fr); }
  .div { margin: 0 20px; }
  .demos-wrap { padding: 80px 20px; }
  .demos-header { flex-direction: column; align-items: flex-start; gap: 24px; }
  .demos-grid { grid-template-columns: 1fr; }
  .roi-inner { padding: 80px 20px; grid-template-columns: 1fr; gap: 40px; }
  .process-wrap { padding: 80px 20px; }
  .process-grid { grid-template-columns: 1fr; }
  .pricing-wrap { padding: 80px 20px; }
  .pricing-grid { grid-template-columns: 1fr; }
  .cta-wrap { padding: 60px 20px 100px; }
  .cta-box { padding: 60px 24px; }
  .cta-box h2 { letter-spacing: -1.5px; }
  .cta-btns { flex-direction: column; align-items: center; }
  .footer-inner { flex-direction: column; gap: 28px; text-align: center; padding: 40px 20px; }
  .f-links { flex-wrap: wrap; justify-content: center; gap: 20px; }
  .f-right { text-align: center; }
}
`;

const fmt = n => '$' + n.toLocaleString();
const fmtMo = n => n < 1 ? (n * 30).toFixed(0) + ' days' : n.toFixed(1) + ' mo';

export default function Portfolio() {
  const [vol, setVol] = useState(8000);
  const [fee, setFee] = useState(15);
  const [navSolid, setNavSolid] = useState(false);

  const monthly = Math.round(vol * fee / 100);
  const annual = monthly * 12;
  const siteCost = 1500;
  const breakeven = siteCost / monthly;
  const year1savings = annual - siteCost;

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const cObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = +el.dataset.counter;
        let start = null;
        const step = ts => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / 1400, 1);
          el.textContent = Math.floor(p * target) + '%';
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-counter]').forEach(el => cObs.observe(el));
    return () => cObs.disconnect();
  }, []);

  useEffect(() => {
    const handler = () => setNavSolid(window.scrollY > 60);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="mbc-page">
      <style>{css}</style>

      {/* NAV */}
      <nav style={{ background: navSolid ? 'rgba(8,8,8,0.97)' : 'rgba(8,8,8,0.85)' }}>
        <div className="nav-logo">Moe<span>Builds</span>Co</div>
        <ul className="nav-links">
          <li><a href="#work">Work</a></li>
          <li><a href="#process">Process</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <a href="#contact" className="nav-cta">Start Your Project →</a>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-bg-fallback"></div>
        <div className="hero-glow"></div>
        {/* Tech circuit overlay */}
        <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',zIndex:1,pointerEvents:'none',mixBlendMode:'screen'}} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <style>{`
              .trace { stroke: rgba(0,220,255,0.07); stroke-width: 1; fill: none; }
              .node { fill: rgba(245,166,35,0.12); }
              .sonar { fill: none; stroke: rgba(0,220,255,0.08); stroke-width: 1; }
              @keyframes travel { from{stroke-dashoffset:200} to{stroke-dashoffset:0} }
            `}</style>
          </defs>
          <line className="trace" x1="0" y1="15%" x2="100%" y2="15%" strokeDasharray="8 120" style={{animation:'travel 6s linear infinite'}}/>
          <line className="trace" x1="0" y1="30%" x2="100%" y2="30%" strokeDasharray="8 200" style={{animation:'travel 9s linear infinite 1s'}}/>
          <line className="trace" x1="0" y1="50%" x2="100%" y2="50%" strokeDasharray="8 150" style={{animation:'travel 7s linear infinite 2s'}}/>
          <line className="trace" x1="0" y1="70%" x2="100%" y2="70%" strokeDasharray="8 180" style={{animation:'travel 8s linear infinite 0.5s'}}/>
          <line className="trace" x1="0" y1="85%" x2="100%" y2="85%" strokeDasharray="8 130" style={{animation:'travel 5s linear infinite 3s'}}/>
          <line className="trace" x1="10%" y1="0" x2="10%" y2="100%" strokeDasharray="8 100" style={{animation:'travel 7s linear infinite 1.5s'}}/>
          <line className="trace" x1="25%" y1="0" x2="25%" y2="100%" strokeDasharray="8 160" style={{animation:'travel 10s linear infinite'}}/>
          <line className="trace" x1="50%" y1="0" x2="50%" y2="100%" strokeDasharray="8 120" style={{animation:'travel 6s linear infinite 2.5s'}}/>
          <line className="trace" x1="75%" y1="0" x2="75%" y2="100%" strokeDasharray="8 140" style={{animation:'travel 8s linear infinite 1s'}}/>
          <line className="trace" x1="90%" y1="0" x2="90%" y2="100%" strokeDasharray="8 110" style={{animation:'travel 5s linear infinite 3.5s'}}/>
          {[['10%','15%'],['25%','15%'],['50%','15%'],['75%','30%'],['90%','30%'],['10%','50%'],['25%','70%'],['50%','50%'],['75%','50%'],['90%','70%'],['10%','85%'],['50%','85%'],['90%','85%']].map(([x,y],i) => (
            <circle key={i} className="node" cx={x} cy={y} r="3" style={{animation:`pulse ${3+i*0.4}s ease-in-out infinite ${i*0.3}s`}}/>
          ))}
          <circle className="sonar" cx="25%" cy="30%"><animate attributeName="r" values="4;70" dur="4s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.5;0" dur="4s" repeatCount="indefinite"/></circle>
          <circle className="sonar" cx="75%" cy="70%"><animate attributeName="r" values="4;60" dur="5s" repeatCount="indefinite" begin="1.5s"/><animate attributeName="opacity" values="0.5;0" dur="5s" repeatCount="indefinite" begin="1.5s"/></circle>
          <circle className="sonar" cx="50%" cy="50%"><animate attributeName="r" values="4;80" dur="6s" repeatCount="indefinite" begin="3s"/><animate attributeName="opacity" values="0.4;0" dur="6s" repeatCount="indefinite" begin="3s"/></circle>
        </svg>
        <div className="hero-content">
          <div className="hero-badge"><div className="badge-dot"></div>📍 San Antonio, TX · Est. 2026</div>
          <h1>
            <span className="l1">San Antonio's</span>
            <span className="grad">Web Agency.</span>
          </h1>
          <p className="hero-sub">
            We build <strong>custom websites</strong> for local restaurants, food trucks &amp; small businesses that drive <strong>real revenue</strong> — not just look good.
          </p>
          <div className="hero-ctas">
            <a href="#work" className="btn-primary">See Our Work</a>
            <a href="#contact" className="btn-secondary">Get a Free Quote</a>
          </div>
        </div>

        <div className="scroll-hint">
          <div className="scroll-mouse"></div>
          <span>Scroll</span>
        </div>
      </div>

      {/* TRUST BAR */}
      <div className="trust-bar">
        <span className="trust-label">Serving SA</span>
        <div className="trust-track">
          <span className="trust-item">The Pearl District</span>
          <span className="trust-item">Southtown</span>
          <span className="trust-item">Stone Oak</span>
          <span className="trust-item">Alamo Heights</span>
          <span className="trust-item">Downtown SA</span>
          <span className="trust-item">Helotes</span>
          <span className="trust-item">Leon Valley</span>
          <span className="trust-item">Medical Center</span>
          <span className="trust-item">Converse</span>
          <span className="trust-item">The Pearl District</span>
          <span className="trust-item">Southtown</span>
          <span className="trust-item">Stone Oak</span>
          <span className="trust-item">Alamo Heights</span>
          <span className="trust-item">Downtown SA</span>
          <span className="trust-item">Helotes</span>
          <span className="trust-item">Leon Valley</span>
          <span className="trust-item">Medical Center</span>
          <span className="trust-item">Converse</span>
        </div>
      </div>

      {/* FOUNDER */}
      <div className="founder-outer" style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 60px 0' }}>
        <div className="reveal founder-section" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '60px', alignItems: 'center', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '56px 60px' }}>
          <div style={{ textAlign: 'center' }}>
            <img
              src="/founder.png"
              alt="Moses Cadena — Founder of Moe Builds Co."
              style={{ width: '140px', height: '140px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'center 38%', border: '2px solid rgba(245,166,35,0.4)', boxShadow: '0 0 0 5px rgba(245,166,35,0.07),0 0 0 6px rgba(245,166,35,0.04),0 12px 40px rgba(0,0,0,0.6)', display: 'block', margin: '0 auto 16px' }}
            />
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff', letterSpacing: '-.3px' }}>Moses Cadena</div>
            <div style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: '4px' }}>Founder · Moe Builds Co.</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>San Antonio, TX</div>
          </div>
          <div>
            <div className="section-label" style={{ marginBottom: '20px' }}>The Founder</div>
            <p style={{ fontSize: '18px', fontWeight: 500, color: '#e0e0e0', lineHeight: 1.7, marginBottom: '18px' }}>
              San Antonio native. Builder. Operator.
            </p>
            <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: '16px' }}>
              I started Moe Builds Co. because I saw local businesses getting overcharged and underserved by agencies that did not understand their community.
            </p>
            <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.75 }}>
              I build custom apps that local businesses in San Antonio <strong style={{ color: '#ddd', fontWeight: 600 }}>own outright</strong> — no marketplaces, no monthly platform fees, no sharing your customers with competitors. Just your brand, your clients, your app.
            </p>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-wrap">
        <div className="stats-grid">
          <div className="stat-box reveal">
            <div className="stat-num" data-counter="15">0%</div>
            <div className="stat-lbl">Avg pickup order fee<br />charged by platforms</div>
          </div>
          <div className="stat-box reveal d1">
            <div className="stat-num">3</div>
            <div className="stat-lbl">Live demo sites<br />ready to personalize</div>
          </div>
          <div className="stat-box reveal d2">
            <div className="stat-num">7</div>
            <div className="stat-lbl">Days or less to<br />build &amp; launch</div>
          </div>
          <div className="stat-box reveal d3">
            <div className="stat-num">100%</div>
            <div className="stat-lbl">Custom code.<br />No templates. No fluff.</div>
          </div>
        </div>
      </div>

      <div className="div"></div>

      {/* DEMOS */}
      <div className="demos-wrap" id="work">
        <div className="demos-header">
          <div className="reveal">
            <div className="section-label">Live Builds</div>
            <h2 className="section-title">These Sites Are Live Right Now</h2>
            <p className="section-sub">Not mockups. Not concepts. Click any card and explore a fully working site — built and deployed.</p>
          </div>
          <a href="https://moe-builds-co.vercel.app" target="_blank" rel="noreferrer" className="btn-secondary reveal" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>View All Demos →</a>
        </div>
        <div className="demos-grid">

          {/* RESTAURANT */}
          <a href="https://moe-builds-co.vercel.app/restaurant" target="_blank" rel="noreferrer" className="demo-card reveal" data-t="restaurant">
            <div className="demo-preview">
              <div className="browser-bar">
                <div className="bdot"></div><div className="bdot"></div><div className="bdot"></div>
                <div className="burl">moe-builds-co.vercel.app/restaurant</div>
              </div>
              <div className="mock-restaurant">
                <div className="mr-nav">
                  <div className="mr-logo">La Mesa Cocina</div>
                  <div className="mr-nav-links">
                    <span>Menu</span><span>Order</span><span>Reservations</span>
                  </div>
                </div>
                <div className="mr-hero">
                  <div className="mr-eyebrow">Authentic Mexican · SA Owned</div>
                  <div className="mr-h1">Order Direct.<br />Keep It Local.</div>
                  <div className="mr-sub">No third-party fees. Straight from our kitchen to your door.</div>
                  <div className="mr-btns">
                    <div className="mr-btn-main">Order Online Now</div>
                    <div className="mr-btn-sec">View Menu</div>
                  </div>
                </div>
                <div className="mr-menu-row">
                  <div className="mr-menu-item">
                    <div className="mr-item-img"></div>
                    <div className="mr-item-name">Enchiladas Verdes</div>
                    <div className="mr-item-price">$12.99</div>
                  </div>
                  <div className="mr-menu-item">
                    <div className="mr-item-img"></div>
                    <div className="mr-item-name">Carne Guisada Plate</div>
                    <div className="mr-item-price">$14.99</div>
                  </div>
                  <div className="mr-menu-item">
                    <div className="mr-item-img"></div>
                    <div className="mr-item-name">Tamales — Dozen</div>
                    <div className="mr-item-price">$16.99</div>
                  </div>
                </div>
                <div className="mr-bar">
                  <div className="mr-bar-item">⭐ 4.9 (240 reviews)</div>
                  <div className="mr-bar-item">📍 San Antonio, TX</div>
                  <div className="mr-bar-item">🕐 Open Now</div>
                </div>
              </div>
            </div>
            <div className="demo-body">
              <span className="demo-tag">Restaurant</span>
              <div className="demo-title">Full-Service Restaurant</div>
              <div className="demo-desc">Online ordering, menus, reservations &amp; direct payment — zero platform fees.</div>
              <div className="demo-link">View Live Demo <span>→</span></div>
            </div>
          </a>

          {/* FOOD TRUCK */}
          <a href="https://moe-builds-co.vercel.app/foodtruck" target="_blank" rel="noreferrer" className="demo-card reveal d1" data-t="foodtruck">
            <div className="demo-preview">
              <div className="browser-bar">
                <div className="bdot"></div><div className="bdot"></div><div className="bdot"></div>
                <div className="burl">moe-builds-co.vercel.app/foodtruck</div>
              </div>
              <div className="mock-foodtruck">
                <div className="mf-nav">
                  <div className="mf-logo">El Jefe Tacos</div>
                  <div className="mf-live"><div className="mf-live-dot"></div><div className="mf-live-text">Live</div></div>
                </div>
                <div className="mf-location">
                  <div className="mf-pin">📍</div>
                  <div className="mf-loc-text">Now Serving: The Pearl District · Next: Southtown 6PM</div>
                </div>
                <div className="mf-hero">
                  <div className="mf-h1">Pre-Order &amp;<br />Skip the Line</div>
                  <div className="mf-sub">Track us live. Order ahead. Pick up ready.</div>
                </div>
                <div className="mf-menu">
                  <div className="mf-item">
                    <div className="mf-item-info">
                      <div className="mf-item-name">Birria Tacos (3)</div>
                      <div className="mf-item-desc">Consommé included</div>
                    </div>
                    <div className="mf-item-price">$13</div>
                  </div>
                  <div className="mf-item">
                    <div className="mf-item-info">
                      <div className="mf-item-name">Al Pastor Plate</div>
                      <div className="mf-item-desc">Rice, beans, tortillas</div>
                    </div>
                    <div className="mf-item-price">$11</div>
                  </div>
                  <div className="mf-item">
                    <div className="mf-item-info">
                      <div className="mf-item-name">Elote Cup</div>
                      <div className="mf-item-desc">Street style</div>
                    </div>
                    <div className="mf-item-price">$5</div>
                  </div>
                  <div className="mf-item">
                    <div className="mf-item-info">
                      <div className="mf-item-name">Agua Fresca</div>
                      <div className="mf-item-desc">Horchata / Jamaica</div>
                    </div>
                    <div className="mf-item-price">$4</div>
                  </div>
                </div>
                <div className="mf-btn-row">
                  <div className="mf-btn">Pre-Order Now →</div>
                </div>
              </div>
            </div>
            <div className="demo-body">
              <span className="demo-tag">Food Truck</span>
              <div className="demo-title">Food Truck Hub</div>
              <div className="demo-desc">Live location, pre-orders, schedule &amp; loyalty — built for the road.</div>
              <div className="demo-link">View Live Demo <span>→</span></div>
            </div>
          </a>

          {/* BARBER */}
          <a href="https://moe-builds-co.vercel.app/barber" target="_blank" rel="noreferrer" className="demo-card reveal d2" data-t="barber">
            <div className="demo-preview">
              <div className="browser-bar">
                <div className="bdot"></div><div className="bdot"></div><div className="bdot"></div>
                <div className="burl">moe-builds-co.vercel.app/barber</div>
              </div>
              <div className="mock-barber">
                <div className="mb-nav">
                  <div className="mb-logo">Kings Fade SA</div>
                  <div className="mb-book-btn">Book Now</div>
                </div>
                <div className="mb-hero">
                  <div className="mb-eyebrow">San Antonio's Best Cuts</div>
                  <div className="mb-h1">Your Chair.<br />Your Style.</div>
                  <div className="mb-sub">Book online in 30 seconds. No calls, no waiting.</div>
                  <div className="mb-avail">
                    <div className="mb-avail-dot"></div>
                    <div className="mb-avail-text">Next Available: Today @ 2:30 PM</div>
                  </div>
                </div>
                <div className="mb-barbers">
                  <div className="mb-barber">
                    <div className="mb-avatar">✂️</div>
                    <div className="mb-name">Marcus R.</div>
                    <div className="mb-role">Senior Barber</div>
                  </div>
                  <div className="mb-barber">
                    <div className="mb-avatar">💈</div>
                    <div className="mb-name">Tony V.</div>
                    <div className="mb-role">Fade Specialist</div>
                  </div>
                  <div className="mb-barber">
                    <div className="mb-avatar">🪒</div>
                    <div className="mb-name">Rico M.</div>
                    <div className="mb-role">Beard &amp; Taper</div>
                  </div>
                </div>
                <div className="mb-services">
                  <div className="mb-service">Regular Cut</div>
                  <div className="mb-service">Skin Fade</div>
                  <div className="mb-service">Beard Trim</div>
                  <div className="mb-service">Hot Towel Shave</div>
                  <div className="mb-service">Kids Cut</div>
                </div>
              </div>
            </div>
            <div className="demo-body">
              <span className="demo-tag">Barbershop</span>
              <div className="demo-title">The Barber Shop</div>
              <div className="demo-desc">Online booking, stylist profiles, services &amp; Google reviews — all in one.</div>
              <div className="demo-link">View Live Demo <span>→</span></div>
            </div>
          </a>

        </div>
      </div>

      <div className="div"></div>

      {/* ROI CALCULATOR */}
      <div className="roi-outer">
        <div className="roi-inner">
          <div className="reveal">
            <div className="section-label">The Math Is Simple</div>
            <h2 className="section-title">Ordering Platforms Take a Cut of Every Pickup Order</h2>
            <p className="section-sub" style={{ marginBottom: '24px' }}>Most restaurants don't realize it: third-party platforms charge <strong style={{ color: '#ef4444' }}>15–25% commission</strong> on every order they process — including pickup. Your customers find you on their app, place the order, and the platform pockets a fee before you see a dime.</p>
            <p className="section-sub" style={{ marginBottom: '36px' }}>A custom ordering site puts those orders — and that money — back in your pocket. Use the calculator to see exactly what you're losing.</p>
          </div>

          <div className="calc-box reveal d1">
            <div className="calc-header">
              <div className="calc-title">Pickup Order Fee Calculator</div>
              <div className="calc-sub">See what third-party platforms are taking from your restaurant</div>
            </div>
            <div className="calc-body">
              <div className="calc-row">
                <div className="calc-label">Monthly pickup orders via platforms <span>{fmt(vol)}</span></div>
                <input type="range" min="1000" max="50000" step="500" value={vol} onChange={e => setVol(+e.target.value)} />
              </div>
              <div className="calc-row">
                <div className="calc-label">Platform fee rate <span>{fee}%</span></div>
                <input type="range" min="10" max="30" step="1" value={fee} onChange={e => setFee(+e.target.value)} />
              </div>
            </div>
            <div className="calc-results">
              <div className="calc-result-item bad-bg">
                <div className="crn red">{fmt(monthly)}</div>
                <div className="crl">Per month going<br />to the platform</div>
              </div>
              <div className="calc-result-item bad-bg">
                <div className="crn red">{fmt(annual)}</div>
                <div className="crl">Per year you're<br />paying in fees</div>
              </div>
              <div className="calc-result-item good-bg">
                <div className="crn green">{fmt(siteCost)}</div>
                <div className="crl">One-time cost<br />for your own site</div>
              </div>
              <div className="calc-result-item good-bg">
                <div className="crn green">{fmtMo(breakeven)}</div>
                <div className="crl">Break-even time<br />after launch</div>
              </div>
            </div>
            <div className="calc-cta">
              <div className="calc-cta-text">You'd save <strong>{fmt(year1savings)}</strong> in Year 1 alone — and every year after that.</div>
              <a href="#contact">Claim Those Savings →</a>
            </div>
          </div>
        </div>
      </div>

      <div className="div"></div>

      {/* PROCESS */}
      <div className="process-wrap" id="process">
        <div className="reveal">
          <div className="section-label">How It Works</div>
          <h2 className="section-title">From Discovery Call to Live in 7 Days</h2>
          <p className="section-sub">No long contracts. No hand-holding. We move fast and build right.</p>
        </div>
        <div className="process-grid">
          <div className="process-card reveal" data-n="1">
            <div className="p-icon">📞</div>
            <div className="p-num">Step 01</div>
            <div className="p-title">Discovery Call</div>
            <div className="p-desc">15 minutes. We learn your business, your goals, what's not working. No pressure, no pitch deck.</div>
          </div>
          <div className="process-card reveal d1" data-n="2">
            <div className="p-icon">⚡</div>
            <div className="p-num">Step 02</div>
            <div className="p-title">We Build It</div>
            <div className="p-desc">Custom design, custom code, built for your brand. You get updates throughout. Done in 7 days or less.</div>
          </div>
          <div className="process-card reveal d2" data-n="3">
            <div className="p-icon">🚀</div>
            <div className="p-num">Step 03</div>
            <div className="p-title">Launch &amp; Grow</div>
            <div className="p-desc">We launch, you go live. Monthly maintenance keeps it fast, secure &amp; updated. You focus on business.</div>
          </div>
        </div>
      </div>

      <div className="div"></div>

      {/* PRICING */}
      <div className="pricing-wrap" id="pricing">
        <div className="reveal" style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto 0' }}>
          <div className="section-label">Transparent Pricing</div>
          <h2 className="section-title">No Surprises. No Upsells.</h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>Flat-rate builds. You know the number before we start.</p>
        </div>
        <div className="pricing-grid">
          <div className="price-card reveal">
            <div className="price-tier">Starter</div>
            <div className="price-num">$1,000</div>
            <div className="price-note">one-time build</div>
            <ul className="price-features">
              <li><span className="ck">✓</span> Mobile-first design</li>
              <li><span className="ck">✓</span> Menu or services page</li>
              <li><span className="ck">✓</span> Contact &amp; hours</li>
              <li><span className="ck">✓</span> Google Maps embed</li>
              <li><span className="ck">✓</span> SEO-ready</li>
            </ul>
          </div>
          <div className="price-card featured reveal d1">
            <div className="feat-badge">Most Popular</div>
            <div className="price-tier">Standard</div>
            <div className="price-num">$1,500</div>
            <div className="price-note">one-time build</div>
            <ul className="price-features">
              <li><span className="ck">✓</span> Everything in Starter</li>
              <li><span className="ck">✓</span> Online ordering system</li>
              <li><span className="ck">✓</span> Photo gallery</li>
              <li><span className="ck">✓</span> Review integration</li>
              <li><span className="ck">✓</span> Direct online payments</li>
            </ul>
          </div>
          <div className="price-card reveal d2">
            <div className="price-tier">Premium</div>
            <div className="price-num">$2,000</div>
            <div className="price-note">one-time build</div>
            <ul className="price-features">
              <li><span className="ck">✓</span> Everything in Standard</li>
              <li><span className="ck">✓</span> Loyalty / rewards system</li>
              <li><span className="ck">✓</span> Push notifications</li>
              <li><span className="ck">✓</span> Admin dashboard</li>
              <li><span className="ck">✓</span> Priority support</li>
            </ul>
          </div>
        </div>
        <div className="reveal" style={{ textAlign: 'center', marginTop: '32px' }}>
          <p style={{ fontSize: '13px', color: '#444' }}>+ Monthly maintenance: <strong style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Basic $100/mo · Standard $150/mo · Premium $200/mo</strong> · Payment plans available</p>
        </div>
      </div>

      <div className="div"></div>

      {/* CTA */}
      <div className="cta-wrap" id="contact">
        <div className="cta-box reveal">
          <div className="section-label" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>📍 San Antonio, Texas</div>
          <h2>Ready to Stop Splitting<br />Your Revenue?</h2>
          <p>Free 15-minute call. No pressure. Let's talk about your business and what you're leaving on the table.</p>
          <div className="cta-btns">
            <a href="mailto:moebuildsco@gmail.com" className="btn-primary">📧 Email Us Directly</a>
            <a href="tel:+12102025555" className="btn-secondary">📞 Schedule a Call</a>
          </div>
          <div className="cta-fine">moebuildsco@gmail.com · San Antonio, Texas</div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer-inner">
        <div>
          <div className="f-logo">Moe<span>Builds</span>Co</div>
          <div className="f-sub">San Antonio's Web Agency · Built Local, Built Right</div>
        </div>
        <div className="f-links">
          <a href="#work">Work</a>
          <a href="#process">Process</a>
          <a href="#pricing">Pricing</a>
          <a href="mailto:moebuildsco@gmail.com">Contact</a>
        </div>
        <div className="f-right">© 2026 Moe Builds Co.<br />San Antonio, Texas 🤘</div>
      </div>
    </div>
  );
}
