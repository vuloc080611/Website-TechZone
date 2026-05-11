(() => {
  "use strict";

  // Cấu hình 
  const SLIDER_MIN  = 0;
  const SLIDER_MAX  = 55_000_000;
  const STEP        = 500_000;
  const MIN_GAP     = 1_000_000;   

  const PRESETS = [
    { label: "Dưới 5tr",   min: 0,          max: 5_000_000  },
    { label: "5 – 15tr",   min: 5_000_000,  max: 15_000_000 },
    { label: "15 – 30tr",  min: 15_000_000, max: 30_000_000 },
    { label: "Trên 30tr",  min: 30_000_000, max: 55_000_000 },
  ];

  // Helpers
  function fmtPrice(val) {
    if (val >= 1_000_000) {
      const m = val / 1_000_000;
      return Number.isInteger(m) ? `${m}tr₫` : `${m.toFixed(1)}tr₫`;
    }
    return val === 0 ? "0₫" : `${(val / 1000).toFixed(0)}k₫`;
  }

  function pct(val) {
    return ((val - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100;
  }

  //  CSS 
  function injectStyles() {
    if (document.getElementById("pf-style")) return;
    const s = document.createElement("style");
    s.id = "pf-style";
    s.textContent = `
      /* ===== Card wrapper ===== */
      #pf-card { margin-top: 16px; }
      #pf-card .sidebar-header { display:flex; align-items:center; gap:6px; }

      /* ===== Current range display ===== */
      .pf-range-display {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 18px;
        gap: 6px;
      }
      .pf-range-display .pf-val {
        background: #f4faf4;
        border: 1.5px solid #29a86e33;
        color: #1a7a4e;
        font-weight: 700;
        font-size: 13px;
        padding: 5px 10px;
        border-radius: 8px;
        min-width: 78px;
        text-align: center;
        transition: border-color .2s, background .2s;
      }
      .pf-range-display .pf-sep {
        color: #aaa;
        font-size: 13px;
        flex-shrink: 0;
      }

      /* ===== Dual range slider ===== */
      .pf-slider-wrap {
        position: relative;
        height: 40px;
        margin: 0 4px 16px;
        user-select: none;
      }
      /* Track base */
      .pf-slider-wrap::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 0; right: 0;
        height: 5px;
        transform: translateY(-50%);
        background: #e0e0e0;
        border-radius: 999px;
      }
      /* Colored fill between thumbs */
      .pf-fill {
        position: absolute;
        top: 50%;
        height: 5px;
        transform: translateY(-50%);
        background: linear-gradient(90deg, #29a86e, #1ec87c);
        border-radius: 999px;
        pointer-events: none;
        transition: left .05s, right .05s;
      }
      /* Both range inputs sit on top */
      .pf-slider-wrap input[type=range] {
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        transform: translateY(-50%);
        -webkit-appearance: none;
        appearance: none;
        background: transparent;
        pointer-events: none;
        margin: 0;
        padding: 0;
        height: 20px;
      }
      .pf-slider-wrap input[type=range]:focus { outline: none; }

      /* Track – hide for both (custom track above handles it) */
      .pf-slider-wrap input[type=range]::-webkit-slider-runnable-track {
        background: transparent; height: 5px;
      }
      .pf-slider-wrap input[type=range]::-moz-range-track {
        background: transparent; height: 5px;
      }

      /* Thumb */
      .pf-slider-wrap input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        pointer-events: all;
        width: 20px; height: 20px;
        border-radius: 50%;
        background: #fff;
        border: 2.5px solid #29a86e;
        box-shadow: 0 2px 8px rgba(41,168,110,.35);
        cursor: pointer;
        transition: box-shadow .15s, transform .15s;
      }
      .pf-slider-wrap input[type=range]::-moz-range-thumb {
        pointer-events: all;
        width: 20px; height: 20px;
        border-radius: 50%;
        background: #fff;
        border: 2.5px solid #29a86e;
        box-shadow: 0 2px 8px rgba(41,168,110,.35);
        cursor: pointer;
        transition: box-shadow .15s;
      }
      .pf-slider-wrap input[type=range]:active::-webkit-slider-thumb {
        box-shadow: 0 0 0 6px rgba(41,168,110,.18);
        transform: scale(1.15);
      }
      .pf-slider-wrap input[type=range]:active::-moz-range-thumb {
        box-shadow: 0 0 0 6px rgba(41,168,110,.18);
      }
      /* Ensure max thumb on top when at same position */
      #pfRangeMax { z-index: 3; }
      #pfRangeMin { z-index: 2; }

      /* ===== Tick labels ===== */
      .pf-ticks {
        display: flex;
        justify-content: space-between;
        margin: 0 4px 14px;
      }
      .pf-ticks span {
        font-size: 10px;
        color: #bbb;
        font-weight: 500;
      }

      /* ===== Preset buttons ===== */
      .pf-presets {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 14px;
      }
      .pf-preset-btn {
        flex: 1 1 auto;
        padding: 5px 8px;
        font-size: 11.5px;
        font-weight: 600;
        border: 1.5px solid #d4d4d4;
        border-radius: 20px;
        background: #fff;
        color: #444;
        cursor: pointer;
        white-space: nowrap;
        transition: all .15s;
        text-align: center;
      }
      .pf-preset-btn:hover {
        border-color: #29a86e;
        color: #29a86e;
        background: #f0fbf6;
      }
      .pf-preset-btn.active {
        background: #29a86e;
        border-color: #29a86e;
        color: #fff;
        box-shadow: 0 2px 8px rgba(41,168,110,.3);
      }

      /* ===== Reset link ===== */
      .pf-reset {
        display: block;
        text-align: center;
        font-size: 12px;
        color: #aaa;
        text-decoration: none;
        cursor: pointer;
        padding-top: 4px;
        transition: color .15s;
      }
      .pf-reset:hover { color: #e30019; }

      /* ===== Result count badge ===== */
      .pf-result-count {
        font-size: 11.5px;
        color: #888;
        text-align: center;
        min-height: 16px;
        margin-bottom: 2px;
        transition: opacity .2s;
      }
    `;
    document.head.appendChild(s);
  }

  //  Build HTML 
  function buildCard() {
    const card = document.createElement("div");
    card.className = "sidebar-card";
    card.id = "pf-card";
    card.innerHTML = `
      <div class="sidebar-header">
        <i class="ti-tag"></i> Lọc Theo Giá
      </div>
      <div class="p-3">

        <div class="pf-range-display">
          <span class="pf-val" id="pfMinLabel">${fmtPrice(SLIDER_MIN)}</span>
          <span class="pf-sep">—</span>
          <span class="pf-val" id="pfMaxLabel">${fmtPrice(SLIDER_MAX)}</span>
        </div>

        <div class="pf-slider-wrap">
          <div class="pf-fill" id="pfFill"></div>
          <input type="range" id="pfRangeMin"
            min="${SLIDER_MIN}" max="${SLIDER_MAX}" step="${STEP}" value="${SLIDER_MIN}">
          <input type="range" id="pfRangeMax"
            min="${SLIDER_MIN}" max="${SLIDER_MAX}" step="${STEP}" value="${SLIDER_MAX}">
        </div>

        <div class="pf-ticks">
          <span>0</span>
          <span>10tr</span>
          <span>20tr</span>
          <span>35tr</span>
          <span>55tr+</span>
        </div>

        <div class="pf-presets" id="pfPresets">
          ${PRESETS.map((p, i) => `
            <button class="pf-preset-btn" data-idx="${i}"
              data-min="${p.min}" data-max="${p.max}">${p.label}</button>
          `).join("")}
        </div>

        <div class="pf-result-count" id="pfResultCount"></div>

        <a class="pf-reset" id="pfReset">✕ Bỏ lọc giá</a>
      </div>
    `;
    return card;
  }

  //  State 
  let curMin = SLIDER_MIN;
  let curMax = SLIDER_MAX;

  //  Update UI 
  function updateUI(min, max) {
    const rMin = document.getElementById("pfRangeMin");
    const rMax = document.getElementById("pfRangeMax");
    const fill = document.getElementById("pfFill");
    const lblMin = document.getElementById("pfMinLabel");
    const lblMax = document.getElementById("pfMaxLabel");

    if (!rMin) return;

    rMin.value = min;
    rMax.value = max;

    const leftPct  = pct(min);
    const rightPct = pct(max);

    fill.style.left  = leftPct + "%";
    fill.style.right = (100 - rightPct) + "%";

    lblMin.textContent = fmtPrice(min);
    lblMax.textContent = fmtPrice(max);

    // Highlight active preset
    document.querySelectorAll(".pf-preset-btn").forEach(btn => {
      const active =
        Number(btn.dataset.min) === min &&
        Number(btn.dataset.max) === max;
      btn.classList.toggle("active", active);
    });
  }

  //  Apply filter via main.js integration 
  function applyFilter(min, max, skipUpdate) {
    curMin = min;
    curMax = max;

    // Cập nhật priceFilterState trong main.js
    if (window.priceFilterState) {
      window.priceFilterState.min = min === SLIDER_MIN ? 0        : min;
      window.priceFilterState.max = max === SLIDER_MAX ? Infinity : max;
    }

    if (!skipUpdate) updateUI(min, max);

    // Trigger lại logic lọc sản phẩm
    if (typeof window.runProductLogic === "function") {
      window.runProductLogic();
    }

    // Hiển thị số kết quả
    requestAnimationFrame(() => {
      const visible = document.querySelectorAll(
        "#productListHTML .product-item[style*='block']"
      ).length;
      const countEl = document.getElementById("pfResultCount");
      if (countEl) {
        if (min === SLIDER_MIN && max === SLIDER_MAX) {
          countEl.textContent = "";
        } else {
          countEl.textContent = visible > 0
            ? `Tìm thấy ${visible} sản phẩm`
            : "Không có sản phẩm trong khoảng giá này";
        }
      }
    });
  }

  //  Reset 
  function resetFilter() {
    applyFilter(SLIDER_MIN, SLIDER_MAX);
  }

  //  Init 
  function init() {
    // Chỉ chạy trên trang product.html
    if (!document.getElementById("productListHTML")) return;

    injectStyles();

    // Chèn card vào sidebar (sau card "Lọc Giá" sort)
    const sidebarCards = document.querySelectorAll(".sidebar-card");
    const lastCard = sidebarCards[sidebarCards.length - 1];
    if (!lastCard) return;

    const card = buildCard();
    lastCard.insertAdjacentElement("afterend", card);

    //  Slider events 
    const rMin = document.getElementById("pfRangeMin");
    const rMax = document.getElementById("pfRangeMax");

    function onSliderChange() {
      let min = Number(rMin.value);
      let max = Number(rMax.value);

      // Giữ khoảng cách tối thiểu
      if (max - min < MIN_GAP) {
        // Xác định thumb nào vừa di chuyển
        if (this === rMin) {
          min = Math.min(min, SLIDER_MAX - MIN_GAP);
          max = Math.max(max, min + MIN_GAP);
        } else {
          max = Math.max(max, SLIDER_MIN + MIN_GAP);
          min = Math.min(min, max - MIN_GAP);
        }
        rMin.value = min;
        rMax.value = max;
      }

      applyFilter(min, max);
    }

    rMin.addEventListener("input", onSliderChange);
    rMax.addEventListener("input", onSliderChange);

    // Khởi tạo fill
    updateUI(SLIDER_MIN, SLIDER_MAX);

    //  Preset buttons 
    document.getElementById("pfPresets").addEventListener("click", e => {
      const btn = e.target.closest(".pf-preset-btn");
      if (!btn) return;
      const min = Number(btn.dataset.min);
      const max = Number(btn.dataset.max);
      applyFilter(min, max);
    });

    //  Reset 
    document.getElementById("pfReset").addEventListener("click", resetFilter);
  }

  // Đợi DOM + main.js đã chạy xong
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

