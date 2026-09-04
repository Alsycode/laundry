/* ============================================================
   FreshPress Laundry — staff operations demo
   Vanilla JS · single-page · localStorage persistence
   See BUILD_PROGRESS.md for state, DESIGN_SYSTEM.md for visuals.
   ============================================================ */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     Constants / catalog
  --------------------------------------------------------- */
  var LS_KEY = "freshpress_v1";

  var CATALOG = [
    { type: "shirt",    label: "Shirt",    emoji: "👔", desc: "Formal / Casual shirt", popular: true },
    { type: "tshirt",   label: "T-shirt",  emoji: "👕", desc: "Cotton t-shirt",        popular: true },
    { type: "jeans",    label: "Jeans",    emoji: "👖", desc: "Denim jeans",           popular: true },
    { type: "pants",    label: "Pants",    emoji: "👖", desc: "Trousers / formal pants" },
    { type: "saree",    label: "Saree",    emoji: "🧣", desc: "Silk / cotton saree",   popular: true },
    { type: "dress",    label: "Dress",    emoji: "👗", desc: "Party / casual dress" },
    { type: "bedsheet", label: "Bedsheet", emoji: "🛏️", desc: "Single / double bedsheet" },
    { type: "towel",    label: "Towel",    emoji: "🧺", desc: "Bath / hand towel" },
    { type: "jacket",   label: "Jacket",   emoji: "🧥", desc: "Blazer / winter jacket" },
    { type: "shorts",   label: "Shorts",   emoji: "🩳", desc: "Casual shorts" },
    { type: "skirt",    label: "Skirt",    emoji: "👚", desc: "Short / long skirt" }
  ];
  var CATALOG_BY_TYPE = {};
  CATALOG.forEach(function (c) { CATALOG_BY_TYPE[c.type] = c; });

  // [wash, iron, wash+iron]
  var DEFAULT_PRICING = {
    shirt: [30, 15, 40], tshirt: [25, 15, 35], jeans: [60, 25, 75], pants: [50, 25, 70],
    saree: [60, 30, 80], dress: [70, 35, 95], bedsheet: [50, 30, 70], towel: [20, 10, 25],
    jacket: [90, 40, 120], shorts: [30, 15, 40], skirt: [40, 20, 55]
  };

  var SERVICE_KEYS = ["wash", "iron", "washiron"];
  var SERVICE_LABEL = { wash: "Wash", iron: "Iron", washiron: "Wash + Iron" };
  var SERVICE_ICON = { wash: "💧", iron: "♽", washiron: "💧 ♽" };
  var SERVICE_IDX = { wash: 0, iron: 1, washiron: 2 };

  var FLOW = ["pickup", "processing", "ready", "out_for_delivery", "delivered"];
  var STATUS_LABEL = {
    pickup: "Pickup", processing: "In Process", ready: "Ready",
    out_for_delivery: "Out for Delivery", delivered: "Delivered"
  };
  var NEXT_ACTION = {
    pickup: "Mark In Process", processing: "Mark Ready",
    ready: "Mark Out for Delivery", out_for_delivery: "Mark Delivered"
  };

  var METHODS = [
    { k: "cash", n: "Cash", i: "💵" },
    { k: "upi", n: "UPI", i: "🔺" },
    { k: "card", n: "Card", i: "💳" },
    { k: "other", n: "Other", i: "•••" }
  ];

  /* ---------------------------------------------------------
     State + persistence
  --------------------------------------------------------- */
  var state = null;

  function persist() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({
        customers: state.customers,
        orders: state.orders,
        pricing: state.pricing,
        feedback: state.feedback,
        settings: state.settings,
        seq: state.seq
      }));
    } catch (e) { /* storage unavailable — demo still runs in memory */ }
  }

  function load() {
    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(LS_KEY) || "null"); } catch (e) { saved = null; }
    if (saved && saved.orders && saved.orders.length) {
      state = {
        customers: saved.customers || [],
        orders: saved.orders || [],
        pricing: Object.assign({}, DEFAULT_PRICING, saved.pricing || {}),
        feedback: saved.feedback || [],
        settings: Object.assign(defaultSettings(), saved.settings || {}),
        seq: saved.seq || 1029
      };
    } else {
      state = seed();
      persist();
    }
    state.ui = { tab: "home", route: { name: "home", params: {} }, history: [], focusId: null };
    state.draft = emptyDraft();
    state.editor = null;
    state.pay = null;
    state.pricingDraft = null;
    state.settingsDraft = null;
  }

  function defaultSettings() {
    return {
      shopName: "FreshPress Laundry",
      tagline: "Laundry & Ironing Services",
      staffName: "Ravi",
      address: "Shop 4, Sunrise Market, Sector 18, Noida",
      phone: "+91 90000 12345",
      social: { instagram: "@freshpress", facebook: "FreshPressLaundry", google: "FreshPress Laundry", youtube: "FreshPress" }
    };
  }

  function emptyDraft() {
    return { customerId: null, newCustomer: null, name: "", phone: "", address: "", items: [], discount: 0, editingOrderId: null, search: "" };
  }

  /* ---------------------------------------------------------
     Seed data
  --------------------------------------------------------- */
  function seed() {
    var pricing = JSON.parse(JSON.stringify(DEFAULT_PRICING));
    var customers = [
      c("cust-001", "Anjali Mehta", "+91 98765 43210", "B-12, Green Park Apartments, Sector 21, Noida"),
      c("cust-002", "Priya Sharma", "+91 91234 56789", "44, Rosewood Society, Indirapuram, Ghaziabad"),
      c("cust-003", "Rahul Nair", "+91 99887 76655", "C-9, Lotus Enclave, Sector 62, Noida"),
      c("cust-004", "Sneha Iyer", "+91 98111 22334", "7B, Maple Residency, Vaishali, Ghaziabad"),
      c("cust-005", "Amit Verma", "+91 97555 88221", "201, Silver Oak Towers, Sector 76, Noida"),
      c("cust-006", "Neha Kapoor", "+91 96650 11009", "D-3, Palm Grove, Sector 50, Noida"),
      c("cust-007", "Karan Mehta", "+91 95000 44556", "18, Orchid Villa, Sector 44, Noida")
    ];
    function c(id, name, phone, address) {
      return { id: id, name: name, phone: phone, address: address, createdAt: Date.now() - 86400000 * 40 };
    }

    var orders = [];
    var seq = 1000;
    var now = Date.now();

    function mkItems(specs) {
      return specs.map(function (s, i) {
        return {
          id: "it-" + seq + "-" + i,
          type: s[0], qty: s[1], service: s[2],
          unitPrice: pricing[s[0]][SERVICE_IDX[s[2]]],
          instructions: s[3] || ""
        };
      });
    }
    function mkOrder(custId, items, status, payStatus, daysAgo, isToday) {
      var id = String(++seq);
      var created = now - (daysAgo || 0) * 86400000 - Math.floor(Math.random() * 6) * 3600000;
      var o = {
        id: id, customerId: custId, items: items,
        discount: 0, status: status, paymentStatus: payStatus,
        payments: [], createdAt: created, isToday: !!isToday,
        history: [{ status: "pickup", at: created }]
      };
      // backfill history up to current status
      var idx = FLOW.indexOf(status);
      for (var i = 1; i <= idx; i++) o.history.push({ status: FLOW[i], at: created + i * 3600000 });
      if (payStatus === "paid") {
        var total = calcTotal(o);
        o.payments.push({ amount: total, method: "cash", note: "", at: created + 4000000 });
      }
      orders.push(o);
      return o;
    }

    // pad with older generated orders to reach the reference dashboard counts
    var pads = [
      // [status, count, payStatus-mostly]
      ["pickup", 3, "pending"],
      ["processing", 7, "pending"],
      ["ready", 2, "pending"],
      ["out_for_delivery", 1, "pending"],
      ["delivered", 11, "paid"]
    ];
    var sampleSpecs = [
      [["shirt", 4, "iron"], ["pants", 2, "washiron"]],
      [["tshirt", 6, "wash"], ["jeans", 2, "wash"]],
      [["saree", 2, "washiron"], ["dress", 1, "wash"]],
      [["bedsheet", 2, "wash"], ["towel", 4, "wash"]],
      [["jacket", 1, "washiron"], ["shirt", 3, "washiron"]],
      [["dress", 2, "iron"], ["skirt", 2, "wash"]],
      [["shorts", 3, "wash"], ["tshirt", 3, "iron"]]
    ];
    var custIdx = 0, dayCursor = 3, specIdx = 0;
    pads.forEach(function (p) {
      for (var i = 0; i < p[1]; i++) {
        var cust = customers[custIdx % customers.length]; custIdx++;
        var spec = sampleSpecs[specIdx % sampleSpecs.length]; specIdx++;
        var payStatus = p[2];
        if (p[0] !== "delivered" && Math.random() < 0.25) payStatus = "paid";
        if (p[0] === "delivered" && Math.random() < 0.18) payStatus = "pending";
        mkOrder(cust.id, mkItems(spec), p[0], payStatus, dayCursor + i, false);
      }
      dayCursor += 2;
    });

    // Named "today" orders shown on the dashboard
    mkOrder("cust-002", mkItems([["shirt", 3, "iron"], ["tshirt", 2, "wash"]]), "pickup", "pending", 0, true); // #1024-ish
    mkOrder("cust-005", mkItems([["jeans", 3, "wash"], ["shirt", 2, "washiron"]]), "processing", "pending", 0, true);
    mkOrder("cust-006", mkItems([["saree", 2, "washiron"], ["dress", 1, "iron"]]), "ready", "paid", 0, true);
    mkOrder("cust-007", mkItems([["bedsheet", 2, "wash"], ["towel", 5, "wash"]]), "delivered", "paid", 0, true);

    // Primary demo order #1028 — Anjali Mehta
    var demo = mkOrder(
      "cust-001",
      mkItems([
        ["shirt", 3, "iron"],
        ["jeans", 2, "wash"],
        ["tshirt", 4, "iron"],
        ["saree", 1, "washiron"]
      ]),
      "pickup", "pending", 0, true
    );
    // renumber generated (older) orders first: 1000, 999, 998 ... — always < 1024, no collisions
    var older = orders.slice(0, orders.length - 5);
    older.forEach(function (o, i) { o.id = String(1000 - i); });

    // force ids of the 5 "today" orders to 1024..1028 for demo familiarity (#1028 = Anjali)
    var todays = orders.slice(-5);
    todays.forEach(function (o, i) { o.id = String(1024 + i); });

    var feedback = [];

    return {
      customers: customers,
      orders: orders,
      pricing: pricing,
      feedback: feedback,
      settings: defaultSettings(),
      seq: 1029
    };
  }

  /* ---------------------------------------------------------
     Domain helpers
  --------------------------------------------------------- */
  function rupee(n) { return "₹" + Number(n || 0).toLocaleString("en-IN"); }
  function uid(prefix) { return prefix + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function customerById(id) { return state.customers.filter(function (c) { return c.id === id; })[0] || null; }
  function orderById(id) { return state.orders.filter(function (o) { return o.id === id; })[0] || null; }
  function itemAmount(it) { return it.qty * it.unitPrice; }
  function calcSubtotal(o) { return o.items.reduce(function (s, it) { return s + itemAmount(it); }, 0); }
  function calcTotal(o) { return Math.max(0, calcSubtotal(o) - (o.discount || 0)); }
  function amountPaid(o) { return (o.payments || []).reduce(function (s, p) { return s + p.amount; }, 0); }
  function amountDue(o) { return Math.max(0, calcTotal(o) - amountPaid(o)); }
  function orderItemCount(o) { return o.items.reduce(function (s, it) { return s + it.qty; }, 0); }
  function priceFor(type, service) {
    var row = state.pricing[type] || DEFAULT_PRICING[type] || [0, 0, 0];
    return row[SERVICE_IDX[service]] || 0;
  }
  function customerStats(id) {
    var os = state.orders.filter(function (o) { return o.customerId === id; });
    var spent = os.reduce(function (s, o) { return s + amountPaid(o); }, 0);
    var pending = os.reduce(function (s, o) { return s + amountDue(o); }, 0);
    return { count: os.length, spent: spent, pending: pending, orders: os };
  }
  function dashCounts() {
    var c = { pickup: 0, processing: 0, ready: 0, delivered: 0 };
    state.orders.forEach(function (o) {
      if (o.status === "pickup") c.pickup++;
      else if (o.status === "processing") c.processing++;
      else if (o.status === "ready" || o.status === "out_for_delivery") c.ready++;
      else if (o.status === "delivered") c.delivered++;
    });
    return c;
  }

  /* ---------------------------------------------------------
     Navigation
  --------------------------------------------------------- */
  var MAIN_TABS = ["home", "orders", "customers", "more"];

  function navigate(name, params, opts) {
    opts = opts || {};
    if (!opts.replace) state.ui.history.push(state.ui.route);
    state.ui.route = { name: name, params: params || {} };
    if (MAIN_TABS.indexOf(name) >= 0) state.ui.tab = name;
    window.scrollTo && window.scrollTo(0, 0);
    var app = document.getElementById("app");
    if (app) app.scrollTop = 0;
    render();
  }
  function back() {
    var prev = state.ui.history.pop();
    if (prev) { state.ui.route = prev; if (MAIN_TABS.indexOf(prev.name) >= 0) state.ui.tab = prev.name; render(); }
    else navigate("home", {}, { replace: true });
  }

  /* ---------------------------------------------------------
     Icons (24x24, currentColor)
  --------------------------------------------------------- */
  function icon(name) {
    var p = {
      menu: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
      bell: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
      back: '<polyline points="15 18 9 12 15 6"/>',
      plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
      search: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
      chev: '<polyline points="9 18 15 12 9 6"/>',
      home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
      orders: '<rect x="4" y="3" width="16" height="18" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="13" y2="16"/>',
      customers: '<circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 6.5a3 3 0 0 1 0 5.8"/><path d="M18 20c0-2.4-1-4.5-2.6-5.7"/>',
      more: '<line x1="4" y1="8" x2="20" y2="8"/><line x1="4" y1="16" x2="20" y2="16"/>',
      phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7A2 2 0 0 1 22 16.9z"/>',
      whatsapp: '<path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3z"/><path d="M8.5 8.5c-.3.7 0 1.7.6 2.6a9 9 0 0 0 3.8 3.8c.9.6 1.9.9 2.6.6l.9-1.3-2-1.1-1 .8a6.6 6.6 0 0 1-2.5-2.5l.8-1L8.5 8.5z"/>',
      location: '<path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11z"/><circle cx="12" cy="10" r="2.6"/>',
      edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>',
      trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
      check: '<polyline points="20 6 9 17 4 12"/>',
      truck: '<rect x="1" y="6" width="13" height="10" rx="1"/><path d="M14 9h4l3 3v4h-7z"/><circle cx="6" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/>',
      washer: '<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="13" r="4.5"/><circle cx="8" cy="6" r="0.8"/>',
      box: '<path d="M21 8 12 3 3 8l9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
      doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="14" y2="17"/>',
      share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/>',
      clock: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 16 14"/>',
      star: '<polygon points="12 2 15 9 22 9.3 16.5 14 18.5 21 12 17 5.5 21 7.5 14 2 9.3 9 9"/>',
      user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',
      bulb: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1h6c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z"/>',
      tag: '<path d="M20.6 13.4 12 22l-9-9V4h9l8.6 8.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
      shirt: '<path d="M16 3l4 3-2 4-2-1v11H8V9L6 10 4 6l4-3 2 2h4z"/>',
      chat: '<path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
      chart: '<line x1="4" y1="20" x2="20" y2="20"/><rect x="6" y="12" width="3" height="6"/><rect x="11" y="8" width="3" height="10"/><rect x="16" y="4" width="3" height="14"/>',
      gear: '<circle cx="12" cy="12" r="3.2"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.4 1a7 7 0 0 0-1.7-1l-.4-2.5h-4l-.4 2.5a7 7 0 0 0-1.7 1l-2.4-1-2 3.5L5.1 11a7 7 0 0 0 0 2l-2 1.5 2 3.5 2.4-1a7 7 0 0 0 1.7 1l.4 2.5h4l.4-2.5a7 7 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5a7 7 0 0 0 .1-1z"/>',
      x: '<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>'
    };
    return '<svg class="ic" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (p[name] || "") + "</svg>";
  }

  /* ---------------------------------------------------------
     Shared components (return HTML strings)
  --------------------------------------------------------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }
  function attr(s) { return esc(s).replace(/"/g, "&quot;"); }

  function appBar(title, opts) {
    opts = opts || {};
    var left = opts.menu
      ? '<button class="iconbtn" data-action="noop-menu" aria-label="Menu">' + icon("menu") + "</button>"
      : (opts.back === false ? "" : '<button class="iconbtn" data-action="back" aria-label="Back">' + icon("back") + "</button>");
    var right = opts.right || "";
    return '<div class="appbar">' + left +
      '<div class="title">' + esc(title) + "</div>" +
      '<div class="spacer"></div>' + right + "</div>";
  }

  function statusChip(status) {
    return '<span class="chip chip-' + status + '">' + esc(STATUS_LABEL[status] || status) + "</span>";
  }
  function payChip(o) {
    var due = amountDue(o), paid = amountPaid(o);
    if (o.paymentStatus === "paid" || due === 0 && paid > 0) return '<span class="chip chip-paid">Paid</span>';
    if (paid > 0 && due > 0) return '<span class="chip chip-partial">Partial</span>';
    return '<span class="chip chip-pending">Pending</span>';
  }

  function stepper(activeIndex) {
    var labels = ["Customer", "Add Items", "Review"];
    var h = '<div class="stepper">';
    for (var i = 0; i < 3; i++) {
      var cls = i < activeIndex ? "done" : (i === activeIndex ? "active" : "");
      var inner = i < activeIndex ? icon("check") : String(i + 1);
      h += '<div class="step ' + cls + '"><div class="bubble">' + inner + "</div><div class=\"cap\">" + labels[i] + "</div></div>";
      if (i < 2) h += '<div class="bar ' + (i < activeIndex ? "done" : "") + '"></div>';
    }
    return h + "</div>";
  }

  function orderTimeline(o) {
    var nodes = [
      { k: "pickup", t: "Pickup", ic: "truck" },
      { k: "processing", t: "In Process", ic: "washer" },
      { k: "ready", t: "Ready", ic: "check" },
      { k: "delivered", t: "Delivered", ic: "box" }
    ];
    var stage = o.status === "out_for_delivery" ? 2 : ["pickup", "processing", "ready", "delivered"].indexOf(o.status);
    var h = '<div class="timeline">';
    nodes.forEach(function (n, i) {
      var done = i <= stage;
      h += '<div class="node ' + (done ? "done" : "") + '"><div class="dot">' + icon(n.ic) + "</div><div class=\"t\">" + n.t + "</div></div>";
      if (i < nodes.length - 1) h += '<div class="seg ' + (i < stage ? "done" : "") + '"></div>';
    });
    h += "</div>";
    if (o.status === "out_for_delivery") h += '<div class="ofd-pill"><span class="chip chip-out_for_delivery">Out for delivery</span></div>';
    return h;
  }

  function bottomNav() {
    var nav = document.getElementById("bottomNav");
    if (MAIN_TABS.indexOf(state.ui.route.name) < 0) { nav.hidden = true; nav.innerHTML = ""; return; }
    nav.hidden = false;
    var items = [
      { k: "home", label: "Home", ic: "home" },
      { k: "orders", label: "Orders", ic: "orders" },
      { k: "customers", label: "Customers", ic: "customers" },
      { k: "more", label: "More", ic: "more" }
    ];
    nav.innerHTML = items.map(function (it) {
      return '<button class="nav-item ' + (state.ui.tab === it.k ? "active" : "") + '" data-action="nav" data-tab="' + it.k + '">' +
        icon(it.ic) + "<span>" + it.label + "</span></button>";
    }).join("");
  }

  // clothing picture with graceful emoji fallback if the PNG is missing
  function clothPic(type, cls) {
    var c = CATALOG_BY_TYPE[type];
    var emoji = c ? c.emoji : "👕";
    return '<div class="' + cls + '">' +
      '<img src="assets/clothing/' + type + '.png" alt="' + attr(c ? c.label : type) + '" loading="lazy" ' +
      'onerror="this.remove();this.parentNode.classList.add(&quot;img-failed&quot;)">' +
      '<span class="glyph">' + emoji + '</span></div>';
  }
  function itemVisual(type, cls) {
    return clothPic(type, cls || "sum-visual");
  }

  function emptyState(em, text) {
    return '<div class="empty"><div class="em">' + em + '</div><p>' + esc(text) + "</p></div>";
  }

  /* ---------------------------------------------------------
     Screens
  --------------------------------------------------------- */
  var screens = {};

  screens.home = function () {
    var s = state.settings;
    var c = dashCounts();
    var todays = state.orders.filter(function (o) { return o.isToday; })
      .sort(function (a, b) { return a.id.localeCompare(b.id); });
    var right = '<div class="bell-wrap"><button class="iconbtn" data-action="noop" aria-label="Notifications">' +
      icon("bell") + '</button><span class="bell-dot"></span></div>';

    var stat = function (num, lbl, tile, ic) {
      return '<div class="stat"><div class="top"><div class="tile ' + tile + '">' + icon(ic) + '</div>' +
        '<div class="num">' + num + '</div></div><div class="lbl">' + lbl + "</div></div>";
    };

    var orderRows = todays.map(function (o) {
      var cust = customerById(o.customerId);
      var sub = o.status === "pickup" ? "Pickup · " + fmtTime(o.createdAt) : STATUS_LABEL[o.status];
      return '<button class="order-row" data-action="open-order" data-id="' + o.id + '">' +
        '<span class="oid">#' + o.id + '</span>' +
        '<span class="grow"><span class="cust">' + esc(cust ? cust.name : "Customer") + '</span>' +
        '<span class="meta">' + esc(sub) + '</span></span>' +
        '<span class="right">' + statusChip(o.status) + '<span class="chev">' + icon("chev") + '</span></span></button>';
    }).join("");

    return '<div class="screen has-nav">' +
      '<div class="appbar"><button class="iconbtn" data-action="noop-menu">' + icon("menu") + '</button><div class="spacer"></div>' + right + '</div>' +
      '<div class="greeting"><div class="hi">Good Morning,</div><div class="name">' + esc(s.staffName) + '</div>' +
      '<div class="sub">Here’s what’s happening today</div></div>' +
      '<div class="stat-grid">' +
        stat(c.pickup, "Pickups Today", "blue", "truck") +
        stat(c.processing, "In Processing", "amber", "washer") +
        stat(c.ready, "Ready for Delivery", "green", "shirt") +
        stat(c.delivered, "Delivered", "purple", "box") +
      '</div>' +
      '<div class="pad mt16"><button class="btn btn-primary" data-action="new-order">' + icon("plus") + ' New Order</button></div>' +
      '<div class="pad"><div class="section-head"><h2>Today’s Orders</h2>' +
        '<button class="link" data-action="nav" data-tab="orders">View All</button></div>' +
        '<div class="list">' + (orderRows || emptyState("🧺", "No orders yet today")) + '</div></div>' +
      '</div>';
  };

  screens.orders = function () {
    var f = state.ui.orderFilter || "all";
    var q = (state.ui.orderSearch || "").trim().toLowerCase();
    var filters = [["all", "All"], ["pickup", "Pickup"], ["processing", "Processing"], ["ready", "Ready"], ["delivered", "Delivered"]];
    var list = state.orders.slice().sort(function (a, b) { return b.createdAt - a.createdAt; });
    list = list.filter(function (o) {
      if (f === "ready") { if (o.status !== "ready" && o.status !== "out_for_delivery") return false; }
      else if (f !== "all" && o.status !== f) return false;
      if (q) {
        var cust = customerById(o.customerId);
        var hay = ("#" + o.id + " " + (cust ? cust.name : "")).toLowerCase();
        if (hay.indexOf(q) < 0) return false;
      }
      return true;
    });

    var chips = '<div class="seg-tabs" style="flex-wrap:nowrap;overflow-x:auto">' + filters.map(function (x) {
      return '<button class="' + (f === x[0] ? "active" : "") + '" data-action="order-filter" data-filter="' + x[0] + '">' + x[1] + "</button>";
    }).join("") + "</div>";

    var rows = list.map(function (o) {
      var cust = customerById(o.customerId);
      return '<button class="order-row" data-action="open-order" data-id="' + o.id + '">' +
        '<span class="grow"><span class="row between"><span class="cust">#' + o.id + ' · ' + esc(cust ? cust.name : "Customer") + '</span></span>' +
        '<span class="meta">' + orderItemCount(o) + ' items · ' + rupee(calcTotal(o)) + '</span>' +
        '<span class="row mt8" style="gap:8px">' + statusChip(o.status) + payChip(o) + '</span></span>' +
        '<span class="chev">' + icon("chev") + '</span></button>';
    }).join("");

    return '<div class="screen has-nav">' +
      appBar("Orders", { back: false }) +
      '<div class="pad"><div class="search">' + icon("search") +
        '<input id="orderSearch" type="text" placeholder="Search by order # or customer" value="' + attr(state.ui.orderSearch || "") + '" data-action="order-search"></div></div>' +
      chips +
      '<div class="pad mt12"><div class="list">' + (rows || emptyState("🔎", "No orders match")) + "</div></div></div>";
  };

  screens.customers = function () {
    var q = (state.ui.custSearch || "").trim().toLowerCase();
    var list = state.customers.slice().filter(function (c) {
      if (!q) return true;
      return (c.name + " " + c.phone).toLowerCase().indexOf(q) >= 0;
    }).sort(function (a, b) { return a.name.localeCompare(b.name); });

    var rows = list.map(function (c) {
      var st = customerStats(c.id);
      return '<button class="order-row" data-action="open-customer" data-id="' + c.id + '">' +
        '<span class="sum-visual" style="border-radius:50%;background:var(--green-tint);color:var(--green);font-size:16px;font-weight:800">' +
          esc(initials(c.name)) + '</span>' +
        '<span class="grow"><span class="cust">' + esc(c.name) + '</span>' +
        '<span class="meta">' + esc(c.phone) + '</span>' +
        '<span class="meta">' + st.count + ' orders · ' + rupee(st.spent) + ' spent</span></span>' +
        '<span class="chev">' + icon("chev") + '</span></button>';
    }).join("");

    return '<div class="screen has-nav">' +
      appBar("Customers", { back: false }) +
      '<div class="pad"><div class="search">' + icon("search") +
        '<input id="custSearch" type="text" placeholder="Search by name or phone" value="' + attr(state.ui.custSearch || "") + '" data-action="cust-search"></div></div>' +
      '<div class="pad mt12"><div class="list">' + (rows || emptyState("👥", "No customers found")) + "</div></div></div>";
  };

  screens.customerDetail = function (p) {
    var c = customerById(p.id);
    if (!c) return notFound();
    var st = customerStats(c.id);
    var history = st.orders.slice().sort(function (a, b) { return b.createdAt - a.createdAt; });
    var rows = history.map(function (o) {
      return '<button class="order-row" data-action="open-order" data-id="' + o.id + '">' +
        '<span class="oid">#' + o.id + '</span>' +
        '<span class="grow"><span class="cust">' + rupee(calcTotal(o)) + '</span>' +
        '<span class="meta">' + fmtDate(o.createdAt) + ' · ' + orderItemCount(o) + ' items</span></span>' +
        '<span class="right">' + statusChip(o.status) + '</span></button>';
    }).join("");

    return '<div class="screen">' +
      appBar("Customer", {}) +
      '<div class="pad stack">' +
        '<div class="card contact-card">' +
          '<div class="cname">' + esc(c.name) + '</div>' +
          '<div class="cphone">' + esc(c.phone) + '</div>' +
          '<div class="caddr">' + icon("location") + '<span>' + esc(c.address) + '</span></div>' +
          '<div class="contact-actions mt16">' +
            '<button class="cta" data-action="call-customer" data-phone="' + attr(c.phone) + '">' + icon("phone") + '</button>' +
            '<button class="cta" data-action="wa-open" data-phone="' + attr(c.phone) + '">' + icon("whatsapp") + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="row" style="gap:12px">' +
          '<div class="stat grow"><div class="num">' + rupee(st.spent) + '</div><div class="lbl">Total spent</div></div>' +
          '<div class="stat grow"><div class="num">' + rupee(st.pending) + '</div><div class="lbl">Pending</div></div>' +
        '</div>' +
        '<div class="section-head"><h2>Order history</h2></div>' +
        '<div class="list">' + (rows || emptyState("📦", "No orders yet")) + '</div>' +
      '</div></div>';
  };

  screens.more = function () {
    var items = [
      ["pricing", "tag", "Pricing", "Manage service prices"],
      ["templates", "chat", "WhatsApp Templates", "Preview customer messages"],
      ["reports", "chart", "Reports", "Revenue & order statistics"],
      ["staff", "customers", "Staff", "Team members"],
      ["settings", "gear", "Settings", "Business info & social links"]
    ];
    return '<div class="screen has-nav">' +
      appBar("More", { back: false }) +
      '<div class="pad"><div class="menu-list">' + items.map(function (it) {
        return '<button data-action="more-open" data-screen="' + it[0] + '">' +
          '<span class="mi-ico">' + icon(it[1]) + '</span>' +
          '<span><span class="mi-t">' + it[2] + '</span><span class="mi-d">' + it[3] + '</span></span>' +
          '<span class="chev">' + icon("chev") + '</span></button>';
      }).join("") + "</div>" +
      '<p class="tiny muted center mt20">FreshPress Laundry — staff demo build</p></div></div>';
  };

  // ---- New Order: Step 1 customer ----
  screens.newOrder = function () {
    var d = state.draft;
    var q = (d.search || "").trim().toLowerCase();
    var matches = q ? state.customers.filter(function (c) {
      return (c.name + " " + c.phone).toLowerCase().indexOf(q) >= 0;
    }).slice(0, 4) : [];

    var results = matches.length ? '<div class="list mt12">' + matches.map(function (c) {
      return '<button class="order-row" data-action="pick-customer" data-id="' + c.id + '">' +
        '<span class="sum-visual" style="border-radius:50%;background:var(--green-tint);color:var(--green);font-weight:800;font-size:15px">' + esc(initials(c.name)) + '</span>' +
        '<span class="grow"><span class="cust">' + esc(c.name) + '</span><span class="meta">' + esc(c.phone) + '</span></span>' +
        (d.customerId === c.id ? '<span class="right">' + icon("check") + '</span>' : "") + "</button>";
    }).join("") + "</div>" : "";

    var selected = d.customerId ? customerById(d.customerId) : null;

    return '<div class="screen">' +
      appBar("New Order", {}) +
      stepper(0) +
      '<div class="pad">' +
        '<div class="section-head"><h2>Customer Details</h2>' +
          (selected ? '<button class="link" data-action="new-customer">+ New</button>' : "") + '</div>' +
        '<div class="search">' + icon("search") +
          '<input id="custQuery" type="text" placeholder="Search customer by name or phone" value="' + attr(d.search || "") + '" data-action="cust-query"></div>' +
        results +
        '<div class="field"><label>Name</label>' +
          '<input class="input input-h" id="f_name" type="text" placeholder="Customer name" value="' + attr(d.name) + '" data-action="draft-field" data-k="name"></div>' +
        '<div class="field"><label>Phone Number</label>' +
          '<div class="input-with-btn"><input class="input input-h" id="f_phone" type="tel" placeholder="+91 " value="' + attr(d.phone) + '" data-action="draft-field" data-k="phone">' +
          '<button class="sidebtn" data-action="noop">' + icon("user") + '</button></div></div>' +
        '<div class="field"><label>Address</label>' +
          '<div class="input-with-btn"><textarea class="textarea" id="f_addr" placeholder="House / street / area" data-action="draft-field" data-k="address">' + esc(d.address) + '</textarea>' +
          '<button class="sidebtn" data-action="noop">' + icon("location") + '</button></div></div>' +
        '<button class="add-dashed mt16" data-action="new-customer">' + icon("plus") + ' Add to new customer</button>' +
      '</div>' +
      '<div class="action-bar"><button class="btn btn-primary" data-action="to-add-items">Next</button></div>' +
    '</div>';
  };

  // ---- Step 2: Add items grid ----
  screens.addItems = function () {
    var tab = state.ui.itemTab || "all";
    var list = CATALOG.slice();
    if (tab === "popular") list = list.filter(function (c) { return c.popular; });
    else if (tab === "recent") {
      var recent = {};
      state.orders.slice().sort(function (a, b) { return b.createdAt - a.createdAt; }).slice(0, 8)
        .forEach(function (o) { o.items.forEach(function (it) { recent[it.type] = true; }); });
      list = list.filter(function (c) { return recent[c.type]; });
    }

    var cards = list.map(function (c) {
      var count = state.draft.items.filter(function (it) { return it.type === c.type; })
        .reduce(function (s, it) { return s + it.qty; }, 0);
      return '<button class="item-card' + (count ? " has-count" : "") + '" data-action="pick-type" data-type="' + c.type + '">' +
        clothPic(c.type, "item-visual") +
        (count ? '<span class="count-badge">' + count + "</span>" : "") +
        '<div class="iname">' + esc(c.label) + "</div></button>";
    }).join("");

    var moreCard = '<button class="item-card more" data-action="pick-type" data-type="shirt"><div class="item-visual">' + icon("plus") + '</div><div class="iname">More Items</div></button>';

    return '<div class="screen">' +
      appBar("Add Items", {}) +
      stepper(1) +
      '<div class="seg-tabs">' +
        ['all', 'popular', 'recent'].map(function (t) {
          return '<button class="' + (tab === t ? "active" : "") + '" data-action="item-tab" data-tab="' + t + '">' +
            (t === "all" ? "All Items" : t.charAt(0).toUpperCase() + t.slice(1)) + "</button>";
        }).join("") +
      '</div>' +
      '<div class="item-grid">' + cards + (tab === "all" ? moreCard : "") + '</div>' +
      (list.length === 0 ? emptyState("👕", "Nothing here yet") : "") +
      '<div class="hint">' + icon("bulb") + '<span><b>Can’t find an item?</b><span>Tap “More Items” to see all available clothing types.</span></span></div>' +
      '<div class="action-bar"><button class="btn btn-primary" data-action="to-summary"' + (state.draft.items.length ? "" : " disabled") + '>Review ' +
        (state.draft.items.length ? "(" + state.draft.items.length + ")" : "") + '</button></div>' +
    '</div>';
  };

  // ---- Configure item (multi-service: one garment can carry Wash + Iron + Wash&Iron) ----
  screens.configureItem = function () {
    var e = state.editor;
    var cat = CATALOG_BY_TYPE[e.type];

    var totalPcs = 0, totalAmt = 0;
    var rows = SERVICE_KEYS.map(function (k) {
      var price = priceFor(e.type, k);
      var qn = e.qty[k] || 0;
      var lineAmt = qn * price;
      totalPcs += qn; totalAmt += lineAmt;
      return '<div class="svc-qty ' + (qn > 0 ? "active" : "") + '">' +
        '<span class="sq-ico">' + SERVICE_ICON[k] + '</span>' +
        '<span class="sq-info"><span class="sq-name">' + SERVICE_LABEL[k] + '</span>' +
        '<span class="sq-price">' + rupee(price) + ' per piece' +
          (qn > 0 ? ' <b>· ' + rupee(lineAmt) + '</b>' : '') + '</span></span>' +
        '<span class="qty-mini">' +
          '<button data-action="qty" data-service="' + k + '" data-d="-1" aria-label="Decrease ' + SERVICE_LABEL[k] + '">−</button>' +
          '<span class="qm-val">' + qn + '</span>' +
          '<button data-action="qty" data-service="' + k + '" data-d="1" aria-label="Increase ' + SERVICE_LABEL[k] + '">+</button>' +
        '</span></div>';
    }).join("");

    return '<div class="screen">' +
      appBar(e.editing ? "Edit Item" : "Add Item", {}) +
      '<div class="config-hero">' +
        clothPic(e.type, "hero-img") +
        '<div class="ct">' + esc(cat.label) + '</div>' +
        '<div class="cd">' + esc(cat.desc) + '</div>' +
      '</div>' +
      '<div class="pad">' +
        '<div class="section-head"><h2>Services &amp; quantity</h2>' +
          '<span class="muted tiny">' + totalPcs + ' piece' + (totalPcs === 1 ? "" : "s") + '</span></div>' +
        '<p class="muted tiny" style="margin:-4px 0 12px">Split the same garment across services — e.g. 3 to wash, 2 to iron.</p>' +
        '<div class="svc-qty-list">' + rows + '</div>' +
        '<div class="field"><label>Special Instructions <span class="muted">(Optional)</span></label>' +
          '<textarea class="textarea" id="instr" maxlength="200" placeholder="e.g. no starch, gentle wash, etc." data-action="editor-instr">' + esc(e.instructions) + '</textarea>' +
          '<div class="char-count"><span id="instrCount">' + e.instructions.length + '</span>/200</div></div>' +
        '<div style="height:96px"></div>' +
      '</div>' +
      '<div class="action-bar"><button class="btn btn-primary" data-action="commit-item"' + (totalPcs ? "" : " disabled") + '>' +
        (e.editing ? "Save Item" : "Add to Order") +
        (totalPcs ? ' · ' + totalPcs + ' pcs · ' + rupee(totalAmt) : '') + '</button></div>' +
    '</div>';
  };

  // group flat line-items (by groupId; legacy items with no groupId stand alone)
  function groupItems(items) {
    var order = [], map = {};
    items.forEach(function (it) {
      var g = it.groupId || it.id;
      if (!map[g]) { map[g] = { groupId: g, type: it.type, instructions: it.instructions || "", lines: [] }; order.push(map[g]); }
      map[g].lines.push(it);
      if (it.instructions && !map[g].instructions) map[g].instructions = it.instructions;
    });
    order.forEach(function (grp) {
      grp.lines.sort(function (a, b) { return SERVICE_IDX[a.service] - SERVICE_IDX[b.service]; });
      grp.qty = grp.lines.reduce(function (s, l) { return s + l.qty; }, 0);
      grp.amount = grp.lines.reduce(function (s, l) { return s + l.qty * l.unitPrice; }, 0);
    });
    return order;
  }

  // ---- Step 3: Order summary ----
  screens.orderSummary = function () {
    var d = state.draft;
    var cust = d.customerId ? customerById(d.customerId) : { name: d.name, phone: d.phone, address: d.address };
    var subtotal = d.items.reduce(function (s, it) { return s + it.qty * it.unitPrice; }, 0);
    var total = Math.max(0, subtotal - (d.discount || 0));

    var rows = groupItems(d.items).map(function (grp) {
      var svcLines = grp.lines.map(function (l) {
        return '<div class="grp-line"><span class="gl-svc">' + SERVICE_LABEL[l.service] + '</span>' +
          '<span class="gl-calc">' + l.qty + ' × ' + rupee(l.unitPrice) + '</span>' +
          '<span class="gl-amt">' + rupee(l.qty * l.unitPrice) + '</span></div>';
      }).join("");
      return '<div class="sum-item grp">' + itemVisual(grp.type) +
        '<div class="grow"><div class="row between">' +
          '<div class="sname">' + esc(CATALOG_BY_TYPE[grp.type].label) +
            ' <span class="muted tiny">· ' + grp.qty + ' pc' + (grp.qty === 1 ? "" : "s") + '</span></div>' +
          '<div class="acts"><button data-action="edit-group" data-g="' + attr(grp.groupId) + '">' + icon("edit") + '</button>' +
          '<button class="del" data-action="delete-group" data-g="' + attr(grp.groupId) + '">' + icon("trash") + '</button></div>' +
        '</div>' +
        '<div class="grp-lines">' + svcLines + '</div>' +
        (grp.instructions ? '<div class="ssvc">“' + esc(grp.instructions) + '”</div>' : "") +
        '<div class="grp-total">Item total <b>' + rupee(grp.amount) + '</b></div>' +
        '</div></div>';
    }).join("");

    return '<div class="screen">' +
      appBar("Order Summary", {}) +
      stepper(2) +
      '<div class="pad stack">' +
        '<div class="card">' +
          '<div class="row between"><div><div class="cname" style="font-size:18px;font-weight:800">' + esc(cust.name) + '</div>' +
          '<div class="cphone">' + esc(cust.phone) + '</div></div><button class="link" data-action="edit-customer">Edit</button></div>' +
          (cust.address ? '<div class="caddr">' + icon("location") + '<span>' + esc(cust.address) + '</span></div>' : "") +
        '</div>' +
        '<div class="section-head" style="margin:6px 0 0"><h2>Items</h2><button class="link" data-action="add-more">+ Add More</button></div>' +
        '<div class="card">' + (rows || emptyState("👕", "No items added")) + '</div>' +
      '</div>' +
      '<div class="totals">' +
        '<div class="line">Subtotal<span class="v">' + rupee(subtotal) + '</span></div>' +
        '<div class="line">Discount<span class="v">- ' + rupee(d.discount || 0) + '</span></div>' +
        '<div class="line grand">Total<span class="v">' + rupee(total) + '</span></div>' +
      '</div>' +
      '<div class="action-bar"><button class="btn btn-primary" data-action="create-order"' + (d.items.length ? "" : " disabled") + '>' +
        (d.editingOrderId ? "Save Order" : "Create Order") + '</button></div>' +
    '</div>';
  };

  // ---- Order created success ----
  screens.orderCreated = function (p) {
    var o = orderById(p.id);
    return '<div class="screen flush"><div class="success">' +
      '<div class="halo"><div class="check">' + icon("check") + '</div></div>' +
      '<h1>Order Created!</h1>' +
      '<div class="oid">Order #' + esc(p.id) + '</div>' +
      '<div class="msg">The bill has been sent to the customer on WhatsApp.</div>' +
      '<div class="btns">' +
        '<button class="btn btn-secondary" data-action="open-invoice" data-id="' + p.id + '">' + icon("doc") + ' View Bill</button>' +
        '<button class="btn btn-primary" data-action="wa-resend" data-id="' + p.id + '">' + icon("whatsapp") + ' Send Again</button>' +
        '<button class="btn btn-outline-green" data-action="add-another">' + icon("plus") + ' Add Another Order</button>' +
      '</div>' +
      '<button class="link underline mt20" data-action="go-home">Go to Home</button>' +
      '<div class="foot"><img class="towels-img" src="assets/branding/hero-towels.png" alt="" ' +
        'onerror="this.replaceWith(Object.assign(document.createElement(&quot;div&quot;),{className:&quot;towels&quot;,textContent:&quot;🧺&quot;}))">' +
        '<div class="caveat">Fresh Clothes.<br>Happier You.<span class="heart">💚</span></div></div>' +
    '</div></div>';
  };

  // ---- Order detail ----
  screens.orderDetail = function (p) {
    var o = orderById(p.id);
    if (!o) return notFound();
    var cust = customerById(o.customerId) || { name: "Customer", phone: "", address: "" };
    var subtotal = calcSubtotal(o), total = calcTotal(o), due = amountDue(o);
    var paid = o.paymentStatus === "paid" || (due === 0 && amountPaid(o) > 0);

    var items = groupItems(o.items).map(function (grp) {
      var multi = grp.lines.length > 1;
      var svcLines = grp.lines.map(function (l) {
        return '<div class="grp-line"><span class="gl-svc">' + SERVICE_LABEL[l.service] + '</span>' +
          '<span class="gl-calc">' + l.qty + ' × ' + rupee(l.unitPrice) + '</span>' +
          '<span class="gl-amt">' + rupee(l.qty * l.unitPrice) + '</span></div>';
      }).join("");
      return '<div class="sum-item grp">' + itemVisual(grp.type) +
        '<div class="grow"><div class="sname">' + esc(CATALOG_BY_TYPE[grp.type].label) +
          (multi ? ' <span class="muted tiny">· ' + grp.qty + ' pcs</span>' : "") + '</div>' +
        '<div class="grp-lines">' + svcLines + '</div>' +
        (grp.instructions ? '<div class="ssvc">“' + esc(grp.instructions) + '”</div>' : "") +
        (multi ? '<div class="grp-total">Item total <b>' + rupee(grp.amount) + '</b></div>' : "") +
        '</div></div>';
    }).join("");

    var advanceBtn = NEXT_ACTION[o.status]
      ? '<button class="btn btn-primary" data-action="advance-status" data-id="' + o.id + '">' + NEXT_ACTION[o.status] + '</button>'
      : '<button class="btn btn-outline-green" data-action="open-delivered" data-id="' + o.id + '">' + icon("star") + ' View delivery / feedback page</button>';

    return '<div class="screen">' +
      appBar("Order #" + o.id, { right: '<button class="iconbtn" data-action="noop">' + icon("more") + "</button>" }) +
      orderTimeline(o) +
      '<div class="pad stack mt16">' +
        '<div class="card contact-card">' +
          '<div class="row between"><div class="grow"><div class="cname">' + esc(cust.name) + '</div>' +
          '<div class="cphone">' + esc(cust.phone) + '</div></div>' +
          '<div class="contact-actions"><button class="cta" data-action="call-customer" data-phone="' + attr(cust.phone) + '">' + icon("phone") + '</button>' +
          '<button class="cta" data-action="wa-order" data-id="' + o.id + '">' + icon("whatsapp") + '</button></div></div>' +
          (cust.address ? '<div class="caddr">' + icon("location") + '<span>' + esc(cust.address) + '</span></div>' : "") +
        '</div>' +
        '<div class="section-head" style="margin:2px 0 0"><h2>Items</h2></div>' +
        '<div class="card">' + items + '</div>' +
      '</div>' +
      '<div class="totals">' +
        '<div class="line">Subtotal<span class="v">' + rupee(subtotal) + '</span></div>' +
        (o.discount ? '<div class="line">Discount<span class="v">- ' + rupee(o.discount) + '</span></div>' : "") +
        '<div class="line grand">Total<span class="v">' + rupee(total) + '</span></div>' +
      '</div>' +
      '<div class="pending-pay-block"><span class="lbl">Payment Status</span>' + payChip(o) +
        (paid ? "" : '<button class="btn btn-primary btn-sm" style="width:auto;padding:0 20px;margin-left:auto" data-action="open-payment" data-id="' + o.id + '">Mark as Paid</button>') +
      '</div>' +
      '<div class="pad stack mt16">' +
        advanceBtn +
        '<div class="btn-row"><button class="btn btn-secondary" data-action="edit-order" data-id="' + o.id + '">' + icon("edit") + ' Edit Order</button>' +
        '<button class="btn btn-secondary" data-action="open-invoice" data-id="' + o.id + '">' + icon("share") + ' Share Bill</button></div>' +
      '</div>' +
    '</div>';
  };

  // ---- Invoice ----
  screens.invoice = function (p) {
    var o = orderById(p.id);
    if (!o) return notFound();
    var cust = customerById(o.customerId) || { name: "Customer", phone: "", address: "" };
    var s = state.settings;
    var subtotal = calcSubtotal(o), total = calcTotal(o);
    var paid = o.paymentStatus === "paid" || amountDue(o) === 0 && amountPaid(o) > 0;

    var items = o.items.map(function (it) {
      return '<div class="inv-item"><span>' + esc(CATALOG_BY_TYPE[it.type].label) + ' × ' + it.qty +
        ' <span class="d">(' + SERVICE_LABEL[it.service] + ' @ ' + rupee(it.unitPrice) + ')</span></span>' +
        '<span>' + rupee(it.qty * it.unitPrice) + '</span></div>';
    }).join("");

    return '<div class="screen">' +
      appBar("Invoice #" + o.id, {}) +
      '<div class="invoice">' +
        '<div class="inv-top"><div class="row" style="gap:12px"><div class="logo"><img src="assets/branding/logo.png" alt="" onerror="this.parentNode.textContent=&quot;FP&quot;"></div>' +
          '<div class="shop">' + esc(s.shopName) + '<small>' + esc(s.tagline) + '</small></div></div>' +
          '<div style="text-align:right" class="tiny muted">Invoice #' + o.id + '<br>' + fmtDate(o.createdAt) + '</div></div>' +
        '<h3>Billed to</h3>' +
        '<div class="tiny muted">' + esc(cust.name) + '<br>' + esc(cust.phone) + '<br>' + esc(cust.address || "") + '</div>' +
        '<h3>Services</h3>' +
        '<div class="inv-items">' + items + '</div>' +
        '<div class="kv" style="margin-top:10px"><span>Subtotal</span><span>' + rupee(subtotal) + '</span></div>' +
        '<div class="kv"><span>Discount</span><span>- ' + rupee(o.discount || 0) + '</span></div>' +
        '<div class="kv" style="color:var(--ink);font-weight:800;font-size:16px;border-top:1px solid var(--border);padding-top:10px;margin-top:6px"><span>Total</span><span>' + rupee(total) + '</span></div>' +
        '<div class="kv" style="margin-top:8px"><span>Payment status</span><span>' + (paid ? "Paid" : "Pending · " + rupee(amountDue(o)) + " due") + '</span></div>' +
      '</div>' +
      '<div class="pad stack mt20">' +
        '<button class="btn btn-primary" data-action="print-invoice">' + icon("doc") + ' Download PDF</button>' +
        '<button class="btn btn-secondary" data-action="wa-order" data-id="' + o.id + '">' + icon("share") + ' Share Bill on WhatsApp</button>' +
      '</div>' +
    '</div>';
  };

  // ---- Delivered / customer-facing feedback entry ----
  screens.delivered = function (p) {
    var o = orderById(p.id);
    var s = state.settings;
    return '<div class="screen flush">' +
      '<div class="cust-hero"><img class="hero-photo" src="assets/branding/hero-towels.png" alt="" ' +
        'onerror="this.replaceWith(Object.assign(document.createElement(&quot;div&quot;),{className:&quot;em&quot;,textContent:&quot;🧺✨&quot;}))">' +
        '<h1>Your order has been delivered! 🎉</h1>' +
        '<p>Thank you for trusting us with your clothes.<br>We’d love to know how we did.</p>' +
      '</div>' +
      '<div class="pad stack mt20">' +
        '<button class="btn btn-primary" data-action="give-feedback" data-id="' + p.id + '">' + icon("star") + ' Give Feedback</button>' +
        '<div class="follow-label">FOLLOW US</div>' +
        '<div class="social-row">' +
          '<a data-action="noop">📷</a><a data-action="noop">👥</a><a data-action="noop">🔍</a><a data-action="noop">▶️</a>' +
        '</div>' +
        '<p class="center caveat" style="font-size:24px">Fresh Clothes. Happier You. 💚</p>' +
      '</div>' +
      (o && !o._backHint ? "" : "") +
    '</div>';
  };

  // ---- Feedback form ----
  screens.feedbackForm = function (p) {
    var existing = state.feedback.filter(function (f) { return f.orderId === p.id; })[0];
    if (state.ui.feedbackDone) {
      return '<div class="screen flush"><div class="cust-hero" style="min-height:60vh;display:flex;flex-direction:column;justify-content:center">' +
        '<div class="em">💚</div><h1>Thank you!</h1><p>Your feedback means a lot to us.</p>' +
        '<div class="pad mt20"><button class="btn btn-primary" data-action="go-home">Back to Home</button></div>' +
      '</div></div>';
    }
    var rating = state.ui.feedbackRating || (existing ? existing.rating : 0);
    var stars = "";
    for (var i = 1; i <= 5; i++) stars += '<button class="' + (i <= rating ? "on" : "") + '" data-action="set-star" data-n="' + i + '">★</button>';

    return '<div class="screen">' +
      appBar("Feedback", {}) +
      '<div class="pad stack">' +
        '<h2 class="center" style="font-size:20px;margin-top:10px">How was your experience?</h2>' +
        '<div class="stars">' + stars + '</div>' +
        '<div class="field"><label>Tell us more</label>' +
          '<textarea class="textarea" id="fbText" placeholder="What did you like? What can we improve?" data-action="fb-text">' + esc(state.ui.feedbackText || "") + '</textarea></div>' +
      '</div>' +
      '<div class="action-bar"><button class="btn btn-primary" data-action="submit-feedback" data-id="' + p.id + '"' + (rating ? "" : " disabled") + '>Submit Feedback</button></div>' +
    '</div>';
  };

  // ---- Pricing ----
  screens.pricing = function () {
    if (!state.pricingDraft) state.pricingDraft = JSON.parse(JSON.stringify(state.pricing));
    var pd = state.pricingDraft;
    var rows = CATALOG.map(function (c) {
      var r = pd[c.type];
      return '<tr><td>' + esc(c.label) + '</td>' +
        SERVICE_KEYS.map(function (k, idx) {
          return '<td><input type="number" min="0" value="' + r[idx] + '" data-action="price-edit" data-type="' + c.type + '" data-idx="' + idx + '"></td>';
        }).join("") + '</tr>';
    }).join("");
    return '<div class="screen">' +
      appBar("Pricing", {}) +
      '<div class="pad"><p class="muted tiny">Prices apply to <b>new</b> orders. Existing orders keep their original rate.</p>' +
        '<div style="overflow-x:auto" class="mt12"><table class="price-table"><thead><tr><th>Item</th><th>Wash</th><th>Iron</th><th>Wash+Iron</th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table></div>' +
      '</div>' +
      '<div class="action-bar"><button class="btn btn-primary" data-action="save-pricing">Save Prices</button></div>' +
    '</div>';
  };

  // ---- WhatsApp templates ----
  screens.templates = function () {
    var tpls = [
      ["Order Created", waMessage(null, "created", true)],
      ["Payment Confirmation", waMessage(null, "payment", true)],
      ["Ready", waMessage(null, "ready", true)],
      ["Out for Delivery", waMessage(null, "out_for_delivery", true)],
      ["Delivered / Feedback", waMessage(null, "delivered", true)]
    ];
    return '<div class="screen">' +
      appBar("WhatsApp Templates", {}) +
      '<div class="pad stack">' + tpls.map(function (t) {
        return '<div class="card"><div class="mi-t" style="margin-bottom:8px">' + t[0] + '</div>' +
          '<div class="wa-bubble">' + esc(t[1]) + '</div></div>';
      }).join("") +
      '<p class="tiny muted center">Demo only — the production app connects these to the WhatsApp Business API.</p>' +
      '</div></div>';
  };

  // ---- Reports ----
  screens.reports = function () {
    var revenue = state.orders.reduce(function (s, o) { return s + amountPaid(o); }, 0);
    var pending = state.orders.reduce(function (s, o) { return s + amountDue(o); }, 0);
    var byStatus = { pickup: 0, processing: 0, ready: 0, out_for_delivery: 0, delivered: 0 };
    state.orders.forEach(function (o) { byStatus[o.status]++; });
    var max = Math.max.apply(null, Object.keys(byStatus).map(function (k) { return byStatus[k]; })) || 1;

    var bars = Object.keys(byStatus).map(function (k) {
      return '<div class="bar-row"><span class="bl">' + STATUS_LABEL[k] + '</span>' +
        '<span class="bar-track"><span class="bar-fill" style="width:' + (byStatus[k] / max * 100) + '%"></span></span>' +
        '<span class="bv">' + byStatus[k] + '</span></div>';
    }).join("");

    return '<div class="screen">' +
      appBar("Reports", {}) +
      '<div class="pad">' +
        '<div class="report-grid">' +
          '<div class="stat"><div class="num">' + state.orders.length + '</div><div class="lbl">Total orders</div></div>' +
          '<div class="stat"><div class="num">' + state.customers.length + '</div><div class="lbl">Customers</div></div>' +
          '<div class="stat"><div class="num">' + rupee(revenue) + '</div><div class="lbl">Revenue collected</div></div>' +
          '<div class="stat"><div class="num">' + rupee(pending) + '</div><div class="lbl">Payment pending</div></div>' +
        '</div>' +
        '<div class="section-head"><h2>Orders by status</h2></div>' +
        '<div class="card">' + bars + '</div>' +
      '</div></div>';
  };

  // ---- Staff ----
  screens.staff = function () {
    var team = [
      ["Ravi Kumar", "Field staff · Pickups & delivery"],
      ["Meena Joshi", "Counter · Billing & payments"],
      ["Sunil Rao", "Processing · Wash & iron"]
    ];
    return '<div class="screen">' + appBar("Staff", {}) +
      '<div class="pad"><div class="menu-list">' + team.map(function (t) {
        return '<button data-action="noop"><span class="mi-ico">' + esc(initials(t[0])) + '</span>' +
          '<span><span class="mi-t">' + t[0] + '</span><span class="mi-d">' + t[1] + '</span></span></button>';
      }).join("") + '</div></div></div>';
  };

  // ---- Settings ----
  screens.settings = function () {
    if (!state.settingsDraft) state.settingsDraft = JSON.parse(JSON.stringify(state.settings));
    var d = state.settingsDraft;
    var f = function (label, k, val) {
      return '<div class="field"><label>' + label + '</label>' +
        '<input class="input input-h" value="' + attr(val) + '" data-action="settings-edit" data-k="' + k + '"></div>';
    };
    return '<div class="screen">' + appBar("Settings", {}) +
      '<div class="pad">' +
        f("Business name", "shopName", d.shopName) +
        f("Tagline", "tagline", d.tagline) +
        f("Staff name (dashboard greeting)", "staffName", d.staffName) +
        f("Shop address", "address", d.address) +
        f("Shop phone", "phone", d.phone) +
        f("Instagram", "instagram", d.social.instagram) +
        f("Facebook", "facebook", d.social.facebook) +
      '</div>' +
      '<div class="pad stack mt16">' +
        '<button class="btn btn-primary" data-action="save-settings">Save Settings</button>' +
        '<button class="btn btn-secondary" style="color:var(--red)" data-action="reset-demo">Reset Demo Data</button>' +
      '</div></div>';
  };

  function notFound() {
    return '<div class="screen">' + appBar("Not found", {}) + emptyState("🤷", "That record no longer exists.") + "</div>";
  }

  /* ---------------------------------------------------------
     Formatting helpers
  --------------------------------------------------------- */
  function fmtTime(ts) {
    var d = new Date(ts);
    var h = d.getHours(), m = d.getMinutes();
    var ap = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return h + ":" + (m < 10 ? "0" + m : m) + " " + ap;
  }
  function fmtDate(ts) {
    var d = new Date(ts);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }
  function initials(name) {
    return name.split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join("");
  }

  /* ---------------------------------------------------------
     WhatsApp simulation
  --------------------------------------------------------- */
  function waMessage(order, kind, asTemplate) {
    var s = state.settings;
    var name = asTemplate ? "{{customer_name}}" : (customerById(order.customerId) || {}).name || "there";
    var num = asTemplate ? "{{order_number}}" : "#" + order.id;
    var shop = s.shopName;
    if (kind === "created") {
      var lines = asTemplate ? "{{items}}" : order.items.map(function (it) {
        return CATALOG_BY_TYPE[it.type].label + " × " + it.qty + " — " + SERVICE_LABEL[it.service];
      }).join("\n");
      var total = asTemplate ? "{{total}}" : String(calcTotal(order));
      return "Hi " + name + " 👋\n\nYour laundry order " + num + " has been received.\n\n" + lines +
        "\n\nTotal: ₹" + total + "\n\nThank you for choosing " + shop + ".";
    }
    if (kind === "payment") {
      var amt = asTemplate ? "{{amount}}" : String(amountPaid(order));
      return "Hi " + name + ",\n\nWe received your payment of ₹" + amt + " for order " + num + ".\n\nThank you.";
    }
    if (kind === "ready") {
      return "Hi " + name + ",\n\nYour laundry order " + num + " is ready.\n\nWe look forward to returning your freshly cleaned clothes.";
    }
    if (kind === "out_for_delivery") {
      return "Hi " + name + ",\n\nYour order " + num + " is out for delivery.";
    }
    if (kind === "delivered") {
      return "🎉 Your order " + num + " has been delivered!\n\nThank you for trusting us with your clothes.\nWe’d love to know how we did.\n\n⭐ Share your feedback\n\nFollow us: Instagram · Facebook · Google · YouTube";
    }
    return "";
  }

  function simulateWhatsApp(order, kind) {
    state.ui.lastWa = { text: waMessage(order, kind), id: order.id };
    toast("WhatsApp message sent ✓", { preview: true });
  }

  /* ---------------------------------------------------------
     Toast / sheet / modal
  --------------------------------------------------------- */
  function toast(msg, opts) {
    opts = opts || {};
    var root = document.getElementById("toastRoot");
    var el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = '<span class="tk">' + icon("check") + "</span><span>" + esc(msg) + "</span>" +
      (opts.preview ? ' <button class="link" style="color:#8FE9BE;margin-left:6px" data-action="wa-preview-last">Preview</button>' : "");
    root.appendChild(el);
    setTimeout(function () {
      el.classList.add("out");
      setTimeout(function () { el.remove(); }, 220);
    }, opts.preview ? 3600 : 2400);
  }

  function openSheet(html) {
    var root = document.getElementById("sheetRoot");
    root.innerHTML = '<div class="scrim" data-action="close-sheet"></div><div class="sheet" role="dialog" aria-modal="true">' + html + "</div>";
    requestAnimationFrame(function () {
      root.querySelector(".scrim").classList.add("show");
      root.querySelector(".sheet").classList.add("show");
    });
  }
  function closeSheet() {
    var root = document.getElementById("sheetRoot");
    var scrim = root.querySelector(".scrim"), sheet = root.querySelector(".sheet");
    if (!scrim) return;
    scrim.classList.remove("show");
    sheet.classList.remove("show");
    setTimeout(function () { root.innerHTML = ""; }, 260);
  }

  function openModal(html) {
    var root = document.getElementById("modalRoot");
    root.innerHTML = '<div class="scrim" data-action="close-modal"></div><div class="modal" role="dialog" aria-modal="true">' + html + "</div>";
    requestAnimationFrame(function () {
      root.querySelector(".scrim").classList.add("show");
      root.querySelector(".modal").classList.add("show");
    });
  }
  function closeModal() {
    var root = document.getElementById("modalRoot");
    var scrim = root.querySelector(".scrim");
    if (!scrim) return;
    scrim.classList.remove("show");
    root.querySelector(".modal").classList.remove("show");
    setTimeout(function () { root.innerHTML = ""; }, 200);
  }

  function whatsAppPreviewModal(text) {
    openModal(
      '<div class="m-head"><span class="wa-ico">' + icon("whatsapp") + '</span><h3>WhatsApp preview</h3>' +
      '<button class="iconbtn" style="margin-left:auto" data-action="close-modal">' + icon("x") + '</button></div>' +
      '<div class="wa-bubble">' + esc(text) + '</div>' +
      '<div class="wa-meta">Simulated — not actually sent</div>'
    );
  }

  function paymentSheet(orderId) {
    var o = orderById(orderId);
    var due = amountDue(o);
    state.pay = { amount: due, method: "cash", note: "" };
    renderPaymentSheet(o);
  }
  function renderPaymentSheet(o) {
    var pay = state.pay;
    var due = amountDue(o);
    var methods = METHODS.map(function (m) {
      return '<button class="method ' + (pay.method === m.k ? "sel" : "") + '" data-action="pay-method" data-m="' + m.k + '">' +
        '<span class="tick">' + icon("check") + '</span>' +
        '<div class="mi">' + m.i + '</div><div class="mn">' + m.n + '</div></button>';
    }).join("");
    openSheet(
      '<div class="grabber"></div>' +
      '<div class="sh-head"><div><h2>Record Payment</h2><div class="sub">Order #' + o.id + '</div></div>' +
        '<button class="iconbtn" data-action="close-sheet">' + icon("x") + '</button></div>' +
      '<div class="pay-top"><div><div class="lbl">Total Amount</div><div class="amt">' + rupee(calcTotal(o)) + '</div></div>' +
        '<div class="due-chip' + (due === 0 ? " ok" : "") + '">' + icon(due === 0 ? "check" : "clock") +
        ' ' + (due === 0 ? "Paid" : "Pending") + '<small>' + (due === 0 ? "Fully paid" : rupee(due) + " due") + '</small></div></div>' +
      '<div class="field"><label>Payment Amount</label>' +
        '<div class="amount-input"><span class="cur">₹</span>' +
        '<input id="payAmt" type="number" min="0" value="' + pay.amount + '" data-action="pay-amount">' +
        '<button class="clr" data-action="pay-clear">' + icon("x") + '</button></div></div>' +
      '<div class="field"><label>Payment Method</label><div class="method-grid">' + methods + '</div></div>' +
      '<div class="field"><label>Notes <span class="muted">(Optional)</span></label>' +
        '<textarea class="textarea" id="payNote" maxlength="200" placeholder="e.g. received cash, UPI reference, etc." data-action="pay-note">' + esc(pay.note) + '</textarea>' +
        '<div class="char-count">' + pay.note.length + '/200</div></div>' +
      '<button class="btn btn-primary mt8" data-action="confirm-payment" data-id="' + o.id + '">Confirm Payment</button>'
    );
  }

  /* ---------------------------------------------------------
     Render
  --------------------------------------------------------- */
  function render() {
    var app = document.getElementById("app");
    var r = state.ui.route;
    var fn = screens[r.name] || screens.home;
    app.innerHTML = fn(r.params);
    bottomNav();

    if (state.ui.focusId) {
      var elx = document.getElementById(state.ui.focusId);
      if (elx) {
        elx.focus();
        try { var v = elx.value; elx.value = ""; elx.value = v; } catch (e) {}
      }
      state.ui.focusId = null;
    }
  }

  /* ---------------------------------------------------------
     Events
  --------------------------------------------------------- */
  function actionEl(e) {
    var t = e.target;
    while (t && t !== document) {
      if (t.getAttribute && t.getAttribute("data-action")) return t;
      t = t.parentNode;
    }
    return null;
  }

  document.addEventListener("click", function (e) {
    var el = actionEl(e);
    if (!el) return;
    var a = el.getAttribute("data-action");
    var id = el.getAttribute("data-id");

    switch (a) {
      case "noop": case "noop-menu": return;
      case "back": return back();

      case "nav": {
        var tab = el.getAttribute("data-tab");
        state.ui.history = [];
        navigate(tab, {}, { replace: true });
        return;
      }
      case "more-open": return navigate(el.getAttribute("data-screen"), {});
      case "order-filter": { state.ui.orderFilter = el.getAttribute("data-filter"); render(); return; }

      case "new-order": {
        state.draft = emptyDraft();
        navigate("newOrder", {});
        return;
      }
      case "open-order": return navigate("orderDetail", { id: id });
      case "open-customer": return navigate("customerDetail", { id: id });

      /* ---- step 1 ---- */
      case "pick-customer": {
        var c = customerById(el.getAttribute("data-id"));
        state.draft.customerId = c.id;
        state.draft.name = c.name; state.draft.phone = c.phone; state.draft.address = c.address;
        state.draft.newCustomer = null;
        render();
        return;
      }
      case "new-customer": {
        state.draft.customerId = null;
        state.draft.newCustomer = true;
        state.draft.name = ""; state.draft.phone = ""; state.draft.address = ""; state.draft.search = "";
        render();
        return;
      }
      case "to-add-items": {
        var d = state.draft;
        if (!d.name.trim() || !d.phone.trim()) { toast("Enter customer name and phone"); return; }
        if (!d.customerId) {
          var nc = { id: uid("cust"), name: d.name.trim(), phone: d.phone.trim(), address: d.address.trim(), createdAt: Date.now() };
          state.customers.push(nc);
          d.customerId = nc.id;
          persist();
        } else {
          // allow inline edits to persist to the existing customer
          var ex = customerById(d.customerId);
          if (ex) { ex.name = d.name.trim(); ex.phone = d.phone.trim(); ex.address = d.address.trim(); persist(); }
        }
        navigate("addItems", {});
        return;
      }

      /* ---- step 2 ---- */
      case "item-tab": { state.ui.itemTab = el.getAttribute("data-tab"); render(); return; }
      case "pick-type": {
        state.editor = {
          type: el.getAttribute("data-type"),
          groupId: uid("grp"),
          qty: { wash: 0, iron: 0, washiron: 0 },
          instructions: "",
          editing: false
        };
        navigate("configureItem", {});
        return;
      }
      case "to-summary": {
        if (!state.draft.items.length) { toast("Add at least one item"); return; }
        navigate("orderSummary", {});
        return;
      }

      /* ---- configure (multi-service) ---- */
      case "qty": {
        var svc = el.getAttribute("data-service");
        var delta = parseInt(el.getAttribute("data-d"), 10);
        state.editor.qty[svc] = Math.max(0, (state.editor.qty[svc] || 0) + delta);
        render();
        return;
      }
      case "commit-item": {
        var ed = state.editor;
        var services = SERVICE_KEYS.filter(function (k) { return (ed.qty[k] || 0) > 0; });
        if (!services.length) { toast("Add at least one piece"); return; }
        var notes = (ed.instructions || "").trim();
        // replace any existing lines for this group
        state.draft.items = state.draft.items.filter(function (it) { return (it.groupId || it.id) !== ed.groupId; });
        services.forEach(function (k) {
          state.draft.items.push({
            id: uid("it"),
            groupId: ed.groupId,
            type: ed.type,
            qty: ed.qty[k],
            service: k,
            unitPrice: priceFor(ed.type, k),
            instructions: notes
          });
        });
        state.editor = null;
        var backToReview = ed.editing || state.draft.editingOrderId;
        navigate(backToReview ? "orderSummary" : "addItems", {});
        if (!backToReview) toast(CATALOG_BY_TYPE[ed.type].label + " added");
        return;
      }

      /* ---- summary (group-level edit / delete) ---- */
      case "edit-group": {
        var gid = el.getAttribute("data-g");
        var groupLines = state.draft.items.filter(function (it) { return (it.groupId || it.id) === gid; });
        if (!groupLines.length) return;
        var q = { wash: 0, iron: 0, washiron: 0 };
        groupLines.forEach(function (l) { q[l.service] = l.qty; });
        state.editor = {
          type: groupLines[0].type,
          groupId: gid,
          qty: q,
          instructions: groupLines[0].instructions || "",
          editing: true
        };
        navigate("configureItem", {});
        return;
      }
      case "delete-group": {
        var dg = el.getAttribute("data-g");
        state.draft.items = state.draft.items.filter(function (it) { return (it.groupId || it.id) !== dg; });
        render();
        return;
      }
      case "add-more": return navigate("addItems", {});
      case "edit-customer": return navigate("newOrder", {});

      case "create-order": {
        var dr = state.draft;
        if (!dr.items.length) { toast("Add at least one item"); return; }
        if (dr.editingOrderId) {
          var eo = orderById(dr.editingOrderId);
          eo.items = dr.items.map(function (it) { return Object.assign({}, it); });
          eo.discount = dr.discount || 0;
          persist();
          var savedId = eo.id;
          state.draft = emptyDraft();
          state.ui.history = [];
          navigate("orderDetail", { id: savedId }, { replace: true });
          toast("Order updated");
          return;
        }
        if (!state.seq || state.seq < 1029) state.seq = 1029;
        var newId = String(state.seq++);
        while (orderById(newId)) newId = String(state.seq++);
        var order = {
          id: newId,
          customerId: dr.customerId,
          items: dr.items.map(function (it) { return Object.assign({}, it); }),
          discount: dr.discount || 0,
          status: "pickup",
          paymentStatus: "pending",
          payments: [],
          createdAt: Date.now(),
          isToday: true,
          history: [{ status: "pickup", at: Date.now() }]
        };
        state.orders.push(order);
        persist();
        state.draft = emptyDraft();
        state.ui.history = [{ name: "home", params: {} }];
        navigate("orderCreated", { id: newId });
        simulateWhatsApp(order, "created");
        return;
      }

      /* ---- order created ---- */
      case "open-invoice": return navigate("invoice", { id: id });
      case "wa-resend": { simulateWhatsApp(orderById(id), "created"); return; }
      case "add-another": {
        state.draft = emptyDraft();
        state.ui.history = [{ name: "home", params: {} }];
        navigate("newOrder", {}, { replace: true });
        return;
      }
      case "go-home": {
        state.ui.history = [];
        navigate("home", {}, { replace: true });
        return;
      }

      /* ---- order detail ---- */
      case "advance-status": {
        var o = orderById(id);
        var idx = FLOW.indexOf(o.status);
        if (idx < FLOW.length - 1) {
          o.status = FLOW[idx + 1];
          o.history.push({ status: o.status, at: Date.now() });
          if (o.status === "delivered") o.isToday = true;
          persist();
          render();
          if (o.status === "ready") simulateWhatsApp(o, "ready");
          else if (o.status === "out_for_delivery") simulateWhatsApp(o, "out_for_delivery");
          else if (o.status === "delivered") simulateWhatsApp(o, "delivered");
          else toast("Status → " + STATUS_LABEL[o.status]);
        }
        return;
      }
      case "open-payment": return paymentSheet(id);
      case "edit-order": {
        var oe = orderById(id);
        state.draft = emptyDraft();
        state.draft.editingOrderId = oe.id;
        state.draft.customerId = oe.customerId;
        var cc = customerById(oe.customerId) || {};
        state.draft.name = cc.name || ""; state.draft.phone = cc.phone || ""; state.draft.address = cc.address || "";
        state.draft.items = oe.items.map(function (it) { return Object.assign({}, it); });
        state.draft.discount = oe.discount || 0;
        navigate("orderSummary", {});
        return;
      }
      case "open-delivered": return navigate("delivered", { id: id });
      case "call-customer": { toast("Calling " + (el.getAttribute("data-phone") || "customer") + " …"); return; }
      case "wa-open": { whatsAppPreviewModal("Hi 👋  This is a WhatsApp chat with " + (el.getAttribute("data-phone") || "the customer") + "."); return; }
      case "wa-order": {
        var wo = orderById(id);
        var kind = wo.status === "delivered" ? "delivered" : wo.status === "ready" ? "ready" : "created";
        whatsAppPreviewModal(waMessage(wo, kind));
        return;
      }
      case "wa-preview-last": {
        if (state.ui.lastWa) whatsAppPreviewModal(state.ui.lastWa.text);
        return;
      }
      case "print-invoice": { window.print(); return; }

      /* ---- feedback ---- */
      case "give-feedback": {
        state.ui.feedbackRating = 0; state.ui.feedbackText = ""; state.ui.feedbackDone = false;
        navigate("feedbackForm", { id: id });
        return;
      }
      case "set-star": {
        state.ui.feedbackRating = parseInt(el.getAttribute("data-n"), 10);
        render();
        return;
      }
      case "submit-feedback": {
        if (!state.ui.feedbackRating) { toast("Pick a star rating"); return; }
        state.feedback.push({
          orderId: id, rating: state.ui.feedbackRating,
          text: (state.ui.feedbackText || "").trim(), at: Date.now()
        });
        var fo = orderById(id);
        if (fo) fo.feedback = { rating: state.ui.feedbackRating, text: (state.ui.feedbackText || "").trim() };
        persist();
        state.ui.feedbackDone = true;
        render();
        return;
      }

      /* ---- sheet / modal ---- */
      case "close-sheet": return closeSheet();
      case "close-modal": return closeModal();
      case "pay-method": {
        state.pay.method = el.getAttribute("data-m");
        var mg = document.querySelectorAll("#sheetRoot .method");
        mg.forEach(function (n) { n.classList.remove("sel"); });
        el.classList.add("sel");
        return;
      }
      case "pay-clear": {
        state.pay.amount = 0;
        var pa = document.getElementById("payAmt");
        if (pa) pa.value = "0";
        return;
      }
      case "confirm-payment": {
        var po = orderById(id);
        var amt = Math.max(0, Number(state.pay.amount) || 0);
        if (amt <= 0) { toast("Enter an amount"); return; }
        po.payments.push({ amount: amt, method: state.pay.method, note: (state.pay.note || "").trim(), at: Date.now() });
        if (amountDue(po) === 0) po.paymentStatus = "paid";
        else po.paymentStatus = "partial";
        persist();
        closeSheet();
        render();
        toast("Payment Recorded Successfully");
        setTimeout(function () { simulateWhatsApp(po, "payment"); }, 400);
        return;
      }

      /* ---- pricing / settings ---- */
      case "save-pricing": {
        state.pricing = JSON.parse(JSON.stringify(state.pricingDraft));
        persist();
        toast("Prices saved");
        return;
      }
      case "save-settings": {
        var sd = state.settingsDraft;
        state.settings = {
          shopName: sd.shopName, tagline: sd.tagline, staffName: sd.staffName,
          address: sd.address, phone: sd.phone,
          social: sd.social
        };
        persist();
        toast("Settings saved");
        return;
      }
      case "reset-demo": {
        try { localStorage.removeItem(LS_KEY); } catch (e) {}
        state = seed();
        persist();
        state.ui = { tab: "home", route: { name: "home", params: {} }, history: [], focusId: null };
        state.draft = emptyDraft();
        state.editor = null; state.pay = null; state.pricingDraft = null; state.settingsDraft = null;
        render();
        toast("Demo data reset");
        return;
      }
    }
  });

  document.addEventListener("input", function (e) {
    var el = e.target;
    var a = el.getAttribute && el.getAttribute("data-action");
    if (!a) return;

    switch (a) {
      case "order-search": state.ui.orderSearch = el.value; state.ui.focusId = "orderSearch"; render(); return;
      case "cust-search": state.ui.custSearch = el.value; state.ui.focusId = "custSearch"; render(); return;
      case "cust-query": state.draft.search = el.value; state.ui.focusId = "custQuery"; render(); return;

      case "draft-field": {
        state.draft[el.getAttribute("data-k")] = el.value;
        return; // no re-render, keep typing smooth
      }
      case "editor-instr": {
        state.editor.instructions = el.value;
        var cc = document.getElementById("instrCount");
        if (cc) cc.textContent = el.value.length;
        return;
      }
      case "fb-text": state.ui.feedbackText = el.value; return;

      case "pay-amount": state.pay.amount = el.value; return;
      case "pay-note": state.pay.note = el.value; return;

      case "price-edit": {
        var type = el.getAttribute("data-type");
        var idx = parseInt(el.getAttribute("data-idx"), 10);
        state.pricingDraft[type][idx] = Math.max(0, parseInt(el.value, 10) || 0);
        return;
      }
      case "settings-edit": {
        var k = el.getAttribute("data-k");
        if (k === "instagram" || k === "facebook" || k === "google" || k === "youtube") state.settingsDraft.social[k] = el.value;
        else state.settingsDraft[k] = el.value;
        return;
      }
    }
  });

  /* ---------------------------------------------------------
     Boot
  --------------------------------------------------------- */
  load();
  render();

  // expose a tiny debug hook
  window.__freshpress = { state: function () { return state; }, reset: function () {
    try { localStorage.removeItem(LS_KEY); } catch (e) {}
    location.reload();
  } };
})();
