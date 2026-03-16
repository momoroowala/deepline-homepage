// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        var target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ========== INTERSECTION OBSERVERS ==========

// Section visibility observer
var sectionObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('section').forEach(function(s) { sectionObserver.observe(s); });

// Initialize hero as visible immediately
document.querySelector('.hero').classList.add('visible');

// Staggered animation for cards
var staggerObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry, index) {
        if (entry.isIntersecting) {
            setTimeout(function() {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.problem-card, .service-card, .tool-card').forEach(function(card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease';
    staggerObserver.observe(card);
});

// ========== DEBOUNCED SCROLL (passive) ==========
// Nav scroll - lightweight, no parallax transforms
var navEl = document.querySelector('nav');
var scrollTicking = false;
window.addEventListener('scroll', function() {
    if (!scrollTicking) {
        requestAnimationFrame(function() {
            if (window.scrollY > 20) {
                navEl.classList.add('scrolled');
            } else {
                navEl.classList.remove('scrolled');
            }
            scrollTicking = false;
        });
        scrollTicking = true;
    }
}, { passive: true });

// ========== CHART ANIMATIONS ==========
var chartObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            var container = entry.target;
            container.classList.add('animate');
            if (container.querySelector('.horizontal-bar-chart')) {
                container.querySelectorAll('.chart-bar-fill').forEach(function(bar, index) {
                    setTimeout(function() { bar.classList.add('animate'); }, index * 200);
                });
            }
            if (container.querySelector('.donut-chart')) {
                var donutFill = container.querySelector('.donut-fill');
                setTimeout(function() { donutFill.classList.add('animate'); }, 500);
            }
            if (container.querySelector('.comparison-grid')) {
                container.querySelectorAll('.comparison-row').forEach(function(row, index) {
                    var delay = row.dataset.delay || index * 200;
                    setTimeout(function() { row.classList.add('animate'); }, delay);
                });
            }
            if (container.querySelector('.roi-timeline')) {
                container.querySelectorAll('.timeline-dot').forEach(function(dot, index) {
                    setTimeout(function() { dot.classList.add('animate'); }, index * 300);
                });
                var path = container.querySelector('.roi-path');
                setTimeout(function() { if (path) path.classList.add('animate'); }, 800);
            }
            chartObserver.unobserve(container);
        }
    });
}, { threshold: 0.3 });
document.querySelectorAll('.chart-container').forEach(function(c) { chartObserver.observe(c); });

// ========== CASE STUDIES ==========
var caseStudyObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.case-study-card').forEach(function(card, index) {
                var delay = card.dataset.delay || index * 200;
                setTimeout(function() { card.classList.add('animate'); }, delay);
            });
            caseStudyObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });
var caseStudiesSection = document.querySelector('.case-studies-section');
if (caseStudiesSection) caseStudyObserver.observe(caseStudiesSection);

// ========== TIMELINE DOTS ==========
var dots = document.querySelectorAll('.timeline-dot');
if (dots.length >= 4) {
    dots[0].textContent = '1-2';
    dots[1].textContent = '3';
    dots[2].textContent = '4-6';
    dots[3].textContent = '6-12';
}

// ========== TICKER ==========
function initTicker() {
    var ticker = document.querySelector('.ticker-content');
    if (ticker && window.innerWidth > 768 && !ticker.dataset.cloned) {
        ticker.innerHTML = ticker.innerHTML + ticker.innerHTML;
        ticker.dataset.cloned = '1';
    }
}
initTicker();
window.addEventListener('resize', initTicker, { passive: true });

// ========== 1. CUSTOMER HEALTH ANALYSIS ==========
(function() {
    var customers = [
        { name: 'Grainger Regional', health: 'green', days: '\u2014', risk: '\u2014' },
        { name: 'Fastenal Corp', health: 'yellow', days: '45d', risk: '$23K' },
        { name: 'Motion Ind', health: 'green', days: '\u2014', risk: '\u2014' },
        { name: 'Applied Industrial', health: 'red', days: '120d', risk: '$47K' },
        { name: 'Kaman Industrial', health: 'yellow', days: '32d', risk: '$18K' },
        { name: 'MSC Industrial', health: 'green', days: '\u2014', risk: '\u2014' },
        { name: 'W.W. Grainger', health: 'red', days: '180d', risk: '$62K' },
        { name: 'HD Supply', health: 'yellow', days: '58d', risk: '$31K' },
        { name: 'Wesco Intl', health: 'green', days: '\u2014', risk: '\u2014' },
        { name: 'Fastenal NE', health: 'red', days: '95d', risk: '$38K' },
        { name: 'ORS Nasco', health: 'yellow', days: '41d', risk: '$15K' },
        { name: 'Bearings Direct', health: 'green', days: '\u2014', risk: '\u2014' }
    ];
    var healthLabels = { green: 'Healthy', yellow: 'At Risk', red: 'Dormant' };
    var healthIdx = 0, healthStarted = false, healthInterval = null;

    function renderHealth() {
        var body = document.getElementById('healthTableBody');
        if (!body) return;
        body.innerHTML = '';
        for (var i = 0; i < 5; i++) {
            var c = customers[(healthIdx + i) % customers.length];
            var row = document.createElement('div');
            row.className = 'health-row';
            row.innerHTML = '<span class="customer-name">' + c.name + '</span><span class="health-badge ' + c.health + '">' + healthLabels[c.health] + '</span><span class="dormant-days">' + c.days + '</span><span class="risk-amount">' + c.risk + '</span>';
            body.appendChild(row);
            setTimeout(function(r) { r.classList.add('visible'); }, 100 + i * 150, row);
        }
    }
    function cycleHealth() {
        var body = document.getElementById('healthTableBody');
        if (!body) return;
        body.querySelectorAll('.health-row').forEach(function(r) { r.style.opacity = '0'; r.style.transform = 'translateX(10px)'; });
        setTimeout(function() { healthIdx = (healthIdx + 2) % customers.length; renderHealth(); }, 400);
    }

    var healthObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
            if (e.isIntersecting && !healthStarted) {
                healthStarted = true; renderHealth();
                healthInterval = setInterval(cycleHealth, 4000);
            } else if (e.isIntersecting && healthStarted && !healthInterval) {
                healthInterval = setInterval(cycleHealth, 4000);
            } else if (!e.isIntersecting && healthInterval) {
                clearInterval(healthInterval); healthInterval = null;
            }
        });
    }, { threshold: 0.3 });
    var ha = document.getElementById('healthAnalysis');
    if (ha) healthObs.observe(ha);
})();

