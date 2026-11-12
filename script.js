(function () {
  "use strict";

  var DATA = window.GST_DATA || [];
  var NOT_VERIFIED = "Could not be verified (check the official source)";

  var form = document.getElementById("search-form");
  var input = document.getElementById("search-input");
  var results = document.getElementById("results");
  var clearBtn = document.getElementById("clear-btn");
  var resetBtn = document.getElementById("reset-btn");
  var list = document.getElementById("suggestions");
  var year = document.getElementById("year");
  if (year) { year.textContent = new Date().getFullYear(); }

  DATA.forEach(function (p) {
    var o = document.createElement("option");
    o.value = p.name;
    list.appendChild(o);
  });

  function norm(s) {
    return String(s || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) { e.className = cls; }
    if (text !== undefined && text !== null) { e.textContent = text; }
    return e;
  }

  function fmt(n) {
    return (Math.round(n * 100) / 100) + "%";
  }

  function find(q) {
    var n = norm(q);
    if (!n) { return []; }
    return DATA.filter(function (p) {
      return [p.name].concat(p.aliases || []).some(function (x) {
        return norm(x).indexOf(n) !== -1;
      });
    });
  }

  function addRow(card, key, value, bad) {
    var row = el("div", "row");
    row.appendChild(el("span", "k", key));
    row.appendChild(el("span", bad ? "v unverified" : "v", value));
    card.appendChild(row);
    return row;
  }

  function render(p) {
    var ok = p.verified === true;
    var hasRate = ok && typeof p.gst_rate === "number";
    var card = el("article", "card");
    card.appendChild(el("h2", null, p.name));

    var status = el("div", "row");
    status.appendChild(el("span", "k", "Verification status"));
    var badge = el("span", ok ? "badge badge-ok" : "badge badge-warn", ok ? "Verified" : "Not verified yet");
    var sv = el("span", "v");
    sv.appendChild(badge);
    status.appendChild(sv);
    card.appendChild(status);

    addRow(card, "Product Name", p.name);
    addRow(card, "Product Category", p.category || NOT_VERIFIED, !p.category);
    addRow(card, "GST Rate", hasRate ? fmt(p.gst_rate) : NOT_VERIFIED, !hasRate);
    addRow(card, "GST Applicability", ok && p.applicable ? p.applicable : NOT_VERIFIED, !(ok && p.applicable));
    addRow(card, "HSN Code", ok && p.hsn ? p.hsn : NOT_VERIFIED, !(ok && p.hsn));
    addRow(card, "CGST Rate", hasRate ? fmt(p.gst_rate / 2) : NOT_VERIFIED, !hasRate);
    addRow(card, "SGST Rate", hasRate ? fmt(p.gst_rate / 2) : NOT_VERIFIED, !hasRate);
    addRow(card, "IGST Rate", hasRate ? fmt(p.gst_rate) : NOT_VERIFIED, !hasRate);

    var src = el("div", "row");
    src.appendChild(el("span", "k", "Official Source"));
    var sv2 = el("span", "v");
    if (p.source_url) {
      var a = el("a", null, p.source_label || p.source_url);
      a.href = p.source_url;
      a.target = "_blank";
      a.rel = "noopener";
      sv2.appendChild(a);
    } else {
      sv2.textContent = NOT_VERIFIED;
    }
    src.appendChild(sv2);
    card.appendChild(src);

    if (p.notification) { addRow(card, "Notification", p.notification); }
    if (p.last_verified) { addRow(card, "Last verified on", p.last_verified); }
    return card;
  }

  function showMessage(text, cls) {
    results.innerHTML = "";
    results.appendChild(el("div", "msg " + cls, text));
  }

  function search() {
    var q = input.value;
    if (!norm(q)) {
      showMessage("Please enter a product name to search.", "msg-info");
      return;
    }
    var found = find(q);
    if (found.length === 0) {
      showMessage("Product not available", "msg-error");
      return;
    }
    results.innerHTML = "";
    found.forEach(function (p) { results.appendChild(render(p)); });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    search();
  });

  clearBtn.addEventListener("click", function () {
    input.value = "";
    input.focus();
  });

  resetBtn.addEventListener("click", function () {
    input.value = "";
    results.innerHTML = "";
    window.scrollTo(0, 0);
    input.focus();
  });
})();
