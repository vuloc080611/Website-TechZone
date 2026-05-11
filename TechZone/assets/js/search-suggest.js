(() => {
  "use strict";

  const PRODUCTS = [
    // iPhone 17 Pro Max
    { name: "iPhone 17 Pro Max 256GB | Chính hãng", url: "item_info/iphone-17promax.html", img: "img/17promax/17promax-2.jpg", price: "37.690.000₫" },
    { name: "iPhone 17 Pro Max 512GB | Chính hãng", url: "item_info/iphone-17promax.html", img: "img/17promax/17promax-2.jpg", price: "42.990.000₫" },
    { name: "iPhone 17 Pro Max 1TB | Chính hãng",   url: "item_info/iphone-17promax.html", img: "img/17promax/17promax-2.jpg", price: "48.990.000₫" },
    // iPhone 17 Pro
    { name: "iPhone 17 Pro 256GB | Chính hãng", url: "item_info/iphone-17pro.html", img: "img/17promax/17promax-2.jpg", price: "33.290.000₫" },
    { name: "iPhone 17 Pro 512GB | Chính hãng", url: "item_info/iphone-17pro.html", img: "img/17promax/17promax-2.jpg", price: "40.590.000₫" },
    // iPhone 17
    { name: "iPhone 17 256GB | Chính hãng", url: "item_info/iphone-17.html", img: "img/iphone17/iphone17-2.jpg", price: "24.190.000₫" },
    { name: "iPhone 17 512GB | Chính hãng", url: "item_info/iphone-17.html", img: "img/iphone17/iphone17-2.jpg", price: "30.490.000₫" },
    // iPhone 17 Air
    { name: "iPhone Air 256GB | Chính hãng", url: "item_info/iphone-17air.html", img: "img/iphoneair/iphoneair-2.jpg", price: "24.890.000₫" },
    { name: "iPhone Air 512GB | Chính hãng", url: "item_info/iphone-17air.html", img: "img/iphoneair/iphoneair-2.jpg", price: "31.490.000₫" },
    { name: "iPhone Air 1TB | Chính hãng",   url: "item_info/iphone-17air.html", img: "img/iphoneair/iphoneair-2.jpg", price: "35.990.000₫" },
    // iPhone 16 Pro Max
    { name: "iPhone 16 Pro Max 256GB | Chính hãng", url: "item_info/iphone-16promax.html", img: "img/iphone16prm/iphone16prm-2.jpg", price: "31.490.000₫" },
    { name: "iPhone 16 Pro Max 512GB | Chính hãng", url: "item_info/iphone-16promax.html", img: "img/iphone16prm/iphone16prm-2.jpg", price: "39.490.000₫" },
    { name: "iPhone 16 Pro Max 1TB | Chính hãng",   url: "item_info/iphone-16promax.html", img: "img/iphone16prm/iphone16prm-2.jpg", price: "43.990.000₫" },
    // iPhone 16e
    { name: "iPhone 16e 128GB | Chính hãng", url: "item_info/iphone-16e.html", img: "img/iphone16e/iphone16e-1.jpg", price: "12.490.000₫" },
    { name: "iPhone 16e 256GB | Chính hãng", url: "item_info/iphone-16e.html", img: "img/iphone16e/iphone16e-1.jpg", price: "15.490.000₫" },
    // iPhone 16
    { name: "iPhone 16 128GB | Chính hãng", url: "item_info/iphone-16.html", img: "img/iphone16/iphone16-1.jpg", price: "19.590.000₫" },
    { name: "iPhone 16 256GB | Chính hãng", url: "item_info/iphone-16.html", img: "img/iphone16/iphone16-1.jpg", price: "22.990.000₫" },
    { name: "iPhone 16 512GB | Chính hãng", url: "item_info/iphone-16.html", img: "img/iphone16/iphone16-1.jpg", price: "27.990.000₫" },
    // Samsung S25 Ultra
    { name: "Samsung Galaxy S25 Ultra 12GB 256GB", url: "item_info/samsung-s25ultra.html", img: "img/sa.jpg", price: "25.990.000₫" },
    { name: "Samsung Galaxy S25 Ultra 12GB 512GB", url: "item_info/samsung-s25ultra.html", img: "img/sa.jpg", price: "29.990.000₫" },
    { name: "Samsung Galaxy S25 Ultra 12GB 1TB",   url: "item_info/samsung-s25ultra.html", img: "img/sa.jpg", price: "35.490.000₫" },
    // Samsung A56
    { name: "Samsung Galaxy A56 5G 8GB 128GB", url: "item_info/samsung-a56.html", img: "img/samsung-a56/samsung-a56-2.jpg", price: "8.590.000₫" },
    { name: "Samsung Galaxy A56 5G 8GB 256GB", url: "item_info/samsung-a56.html", img: "img/samsung-a56/samsung-a56-2.jpg", price: "9.590.000₫" },
    // Samsung S25 FE
    { name: "Samsung Galaxy S25 FE 8GB 256GB", url: "item_info/samsung-s25fe.html", img: "img/samsung-s25fe/samsung-s25fe-2.jpg", price: "13.890.000₫" },
    { name: "Samsung Galaxy S25 FE 8GB 512GB", url: "item_info/samsung-s25fe.html", img: "img/samsung-s25fe/samsung-s25fe-2.jpg", price: "16.590.000₫" },
    // Samsung S25
    { name: "Samsung Galaxy S25 8GB 256GB", url: "item_info/samsung-s25.html", img: "img/samsung-s25/samsung-s25-2.jpg", price: "17.590.000₫" },
    { name: "Samsung Galaxy S25 8GB 512GB", url: "item_info/samsung-s25.html", img: "img/samsung-s25/samsung-s25-2.jpg", price: "20.090.000₫" },
    // Samsung Z Flip7
    { name: "Samsung Galaxy Z Flip7 12GB 256GB", url: "item_info/samsung-zflip7.html", img: "img/samsung-zflip7/samsung-zflip7-2.jpg", price: "23.990.000₫" },
    { name: "Samsung Galaxy Z Flip7 12GB 512GB", url: "item_info/samsung-zflip7.html", img: "img/samsung-zflip7/samsung-zflip7-2.jpg", price: "28.990.000₫" },
    // Samsung Z Fold7
    { name: "Samsung Galaxy Z Fold7 12GB 256GB", url: "item_info/samsung-zfold7.html", img: "img/samsung-zfold7/samsung-zfold7-2.jpg", price: "39.590.000₫" },
    { name: "Samsung Galaxy Z Fold7 12GB 512GB", url: "item_info/samsung-zfold7.html", img: "img/samsung-zfold7/samsung-zfold7-2.jpg", price: "45.990.000₫" },
    // OPPO
    { name: "OPPO Find N3 16GB 512GB",       url: "item_info/oppo-findn3.html",     img: "img/oppo-findn3/oppo-findn3-2.jpg",       price: "26.990.000₫" },
    { name: "OPPO Find N3 Flip 12GB 256GB",  url: "item_info/oppo-findn3flip.html", img: "img/oppo-findn3flip/oppo-findn3flip-2.jpg", price: "13.990.000₫" },
    { name: "OPPO Find X9 12GB 256GB",       url: "item_info/oppo-findx9.html",     img: "img/oppo-findx9/oppo-findx9-1.jpg",       price: "22.990.000₫" },
    { name: "OPPO Find X9 16GB 512GB",       url: "item_info/oppo-findx9.html",     img: "img/oppo-findx9/oppo-findx9-1.jpg",       price: "26.990.000₫" },
    { name: "OPPO Find X9 Pro 16GB 512GB",   url: "item_info/oppo-findx9pro.html",  img: "img/oppo-findx9pro/oppo-findx9pro-1.jpg", price: "32.990.000₫" },
    { name: "OPPO Reno14 F 5G 8GB 256GB",   url: "item_info/oppo-reno14f.html",    img: "img/oppo-reno14f/oppo-reno14f-1.jpg",     price: "10.100.000₫" },
    { name: "OPPO Reno14 F 5G 12GB 256GB",  url: "item_info/oppo-reno14f.html",    img: "img/oppo-reno14f/oppo-reno14f-1.jpg",     price: "12.100.000₫" },
    // Xiaomi
    { name: "Xiaomi 15T 12GB 512GB",    url: "item_info/xiaomi15t.html",     img: "img/xiaomi-15t/den.jpg",                          price: "13.490.000₫" },
    { name: "Xiaomi 15T Pro 12GB 512GB", url: "item_info/xiaomi15tpro.html", img: "img/xiaomi15tp/v.jpg",                            price: "17.690.000₫" },
    { name: "Xiaomi 15C 4GB 128GB",     url: "item_info/xiaomi15c4g.html",   img: "img/xiaomi-redmi15c/xiaomi-redmi15c-1.jpg",        price: "3.390.000₫" },
    { name: "Xiaomi 15C 8GB 256GB",     url: "item_info/xiaomi15c8g.html",   img: "img/xiaomi-redmi15c/xiaomi-redmi15c-1.jpg",        price: "3.790.000₫" },
  ];

  function normalize(str) {
    return String(str || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function highlight(text, keyword) {
    if (!keyword) return text;
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Tìm vị trí match trong text đã normalize, rồi highlight text gốc
    const normText = normalize(text);
    const normKw   = normalize(keyword);
    const idx = normText.indexOf(normKw);
    if (idx === -1) return text;
    return (
      text.slice(0, idx) +
      `<mark>${text.slice(idx, idx + keyword.length)}</mark>` +
      text.slice(idx + keyword.length)
    );
  }

  
  // Tạo CSS cho dropdown
  function injectStyles() {
    if (document.getElementById("tz-search-style")) return;
    const style = document.createElement("style");
    style.id = "tz-search-style";
    style.textContent = `
      .tz-suggest-wrap {
        position: relative;
        flex: 1;
      }
      .tz-suggest-dropdown {
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        right: 0;
        background: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        box-shadow: 0 8px 24px rgba(0,0,0,.12);
        z-index: 9999;
        max-height: 420px;
        overflow-y: auto;
        display: none;
      }
      .tz-suggest-dropdown.open {
        display: block;
      }
      .tz-suggest-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 12px;
        cursor: pointer;
        transition: background .15s;
        text-decoration: none;
        color: inherit;
      }
      .tz-suggest-item:hover,
      .tz-suggest-item.focused {
        background: #f5f5f5;
      }
      .tz-suggest-item img {
        width: 44px;
        height: 44px;
        object-fit: contain;
        border-radius: 6px;
        flex-shrink: 0;
        background: #fafafa;
        border: 1px solid #eee;
      }
      .tz-suggest-item .tz-name {
        font-size: 13px;
        font-weight: 500;
        color: #222;
        flex: 1;
        line-height: 1.3;
      }
      .tz-suggest-item .tz-name mark {
        background: #fff3cd;
        padding: 0 1px;
        border-radius: 2px;
        font-weight: 700;
        color: #e65c00;
      }
      .tz-suggest-item .tz-price {
        font-size: 13px;
        font-weight: 600;
        color: #e30019;
        white-space: nowrap;
      }
      .tz-suggest-footer {
        padding: 8px 12px;
        font-size: 13px;
        color: #555;
        border-top: 1px solid #f0f0f0;
        text-align: center;
        cursor: pointer;
        font-weight: 500;
      }
      .tz-suggest-footer:hover { background: #f9f9f9; }
      .tz-suggest-empty {
        padding: 14px 16px;
        font-size: 13px;
        color: #999;
        text-align: center;
      }
    `;
    document.head.appendChild(style);
  }

  // Khởi tạo autocomplete cho một input
  function initSuggest(input) {
    if (!input || input.dataset.tzSuggest) return;
    input.dataset.tzSuggest = "1";

    // Bọc input vào wrapper (giữ nguyên layout flex của form)
    const form = input.closest("form");
    const wrapper = document.createElement("div");
    wrapper.className = "tz-suggest-wrap";
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    const dropdown = document.createElement("div");
    dropdown.className = "tz-suggest-dropdown";
    wrapper.appendChild(dropdown);

    let focusedIndex = -1;

    function getItems() {
      return Array.from(dropdown.querySelectorAll(".tz-suggest-item"));
    }

    function setFocus(idx) {
      const items = getItems();
      items.forEach((el, i) => el.classList.toggle("focused", i === idx));
      focusedIndex = idx;
    }

    function open() { dropdown.classList.add("open"); }
    function close() { dropdown.classList.remove("open"); focusedIndex = -1; }

    function render(keyword) {
      const normKw = normalize(keyword);
      if (!normKw) { close(); return; }

      const matches = PRODUCTS.filter(p => normalize(p.name).includes(normKw)).slice(0, 7);

      dropdown.innerHTML = "";
      focusedIndex = -1;

      if (!matches.length) {
        dropdown.innerHTML = `<div class="tz-suggest-empty">Không tìm thấy sản phẩm phù hợp</div>`;
        open();
        return;
      }

      matches.forEach(p => {
        const a = document.createElement("a");
        a.className = "tz-suggest-item";
        // Đường dẫn tương đối – điều chỉnh nếu cần
        const base = getBasePath();
        a.href = base + p.url;
        a.innerHTML = `
          <img src="${base}${p.img}" alt="" onerror="this.src='${base}img/log.png'">
          <span class="tz-name">${highlight(p.name, keyword)}</span>
          <span class="tz-price">${p.price}</span>
        `;
        a.addEventListener("mousedown", e => e.preventDefault()); 
        dropdown.appendChild(a);
      });

      // Dòng "Xem tất cả kết quả"
      const footer = document.createElement("div");
      footer.className = "tz-suggest-footer";
      const base = getBasePath();
      footer.textContent = `🔍 Xem tất cả kết quả cho "${keyword}"`;
      footer.addEventListener("mousedown", e => {
        e.preventDefault();
        window.location.href = `${base}product.html?q=${encodeURIComponent(keyword)}`;
      });
      dropdown.appendChild(footer);

      open();
    }

    // Xác định base path (chạy đúng cả từ root lẫn thư mục con)
    function getBasePath() {
      const path = window.location.pathname;
      if (/\/item_info\//i.test(path)) return "../";
      if (/\/Admin\//i.test(path)) return "../";
      return "";
    }

    // Events
    input.addEventListener("input", () => render(input.value));
    input.addEventListener("focus", () => { if (input.value.trim()) render(input.value); });

    input.addEventListener("keydown", e => {
      const items = getItems().filter(el => el.classList.contains("tz-suggest-item"));
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocus(Math.min(focusedIndex + 1, items.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocus(Math.max(focusedIndex - 1, -1));
      } else if (e.key === "Enter") {
        if (focusedIndex >= 0 && items[focusedIndex]) {
          e.preventDefault();
          items[focusedIndex].click();
        }
        // else: submit form như bình thường → product.html?q=...
        close();
      } else if (e.key === "Escape") {
        close();
      }
    });

    document.addEventListener("click", e => {
      if (!wrapper.contains(e.target)) close();
    });

    // Khi submit form, đảm bảo q= đúng
    if (form) {
      form.addEventListener("submit", e => {
        close();
      });
    }
  }

  // Chạy sau khi DOM sẵn sàng
  function init() {
    injectStyles();

    // Tìm đúng ô search trên header (nằm trong form[action*="product.html"])
    const headerForm = document.querySelector('form[action*="product.html"]');
    if (headerForm) {
      const input = headerForm.querySelector('input[type="text"], input:not([type])');
      if (input) {
        // Đổi ID để tránh trùng với ô filter trong product.html
        if (input.id === "searchInput") {
          input.id = "headerSearchInput";
        }
        initSuggest(input);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();