// ========== 2. CAMPAIGN FLOW ==========
(function() {
    var emailData = [
        { target: 'Applied Industrial', segment: 'dormant', status: 'sent', statusLabel: 'Sent' },
        { target: 'Fastenal NE', segment: 'declining', status: 'opened', statusLabel: 'Opened' },
        { target: 'W.W. Grainger', segment: 'dormant', status: 'reactivated', statusLabel: 'Reactivated!' },
        { target: 'HD Supply', segment: 'at-risk', status: 'clicked', statusLabel: 'Clicked' },
        { target: 'ORS Nasco', segment: 'declining', status: 'sent', statusLabel: 'Sent' },
        { target: 'Grainger Regional', segment: 'at-risk', status: 'opened', statusLabel: 'Opened' },
        { target: 'Fastenal Boston', segment: 'dormant', status: 'reactivated', statusLabel: 'Reactivated!' },
        { target: 'Bearings Direct', segment: 'declining', status: 'clicked', statusLabel: 'Clicked' },
        { target: 'Kaman Industrial', segment: 'at-risk', status: 'sent', statusLabel: 'Sent' },
        { target: 'Motion Atlanta', segment: 'dormant', status: 'opened', statusLabel: 'Opened' }
    ];
    var emailIdx = 0, campaignStarted = false;
    var sent = 0, opened = 0, clicked = 0, reactivated = 0;
    var icons = { sent: '\uD83D\uDCE7', opened: '\uD83D\uDCEC', clicked: '\uD83D\uDDB1\uFE0F', reactivated: '\u2705' };
    var campInterval = null;

    function addEmail() {
        var container = document.getElementById('campaignEmails');
        if (!container) return;
        var d = emailData[emailIdx % emailData.length];
        emailIdx++;
        document.querySelectorAll('.campaign-segment').forEach(function(s) { s.classList.remove('active'); });
        var seg = document.querySelector('[data-segment="' + d.segment + '"]');
        if (seg) seg.classList.add('active');
        var el = document.createElement('div');
        el.className = 'campaign-email';
        el.innerHTML = '<span class="email-icon">' + icons[d.status] + '</span><span class="email-target">' + d.target + '</span><span class="email-status ' + d.status + '">' + d.statusLabel + '</span>';
        container.insertBefore(el, container.firstChild);
        setTimeout(function() { el.classList.add('visible'); }, 50);
        while (container.children.length > 5) container.removeChild(container.lastChild);
        sent++;
        if (d.status === 'opened' || d.status === 'clicked' || d.status === 'reactivated') opened++;
        if (d.status === 'clicked' || d.status === 'reactivated') clicked++;
        if (d.status === 'reactivated') reactivated++;
        var cS = document.getElementById('cSent'); if (cS) cS.textContent = sent;
        var cO = document.getElementById('cOpened'); if (cO) cO.textContent = opened;
        var cC = document.getElementById('cClicked'); if (cC) cC.textContent = clicked;
        var cR = document.getElementById('cReactivated'); if (cR) cR.textContent = reactivated;
    }

    var campObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
            if (e.isIntersecting && !campaignStarted) {
                campaignStarted = true; addEmail();
                campInterval = setInterval(addEmail, 2500);
            } else if (e.isIntersecting && campaignStarted && !campInterval) {
                campInterval = setInterval(addEmail, 2500);
            } else if (!e.isIntersecting && campInterval) {
                clearInterval(campInterval); campInterval = null;
            }
        });
    }, { threshold: 0.3 });
    var cf = document.getElementById('campaignFlow');
    if (cf) campObs.observe(cf);
})();

// ========== 3. REVENUE INTELLIGENCE DASHBOARD ==========
(function() {
    var revStarted = false, revFeedInterval = null;
    var feedItems = [
        { text: 'W.W. Grainger reactivated', color: '#22c55e' },
        { text: 'Fastenal NE moved to At Risk', color: '#fbbf24' },
        { text: 'VIP retention: Motion Ind saved', color: '#22c55e' },
        { text: 'Kaman Industrial order declined 22%', color: '#ef4444' },
        { text: 'Cross-sell campaign: +$18K', color: '#1B9AAA' }
    ];
    var feedIdx = 0;

    function animateRevDashboard() {
        var cp = document.querySelector('.rev-churn-path');
        if (cp) setTimeout(function() { cp.classList.add('animate'); }, 500);
        var rv = document.querySelector('.rev-recovered-val');
        if (rv) {
            var target = 184000, steps = 60, inc = target / steps, count = 0;
            var timer = setInterval(function() {
                count += inc;
                if (count >= target) { count = target; clearInterval(timer); }
                rv.textContent = '$' + Math.floor(count / 1000) + 'K';
            }, 30);
        }
        renderRevFeed();
        revFeedInterval = setInterval(rotateRevFeed, 3500);
    }
    function renderRevFeed() {
        var feed = document.getElementById('revFeed');
        if (!feed) return;
        feed.innerHTML = '';
        for (var i = 0; i < 3; i++) {
            var item = feedItems[(feedIdx + i) % feedItems.length];
            var el = document.createElement('div');
            el.className = 'rev-feed-item';
            el.innerHTML = '<span class="rev-feed-text">' + item.text + '</span><span class="rev-feed-status" style="color:' + item.color + '">\u25CF</span>';
            feed.appendChild(el);
            setTimeout(function(e) { e.classList.add('visible'); }, 100 + i * 100, el);
        }
    }
    function rotateRevFeed() { feedIdx = (feedIdx + 1) % feedItems.length; renderRevFeed(); }

    var revObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
            if (e.isIntersecting && !revStarted) { revStarted = true; animateRevDashboard(); }
            else if (e.isIntersecting && revStarted && !revFeedInterval) { revFeedInterval = setInterval(rotateRevFeed, 3500); }
            else if (!e.isIntersecting && revFeedInterval) { clearInterval(revFeedInterval); revFeedInterval = null; }
        });
    }, { threshold: 0.3 });
    var rd = document.getElementById('revDashboard');
    if (rd) revObs.observe(rd);
})();

