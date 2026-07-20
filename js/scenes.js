/* ============================================================
   George Brothers — scenes.js
   Six "living diorama" card illustrations, shared by the home
   page and /work. Each scene is a layered SVG injected into a
   [data-scene] host element. Idle = ambient motion. Scrolling a
   card into view adds .play for one narrative loop, then settles;
   re-entering the viewport replays it. Hover-capable devices also
   play on hover/focus and loop until the pointer/focus leaves.
   Reduced motion skips auto-play (global clamp neutralizes loops).
   All timing lives in /css/scenes.css. Plain ES2017.
   ============================================================ */
(function () {
  'use strict';

  var STAR = 'M0,-4.2 L1.1,-1.1 L4.2,0 L1.1,1.1 L0,4.2 L-1.1,1.1 L-4.2,0 L-1.1,-1.1 Z';

  var SVG = {};

  /* ---- 1 · garden — Lucy ---------------------------------- */
  SVG.garden = '<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">'
    + '<defs><radialGradient id="gdW" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="rgba(239,217,138,.12)"/><stop offset="1" stop-color="rgba(239,217,138,0)"/></radialGradient></defs>'
    /* sky details */
    + '<g class="dtl">'
    + '<g transform="translate(174,22)"><g class="gd-rays">'
    + '<line x1="-11" y1="0" x2="11" y2="0" stroke="rgba(239,217,138,.4)" stroke-width="1.5" stroke-linecap="round"/>'
    + '<line x1="0" y1="-11" x2="0" y2="11" stroke="rgba(239,217,138,.4)" stroke-width="1.5" stroke-linecap="round"/>'
    + '<line x1="-8" y1="-8" x2="8" y2="8" stroke="rgba(239,217,138,.4)" stroke-width="1.5" stroke-linecap="round"/>'
    + '<line x1="-8" y1="8" x2="8" y2="-8" stroke="rgba(239,217,138,.4)" stroke-width="1.5" stroke-linecap="round"/>'
    + '</g><circle r="10" fill="rgba(239,217,138,.14)"/><circle r="6.5" fill="#efd98a"/></g>'
    + '<g transform="translate(26,20)"><g class="gd-cloud"><rect width="26" height="8" rx="4" fill="rgba(243,234,217,.4)"/><circle cx="9" cy="0" r="5" fill="rgba(243,234,217,.4)"/></g></g>'
    + '<ellipse cx="48" cy="133" rx="2.5" ry="1.1" fill="rgba(243,234,217,.14)"/>'
    + '<ellipse cx="122" cy="134" rx="3" ry="1.2" fill="rgba(243,234,217,.12)"/>'
    + '<ellipse cx="158" cy="132.5" rx="2.2" ry="1" fill="rgba(243,234,217,.14)"/>'
    + '<g transform="translate(146,56)"><g class="gd-fly">'
    + '<path class="gd-wingL" d="M0,0 Q-5,-6 -6.5,-1 Q-3,2 0,0 Z" fill="#e8913f"/>'
    + '<path class="gd-wingR" d="M0,0 Q5,-6 6.5,-1 Q3,2 0,0 Z" fill="#efa85c"/>'
    + '</g></g>'
    + '</g>'
    /* soil bed */
    + '<rect x="10" y="128" width="180" height="9" rx="3" fill="#241b0d"/>'
    + '<rect x="10" y="127.4" width="180" height="1.4" rx="0.7" fill="rgba(243,234,217,.14)"/>'
    /* pot 1 · 听 */
    + '<rect x="21" y="116" width="18" height="12" rx="2" fill="#b0623a"/><rect x="19" y="112" width="22" height="4" rx="1.5" fill="#c07048"/><ellipse cx="30" cy="114" rx="8" ry="1.7" fill="#3a2a15"/>'
    + '<g transform="translate(30,113)"><g class="gd-sw1">'
    + '<rect x="-1" y="-24" width="2" height="24" rx="1" fill="#93b573"/>'
    + '<g transform="translate(-2,-15) rotate(-34)"><ellipse rx="5.5" ry="2.4" fill="#7da05e"/></g>'
    + '<g transform="translate(2,-19) rotate(32)"><ellipse rx="5.5" ry="2.4" fill="#a8c184"/></g>'
    + '</g></g>'
    /* pot 2 · 说 — the one that gets watered */
    + '<rect x="94" y="116" width="18" height="12" rx="2" fill="#b0623a"/><rect x="92" y="112" width="22" height="4" rx="1.5" fill="#c07048"/><ellipse cx="103" cy="114" rx="8" ry="1.7" fill="#3a2a15"/>'
    + '<ellipse class="gd-wet" cx="103" cy="114" rx="8" ry="1.7" fill="#1c1208" opacity="0"/>'
    + '<g transform="translate(103,113)"><g class="gd-grow" transform="scale(.28)">'
    + '<rect x="-1.2" y="-30" width="2.4" height="30" rx="1.2" fill="#93b573"/>'
    + '<g transform="translate(-1,-18) rotate(-32)"><ellipse rx="6" ry="2.7" fill="#7da05e"/></g>'
    + '<g transform="translate(1,-23) rotate(30)"><ellipse rx="6" ry="2.7" fill="#a8c184"/></g>'
    + '<g transform="translate(0,-29) rotate(-6)"><ellipse rx="4" ry="2" fill="#93b573"/></g>'
    + '<circle class="gd-bud" cy="-33" r="2.6" fill="#efd98a" opacity="0"/>'
    + '</g></g>'
    /* pot 3 · 读 */
    + '<rect x="131" y="116" width="18" height="12" rx="2" fill="#b0623a"/><rect x="129" y="112" width="22" height="4" rx="1.5" fill="#c07048"/><ellipse cx="140" cy="114" rx="8" ry="1.7" fill="#3a2a15"/>'
    + '<g transform="translate(140,113)"><g class="gd-sw2">'
    + '<rect x="-1" y="-18" width="2" height="18" rx="1" fill="#93b573"/>'
    + '<g transform="translate(-2,-11) rotate(-34)"><ellipse rx="5" ry="2.2" fill="#7da05e"/></g>'
    + '<g transform="translate(2,-14) rotate(30)"><ellipse rx="4.5" ry="2" fill="#a8c184"/></g>'
    + '</g></g>'
    /* pot 4 · 写 */
    + '<rect x="167" y="116" width="18" height="12" rx="2" fill="#b0623a"/><rect x="165" y="112" width="22" height="4" rx="1.5" fill="#c07048"/><ellipse cx="176" cy="114" rx="8" ry="1.7" fill="#3a2a15"/>'
    + '<g transform="translate(176,113)"><g class="gd-sw3">'
    + '<rect x="-1" y="-22" width="2" height="22" rx="1" fill="#93b573"/>'
    + '<g transform="translate(-2,-14) rotate(-34)"><ellipse rx="5" ry="2.2" fill="#7da05e"/></g>'
    + '<g transform="translate(2,-17) rotate(30)"><ellipse rx="5" ry="2.2" fill="#a8c184"/></g>'
    + '</g></g>'
    /* glyphs + glow dots */
    + '<circle class="gd-dot1" cx="30" cy="148" r="7" fill="#efd98a" opacity="0"/>'
    + '<circle class="gd-dot2" cx="103" cy="148" r="7" fill="#efd98a" opacity="0"/>'
    + '<circle class="gd-dot3" cx="140" cy="148" r="7" fill="#efd98a" opacity="0"/>'
    + '<circle class="gd-dot4" cx="176" cy="148" r="7" fill="#efd98a" opacity="0"/>'
    + '<text class="gd-gl1" x="30" y="152" font-size="11" text-anchor="middle" fill="rgba(243,234,217,.5)">听</text>'
    + '<text class="gd-gl2" x="103" y="152" font-size="11" text-anchor="middle" fill="rgba(243,234,217,.5)">说</text>'
    + '<text class="gd-gl3" x="140" y="152" font-size="11" text-anchor="middle" fill="rgba(243,234,217,.5)">读</text>'
    + '<text class="gd-gl4" x="176" y="152" font-size="11" text-anchor="middle" fill="rgba(243,234,217,.5)">写</text>'
    /* the 老师 gardener, watering can in hand */
    + '<g transform="translate(66,128)"><g class="gd-body">'
    + '<rect x="-6" y="-9" width="4.5" height="9" rx="1.5" fill="#4a3a2c"/><rect x="1.5" y="-9" width="4.5" height="9" rx="1.5" fill="#4a3a2c"/>'
    + '<rect x="-9" y="-32" width="18" height="24" rx="4" fill="#8f3f34"/>'
    + '<text x="0" y="-16" font-size="6" text-anchor="middle" fill="rgba(243,234,217,.85)">老师</text>'
    + '<circle cy="-37" r="6" fill="#e8c39a"/>'
    + '<rect x="-2.5" y="-33.5" width="5" height="4" rx="2" fill="#ddd3c2"/>'
    + '<path d="M-6.5,-41 Q0,-48.5 6.5,-41 Z" fill="#c9a35e"/><rect x="-10" y="-41.8" width="20" height="2.2" rx="1" fill="#b08c48"/>'
    + '<g transform="translate(6,-26)"><g class="gd-arm">'
    + '<rect y="-1.6" width="11" height="3.2" rx="1.6" fill="#8f3f34"/>'
    + '<circle cx="11.5" r="2.2" fill="#e8c39a"/>'
    + '<g transform="translate(12.5,0)"><g class="gd-can">'
    + '<rect y="-4.5" width="12" height="9" rx="2" fill="#7d8ca0"/>'
    + '<path d="M2.5,-4.5 Q6,-9.5 9.5,-4.5" stroke="#7d8ca0" stroke-width="1.5" fill="none"/>'
    + '<path d="M12,-1.5 L18.5,-6.5" stroke="#7d8ca0" stroke-width="2.4" stroke-linecap="round"/>'
    + '<circle cx="18.7" cy="-6.7" r="1.7" fill="#7d8ca0"/>'
    + '</g></g></g></g>'
    + '</g></g>'
    /* water droplets (arc into pot 2) */
    + '<g transform="translate(102,96)">'
    + '<g class="gd-dropx" opacity="0"><circle class="gd-dropy" r="2" fill="#8fc4d9"/></g>'
    + '<g class="gd-dropx gd-d2" opacity="0"><circle class="gd-dropy gd-d2" cx="-2" r="1.8" fill="#8fc4d9"/></g>'
    + '<g class="gd-dropx gd-d3" opacity="0"><circle class="gd-dropy gd-d3" cx="2" cy="-1" r="1.6" fill="#8fc4d9"/></g>'
    + '</g>'
    + '<g transform="translate(111,78)"><path class="gd-spark" d="' + STAR + '" fill="#efd98a" opacity="0"/></g>'
    + '<rect class="warm" width="200" height="160" fill="url(#gdW)"/>'
    + '<rect class="scn-clock" width="1" height="1" fill="none" opacity="0"/>'
    + '</svg>';

  /* ---- 2 · dashboard — Dashboard Pro Max ----------------- */
  SVG.dashboard = '<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">'
    + '<defs>'
    + '<radialGradient id="dbO" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#ffe9c4"/><stop offset=".72" stop-color="#efa85c"/><stop offset="1" stop-color="#e8913f"/></radialGradient>'
    + '<radialGradient id="dbW" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="rgba(239,217,138,.1)"/><stop offset="1" stop-color="rgba(239,217,138,0)"/></radialGradient>'
    + '</defs>'
    /* desk, mug, clock, antenna */
    + '<g class="dtl">'
    + '<rect x="10" y="138" width="180" height="4" rx="2" fill="rgba(243,234,217,.16)"/>'
    + '<circle cx="164" cy="132.5" r="3.5" stroke="#8f3f34" stroke-width="2" fill="none"/><rect x="150" y="127" width="12" height="11" rx="2" fill="#8f3f34"/>'
    + '<g transform="translate(154,124)"><path class="db-steam" d="M0,0 q2,-3 0,-6" stroke="rgba(243,234,217,.35)" stroke-width="1.2" fill="none"/></g>'
    + '<g transform="translate(158,123)"><path class="db-steam s2" d="M0,0 q-2,-3 0,-6" stroke="rgba(243,234,217,.3)" stroke-width="1.2" fill="none"/></g>'
    + '<circle cx="185" cy="16" r="6" stroke="rgba(243,234,217,.35)" stroke-width="1.5" fill="none"/>'
    + '<g transform="translate(185,16)"><rect class="db-hand" x="-0.7" y="-4.5" width="1.4" height="4.5" rx="0.7" fill="#efa85c"/></g>'
    + '<rect x="99" y="10" width="2" height="8" rx="1" fill="rgba(243,234,217,.3)"/><circle cx="100" cy="9" r="1.6" fill="rgba(243,234,217,.4)"/>'
    + '<g transform="translate(100,17)"><circle class="db-pulse" r="1.8" fill="#efd98a" opacity="0"/></g>'
    + '</g>'
    /* monitor */
    + '<rect x="26" y="18" width="148" height="108" rx="8" fill="#1e1207" stroke="rgba(243,234,217,.4)" stroke-width="1.5"/>'
    + '<rect x="94" y="126" width="12" height="7" fill="rgba(243,234,217,.22)"/><rect x="80" y="133" width="40" height="3" rx="1.5" fill="rgba(243,234,217,.22)"/>'
    /* header + grid texture */
    + '<rect x="34" y="27" width="28" height="3" rx="1.5" fill="rgba(243,234,217,.3)"/>'
    + '<g class="dtl"><circle cx="158" cy="28.5" r="1.5" fill="rgba(243,234,217,.3)"/><circle cx="164" cy="28.5" r="1.5" fill="rgba(243,234,217,.3)"/>'
    + '<rect x="68" y="38" width="0.75" height="78" fill="rgba(243,234,217,.05)"/><rect x="102" y="38" width="0.75" height="78" fill="rgba(243,234,217,.05)"/><rect x="136" y="38" width="0.75" height="78" fill="rgba(243,234,217,.05)"/>'
    + '<rect x="34" y="79" width="132" height="0.75" fill="rgba(243,234,217,.05)"/></g>'
    + '<rect x="32" y="34" width="136" height="1" fill="rgba(243,234,217,.1)"/>'
    /* tile A — chart */
    + '<rect x="36" y="40" width="32" height="32" rx="4" fill="#31200e" stroke="rgba(243,234,217,.15)"/>'
    + '<rect x="41" y="45" width="14" height="2.5" rx="1" fill="rgba(243,234,217,.3)"/>'
    + '<g transform="translate(44,67)"><rect class="db-bar1" transform="scale(1,.45)" x="-2.2" y="-18" width="4.4" height="18" rx="1.5" fill="#efa85c"/></g>'
    + '<g transform="translate(52,67)"><rect class="db-bar2" transform="scale(1,.85)" x="-2.2" y="-18" width="4.4" height="18" rx="1.5" fill="#c9a35e"/></g>'
    + '<g transform="translate(60,67)"><rect class="db-bar3" transform="scale(1,.6)" x="-2.2" y="-18" width="4.4" height="18" rx="1.5" fill="#e8913f"/></g>'
    /* empty slot */
    + '<rect x="74" y="42" width="32" height="26" rx="4" fill="none" stroke="rgba(243,234,217,.35)" stroke-width="1.2" stroke-dasharray="3 3"/>'
    + '<text class="db-plus" x="90" y="59" font-size="9" text-anchor="middle" fill="#f3ead9" opacity=".25">+</text>'
    + '<rect class="db-flash" x="74" y="42" width="32" height="26" rx="4" fill="none" stroke="#efa85c" stroke-width="1.5" opacity="0"/>'
    /* tile — number */
    + '<rect x="112" y="40" width="32" height="32" rx="4" fill="#31200e" stroke="rgba(243,234,217,.15)"/>'
    + '<text x="128" y="58" font-size="11" text-anchor="middle" fill="#f3ead9">42</text>'
    + '<rect x="120" y="63" width="16" height="2.5" rx="1" fill="rgba(243,234,217,.25)"/>'
    /* LED strip */
    + '<rect x="150" y="40" width="14" height="32" rx="4" fill="#2a190b" stroke="rgba(243,234,217,.12)"/>'
    + '<circle class="db-led1" cx="157" cy="48" r="2.2" fill="#efd98a"/>'
    + '<circle class="db-led2" cx="157" cy="56" r="2.2" fill="rgba(243,234,217,.18)"/>'
    + '<circle class="db-ping" cx="157" cy="56" r="2.6" stroke="#8fbf7f" stroke-width="1.2" fill="none" opacity="0"/>'
    + '<circle cx="157" cy="64" r="2.2" fill="rgba(243,234,217,.15)"/>'
    /* tile C — list */
    + '<rect x="36" y="84" width="46" height="30" rx="4" fill="#31200e" stroke="rgba(243,234,217,.15)"/>'
    + '<rect x="41" y="90" width="26" height="2.5" rx="1" fill="rgba(243,234,217,.3)"/><rect x="41" y="95" width="18" height="2.5" rx="1" fill="rgba(243,234,217,.25)"/>'
    + '<rect x="41" y="103" width="36" height="4" rx="2" fill="rgba(243,234,217,.1)"/>'
    + '<g transform="translate(41,103)"><rect class="db-prog" transform="scale(.3,1)" width="36" height="4" rx="2" fill="#8fbf7f"/></g>'
    /* tile B — the misplaced one */
    + '<g transform="translate(106,88)"><g class="db-tileb" transform="rotate(4)">'
    + '<rect width="32" height="26" rx="4" fill="#31200e" stroke="rgba(243,234,217,.3)"/>'
    + '<circle cx="10" cy="13" r="6" stroke="#efa85c" stroke-width="2.4" fill="none" stroke-dasharray="26 12" transform="rotate(-90 10 13)"/>'
    + '<rect x="20" y="8" width="8" height="2.5" rx="1" fill="rgba(243,234,217,.3)"/><rect x="20" y="13" width="6" height="2.5" rx="1" fill="rgba(243,234,217,.25)"/>'
    + '</g></g>'
    /* scan beam + orb + refresh veil */
    + '<g transform="translate(34,26)"><rect class="db-scan" width="12" height="94" rx="4" fill="rgba(239,168,92,.16)" opacity="0"/></g>'
    + '<g transform="translate(50,32)"><g class="db-orbmove"><g class="db-bob">'
    + '<circle class="db-halo" r="10" fill="rgba(239,168,92,.25)"/>'
    + '<circle r="7" fill="url(#dbO)"/>'
    + '<text y="2" font-size="5" text-anchor="middle" fill="#26190b" font-weight="600">AI</text>'
    + '</g></g></g>'
    + '<rect class="db-veil" x="27" y="19" width="146" height="106" rx="8" fill="#1e1207" opacity="0"/>'
    + '<rect class="warm" width="200" height="160" fill="url(#dbW)"/>'
    + '<rect class="scn-clock" width="1" height="1" fill="none" opacity="0"/>'
    + '</svg>';

  /* ---- 3 · guidebook — AI for Beginners ------------------ */
  SVG.guidebook = '<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">'
    + '<defs>'
    + '<radialGradient id="bkW" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="rgba(239,217,138,.11)"/><stop offset="1" stop-color="rgba(239,217,138,0)"/></radialGradient>'
    + '<linearGradient id="bkC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(239,217,138,.32)"/><stop offset="1" stop-color="rgba(239,217,138,0)"/></linearGradient>'
    + '</defs>'
    /* wall notes + lamp + cone */
    + '<g class="dtl">'
    + '<g transform="rotate(3 158 64)"><rect x="150" y="58" width="16" height="12" rx="1.5" fill="rgba(243,234,217,.1)"/></g><circle cx="158" cy="60" r="1" fill="#b0623a"/>'
    + '<g transform="rotate(-4 176 76)"><rect x="170" y="71" width="12" height="9" rx="1.5" fill="rgba(180,143,217,.16)"/></g>'
    + '<path class="bk-cone" d="M44,88 L70,124 L122,124 L52,86 Z" fill="url(#bkC)" opacity=".5"/>'
    + '<rect x="16" y="119" width="16" height="5" rx="2" fill="#5e6b7d"/>'
    + '<path d="M23,119 C17,94 30,85 45,83" stroke="#5e6b7d" stroke-width="2.5" fill="none"/>'
    + '<circle cx="47" cy="84" r="5" fill="#5e6b7d"/><circle cx="48" cy="86.5" r="2" fill="#efd98a"/>'
    + '<g transform="translate(78,116)"><circle class="bk-mote1" r="1" fill="rgba(239,217,138,.6)" opacity="0"/></g>'
    + '<g transform="translate(94,120)"><circle class="bk-mote2" r="1" fill="rgba(239,217,138,.6)" opacity="0"/></g>'
    + '</g>'
    /* desk */
    + '<rect x="8" y="124" width="184" height="5" rx="2" fill="rgba(243,234,217,.18)"/>'
    + '<g class="dtl"><rect x="8" y="129" width="184" height="2" rx="1" fill="rgba(243,234,217,.06)"/>'
    + '<g transform="rotate(-5 35 120)"><rect x="30" y="117.5" width="11" height="6" rx="1" fill="rgba(239,217,138,.55)"/></g>'
    + '<g transform="rotate(4 47 121)"><rect x="43" y="118.5" width="9" height="5" rx="1" fill="rgba(120,190,180,.45)"/></g>'
    + '<g transform="rotate(-8 79 121)"><rect x="70" y="119.5" width="17" height="2.4" rx="1" fill="#c9a35e"/><path d="M87,119.5 L90,120.7 L87,121.9 Z" fill="#e8c39a"/></g>'
    + '</g>'
    /* reader */
    + '<g transform="translate(56,124)"><g class="bk-lean">'
    + '<rect x="-12" y="-30" width="22" height="30" rx="6" fill="#5b7d9e"/>'
    + '<circle cy="-36" r="7" fill="#e8c39a"/>'
    + '<path d="M-7,-38 Q0,-46 7,-38 Q3.5,-42.5 0,-42.5 Q-3.5,-42.5 -7,-38 Z" fill="#4a3a2c"/>'
    + '<g transform="translate(8,-20)"><g class="bk-arm"><rect y="-2" width="20" height="4" rx="2" fill="#5b7d9e"/><circle cx="21" r="2.5" fill="#e8c39a"/></g></g>'
    + '</g></g>'
    /* open guidebook */
    + '<g transform="translate(88,124)">'
    + '<path d="M26,0 L26,-14 Q13,-18 2,-13 L2,1 Q13,-3 26,0 Z" fill="#f0e6d2"/>'
    + '<path d="M7,-9 L21,-7" stroke="rgba(23,16,9,.25)" stroke-width="1.2"/><path d="M7,-6 L18,-4" stroke="rgba(23,16,9,.2)" stroke-width="1.2"/>'
    + '<path d="M26,0 L26,-14 Q39,-18 50,-13 L50,1 Q39,-3 26,0 Z" fill="#faf3e3"/>'
    + '<path d="M31,-9 L45,-11" stroke="rgba(23,16,9,.22)" stroke-width="1.2"/>'
    + '<g class="dtl"><rect x="48.5" y="-12" width="4" height="3" fill="#efa85c" opacity=".85"/><rect x="48.5" y="-8" width="4" height="3" fill="#78beb4" opacity=".85"/><rect x="48.5" y="-4" width="4" height="3" fill="#b48fd9" opacity=".85"/>'
    + '<path class="bk-corner" d="M47,-12.6 L50,-13 L50,-10 Z" fill="rgba(255,255,255,.6)"/></g>'
    + '<rect x="24.6" y="-15" width="2.8" height="16" rx="1" fill="#8f6ab0"/>'
    + '<g class="bk-diag" opacity="0"><circle cx="39" cy="-8.5" r="3" stroke="#8f6ab0" stroke-width="1.2" fill="none"/><rect x="34" y="-3.8" width="10" height="1.2" rx="0.6" fill="rgba(143,106,176,.7)"/></g>'
    + '<path class="bk-flip" d="M26,0 L26,-14 Q39,-18 50,-13 L50,1 Q39,-3 26,0 Z" fill="#fff7ea" opacity="0"/>'
    + '</g>'
    /* idea spark */
    + '<g transform="translate(127,112)"><g class="bk-ideax" opacity="0"><g class="bk-ideay">'
    + '<circle r="4.5" fill="rgba(239,217,138,.35)"/><circle r="2.4" fill="#efd98a"/>'
    + '</g></g></g>'
    /* robot buddy */
    + '<g transform="translate(152,124)"><g class="bk-hop">'
    + '<rect class="bk-leg1" x="5" y="-1" width="4.5" height="11" rx="2" fill="#5e6b7d"/>'
    + '<rect class="bk-leg2" x="12.5" y="-1" width="4.5" height="11" rx="2" fill="#5e6b7d"/>'
    + '<rect y="-16" width="22" height="15" rx="5" fill="#7d8ca0"/>'
    + '<rect x="6.5" y="-13" width="9" height="6" rx="2" fill="#5e6b7d"/>'
    + '<circle class="bk-chest" cx="11" cy="-10" r="1.6" fill="#efd98a" opacity="0"/>'
    + '<rect x="3" y="-28" width="16" height="11" rx="4" fill="#7d8ca0"/>'
    + '<circle cx="7.5" cy="-22.5" r="1.6" fill="#171009"/><circle cx="14.5" cy="-22.5" r="1.6" fill="#171009"/>'
    + '<rect x="10.3" y="-33" width="1.4" height="5" rx="0.7" fill="#5e6b7d"/>'
    + '<circle class="bk-ledhalo" cx="11" cy="-34.5" r="4.5" fill="rgba(239,217,138,.5)" opacity="0"/>'
    + '<circle class="bk-led" cx="11" cy="-34.5" r="2" fill="rgba(243,234,217,.25)"/>'
    + '</g></g>'
    + '<text class="bk-bang" x="163" y="84" font-size="10" text-anchor="middle" fill="#efd98a" opacity="0">!</text>'
    + '<rect class="warm" width="200" height="160" fill="url(#bkW)"/>'
    + '<rect class="scn-clock" width="1" height="1" fill="none" opacity="0"/>'
    + '</svg>';

  /* ---- 4 · website — This Site ---------------------------- */
  SVG.website = '<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">'
    + '<defs><radialGradient id="wsW" cx="50%" cy="42%" r="70%"><stop offset="0" stop-color="rgba(239,217,138,.09)"/><stop offset="1" stop-color="rgba(239,217,138,0)"/></radialGradient></defs>'
    /* browser frame + chrome */
    + '<rect x="20" y="20" width="160" height="116" rx="9" fill="#10141f" stroke="rgba(243,234,217,.4)" stroke-width="1.5"/>'
    + '<circle cx="29" cy="28.5" r="1.8" fill="rgba(243,234,217,.35)"/><circle cx="35" cy="28.5" r="1.8" fill="rgba(243,234,217,.35)"/>'
    + '<rect x="42" y="24" width="52" height="9" rx="4.5" fill="rgba(243,234,217,.08)"/>'
    + '<text x="47" y="30.5" font-size="5.5" fill="#efa85c">GEB.com</text>'
    + '<circle class="ws-led" cx="170" cy="28.5" r="2" fill="rgba(243,234,217,.2)"/>'
    + '<circle class="ws-ping" cx="170" cy="28.5" r="2.4" stroke="#8fbf7f" stroke-width="1.2" fill="none" opacity="0"/>'
    + '<rect x="21" y="36" width="158" height="1" fill="rgba(243,234,217,.18)"/>'
    + '<g transform="translate(21,36.5)"><rect class="ws-prog" transform="scale(0,1)" width="158" height="1.6" fill="#efa85c" opacity="0"/></g>'
    /* page canvas (shifted right in mini, where the code panel hides) */
    + '<g class="ws-page">'
    + '<text class="tserif" x="30" y="52" font-size="9.5" fill="#f3ead9">I build <tspan fill="#efa85c" font-style="italic">systems.</tspan></text>'
    + '<rect x="30" y="57" width="62" height="2.5" rx="1" fill="rgba(243,234,217,.25)"/><rect x="30" y="62" width="46" height="2.5" rx="1" fill="rgba(243,234,217,.22)"/>'
    + '<rect x="30" y="70" width="30" height="22" rx="4" fill="#1d2433" stroke="rgba(243,234,217,.2)"/>'
    + '<rect x="34" y="74" width="9" height="7" rx="2" fill="rgba(143,196,217,.3)"/><rect x="34" y="84" width="16" height="2" rx="1" fill="rgba(243,234,217,.25)"/>'
    + '<rect class="ws-slot" x="64" y="70" width="30" height="22" rx="4" fill="none" stroke="rgba(243,234,217,.35)" stroke-width="1.2" stroke-dasharray="3 3"/>'
    + '<text class="ws-plus" x="79" y="84" font-size="9" text-anchor="middle" fill="#f3ead9" opacity=".25">+</text>'
    + '<rect class="ws-flash" x="64" y="70" width="30" height="22" rx="4" fill="none" stroke="#8fbf7f" stroke-width="1.5" opacity="0"/>'
    + '<rect x="30" y="96" width="30" height="22" rx="4" fill="#1d2433" stroke="rgba(243,234,217,.12)"/>'
    + '<rect x="34" y="101" width="18" height="2" rx="1" fill="rgba(243,234,217,.2)"/><rect x="34" y="106" width="12" height="2" rx="1" fill="rgba(243,234,217,.16)"/>'
    + '<rect x="64" y="96" width="30" height="22" rx="4" fill="#1d2433" stroke="rgba(243,234,217,.12)"/>'
    + '<circle cx="72" cy="104" r="3.5" stroke="rgba(243,234,217,.22)" stroke-width="1.2" fill="none"/><rect x="79" y="103" width="10" height="2" rx="1" fill="rgba(243,234,217,.18)"/>'
    /* tray + component chip */
    + '<rect x="30" y="121" width="64" height="12" rx="3" fill="rgba(0,0,0,.18)" stroke="rgba(243,234,217,.12)"/>'
    + '<g transform="translate(47,122.5)"><g class="ws-chipbob"><g class="ws-chip" transform="scale(.5)">'
    + '<rect width="30" height="22" rx="4" fill="#232c42" stroke="rgba(143,196,217,.55)"/>'
    + '<rect x="4" y="4" width="9" height="7" rx="2" fill="rgba(143,196,217,.35)"/>'
    + '<g transform="translate(16,5)"><rect class="ws-cl1" transform="scale(0,1)" width="10" height="2" rx="1" fill="rgba(243,234,217,.35)"/></g>'
    + '<g transform="translate(16,9)"><rect class="ws-cl2" transform="scale(0,1)" width="8" height="2" rx="1" fill="rgba(243,234,217,.3)"/></g>'
    + '</g></g></g>'
    + '<g transform="translate(55,127)"><circle class="ws-ring" r="3.5" stroke="#efa85c" stroke-width="1.5" fill="none" opacity="0"/></g>'
    + '<g class="dtl"><g transform="translate(66,84)"><g class="ws-pill" opacity="0">'
    + '<rect width="24" height="7.5" rx="3.75" fill="#8fbf7f"/><text x="12" y="5.3" font-size="4.2" text-anchor="middle" fill="#141824" font-weight="600">SHIPPED</text>'
    + '</g></g></g>'
    /* cursor */
    + '<g transform="translate(150,138)"><g class="ws-cur">'
    + '<path d="M0,0 L0,9.5 L2.8,7.2 L4.7,10.8 L6.6,9.7 L4.7,6.2 L7.8,5.9 Z" fill="#f3ead9" stroke="#10141f" stroke-width="0.7"/>'
    + '</g></g>'
    + '</g>'
    /* code side panel */
    + '<g class="dtl">'
    + '<rect x="104" y="42" width="68" height="88" rx="4" fill="rgba(0,0,0,.22)" stroke="rgba(243,234,217,.1)"/>'
    + '<rect x="110" y="48" width="8" height="2.5" rx="1" fill="#efa85c" opacity=".8"/><rect x="121" y="48" width="18" height="2.5" rx="1" fill="rgba(243,234,217,.28)"/>'
    + '<rect x="110" y="54" width="13" height="2.5" rx="1" fill="#78beb4" opacity=".7"/><rect x="126" y="54" width="11" height="2.5" rx="1" fill="rgba(243,234,217,.25)"/>'
    + '<rect x="114" y="60" width="10" height="2.5" rx="1" fill="rgba(243,234,217,.28)"/><rect x="127" y="60" width="15" height="2.5" rx="1" fill="#b48fd9" opacity=".65"/>'
    + '<rect x="114" y="66" width="20" height="2.5" rx="1" fill="rgba(243,234,217,.25)"/>'
    + '<rect x="110" y="72" width="15" height="2.5" rx="1" fill="rgba(243,234,217,.28)"/>'
    + '<g transform="translate(110,80)"><rect class="ws-type" width="26" height="2.5" rx="1" fill="#8fc4d9" opacity=".8"/></g>'
    + '<rect class="ws-ccaret" x="138" y="77.5" width="1.2" height="6" fill="#8fc4d9"/>'
    + '<text x="110" y="98" font-size="6" fill="rgba(243,234,217,.22)">&lt;/&gt;</text>'
    + '</g>'
    + '<rect class="ws-veil" x="22" y="37.5" width="156" height="97" fill="#10141f" opacity="0"/>'
    + '<rect class="warm" width="200" height="160" fill="url(#wsW)"/>'
    + '<rect class="scn-clock" width="1" height="1" fill="none" opacity="0"/>'
    + '</svg>';

  /* ---- 5 · lab — Coming Soon ------------------------------ */
  SVG.lab = '<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">'
    + '<defs>'
    + '<radialGradient id="lbW" cx="50%" cy="42%" r="70%"><stop offset="0" stop-color="rgba(239,217,138,.1)"/><stop offset="1" stop-color="rgba(239,217,138,0)"/></radialGradient>'
    + '<linearGradient id="lbC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(239,217,138,.3)"/><stop offset="1" stop-color="rgba(239,217,138,0)"/></linearGradient>'
    + '</defs>'
    /* shelf, jars, lamp, flask, vial rack, bench legs */
    + '<g class="dtl">'
    + '<rect x="24" y="115" width="4" height="28" fill="rgba(243,234,217,.15)"/><rect x="168" y="115" width="4" height="28" fill="rgba(243,234,217,.15)"/>'
    + '<rect x="18" y="32" width="58" height="3" rx="1.5" fill="rgba(243,234,217,.25)"/>'
    + '<rect x="24" y="20" width="11" height="12" rx="2" fill="rgba(143,196,217,.22)" stroke="rgba(243,234,217,.3)"/><rect x="25.5" y="17.8" width="8" height="2.6" rx="1" fill="rgba(243,234,217,.35)"/>'
    + '<rect x="41" y="22" width="9" height="10" rx="2" fill="rgba(239,168,92,.28)" stroke="rgba(243,234,217,.3)"/><rect x="42.3" y="20" width="6.4" height="2.4" rx="1" fill="rgba(243,234,217,.35)"/>'
    + '<rect x="55" y="24" width="7" height="8" rx="1.5" fill="rgba(180,143,217,.22)" stroke="rgba(243,234,217,.25)"/>'
    + '<g transform="translate(112,0)"><g class="lb-lamp">'
    + '<rect x="-0.7" width="1.4" height="22" fill="rgba(243,234,217,.3)"/>'
    + '<path d="M-4,22 L4,22 L8,30 L-8,30 Z" fill="#5e6b7d"/><circle cy="31.5" r="2" fill="#efd98a"/>'
    + '<path class="lb-cone" d="M-8,31 L-22,110 L22,110 L8,31 Z" fill="url(#lbC)" opacity=".5"/>'
    + '</g></g>'
    + '<path d="M160,86 L168,86 L168,92 L174,107 Q174,110 171,110 L157,110 Q154,110 154,108 L160,92 Z" stroke="rgba(243,234,217,.5)" stroke-width="1.5" fill="none"/>'
    + '<path d="M158,101 L170,101 L173,107 Q173,109.5 171,109.5 L157,109.5 Q155,109.5 155,107.5 Z" fill="rgba(120,190,180,.45)"/>'
    + '<g transform="translate(162,82)"><path class="lb-steam1" d="M0,0 q2,-3 0,-6" stroke="rgba(243,234,217,.35)" stroke-width="1.2" fill="none"/></g>'
    + '<g transform="translate(166,80)"><path class="lb-steam2" d="M0,0 q-2,-3 0,-6" stroke="rgba(243,234,217,.3)" stroke-width="1.2" fill="none"/></g>'
    + '<rect x="28" y="104" width="26" height="3" rx="1" fill="rgba(243,234,217,.25)"/><rect x="30" y="107" width="2" height="3" fill="rgba(243,234,217,.2)"/><rect x="50" y="107" width="2" height="3" fill="rgba(243,234,217,.2)"/>'
    + '<rect class="lb-vial" x="32" y="92" width="6" height="12" rx="2" fill="rgba(239,217,138,.5)" stroke="rgba(243,234,217,.4)"/>'
    + '<rect x="42" y="94" width="6" height="10" rx="2" fill="rgba(180,143,217,.35)" stroke="rgba(243,234,217,.35)"/>'
    + '</g>'
    /* bench */
    + '<rect x="14" y="110" width="172" height="5" rx="2" fill="rgba(243,234,217,.3)"/>'
    /* scientist */
    + '<g transform="translate(72,110)"><g class="lb-body">'
    + '<rect x="-13" y="-36" width="26" height="36" rx="6" fill="#ded7c8"/>'
    + '<rect x="-0.7" y="-34" width="1.4" height="33" fill="rgba(23,16,9,.22)"/>'
    + '<rect x="-9" y="-14" width="6" height="1.6" rx="0.8" fill="rgba(23,16,9,.2)"/>'
    + '<g transform="translate(0,-36)"><g class="lb-nod">'
    + '<circle cy="-8" r="7.5" fill="#e8c39a"/>'
    + '<rect x="-7.5" y="-15.5" width="15" height="6" rx="3" fill="#4a3a2c"/>'
    + '<rect x="-7.5" y="-10" width="15" height="1.2" fill="rgba(201,214,211,.4)"/>'
    + '<circle cx="-3.2" cy="-9" r="2.8" fill="#2a3b39" stroke="#c9d6d3"/>'
    + '<circle cx="3.4" cy="-9" r="2.8" fill="#2a3b39" stroke="#c9d6d3"/>'
    + '<g transform="rotate(20 -4 -9)"><rect class="lb-glint" x="-5.5" y="-11" width="1.8" height="4" rx="0.9" fill="rgba(255,255,255,.85)" opacity="0"/></g>'
    + '</g></g>'
    + '<g transform="translate(12,-30) rotate(43)"><rect y="-2.2" width="17" height="4.4" rx="2.2" fill="#ded7c8"/></g>'
    + '<g transform="translate(8,-34) rotate(-14)"><g class="lb-arm2">'
    + '<rect y="-2" width="24" height="4" rx="2" fill="#ded7c8"/><circle cx="25" r="2.5" fill="#e8c39a"/>'
    + '<g transform="translate(25,0) rotate(14)">'
    + '<circle class="lb-bulb" cy="-2" r="3" fill="#b0623a"/>'
    + '<rect x="-1.2" width="2.4" height="9" rx="1" fill="rgba(255,255,255,.14)" stroke="rgba(243,234,217,.55)" stroke-width="0.8"/>'
    + '</g></g></g>'
    + '</g></g>'
    /* the held beaker (hand + glass + liquid move as one) */
    + '<g transform="translate(97,110)"><g class="lb-hold">'
    + '<circle class="lb-glow" cx="11" cy="-9" r="16" fill="rgba(239,217,138,.4)" opacity="0"/>'
    + '<g class="lb-rise">'
    + '<rect x="1.5" y="-11" width="19" height="10.2" rx="1.5" fill="#78beb4" opacity=".75"/>'
    + '<rect class="lb-liqA" x="1.5" y="-11" width="19" height="10.2" rx="1.5" fill="#efd98a" opacity="0"/>'
    + '</g>'
    + '<ellipse class="lb-shim" cx="11" cy="-11" rx="9.3" ry="1.4" fill="rgba(255,255,255,.28)"/>'
    + '<circle class="lb-bub1" cx="7" cy="-4" r="1.4" fill="rgba(255,255,255,.75)" opacity="0"/>'
    + '<circle class="lb-bub2" cx="12" cy="-6" r="1.2" fill="rgba(255,255,255,.75)" opacity="0"/>'
    + '<circle class="lb-bub3" cx="16" cy="-3" r="1.5" fill="rgba(255,255,255,.75)" opacity="0"/>'
    + '<ellipse class="lb-splash" cx="11" cy="-11.5" rx="4" ry="1.3" stroke="rgba(255,255,255,.75)" fill="none" opacity="0"/>'
    + '<path d="M0,-26 L0,-2.5 Q0,0 3,0 L19,0 Q22,0 22,-2.5 L22,-26" stroke="rgba(243,234,217,.65)" stroke-width="1.5" fill="none"/>'
    + '<rect x="17.5" y="-20" width="3" height="1" fill="rgba(243,234,217,.3)"/><rect x="17.5" y="-15" width="3" height="1" fill="rgba(243,234,217,.3)"/>'
    + '<rect x="-3.5" y="-21" width="7" height="9" rx="3" fill="#e8c39a"/><rect x="-1" y="-17.5" width="5.5" height="2.2" rx="1.1" fill="#d9b184"/>'
    + '<g transform="translate(11,-31)"><path class="lb-spark" d="' + STAR + '" fill="#efd98a" opacity="0"/></g>'
    + '</g></g>'
    /* the droplet */
    + '<g transform="translate(105.6,79)"><circle class="lb-drip" r="1.8" fill="#a8e0d6" opacity="0"/></g>'
    + '<rect class="warm" width="200" height="160" fill="url(#lbW)"/>'
    + '<rect class="scn-clock" width="1" height="1" fill="none" opacity="0"/>'
    + '</svg>';

  /* ---- 6 · library — Context Drop ------------------------- */
  SVG.library = '<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">'
    + '<defs>'
    + '<radialGradient id="libO" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#ffe9c4"/><stop offset=".72" stop-color="#efa85c"/><stop offset="1" stop-color="#e8913f"/></radialGradient>'
    + '<radialGradient id="libW" cx="55%" cy="55%" r="70%"><stop offset="0" stop-color="rgba(239,217,138,.11)"/><stop offset="1" stop-color="rgba(239,217,138,0)"/></radialGradient>'
    + '</defs>'
    + '<g class="dtl"><rect x="20" y="40" width="3" height="63" rx="1" fill="rgba(243,234,217,.18)"/><rect x="177" y="40" width="3" height="63" rx="1" fill="rgba(243,234,217,.18)"/></g>'
    /* shelf boards */
    + '<rect x="20" y="56" width="160" height="3.5" rx="1.5" fill="rgba(243,234,217,.32)"/>'
    + '<rect x="20" y="96" width="160" height="3.5" rx="1.5" fill="rgba(243,234,217,.32)"/>'
    /* top row spines */
    + '<rect x="26" y="38" width="7" height="18" rx="1" fill="#7d8ca0"/>'
    + '<rect x="35" y="35" width="8" height="21" rx="1" fill="#b0623a"/>'
    + '<rect x="45" y="40" width="6" height="16" rx="1" fill="#8f9a6a"/>'
    + '<rect x="53" y="36" width="8" height="20" rx="1" fill="#c9a35e"/>'
    + '<rect x="73" y="39" width="7" height="17" rx="1" fill="#8f3f34"/>'
    + '<rect x="82" y="37" width="8" height="19" rx="1" fill="#a08b6f"/>'
    + '<rect x="92" y="36" width="7" height="20" rx="1" fill="#6f8a85"/>'
    + '<rect x="101" y="40" width="7" height="16" rx="1" fill="#7d8ca0"/>'
    + '<rect x="110" y="35" width="8" height="21" rx="1" fill="#8f9a6a"/>'
    + '<rect x="120" y="39" width="7" height="17" rx="1" fill="#8f6ab0"/>'
    + '<rect x="129" y="36" width="8" height="20" rx="1" fill="#c9a35e"/>'
    + '<rect x="139" y="41" width="7" height="15" rx="1" fill="#7d8ca0"/>'
    + '<rect x="148" y="37" width="8" height="19" rx="1" fill="#b0623a"/>'
    + '<rect x="158" y="39" width="7" height="17" rx="1" fill="#8f9a6a"/>'
    + '<rect x="167" y="35" width="8" height="21" rx="1" fill="#a08b6f"/>'
    /* scan glints */
    + '<rect class="lib-s1" x="26" y="38" width="7" height="18" rx="1" fill="#ffe9c4" opacity="0"/>'
    + '<rect class="lib-s2" x="35" y="35" width="8" height="21" rx="1" fill="#ffe9c4" opacity="0"/>'
    + '<rect class="lib-s3" x="45" y="40" width="6" height="16" rx="1" fill="#ffe9c4" opacity="0"/>'
    + '<rect class="lib-s4" x="53" y="36" width="8" height="20" rx="1" fill="#ffe9c4" opacity="0"/>'
    + '<rect class="lib-s5" x="63" y="34" width="8" height="22" rx="1" fill="#ffe9c4" opacity="0"/>'
    /* the target book */
    + '<g transform="translate(67,56)"><g class="lib-book">'
    + '<rect x="-4" y="-22" width="8" height="22" rx="1.5" fill="#efa85c"/>'
    + '<rect x="-4" y="-18" width="8" height="1.2" fill="rgba(23,16,9,.25)"/><rect x="-4" y="-8" width="8" height="1.2" fill="rgba(23,16,9,.25)"/>'
    + '</g></g>'
    /* lower row spines (with the charming lean, and space where books went) */
    + '<rect x="26" y="78" width="7" height="18" rx="1" fill="#8f9a6a"/>'
    + '<rect x="35" y="80" width="8" height="16" rx="1" fill="#c9a35e"/>'
    + '<rect x="45" y="76" width="7" height="20" rx="1" fill="#7d8ca0"/>'
    + '<rect x="54" y="79" width="8" height="17" rx="1" fill="#b0623a"/>'
    + '<rect x="64" y="77" width="7" height="19" rx="1" fill="#a08b6f"/>'
    + '<rect x="73" y="81" width="8" height="15" rx="1" fill="#6f8a85"/>'
    + '<rect x="83" y="77" width="7" height="19" rx="1" fill="#8f6ab0"/>'
    + '<rect x="92" y="79" width="8" height="17" rx="1" fill="#8f9a6a"/>'
    + '<rect x="102" y="76" width="7" height="20" rx="1" fill="#c9a35e"/>'
    + '<rect x="111" y="80" width="8" height="16" rx="1" fill="#7d8ca0"/>'
    + '<g transform="rotate(10 131 96)"><rect x="124" y="78" width="7" height="18" rx="1" fill="#b0623a"/></g>'
    + '<rect x="134" y="79" width="8" height="17" rx="1" fill="#8f3f34"/>'
    /* floor + a small waiting stack */
    + '<g class="dtl">'
    + '<rect x="20" y="148" width="160" height="1.5" rx="0.75" fill="rgba(243,234,217,.1)"/>'
    + '<rect x="30" y="143" width="22" height="5" rx="1" fill="#8f3f34"/>'
    + '<rect x="33" y="138" width="18" height="5" rx="1" fill="#8f9a6a"/>'
    + '<rect x="36" y="133" width="12" height="5" rx="1" fill="#c9a35e"/>'
    + '</g>'
    /* reading desk + lamp */
    + '<rect x="118" y="130" width="68" height="4" rx="2" fill="rgba(243,234,217,.32)"/>'
    + '<rect x="124" y="134" width="3" height="16" fill="rgba(243,234,217,.2)"/><rect x="178" y="134" width="3" height="16" fill="rgba(243,234,217,.2)"/>'
    + '<ellipse class="lib-pool" cx="146" cy="131" rx="30" ry="5" fill="rgba(239,217,138,.16)" opacity=".5"/>'
    + '<rect x="171" y="118" width="2" height="12" fill="rgba(243,234,217,.4)"/>'
    + '<path d="M166,118 Q172,111 178,118 Z" fill="#5e6b7d"/><circle cx="172" cy="117" r="1.8" fill="#efd98a"/>'
    /* question / answer chip */
    + '<g transform="translate(157.5,130)">'
    + '<g class="lib-q" opacity="0"><rect x="-5.5" y="-11" width="11" height="11" rx="2.5" fill="rgba(243,234,217,.92)"/><text y="-3" font-size="8" text-anchor="middle" fill="#221609" font-weight="600">?</text></g>'
    + '<g class="lib-q2" opacity="0"><rect x="-5.5" y="-11" width="11" height="11" rx="2.5" fill="#efd98a"/><text y="-3" font-size="8" text-anchor="middle" fill="#221609" font-weight="600">!</text></g>'
    + '</g>'
    /* opened pages + cite lines (appear when the book lands) */
    + '<g transform="translate(135,122)">'
    + '<path class="lib-pg1" d="M0,0 L-11,-3 L-11,-7.5 L0,-4 Z" fill="#f0e6d2" opacity="0"/>'
    + '<path class="lib-pg2" d="M0,0 L11,-3 L11,-7.5 L0,-4 Z" fill="#faf3e3" opacity="0"/>'
    + '</g>'
    + '<g transform="translate(125.5,116.5)"><rect class="lib-c1" width="7" height="1" rx="0.5" fill="rgba(143,106,176,.9)" opacity="0"/></g>'
    + '<g transform="translate(126.5,119)"><rect class="lib-c2" width="5" height="1" rx="0.5" fill="rgba(143,106,176,.75)" opacity="0"/></g>'
    + '<g transform="translate(137,117)"><rect class="lib-c3" width="6" height="1" rx="0.5" fill="rgba(143,106,176,.8)" opacity="0"/></g>'
    /* the librarian orb */
    + '<g transform="translate(132,112)"><g class="lib-move"><g class="lib-bob">'
    + '<circle class="lib-halo" r="9.5" fill="rgba(239,168,92,.25)"/>'
    + '<circle r="6.5" fill="url(#libO)"/>'
    + '<text y="1.8" font-size="4.8" text-anchor="middle" fill="#221609" font-weight="600">AI</text>'
    + '</g></g></g>'
    + '<g class="dtl"><g transform="translate(140,122)"><circle class="lib-mote1" r="1" fill="rgba(239,217,138,.55)" opacity="0"/></g>'
    + '<g transform="translate(152,118)"><circle class="lib-mote2" r="1" fill="rgba(239,217,138,.55)" opacity="0"/></g></g>'
    + '<rect class="warm" width="200" height="160" fill="url(#libW)"/>'
    + '<rect class="scn-clock" width="1" height="1" fill="none" opacity="0"/>'
    + '</svg>';

  /* ---- 7 · redline — Copywriter --------------------------- */
  SVG.redline = '<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">'
    + '<defs><radialGradient id="rlW" cx="50%" cy="42%" r="70%"><stop offset="0" stop-color="rgba(239,217,138,.1)"/><stop offset="1" stop-color="rgba(239,217,138,0)"/></radialGradient></defs>'
    /* desk, lamp, dust motes */
    + '<g class="dtl">'
    + '<rect x="14" y="140" width="172" height="4" rx="2" fill="rgba(243,234,217,.18)"/>'
    + '<g transform="translate(174,18)"><g class="rl-lamp">'
    + '<rect x="-0.7" width="1.4" height="16" fill="rgba(243,234,217,.3)"/>'
    + '<path d="M-5,16 L5,16 L8,23 L-8,23 Z" fill="#5e6b7d"/><circle cy="24.5" r="2" fill="#efd98a"/>'
    + '</g></g>'
    + '<g transform="translate(38,30)"><circle class="rl-mote1" r="1" fill="rgba(239,217,138,.55)" opacity="0"/></g>'
    + '<g transform="translate(150,116)"><circle class="rl-mote2" r="1" fill="rgba(239,217,138,.55)" opacity="0"/></g>'
    + '</g>'
    /* page shadow + sheet + headline */
    + '<rect x="33" y="27" width="140" height="112" rx="8" fill="#1c130a" opacity=".35"/>'
    + '<rect x="30" y="24" width="140" height="112" rx="8" fill="#f0e6d2"/>'
    + '<rect x="42" y="34" width="46" height="4.5" rx="2" fill="#e8913f"/>'
    /* paragraph, worst offenders first; two keeper lines stay sharp */
    + '<rect class="rl-keep1" x="39" y="72" width="78" height="9" rx="3" fill="rgba(239,168,92,.28)" opacity="0"/>'
    + '<rect class="rl-keep2" x="39" y="96" width="68" height="9" rx="3" fill="rgba(239,168,92,.28)" opacity="0"/>'
    + '<rect class="rl-line1" x="42" y="50" width="108" height="4.5" rx="2" fill="rgba(23,16,9,.3)"/>'
    + '<rect class="rl-line2" x="42" y="62" width="96" height="4.5" rx="2" fill="rgba(23,16,9,.3)"/>'
    + '<rect x="42" y="74" width="70" height="4.5" rx="2" fill="rgba(23,16,9,.42)"/>'
    + '<rect class="rl-line4" x="42" y="86" width="112" height="4.5" rx="2" fill="rgba(23,16,9,.3)"/>'
    + '<rect x="42" y="98" width="60" height="4.5" rx="2" fill="rgba(23,16,9,.42)"/>'
    + '<rect class="rl-line6" x="42" y="110" width="84" height="4.5" rx="2" fill="rgba(23,16,9,.3)"/>'
    /* strike-throughs, drawn on by the pen */
    + '<rect class="rl-strike1" x="42" y="51.7" width="108" height="2" rx="1" fill="#c0392b" opacity="0"/>'
    + '<rect class="rl-strike2" x="42" y="63.7" width="96" height="2" rx="1" fill="#c0392b" opacity="0"/>'
    + '<rect class="rl-strike4" x="42" y="87.7" width="112" height="2" rx="1" fill="#c0392b" opacity="0"/>'
    + '<rect class="rl-strike6" x="42" y="111.7" width="84" height="2" rx="1" fill="#c0392b" opacity="0"/>'
    /* the red pen, parked at rest; travels the margin during play */
    + '<g transform="translate(158,34)"><g class="rl-pen"><g class="rl-nib">'
    + '<rect x="-1.4" y="-16" width="2.8" height="16" rx="1.4" fill="#c0392b" transform="rotate(24)"/>'
    + '<path d="M0,0 L-5,-11 L2,-9 Z" fill="#8f3f34" transform="rotate(24)"/>'
    + '</g></g></g>'
    /* the gate passing */
    + '<g transform="translate(122,122)"><g class="rl-pill" opacity="0">'
    + '<rect width="34" height="9.5" rx="4.75" fill="#8fbf7f"/><text x="17" y="6.6" font-size="5" text-anchor="middle" fill="#141824" font-weight="600">CLEAN</text>'
    + '</g></g>'
    + '<rect class="rl-veil" x="30" y="24" width="140" height="112" rx="8" fill="#f0e6d2" opacity="0"/>'
    + '<rect class="warm" width="200" height="160" fill="url(#rlW)"/>'
    + '<rect class="scn-clock" width="1" height="1" fill="none" opacity="0"/>'
    + '</svg>';

  /* ---- injection + play/pause wiring ---------------------- */
  // Hover-capable devices additionally get the pointer/focus play; every
  // device gets the scroll-in play below.
  var hoverCapable = !(window.matchMedia && window.matchMedia('(hover: none)').matches);
  var reduced = !!(window.gbReducedMotion && window.gbReducedMotion());

  var hosts = document.querySelectorAll('[data-scene]');
  hosts.forEach(function (host) {
    var markup = SVG[host.getAttribute('data-scene')];
    if (!markup) return;
    host.innerHTML = markup;
    host.classList.add('scn-host');

    var card = host.closest('.wcard') || host;
    var hovering = false;   // pointer/focus is currently holding the loop open
    var loopsLeft = 0;      // bounded narrative loops still owed from a scroll-in

    function refresh() {
      if (hovering || loopsLeft > 0) host.classList.add('play');
      else host.classList.remove('play');
    }

    // A scene plays its narrative whenever it scrolls into view — on every
    // entry, on every device — then settles back to the ambient rest pose.
    // Re-entering the viewport re-arms and replays it ("per scroll"). Reduced
    // motion opts out of auto-play; the global clamp neutralizes any residual
    // loop anyway.
    if (!reduced && window.gbObserve) {
      window.gbObserve(host, function () {
        loopsLeft = 1;      // one full narrative loop on entry, then settle
        refresh();
      }, function () {
        // Left the viewport: drop any owed loops and re-arm for next entry.
        loopsLeft = 0;
        refresh();
      });
    }

    // End a bounded loop only at a clean clock boundary, and only if hover
    // isn't still holding it open (hover loops until the pointer/focus leaves).
    host.addEventListener('animationiteration', function (e) {
      if (e.animationName !== 'scn-clock') return;
      if (loopsLeft > 0) loopsLeft--;
      refresh();
    });

    // Hover / focus keeps the narrative looping on hover-capable devices, in
    // addition to the scroll-in play above.
    if (hoverCapable) {
      card.addEventListener('pointerenter', function () { hovering = true; refresh(); });
      card.addEventListener('focusin', function () { hovering = true; refresh(); });
      card.addEventListener('pointerleave', function () {
        hovering = false;   // let the current loop finish at the next boundary
      });
      card.addEventListener('focusout', function () {
        // activeElement updates after focusout; check on the next tick.
        setTimeout(function () {
          if (!card.contains(document.activeElement) && !card.matches(':hover')) hovering = false;
        }, 0);
      });
    }
  });
})();