// ========== 4. REVENUE GROWTH TIMELINE ==========
(function() {
    var tlStarted = false;
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var afterHeights = [65, 60, 58, 62, 68, 75, 80, 88, 92, 98, 105, 110];
    var annotations = [
        { month: 3, text: '\uD83D\uDCCB Diagnostic complete' },
        { month: 5, text: '\uD83D\uDCE7 Dormant reactivated (+$42K)' },
        { month: 7, text: '\uD83C\uDFAF Cross-sell campaign (+$28K)' },
        { month: 10, text: '\u2B50 VIP retained ($95K saved)' }
    ];
    function renderTimeline() {
        var barsEl = document.getElementById('revTlBars');
        var annoEl = document.getElementById('revTlAnnotations');
        if (!barsEl) return;
        barsEl.innerHTML = '';
        annoEl.innerHTML = '';
        for (var i = 0; i < 12; i++) {
            var bar = document.createElement('div');
            bar.className = 'rev-tl-bar';
            var pct = (afterHeights[i] / 115) * 100;
            var color = i < 3 ? '#ef4444' : (i < 6 ? '#fbbf24' : '#22c55e');
            bar.style.height = '0px';
            bar.style.background = 'linear-gradient(to top, ' + color + ', ' + color + 'aa)';
            bar.innerHTML = '<span class="bar-month">' + months[i] + '</span>';
            barsEl.appendChild(bar);
            setTimeout(function(b, p) { b.style.height = p + '%'; }, 200 + i * 100, bar, pct);
        }
        annotations.forEach(function(a, idx) {
            var anno = document.createElement('div');
            anno.className = 'rev-tl-annotation';
            anno.textContent = a.text;
            annoEl.appendChild(anno);
            setTimeout(function() { anno.classList.add('visible'); }, 1000 + idx * 600);
        });
    }
    var tlObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
            if (e.isIntersecting && !tlStarted) { tlStarted = true; renderTimeline(); }
        });
    }, { threshold: 0.3 });
    var rt = document.getElementById('revenueTimeline');
    if (rt) tlObs.observe(rt);
})();

// ========== ROUTE OPTIMIZATION ==========
(function() {
    var routeMap = document.getElementById('routeMap');
    if (!routeMap) return;
    var routeStarted = false, stateIdx = 0, animId = null, cycleTimer = null;
    var states = [
        {
            title: "Route NJ-7 | North Jersey",
            stops: [
                { label: "Warehouse", x: 45, y: 150, wh: true },
                { label: "Grainger Regional", x: 85, y: 85 },
                { label: "Fastenal NE", x: 140, y: 110 },
                { label: "Kaman Industrial", x: 195, y: 65 },
                { label: "Applied Ind", x: 245, y: 130 },
                { label: "Motion Ind", x: 300, y: 80 },
                { label: "MSC Industrial", x: 355, y: 155 }
            ],
            stats: ["7","48.3 mi","2.1h","31%","38 min"],
            outline: "M30,50 L100,35 L200,30 L350,45 L370,100 L360,180 L300,210 L120,220 L50,200 L25,140Z"
        },
        {
            title: "Route TX-3 | Dallas-Fort Worth",
            stops: [
                { label: "Warehouse", x: 200, y: 130, wh: true },
                { label: "Fastenal DFW", x: 140, y: 170 },
                { label: "ORS Nasco", x: 70, y: 120 },
                { label: "Bearings Dir", x: 120, y: 70 },
                { label: "MSC Industrial", x: 230, y: 55 },
                { label: "Motion Ind", x: 310, y: 90 },
                { label: "Applied Ind", x: 350, y: 160 }
            ],
            stats: ["7","62.7 mi","2.8h","28%","44 min"],
            outline: "M20,30 L180,25 L370,40 L385,130 L360,210 L200,225 L60,215 L15,120Z"
        },
        {
            title: "Route GA-1 | Metro Atlanta",
            stops: [
                { label: "Warehouse", x: 300, y: 60, wh: true },
                { label: "Kaman Dist", x: 250, y: 95 },
                { label: "Fastenal ATL", x: 180, y: 75 },
                { label: "MSC Industrial", x: 110, y: 120 },
                { label: "Bearings Direct", x: 80, y: 170 },
                { label: "Motion Ind", x: 170, y: 180 },
                { label: "ORS Nasco", x: 300, y: 160 }
            ],
            stats: ["7","37.1 mi","1.9h","36%","35 min"],
            outline: "M40,60 L160,30 L330,35 L380,80 L370,180 L300,220 L100,215 L30,160Z"
        }
    ];

    function roadPath(pts) {
        var d = 'M' + pts[0].x + ',' + pts[0].y;
        for (var i = 1; i < pts.length; i++) {
            var p = pts[i - 1], c = pts[i];
            var dx = c.x - p.x, dy = c.y - p.y;
            if (Math.abs(dx) >= Math.abs(dy)) {
                var mx = Math.round(p.x + dx * 0.65);
                d += ' L' + mx + ',' + p.y + ' L' + mx + ',' + c.y + ' L' + c.x + ',' + c.y;
            } else {
                var my = Math.round(p.y + dy * 0.65);
                d += ' L' + p.x + ',' + my + ' L' + c.x + ',' + my + ' L' + c.x + ',' + c.y;
            }
        }
        return d;
    }
    function clearRoute() {
        if (animId) { cancelAnimationFrame(animId); animId = null; }
        if (cycleTimer) { clearTimeout(cycleTimer); cycleTimer = null; }
        document.getElementById('routeSvg').innerHTML = '';
        document.getElementById('routeStops').innerHTML = '';
        document.getElementById('stateOutline').innerHTML = '';
        document.getElementById('routeTruck').classList.remove('active');
    }
    function showRoute(s) {
        clearRoute();
        var svg = document.getElementById('routeSvg');
        var stopsEl = document.getElementById('routeStops');
        var outlineEl = document.getElementById('stateOutline');
        document.getElementById('routeTitle').textContent = s.title;
        document.getElementById('routeBadge').textContent = 'Optimizing...';
        document.querySelector('.route-header-bar').classList.add('visible');
        document.querySelector('.route-stats-panel').classList.add('visible');
        outlineEl.innerHTML = '<svg viewBox="0 0 400 240" preserveAspectRatio="none" style="width:100%;height:100%;"><path d="' + s.outline + '" fill="none" stroke="rgba(148,163,184,0.08)" stroke-width="1.5"/></svg>';
        s.stops.forEach(function(st, i) {
            var el = document.createElement('div');
            el.className = 'route-stop';
            el.style.left = (st.x / 400 * 100) + '%';
            el.style.top = (st.y / 240 * 100) + '%';
            el.innerHTML = '<div class="stop-pin ' + (st.wh ? 'warehouse' : 'pending') + '"></div><span class="stop-label">' + st.label + '</span>';
            el.setAttribute('data-si', i);
            stopsEl.appendChild(el);
        });
        var pd = roadPath(s.stops);
        var bg = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        bg.setAttribute('d', pd); bg.setAttribute('class', 'route-path-bg');
        svg.appendChild(bg);
        var act = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        act.setAttribute('d', pd); act.setAttribute('class', 'route-path-active');
        svg.appendChild(act);
        var len = act.getTotalLength();
        act.style.strokeDasharray = len;
        act.style.strokeDashoffset = len;
        var whStop = stopsEl.querySelector('[data-si="0"]');
        if (whStop) whStop.classList.add('visible');
        setTimeout(function() {
            act.style.transition = 'stroke-dashoffset 7s linear';
            act.style.strokeDashoffset = '0';
            document.getElementById('routeBadge').textContent = 'Routing...';
            var truck = document.getElementById('routeTruck');
            truck.classList.add('active');
            var t0 = null, dur = 7000, nStops = s.stops.length;
            function tick(ts) {
                if (!t0) t0 = ts;
                var p = Math.min((ts - t0) / dur, 1);
                var pt = act.getPointAtLength(p * len);
                truck.style.left = (pt.x / 400 * 100) + '%';
                truck.style.top = (pt.y / 240 * 100) + '%';
                var si = Math.floor(p * (nStops - 1)) + 1;
                for (var j = 1; j < Math.min(si + 1, nStops); j++) {
                    var stopEl = stopsEl.querySelector('[data-si="' + j + '"]');
                    if (stopEl && !stopEl.classList.contains('visible')) {
                        stopEl.classList.add('visible');
                        var pin = stopEl.querySelector('.stop-pin');
                        if (pin) { pin.classList.add('visible'); pin.classList.remove('pending'); pin.classList.add('delivered'); }
                    }
                }
                document.getElementById('rStops').textContent = Math.min(si, nStops - 1);
                if (p < 1) { animId = requestAnimationFrame(tick); }
                else {
                    document.getElementById('routeBadge').textContent = 'Optimized';
                    document.getElementById('rStops').textContent = s.stats[0];
                    document.getElementById('rMiles').textContent = s.stats[1];
                    document.getElementById('rTime').textContent = s.stats[2];
                    document.getElementById('rGas').textContent = s.stats[3];
                    document.getElementById('rTimeSaved').textContent = s.stats[4];
                    cycleTimer = setTimeout(function() {
                        routeMap.style.opacity = '0.3';
                        setTimeout(function() {
                            stateIdx = (stateIdx + 1) % states.length;
                            showRoute(states[stateIdx]);
                            routeMap.style.opacity = '1';
                        }, 400);
                    }, 3000);
                }
            }
            animId = requestAnimationFrame(tick);
        }, 500);
    }
    document.getElementById('routeSvg').setAttribute('viewBox', '0 0 400 240');
    document.getElementById('routeSvg').setAttribute('preserveAspectRatio', 'none');
    var routeObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !routeStarted) {
                routeStarted = true;
                routeMap.style.transition = 'opacity 0.4s ease';
                showRoute(states[0]);
            } else if (!entry.isIntersecting && routeStarted) {
                if (animId) { cancelAnimationFrame(animId); animId = null; }
                if (cycleTimer) { clearTimeout(cycleTimer); cycleTimer = null; }
            } else if (entry.isIntersecting && routeStarted) {
                showRoute(states[stateIdx]);
            }
        });
    }, { threshold: 0.1 });
    routeObs.observe(routeMap);
})();

// ========== ORCHESTRATOR DIAGRAM ==========
(function() {
    var diagram = document.getElementById('orchDiagram');
    if (!diagram) return;
    var svg = document.getElementById('orchSvg');
    var colors = { erp: '#ef4444', tms: '#f59e0b', wms: '#10b981', crm: '#8b5cf6' };
    var syncCount = 0, animRunning = false;

    function getCenter(el) {
        var dr = diagram.getBoundingClientRect();
        var er = el.getBoundingClientRect();
        return { x: er.left - dr.left + er.width / 2, y: er.top - dr.top + er.height / 2 };
    }
    function drawLines() {
        svg.innerHTML = '';
        var hub = diagram.querySelector('.orch-hub');
        var hc = getCenter(hub);
        diagram.querySelectorAll('.orch-node').forEach(function(node) {
            var nc = getCenter(node);
            var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', nc.x); line.setAttribute('y1', nc.y);
            line.setAttribute('x2', hc.x); line.setAttribute('y2', hc.y);
            line.setAttribute('class', 'orch-line');
            svg.appendChild(line);
        });
    }
    function animateDot(nodeKey, toHub) {
        var node = diagram.querySelector('.orch-node.n-' + nodeKey);
        var hub = diagram.querySelector('.orch-hub');
        if (!node || !hub) return;
        var nc = getCenter(node), hc = getCenter(hub);
        var startX = toHub ? nc.x : hc.x, startY = toHub ? nc.y : hc.y;
        var endX = toHub ? hc.x : nc.x, endY = toHub ? hc.y : nc.y;
        var dot = document.createElement('div');
        dot.className = 'orch-dot moving';
        dot.style.background = colors[nodeKey];
        dot.style.boxShadow = '0 0 12px ' + colors[nodeKey];
        dot.style.left = startX - 4 + 'px';
        dot.style.top = startY - 4 + 'px';
        diagram.appendChild(dot);
        var start = null, duration = 1200;
        function step(ts) {
            if (!start) start = ts;
            var progress = Math.min((ts - start) / duration, 1);
            var ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            dot.style.left = (startX + (endX - startX) * ease - 4) + 'px';
            dot.style.top = (startY + (endY - startY) * ease - 4) + 'px';
            if (progress < 1) { requestAnimationFrame(step); }
            else {
                dot.remove();
                if (toHub) {
                    syncCount += Math.floor(Math.random() * 30) + 10;
                    var el = document.getElementById('orchSyncCount');
                    if (el) el.textContent = syncCount;
                }
                var target = toHub ? hub : node;
                target.style.boxShadow = '0 0 20px ' + colors[nodeKey];
                node.classList.add('active');
                setTimeout(function() { target.style.boxShadow = ''; node.classList.remove('active'); }, 400);
            }
        }
        requestAnimationFrame(step);
    }
    function runCycle() {
        if (!animRunning) return;
        var keys = Object.keys(colors);
        animateDot(keys[Math.floor(Math.random() * keys.length)], Math.random() > 0.3);
        setTimeout(runCycle, 600 + Math.random() * 800);
    }
    var orchObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !animRunning) { animRunning = true; drawLines(); runCycle(); }
            else if (!entry.isIntersecting) { animRunning = false; }
        });
    }, { threshold: 0.3 });
    orchObserver.observe(diagram);
    window.addEventListener('resize', function() { if (animRunning) drawLines(); }, { passive: true });
})();

// ========== COO OPERATIONS DASHBOARD ==========
(function() {
    var cooActivities = [
        { text: 'Route NYC-7 delayed 45min', status: 'Traffic', color: '#fbbf24' },
        { text: 'Warehouse B hit 90% capacity', status: 'Alert', color: '#ef4444' },
        { text: 'ACME Corp emergency order $14.2K', status: 'Rush', color: '#8b5cf6' },
        { text: 'Driver J.Smith called in sick', status: 'Reassigned', color: '#fbbf24' },
        { text: 'Supplier ABC delayed shipment', status: '34 SKUs', color: '#ef4444' },
        { text: 'Route BOS-3 ahead of schedule', status: '+20 min', color: '#22c55e' },
        { text: 'Fastenal payment received $47.8K', status: 'Paid', color: '#22c55e' },
        { text: 'Low stock alert: SKU-4891', status: 'Reorder', color: '#ef4444' },
        { text: 'Route PHI-2 fuel efficiency up', status: '+12%', color: '#22c55e' },
        { text: 'Customer complaint resolved', status: 'Closed', color: '#22c55e' },
        { text: 'New driver onboarded', status: 'Training', color: '#1B9AAA' },
        { text: 'Inventory cycle count started', status: 'Zone A', color: '#1B9AAA' },
        { text: 'Route DC-1 optimized', status: '-18 min', color: '#22c55e' },
        { text: 'Quote expired: Grainger Regional', status: 'Follow-up', color: '#fbbf24' },
        { text: 'Warehouse C temp alarm', status: 'Resolved', color: '#22c55e' }
    ];
    var cooFeedIndex = 0, cooDashboardAnimated = false, cooFeedInterval = null;

    function renderCooFeed() {
        var feedScroll = document.getElementById('cooFeedScroll');
        if (!feedScroll) return;
        var html = '';
        for (var i = 0; i < 6; i++) {
            var a = cooActivities[(cooFeedIndex + i) % cooActivities.length];
            html += '<div class="coo-feed-item"><div class="coo-feed-text">' + a.text + '</div><div class="coo-feed-status" style="color:' + a.color + '"><div class="coo-feed-icon"></div>' + a.status + '</div></div>';
        }
        feedScroll.innerHTML = html;
    }
    function rotateCooFeed() {
        var feedScroll = document.getElementById('cooFeedScroll');
        if (!feedScroll) return;
        feedScroll.style.transform = 'translateY(-20px)';
        feedScroll.style.opacity = '0.7';
        setTimeout(function() {
            cooFeedIndex = (cooFeedIndex + 1) % cooActivities.length;
            renderCooFeed();
            feedScroll.style.transition = 'none';
            feedScroll.style.transform = 'translateY(20px)';
            setTimeout(function() {
                feedScroll.style.transition = 'all 0.5s ease';
                feedScroll.style.transform = 'translateY(0)';
                feedScroll.style.opacity = '1';
            }, 50);
        }, 300);
    }
    function animateCooDashboard() {
        var kpiCards = document.querySelectorAll('#cooDashboard .coo-kpi-card');
        kpiCards.forEach(function(card, index) {
            setTimeout(function() {
                var valueElement = card.querySelector('.coo-kpi-value');
                var originalText = valueElement.textContent;
                var animateValue = card.dataset.animate;
                if (!animateValue) return;
                var targetValue = parseFloat(animateValue);
                var currentValue = 0, steps = 60, increment = targetValue / steps;
                card.style.transform = 'scale(0.95)';
                card.style.transition = 'transform 0.3s ease';
                var counter = setInterval(function() {
                    currentValue += increment;
                    if (currentValue >= targetValue) { currentValue = targetValue; clearInterval(counter); card.style.transform = 'scale(1)'; }
                    if (originalText.includes('%')) valueElement.textContent = currentValue.toFixed(1) + '%';
                    else if (originalText.includes('x')) valueElement.textContent = currentValue.toFixed(1) + 'x';
                    else if (originalText.includes('/')) valueElement.textContent = Math.floor(currentValue) + '/40';
                    else valueElement.textContent = Math.floor(currentValue).toString();
                }, 1500 / steps);
            }, index * 100);
        });
        setTimeout(function() {
            var trendPath = document.querySelector('#cooDashboard .coo-trend-path');
            if (trendPath) trendPath.classList.add('animate');
        }, 800);
    }

    var dashboard = document.getElementById('cooDashboard');
    if (!dashboard) return;
    renderCooFeed();
    var cooObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !cooDashboardAnimated) {
                cooDashboardAnimated = true; animateCooDashboard();
                cooFeedInterval = setInterval(rotateCooFeed, 3500);
            } else if (entry.isIntersecting && !cooFeedInterval) {
                cooFeedInterval = setInterval(rotateCooFeed, 3500);
            } else if (!entry.isIntersecting && cooFeedInterval) {
                clearInterval(cooFeedInterval); cooFeedInterval = null;
            }
        });
    }, { threshold: 0.3 });
    cooObserver.observe(dashboard);
})();

// ========== HERO LIVE DASHBOARD ==========
(function() {
    var activities = [
        { text: 'Grainger Regional - 6 months dormant', status: 'Reactivated', color: '#2ECC71', icon: '\u2713' },
        { text: 'Fastenal Corp - order declined', status: 'At Risk', color: '#ef4444', icon: '!' },
        { text: 'Motion Industries - email opened', status: 'Engaged', color: '#1B9AAA', icon: '\u25CF' },
        { text: 'Applied Industrial - VIP flagged', status: 'Priority', color: '#fbbf24', icon: '\u25D0' },
        { text: 'Kaman Industrial - campaign response', status: 'Interested', color: '#818cf8', icon: '\u25C9' },
        { text: 'MSC Industrial - payment received $47.8K', status: 'Recovered', color: '#2ECC71', icon: '\u2713' },
        { text: 'W.W. Grainger - 4 month gap', status: 'Flagged', color: '#ef4444', icon: '!' },
        { text: 'HD Supply - follow-up scheduled', status: 'Outreach', color: '#fbbf24', icon: '\u25D0' },
        { text: 'Wesco Intl - order resumed', status: 'Win Back', color: '#2ECC71', icon: '\u2713' },
        { text: 'Fastenal NE - declining trend', status: 'Monitor', color: '#fbbf24', icon: '!' },
        { text: 'Fastenal Boston - customer reactivated', status: 'Success', color: '#2ECC71', icon: '\u2713' },
        { text: 'ORS Nasco - 8 months dormant', status: 'Target', color: '#ef4444', icon: '!' },
        { text: 'PFG - engagement campaign sent', status: 'Outbound', color: '#1B9AAA', icon: '\u25CF' },
        { text: 'Motion Atlanta - VIP retention', status: 'Saved', color: '#2ECC71', icon: '\u2713' },
        { text: 'MSC Industrial West - churn prevented', status: 'Retained', color: '#2ECC71', icon: '\u2713' }
    ];
    var feedIndex = 0;
    var feedInner = document.getElementById('feedInner');
    var heroIntervals = [];
    var dormant = 860, atRisk = 1.38, vipCustomers = 204;

    function renderFeedItems() {
        var html = '';
        for (var i = 0; i < 4; i++) {
            var item = activities[(feedIndex + i) % activities.length];
            html += '<div style="display:flex;justify-content:space-between;padding:4px 0;opacity:' + (i < 3 ? '1' : '0.4') + ';font-size:12px;"><span style="color:#D1D5DB;">' + item.text + '</span><span style="color:' + item.color + ';">' + item.icon + ' ' + item.status + '</span></div>';
        }
        feedInner.innerHTML = html;
    }
    renderFeedItems();

    function startHeroAnimations() {
        if (heroIntervals.length) return;
        heroIntervals.push(setInterval(function() {
            feedInner.style.transform = 'translateY(-24px)';
            feedInner.style.opacity = '0.5';
            setTimeout(function() {
                feedIndex = (feedIndex + 1) % activities.length;
                renderFeedItems();
                feedInner.style.transition = 'none';
                feedInner.style.transform = 'translateY(0)';
                feedInner.style.opacity = '1';
                setTimeout(function() { feedInner.style.transition = 'transform 0.5s ease, opacity 0.3s ease'; }, 50);
            }, 400);
        }, 3000));
        heroIntervals.push(setInterval(function() {
            for (var i = 0; i < 8; i++) {
                var bar = document.getElementById('liveBar' + i);
                if (bar) bar.style.height = (15 + Math.random() * 45) + 'px';
            }
        }, 2000));
        heroIntervals.push(setInterval(function() {
            dormant += Math.floor(Math.random() * 10) - 5;
            dormant = Math.max(820, Math.min(900, dormant));
            document.getElementById('statRoutes').textContent = dormant;
            atRisk += (Math.random() * 0.08) - 0.04;
            atRisk = Math.max(1.25, Math.min(1.52, atRisk));
            document.getElementById('statDelivery').textContent = '$' + atRisk.toFixed(2) + 'M';
            vipCustomers += Math.floor(Math.random() * 6) - 3;
            vipCustomers = Math.max(195, Math.min(215, vipCustomers));
            document.getElementById('statRevenue').textContent = vipCustomers;
        }, 4000));
    }
    function stopHeroAnimations() {
        heroIntervals.forEach(function(id) { clearInterval(id); });
        heroIntervals = [];
    }
    var heroObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) startHeroAnimations();
            else stopHeroAnimations();
        });
    }, { threshold: 0.1 });
    heroObserver.observe(document.querySelector('.hero'));

    function updateClock() {
        var now = new Date();
        var h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
        var ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        var el = document.getElementById('dashClock');
        if (el) el.textContent = h + ':' + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s + ' ' + ampm;
    }
    updateClock();
    setInterval(updateClock, 1000);
})();

// ========== ENHANCED QUOTING WITH TYPING ==========
(function() {
    var quoteScenarios = [
        { customer: "Fastenal Corp", product: "Ball Bearings SKF 6205 (SKU-4412)", quantity: "500", terms: "NET30", dueDate: "Mar 21, 2026", price: "$12,847.50", margin: "32.4%", marginColor: "green", inventory: "2,340 in stock", inventoryLevel: "green", type: "normal" },
        { customer: "Motion Industries", product: "Safety Gloves 3M XL (SKU-2891)", quantity: "800", terms: "NET45", dueDate: "Apr 5, 2026", price: "$19,440.00", margin: "28.1%", marginColor: "green", inventory: "127 units - LOW STOCK", inventoryLevel: "yellow", warning: "Low Stock Alert: Only 127 units. Partial fill available.", warningType: "yellow", type: "low-inventory" },
        { customer: "Applied Industrial", product: "Hydraulic Hose 3/8in (SKU-1055)", quantity: "1,200", terms: "NET30", dueDate: "Apr 5, 2026", price: "STOCKOUT", margin: "", inventory: "STOCKOUT", inventoryLevel: "red", warning: "Stockout: Hydraulic Hose 1/2in available as substitute", warningType: "red", substitute: "Substitute Available: Hydraulic Hose 1/2in (SKU-1062), 3,100 in stock, $8.42/unit", type: "stockout" },
        { customer: "MSC Industrial", product: "Cut-Off Wheels 4.5in (SKU-3301)", quantity: "2,500", terms: "NET60", dueDate: "Apr 20, 2026", price: "$31,250.00", margin: "22.7%", marginColor: "green", inventory: "8,900 in stock", inventoryLevel: "green", type: "volume-discount" },
        { customer: "Kaman Industrial", product: "Welding Rod E7018 (SKU-7744)", quantity: "300", terms: "COD", dueDate: "Immediate (COD)", price: "$5,670.00", margin: "35.2%", marginColor: "green", inventory: "1,450 in stock", inventoryLevel: "green", warning: "Rush Order: 8% surcharge applied", warningType: "orange", type: "rush-order" },
        { customer: "W.W. Grainger", product: "V-Belt A68 Gates (SKU-2200)", quantity: "5,000", terms: "NET90", dueDate: "May 20, 2026", price: "$42,500.00", margin: "11.3%", marginColor: "red", inventory: "12,400 in stock", inventoryLevel: "green", warning: "Margin Alert: Below 15% threshold. Manager approval required.", warningType: "red", type: "low-margin" },
        { customer: "HD Supply", product: "Pneumatic Cylinder 2in (SKU-5590)", quantity: "600", terms: "NET30", dueDate: "Apr 20, 2026", price: "STOCKOUT", margin: "", inventory: "STOCKOUT", inventoryLevel: "red", warning: "Stockout: Pneumatic Cylinder 2.5in available as substitute", warningType: "red", substitute: "Substitute Available: Pneumatic Cylinder 2.5in (SKU-5595), 890 in stock, $14.20/unit", type: "stockout" }
    ];
    var currentScenario = 0, isAnimating = false, cycleInterval = null, currentAnimation = null;

    function typeText(element, text, speed) {
        speed = speed || 60;
        return new Promise(function(resolve) {
            element.value = '';
            element.classList.add('typing');
            var i = 0;
            function next() {
                if (currentAnimation !== 'running') { resolve(); return; }
                if (i <= text.length) {
                    element.value = text.substring(0, i);
                    i++;
                    setTimeout(next, speed);
                } else {
                    element.classList.remove('typing');
                    element.classList.add('typed');
                    setTimeout(function() { element.classList.remove('typed'); resolve(); }, 150);
                }
            }
            next();
        });
    }
    function clearFieldStates() {
        document.querySelectorAll('.form-field').forEach(function(f) { f.classList.remove('typing', 'typed'); f.value = ''; });
    }
    function showGeneratingState() {
        var r = document.getElementById('quoteResult');
        var w = document.getElementById('quoteWarning');
        var s = document.getElementById('quoteSubstitute');
        var inv = document.getElementById('quoteInventory');
        if (r) r.style.display = 'none';
        if (w) w.style.display = 'none';
        if (s) s.style.display = 'none';
        if (inv) inv.style.display = 'none';
        var g = document.getElementById('quoteGenerating');
        if (!g) {
            g = document.createElement('div');
            g.id = 'quoteGenerating';
            g.className = 'quote-generating';
            r.parentNode.insertBefore(g, r);
        }
        g.textContent = 'Generating quote...';
        g.style.display = 'flex';
    }
    function hideGeneratingState() {
        var g = document.getElementById('quoteGenerating');
        if (g) g.style.display = 'none';
    }
    function animateResults(scenario) {
        return new Promise(function(resolve) {
            var els = {
                result: document.getElementById('quoteResult'),
                price: document.getElementById('quotePrice'),
                margin: document.getElementById('quoteMargin'),
                status: document.getElementById('quoteStatus'),
                inventory: document.getElementById('quoteInventory'),
                warning: document.getElementById('quoteWarning'),
                substitute: document.getElementById('quoteSubstitute')
            };
            hideGeneratingState();
            if (els.price) {
                els.price.textContent = scenario.price;
                if (scenario.price === 'STOCKOUT') els.price.classList.add('price-na');
                else els.price.classList.remove('price-na');
            }
            if (els.margin && scenario.margin) {
                els.margin.textContent = 'Margin: ' + scenario.margin;
                els.margin.style.color = scenario.marginColor === 'green' ? '#16a34a' : scenario.marginColor === 'red' ? '#dc2626' : '#ca8a04';
            } else if (els.margin) { els.margin.textContent = ''; }
            var dd = els.result.querySelector('.quote-due-date');
            if (dd) dd.remove();
            var newDD = document.createElement('div');
            newDD.className = 'quote-due-date';
            newDD.textContent = 'Due: ' + scenario.dueDate;
            els.result.appendChild(newDD);
            if (els.status) els.status.textContent = scenario.type === 'stockout' ? 'STOCKOUT' : 'Quote generated';
            if (els.result) {
                els.result.className = 'quote-result';
                if (scenario.type === 'stockout') els.result.classList.add('result-stockout');
                else if (scenario.type === 'low-inventory' || scenario.type === 'low-margin') els.result.classList.add('result-warning');
                else els.result.classList.add('result-normal');
            }
            els.result.style.display = 'flex';
            els.result.classList.add('show');
            setTimeout(function() {
                if (els.inventory) {
                    els.inventory.innerHTML = '<div class="inventory-level inventory-' + scenario.inventoryLevel + '">' + scenario.inventory + '</div>';
                    els.inventory.style.display = 'block';
                }
                setTimeout(function() {
                    if (scenario.warning && els.warning) {
                        els.warning.textContent = scenario.warning;
                        els.warning.className = 'quote-warning warning-' + scenario.warningType;
                        els.warning.style.display = 'block';
                    }
                    setTimeout(function() {
                        if (scenario.substitute && els.substitute) {
                            els.substitute.innerHTML = '<div class="quote-substitute-title">Substitute Available:</div>' + scenario.substitute;
                            els.substitute.style.display = 'block';
                        }
                        resolve();
                    }, 150);
                }, 150);
            }, 200);
        });
    }
    function hardClearScenario() {
        clearFieldStates();
        var r = document.getElementById('quoteResult');
        if (r) { r.classList.remove('show'); r.style.display = 'none'; var dd = r.querySelector('.quote-due-date'); if (dd) dd.remove(); }
        var w = document.getElementById('quoteWarning'); if (w) { w.style.display = 'none'; w.textContent = ''; }
        var s = document.getElementById('quoteSubstitute'); if (s) { s.style.display = 'none'; s.innerHTML = ''; }
        var inv = document.getElementById('quoteInventory'); if (inv) { inv.style.display = 'none'; inv.innerHTML = ''; }
        var g = document.getElementById('quoteGenerating'); if (g) g.style.display = 'none';
        var c = document.getElementById('quoteCustomer'); if (c) c.textContent = '';
    }
    function animateScenario(scenario) {
        currentAnimation = 'stopped';
        return new Promise(function(resolve) {
            setTimeout(function() {
                currentAnimation = 'running';
                var els = {
                    customer: document.getElementById('quoteCustomer'),
                    product: document.getElementById('quoteProd'),
                    quantity: document.getElementById('quoteQty'),
                    terms: document.getElementById('quoteTerms')
                };
                hardClearScenario();
                if (els.customer) els.customer.textContent = 'Customer: ' + scenario.customer;
                typeText(els.product, scenario.product, 50).then(function() {
                    if (currentAnimation !== 'running') return resolve();
                    return typeText(els.quantity, 'Quantity: ' + scenario.quantity, 60);
                }).then(function() {
                    if (currentAnimation !== 'running') return resolve();
                    return typeText(els.terms, 'Terms: ' + scenario.terms, 70);
                }).then(function() {
                    if (currentAnimation !== 'running') return resolve();
                    showGeneratingState();
                    return new Promise(function(r) { setTimeout(r, 500); });
                }).then(function() {
                    if (currentAnimation !== 'running') return resolve();
                    return animateResults(scenario);
                }).then(function() {
                    currentAnimation = 'complete';
                    setTimeout(function() { if (currentAnimation === 'complete') currentAnimation = null; }, 3500);
                    resolve();
                });
            }, 50);
        });
    }
    function cycleToNext() {
        currentAnimation = 'stopped';
        isAnimating = true;
        var qi = document.getElementById('quotingCycler');
        if (qi) { qi.style.opacity = '0.7'; qi.style.transform = 'translateY(-10px)'; }
        setTimeout(function() {
            currentScenario = (currentScenario + 1) % quoteScenarios.length;
            if (qi) { qi.style.opacity = '1'; qi.style.transform = 'translateY(0)'; }
            animateScenario(quoteScenarios[currentScenario]).then(function() { isAnimating = false; });
        }, 300);
    }
    function startCycling() {
        animateScenario(quoteScenarios[currentScenario]);
        cycleInterval = setInterval(cycleToNext, 6500);
    }
    function stopCycling() {
        if (cycleInterval) { clearInterval(cycleInterval); cycleInterval = null; }
        currentAnimation = null;
        isAnimating = false;
    }
    var quotingObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) startCycling();
            else stopCycling();
        });
    }, { threshold: 0.3 });
    var quotingCycler = document.getElementById('quotingCycler');
    if (quotingCycler) {
        quotingCycler.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        quotingObserver.observe(quotingCycler);
    }
})();
