(() => {
  "use strict";

  // ================== CONSTANTS ==================
  const STORAGE_KEYS = {
    users: "techzone_users",
    currentUser: "currentUser",
    cart: "cart",
    legacyUsername: "username",
    productPageUrl: "productPageUrl",
  };

  const PRODUCT_PAGE_CONFIG = {
    itemsPerPage: 9,
  };

  const PRODUCT_PAGE_CATEGORIES = [
    "all",
    "iphone",
    "samsung",
    "oppo",
    "xiaomi",
  ];
  const PRODUCT_PAGE_SORTS = ["default", "asc", "desc"];

  const productPageState = {
    currentPage: 1,
    currentCategory: "all",
    currentSort: "default",
  };

  const priceFilterState = { min: 0, max: Infinity };

  const listingPageState = {
    currentFilter: "all",
  };

  // ===== Dữ liệu giá cũ cho trang chi tiết =====
  // Map từ đường dẫn trang chi tiết đến các lựa chọn dung lượng và giá cũ/giá hiện tại
  const DETAIL_PAGE_OLD_PRICE_OVERRIDES = {
    "/item_info/iphone-16.html": {
      "512GB": { current: 27990000, old: 31990000 },
    },
    "/item_info/iphone-16e.html": {
      "128GB": { current: 12490000, old: 16990000 },
      "256GB": { current: 15490000, old: 19990000 },
    },
    "/item_info/iphone-16pro.html": {
      "256GB": { current: 28590000, old: 31990000 },
      "512GB": { current: 33490000, old: 37990000 },
      "1T": { current: 37690000, old: 43990000 },
    },
    "/item_info/iphone-16promax.html": {
      "256GB": { current: 31490000, old: 34990000 },
      "512GB": { current: 39490000, old: 40990000 },
      "1T": { current: 43990000, old: 46990000 },
    },
    "/item_info/iphone-17.html": {
      "256GB": { current: 24190000, old: 24990000 },
      "512GB": { current: 30490000, old: 31490000 },
    },
    "/item_info/iphone-17air.html": {
      "256GB": { current: 24890000, old: 31990000 },
      "512GB": { current: 31490000, old: 38490000 },
      "1TB": { current: 35990000, old: 44990000 },
    },
    "/item_info/iphone-17pro.html": {
      "256GB": { current: 33290000, old: 34990000 },
      "512GB": { current: 40590000, old: 41490000 },
    },
    "/item_info/iphone-17promax.html": {
      "256GB": { current: 37690000, old: 39990000 },
      "512GB": { current: 42990000, old: 44490000 },
      "1TB": { current: 48990000, old: 50990000 },
    },
    "/item_info/oppo-findn3.html": {
      "16GB - 512GB": { current: 26990000, old: 44180000 },
    },
    "/item_info/oppo-findn3flip.html": {
      "12GB - 256GB": { current: 13990000, old: 22580000 },
    },
    "/item_info/oppo-findx9pro.html": {
      "256GB": { current: 26490000, old: 29450000 },
      "512GB": { current: 32990000, old: 35990000 },
    },
    "/item_info/oppo-reno14f.html": {
      "256GB": { current: 10590000, old: 11290000 },
      "512GB": { current: 12760000, old: 13290000 },
    },
    "/item_info/samsung-a56.html": {
      "8GB - 128GB": { current: 8590000, old: 9810000 },
      "8GB - 256GB": { current: 9590000, old: 10810000 },
    },
    "/item_info/samsung-s25.html": {
      "256GB": { current: 17590000, old: 22580000 },
      "512GB": { current: 20090000, old: 26010000 },
    },
    "/item_info/samsung-s25fe.html": {
      "256GB": { current: 13890000, old: 16690000 },
      "512GB": { current: 16590000, old: 21990000 },
    },
    "/item_info/samsung-s25ultra.html": {
      "256GB": { current: 25990000, old: 33380000 },
      "512GB": { current: 29990000, old: 36810000 },
      "1TB": { current: 35490000, old: 43980000 },
    },
    "/item_info/samsung-zflip7.html": {
      "256GB": { current: 23990000, old: 28990000 },
      "512GB": { current: 28990000, old: 32990000 },
    },
    "/item_info/samsung-zfold7.html": {
      "256GB": { current: 39590000, old: 46990000 },
      "512GB": { current: 45990000, old: 50990000 },
    },
  };

  // ================== UTILS ==================
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  // Ngăn chặn hành vi mặc định của sự kiện hiện tại
  function preventCurrentEvent() {
    if (window.event && typeof window.event.preventDefault === "function") {
      window.event.preventDefault();
    }
  }

  // Đọc dữ liệu JSON từ localStorage, nếu lỗi thì trả về fallback
  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  // Ghi dữ liệu JSON xuống localStorage
  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Chuẩn hóa chuỗi: bỏ dấu, lowercase, trim
  function normalizeText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

   // Chuyển chuỗi giá thành số nguyên (bỏ ký tự không phải số)
  function parsePrice(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    const digits = String(value || "").replace(/[^\d]/g, "");
    return digits ? Number(digits) : 0;
  }

  // Format giá tiền VND có dấu chấm phân cách
  function formatPrice(value) {
    return `${parsePrice(value).toLocaleString("vi-VN")}đ`;
  }

   // Escape HTML để tránh XSS
  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, (char) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };

      return entities[char];
    });
  }

  // Lấy giá trị từ input theo id
  function getValueById(id) {
    const element = document.getElementById(id);
    return element ? element.value.trim() : "";
  }

  // Gán giá trị cho input theo id
  function setValueById(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.value = value;
    }
  }

  function isProductPage() {
    return /\/product\.html$/i.test(window.location.pathname);
  }

  function isProductDetailPage() {
    return /\/item_info\/[^/]+\.html$/i.test(window.location.pathname);
  }

  // Chuyển hướng đến đường dẫn khác
  function redirectTo(path) {
    window.location.href = path;
  }

  function syncProductPageControls() {
    // Cập nhật nút category active
    $$(".category-item").forEach((item) => {
      const onclickValue = item.getAttribute("onclick") || "";
      const isActive = onclickValue.includes(
        `filterHTML('${productPageState.currentCategory}'`,
      );

      item.classList.toggle("active", isActive);
    });

    // Cập nhật radio sort
    const sortRadioIds = {
      default: "sortDefault",
      asc: "sortLowHigh",
      desc: "sortHighLow",
    };

    Object.entries(sortRadioIds).forEach(([sortType, elementId]) => {
      const radio = document.getElementById(elementId);
      if (radio) {
        radio.checked = sortType === productPageState.currentSort;
      }
    });
  }

  // Đọc state từ URL hiện tại (query params) để khôi phục trạng thái
  function hydrateProductPageStateFromUrl() {
    if (!isProductPage()) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const page = Number(params.get("page"));
    const category = params.get("category");
    const sort = params.get("sort");
    const keyword = params.get("q");

    if (Number.isInteger(page) && page > 0) {
      productPageState.currentPage = page;
    }

    if (PRODUCT_PAGE_CATEGORIES.includes(category)) {
      productPageState.currentCategory = category;
    }

    if (PRODUCT_PAGE_SORTS.includes(sort)) {
      productPageState.currentSort = sort;
    }

    if (keyword !== null) {
      setValueById("searchInput", keyword);
    }

    syncProductPageControls();
  }

  // Tạo URL mới từ state hiện tại (để lưu lịch sử)
  function buildProductPageUrl() {
    const url = new URL(window.location.href);
    const searchValue = getValueById("searchInput");

    url.searchParams.delete("page");
    url.searchParams.delete("category");
    url.searchParams.delete("sort");
    url.searchParams.delete("q");

    if (productPageState.currentPage > 1) {
      url.searchParams.set("page", String(productPageState.currentPage));
    }

    if (productPageState.currentCategory !== "all") {
      url.searchParams.set("category", productPageState.currentCategory);
    }

    if (productPageState.currentSort !== "default") {
      url.searchParams.set("sort", productPageState.currentSort);
    }

    if (searchValue) {
      url.searchParams.set("q", searchValue);
    }

    return url.toString();
  }

  // Lưu URL trang sản phẩm vào history + localStorage
  function persistProductPageState() {
    if (!isProductPage()) {
      return;
    }

    const productPageUrl = buildProductPageUrl();

    try {
      window.history.replaceState(null, "", productPageUrl);
    } catch (error) {
    }

    try {
      localStorage.setItem(STORAGE_KEYS.productPageUrl, productPageUrl);
    } catch (error) {
    }
  }

  // Lấy URL trang sản phẩm đã lưu (dùng cho nút quay lại từ chi tiết)
  function getSavedProductPageUrl() {
    if (document.referrer) {
      try {
        const referrerUrl = new URL(document.referrer);
        if (/\/product\.html$/i.test(referrerUrl.pathname)) {
          return referrerUrl.toString();
        }
      } catch (error) {
      }
    }

    try {
      return localStorage.getItem(STORAGE_KEYS.productPageUrl) || "";
    } catch (error) {
      return "";
    }
  }

  // Cập nhật các link quay về trang sản phẩm (trong trang chi tiết) thành URL đúng
  function syncProductReturnLinks() {
    if (!isProductDetailPage()) {
      return;
    }

    const productPageUrl = getSavedProductPageUrl();
    if (!productPageUrl) {
      return;
    }

    $$('a[href$="product.html"]').forEach((link) => {
      link.href = productPageUrl;
    });
  }

  // Lấy đường dẫn trang chi tiết hiện tại (ví dụ "/item_info/iphone-16.html")
  function getCurrentDetailPagePath() {
    const match = window.location.pathname.match(/\/item_info\/[^/]+\.html$/i);
    return match ? match[0] : "";
  }

  // Lấy giá từ nút dung lượng (ví dụ onclick="chooseStorage(this, 27990000)")
  function parseStorageButtonPrice(button) {
    const onclickValue = button?.getAttribute("onclick") || "";
    const match = onclickValue.match(/chooseStorage\s*\(\s*this\s*,\s*(\d+)/i);
    return match ? Number(match[1]) : 0;
  }

  // Format giá cho trang chi tiết (sử dụng ký hiệu ₫ thay vì "đ")
  function formatDetailPrice(value) {
    return `${parsePrice(value).toLocaleString("vi-VN")}\u20ab`;
  }

  // Tính % giảm giá
  function calculateDiscountPercent(currentPrice, oldPrice) {
    const safeCurrentPrice = parsePrice(currentPrice);
    const safeOldPrice = parsePrice(oldPrice);

    if (!safeCurrentPrice || safeOldPrice <= safeCurrentPrice) {
      return 0;
    }

    return Math.round(
      ((safeOldPrice - safeCurrentPrice) / safeOldPrice) * 100,
    );
  }

  // Xác định giá cũ cho lựa chọn dung lượng
  function resolveDetailOldPrice(detailPath, storageLabel, currentPrice, ratio) {
    const pricingOverride =
      DETAIL_PAGE_OLD_PRICE_OVERRIDES[detailPath]?.[storageLabel];

    if (
      pricingOverride &&
      pricingOverride.current === currentPrice &&
      pricingOverride.old >= currentPrice
    ) {
      return pricingOverride.old;
    }

    if (!(ratio > 0)) {
      return currentPrice;
    }

    const estimatedOldPrice =
      Math.round((currentPrice * ratio) / 10000) * 10000;

    return Math.max(estimatedOldPrice, currentPrice);
  }

  // Cập nhật hiển thị giá chi tiết (giá hiện tại, giá cũ, % giảm)
  function updateDetailPagePricing(storageButton, ratio) {
    const detailPath = getCurrentDetailPagePath();
    const displayPriceElement = document.getElementById("displayPrice");
    const oldPriceElement = document.querySelector(".old-price");
    const discountElement = document.querySelector(".discount-tag");
    const storageLabel = $("span", storageButton)?.textContent.trim();

    if (
      !detailPath ||
      !displayPriceElement ||
      !oldPriceElement ||
      !storageLabel
    ) {
      return;
    }

    const currentPrice =
      parsePrice(displayPriceElement.textContent) ||
      parseStorageButtonPrice(storageButton);

    if (!currentPrice) {
      return;
    }

    const oldPrice = resolveDetailOldPrice(
      detailPath,
      storageLabel,
      currentPrice,
      ratio,
    );

    displayPriceElement.textContent = formatDetailPrice(currentPrice);
    oldPriceElement.textContent = formatDetailPrice(oldPrice);

    if (discountElement) {
      discountElement.textContent = `Gi\u1ea3m ${calculateDiscountPercent(
        currentPrice,
        oldPrice,
      )}%`;
    }
  }

  // Khởi tạo logic giá khi chọn dung lượng ở trang chi tiết
  function initDetailStoragePricing() {
    if (!isProductDetailPage()) {
      return;
    }

    const displayPriceElement = document.getElementById("displayPrice");
    const oldPriceElement = document.querySelector(".old-price");
    const storageButtons = $$(".btn-storage");

    if (!displayPriceElement || !oldPriceElement || storageButtons.length === 0) {
      return;
    }

    const initialCurrentPrice = parsePrice(displayPriceElement.textContent);
    const initialOldPrice = parsePrice(oldPriceElement.textContent);
    const ratio =
      initialCurrentPrice > 0 && initialOldPrice >= initialCurrentPrice
        ? initialOldPrice / initialCurrentPrice
        : 1;

    storageButtons.forEach((button) => {
      button.addEventListener("click", () => {
        window.requestAnimationFrame(() => {
          updateDetailPagePricing(button, ratio);
        });
      });
    });

    const activeStorageButton = $(".btn-storage.active-style") || storageButtons[0];
    if (activeStorageButton) {
      updateDetailPagePricing(activeStorageButton, ratio);
    }
  }

  const UserStore = {
    getAll() {
      return readJson(STORAGE_KEYS.users, []);
    },

    saveAll(users) {
      writeJson(STORAGE_KEYS.users, users);
    },

    // Tìm user theo email (có hỗ trợ dữ liệu cũ)
    getByEmail(email) {
      const normalizedEmail = normalizeText(email);
      if (!normalizedEmail) {
        return null;
      }

      const users = this.getAll();
      const storedUser = users.find(
        (user) => normalizeText(user.email) === normalizedEmail,
      );

      if (storedUser) {
        return storedUser;
      }

      // Fallback: dữ liệu cũ lưu theo email riêng lẻ
      const legacyUser =
        readJson(email, null) || readJson(normalizedEmail, null);
      if (legacyUser && legacyUser.email) {
        this.upsert(legacyUser);
        return legacyUser;
      }

      return null;
    },

     // Thêm hoặc cập nhật user (đảm bảo không trùng email)
    upsert(user) {
      const users = this.getAll().filter(
        (item) => normalizeText(item.email) !== normalizeText(user.email),
      );

      users.push(user);
      this.saveAll(users);

      localStorage.setItem(user.email, JSON.stringify(user));
      localStorage.setItem(normalizeText(user.email), JSON.stringify(user));
    },
  };

  const AuthService = {
    getCurrentUser() {
      return readJson(STORAGE_KEYS.currentUser, null);
    },

    setCurrentUser(user) {
      writeJson(STORAGE_KEYS.currentUser, user);
      localStorage.setItem(STORAGE_KEYS.legacyUsername, user.email);
    },

    clearCurrentUser() {
      localStorage.removeItem(STORAGE_KEYS.currentUser);
      localStorage.removeItem(STORAGE_KEYS.legacyUsername);
    },

    // Kiểm tra đăng ký
    register({ username, email, password, confirmPassword }) {
      const cleanName = username.trim();
      const cleanEmail = email.trim().toLowerCase();

      if (!cleanName) {
        return { ok: false, message: "Vui lòng nhập tên đăng nhập." };
      }
      const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/; 
      if (!usernamePattern.test(cleanName)) {
        return { 
          ok: false, 
          message: "Tên đăng nhập không hợp lệ! Vui lòng viết liền không dấu, không khoảng trắng (chỉ dùng chữ, số và dấu _)." 
        };
      }

      if (!cleanEmail) {
        return { ok: false, message: "Vui lòng nhập email." };
      }
      const emailPattern = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailPattern.test(cleanEmail)) {
        return { ok: false, message: "Email không đúng định dạng. Vui lòng kiểm tra lại!" };
      }

      if (UserStore.getByEmail(cleanEmail)) {
        return { ok: false, message: "Email đã tồn tại trên hệ thống." };
      }

      if (!password) {
        return { ok: false, message: "Vui lòng nhập mật khẩu." };
      }
      const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordPattern.test(password)) {
        return {
          ok: false,
          message: "Mật khẩu quá yếu! Yêu cầu tối thiểu 8 ký tự, bao gồm cả chữ cái, số và ký tự đặc biệt.",
        };
      }

      if (password !== confirmPassword) {
        return { ok: false, message: "Mật khẩu nhập lại không khớp." };
      }

      const user = {
        username: cleanName,
        email: cleanEmail,
        password,
      };

      UserStore.upsert(user);
      return { ok: true, user };
    },

    // Kiểm tra đăng nhập
    login({ email, password }) {
      const cleanEmail = email.trim().toLowerCase();

      if (!cleanEmail) {
        return { ok: false, message: "Vui lòng nhập email." };
      }

      if (!password) {
        return { ok: false, message: "Vui lòng nhập mật khẩu." };
      }

      const user = UserStore.getByEmail(cleanEmail);
      if (!user) {
        return { ok: false, message: "Email không tồn tại." };
      }

      if (user.password !== password) {
        return { ok: false, message: "Sai mật khẩu." };
      }

      this.setCurrentUser(user);
      return { ok: true, user };
    },

    logout() {
      this.clearCurrentUser();
    },
  };

  const CartService = {
    getItems() {
      return readJson(STORAGE_KEYS.cart, []);
    },

    saveItems(items) {
      writeJson(STORAGE_KEYS.cart, items);
    },

    // Thêm sản phẩm vào giỏ 
    addItem(item) {
      const items = this.getItems();
      const normalizedName = normalizeText(item.name);
      const existingItem = items.find(
        (entry) => normalizeText(entry.name) === normalizedName,
      );

      if (existingItem) {
        existingItem.quantity = Number(existingItem.quantity || 1) + 1;
      } else {
        items.push({
          name: item.name,
          category: item.category || "Dien thoai",
          image: item.image || "",
          price: parsePrice(item.price),
          quantity: Number(item.quantity || 1),
        });
      }

      this.saveItems(items);
      return items;
    },

    updateQuantity(index, quantity) {
      const items = this.getItems();
      if (!items[index]) {
        return items;
      }

      items[index].quantity = Math.max(1, Number(quantity) || 1);
      this.saveItems(items);
      return items;
    },

    removeItem(index) {
      const items = this.getItems();
      items.splice(index, 1);
      this.saveItems(items);
      return items;
    },

    getTotal(items = this.getItems()) {
      return items.reduce((sum, item) => {
        return sum + parsePrice(item.price) * Number(item.quantity || 1);
      }, 0);
    },
  };

  // Tạo HTML menu dropdown cho user đã đăng nhập
  function buildLoggedInMenu(user) {
    const safeName = escapeHtml(user.username);
    return `
      <li>
        <span class="dropdown-item text-muted" style="font-size:12px; padding-bottom:4px;">
          <i class="fas fa-user-circle me-1"></i> ${safeName}
        </span>
      </li>
      <li><hr class="dropdown-divider my-1"></li>
      <li><a class="dropdown-item" href="#"><i class="fas fa-user me-2"></i>Hồ sơ cá nhân</a></li>
      <li><a class="dropdown-item" href="cart.html"><i class="fas fa-shopping-bag me-2"></i>Đơn hàng của tôi</a></li>
      <li><hr class="dropdown-divider my-1"></li>
      <li>
        <a class="dropdown-item text-danger" href="#" onclick="return logout()">
          <i class="fas fa-sign-out-alt me-2"></i>Đăng xuất
        </a>
      </li>
    `;
  }

  // Cập nhật số lượng hiển thị trên badge giỏ hàng
  function updateCartBadge() {
    const cartBadge = document.getElementById("cart-count");
    if (!cartBadge) return;
    const items = CartService.getItems();
    const total = items.reduce(function(sum, item) {
      return sum + Number(item.quantity || 1);
    }, 0);
    cartBadge.textContent = total > 0 ? String(total) : "0";
  }

  // Cập nhật giao diện header (tên user, menu)
  function updateHeaderUserUI() {
    const user = AuthService.getCurrentUser();

    const displayUserName = document.getElementById("display-username");
    const userMenu = document.getElementById("user-menu");

    if (displayUserName) {
      displayUserName.textContent = user ? "Hi, " + user.username : "Đăng nhập";
    }

    if (userMenu) {
      if (user) {
        userMenu.innerHTML = buildLoggedInMenu(user);
      } else {
        userMenu.innerHTML = `
          <li><a class="dropdown-item" href="login.html"><i class="fas fa-sign-in-alt me-2"></i>Đăng Nhập</a></li>
          <li><a class="dropdown-item" href="signup.html"><i class="fas fa-user-plus me-2"></i>Đăng Ký</a></li>
        `;
      }
    }

    // Cập nhật icon account ở ngoài
    const accountContainer = document.querySelector(".header-btn.account");
    if (user && accountContainer) {
      const safeName = escapeHtml(user.username);
      accountContainer.innerHTML = `
        <div class="nav-item dropdown account-icon">
          <a class="nav-link dropdown-toggle d-flex align-items-center text-decoration-none" href="#" data-bs-toggle="dropdown" aria-expanded="false">
            <i id="user-icon" class="ti-user text-success"></i>
            <span class="ms-2 fw-bold text-success" style="font-size:14px;">Hi, ${safeName}</span>
          </a>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" href="#">Hồ sơ cá nhân</a></li>
            <li><a class="dropdown-item" href="#">Đơn hàng của tôi</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item text-danger fw-bold" href="#" onclick="return logout()">Đăng xuất <i class="ti-power-off ms-1"></i></a></li>
          </ul>
        </div>
      `;
    }

    updateCartBadge();
  }

  // Vẽ bảng giỏ hàng (dùng ở trang cart)
  function renderCartTable() {
    const cartTable = document.getElementById("cart");
    const totalElement = document.getElementById("total");

    if (!cartTable) {
      return;
    }

    const items = CartService.getItems();
    const tbody = cartTable.tBodies[0] || cartTable.createTBody();
    tbody.innerHTML = "";

    if (!items.length) {
      const emptyRow = tbody.insertRow();
      const emptyCell = emptyRow.insertCell();
      emptyCell.colSpan = 6;
      emptyCell.className = "text-center text-muted py-4";
      emptyCell.textContent = "Giỏ hàng hiện đang trống.";
    } else {
      items.forEach((item, index) => {
        const row = tbody.insertRow();

        const nameCell = row.insertCell();
        nameCell.textContent = item.name;

        const categoryCell = row.insertCell();
        categoryCell.textContent = item.category || "Điện thoại";

        // Ảnh sản phẩm
        const imageCell = row.insertCell();
        const image = document.createElement("img");
        image.src = String(item.image || "").replace(/\.\.\//g, "");
        image.alt = item.name;
        image.style.width = "80px";
        image.style.objectFit = "contain";
        image.onerror = function handleImageError() {
          this.src = "img/log.png";
        };
        imageCell.appendChild(image);

        const priceCell = row.insertCell();
        priceCell.textContent = formatPrice(item.price);

        // Ô số lượng
        const quantityCell = row.insertCell();
        const quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.min = "1";
        quantityInput.value = String(item.quantity || 1);
        quantityInput.className = "form-control";
        quantityInput.style.width = "80px";
        quantityInput.addEventListener("change", () => {
          CartService.updateQuantity(index, quantityInput.value);
          renderCartTable();
        });
        quantityCell.appendChild(quantityInput);

        // Nút xóa
        const removeCell = row.insertCell();
        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "btn btn-danger btn-sm";
        removeButton.innerHTML = '<i class="ti-trash"></i> Xóa';
        removeButton.addEventListener("click", () => {
          CartService.removeItem(index);
          renderCartTable();
        });
        removeCell.appendChild(removeButton);
      });
    }

    if (totalElement) {
      totalElement.textContent = `Tổng tiền: ${formatPrice(
        CartService.getTotal(items),
      )}`;
    }
  }

  function getProductPageItems() {
    return $$(".product-item");
  }

  function getProductItemPrice(item) {
    const displayedPrice = parsePrice($(".price-current", item)?.textContent);
    if (displayedPrice > 0) {
      return displayedPrice;
    }

    return parsePrice(item.getAttribute("data-price"));
  }

  // Hiển thị thông báo nếu không có sản phẩm
  function renderProductPageEmptyState(visibleCount) {
    const container = document.getElementById("productListHTML");
    if (!container) {
      return;
    }

    let emptyState = document.getElementById("product-page-empty");
    if (!emptyState) {
      emptyState = document.createElement("div");
      emptyState.id = "product-page-empty";
      emptyState.className = "text-center text-muted py-4";
      container.insertAdjacentElement("afterend", emptyState);
    }

    emptyState.textContent =
      visibleCount === 0 ? "Không tìm thấy sản phẩm phù hợp." : "";
  }

   // Tạo thanh phân trang
  function updatePagination(totalPages) {
    const pagination = document.getElementById("pagination");
    if (!pagination) {
      return;
    }

    pagination.innerHTML = "";

    if (totalPages <= 1) {
      return;
    }

    const buttons = [];

    // Nút Previous
    buttons.push({
      label: '<i class="ti-angle-left"></i>',
      page: productPageState.currentPage - 1,
      disabled: productPageState.currentPage === 1,
      active: false,
    });

    // Nút số trang
    for (let page = 1; page <= totalPages; page += 1) {
      buttons.push({
        label: String(page),
        page,
        disabled: false,
        active: page === productPageState.currentPage,
      });
    }

     // Nút Next
    buttons.push({
      label: '<i class="ti-angle-right"></i>',
      page: productPageState.currentPage + 1,
      disabled: productPageState.currentPage === totalPages,
      active: false,
    });

    buttons.forEach((buttonData) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `page-btn${buttonData.active ? " active" : ""}`;
      button.innerHTML = buttonData.label;
      button.disabled = buttonData.disabled;

      button.addEventListener("click", () => {
        if (!buttonData.disabled) {
          changePage(buttonData.page);
        }
      });

      pagination.appendChild(button);
    });
  }

    // Logic chính hiển thị/lọc/sắp xếp sản phẩm
  function runProductLogic() {
    const container = document.getElementById("productListHTML");
    if (!container) {
      return;
    }

    const searchInput = document.getElementById("searchInput");
    const countLabel = document.getElementById("countLabel");
    const allItems = getProductPageItems();
    const keyword = normalizeText(searchInput ? searchInput.value : "");

    // Lọc theo category, từ khóa, khoảng giá
    let visibleItems = allItems.filter((item) => {
      const matchesCategory =
        productPageState.currentCategory === "all" ||
        item.classList.contains(productPageState.currentCategory);

      const title = normalizeText($(".product-title", item)?.textContent);
      const matchesKeyword = !keyword || title.includes(keyword);

      const itemPrice = getProductItemPrice(item);
      const matchesPrice = itemPrice >= priceFilterState.min
            && itemPrice <= priceFilterState.max;

      return matchesCategory && matchesKeyword && matchesPrice;
    });

    // Sắp xếp
    if (productPageState.currentSort !== "default") {
      visibleItems = visibleItems.sort((a, b) => {
        const priceA = getProductItemPrice(a);
        const priceB = getProductItemPrice(b);

        return productPageState.currentSort === "asc"
          ? priceA - priceB
          : priceB - priceA;
      });
    }

    // Ẩn tất cả, chỉ hiện item của trang hiện tại
    allItems.forEach((item) => {
      item.style.display = "none";
    });

    const totalPages =
      visibleItems.length === 0
        ? 0
        : Math.ceil(visibleItems.length / PRODUCT_PAGE_CONFIG.itemsPerPage);

    if (totalPages === 0) {
      productPageState.currentPage = 1;
    } else {
      productPageState.currentPage = Math.min(
        Math.max(productPageState.currentPage, 1),
        totalPages,
      );
    }

    const startIndex =
      (productPageState.currentPage - 1) * PRODUCT_PAGE_CONFIG.itemsPerPage;
    const endIndex = startIndex + PRODUCT_PAGE_CONFIG.itemsPerPage;
    const currentItems = visibleItems.slice(startIndex, endIndex);

    currentItems.forEach((item) => {
      item.style.display = "block";
      container.appendChild(item);
    });

    if (countLabel) {
      countLabel.textContent = `Hiển thị ${visibleItems.length} sản phẩm`;
    }

    renderProductPageEmptyState(visibleItems.length);
    updatePagination(totalPages);
    persistProductPageState();
  }

    // ================== TRANG DANH SÁCH (listing page) ==================
  function runListingPageLogic() {
    const container = document.getElementById("productList");
    if (!container || document.getElementById("productListHTML")) {
      return;
    }

    const keyword = normalizeText(getValueById("searchInput"));
    const items = $$(".product-item", container);

    items.forEach((item) => {
      const matchesFilter =
        listingPageState.currentFilter === "all" ||
        item.classList.contains(listingPageState.currentFilter);

      const title = normalizeText($(".product-title", item)?.textContent);
      const matchesKeyword = !keyword || title.includes(keyword);

      item.style.display = matchesFilter && matchesKeyword ? "" : "none";
    });
  }

    // Đăng ký
  function singup() {
    preventCurrentEvent();

    const result = AuthService.register({
      username: getValueById("username"),
      email: getValueById("email"),
      password: getValueById("pwd"),
      confirmPassword: getValueById("pre-pwd"),
    });

    if (!result.ok) {
      alert(result.message);
      return false;
    }

    alert("Đăng ký thành công.");
    redirectTo("login.html");
    return false;
  }

    // Đăng nhập
  function login() {
    preventCurrentEvent();

    const result = AuthService.login({
      email: getValueById("email"),
      password: getValueById("pwd"),
    });

    if (!result.ok) {
      alert(result.message);
      return false;
    }

    const isAdmin = normalizeText(result.user.email) === "admin@gmail.com";
    alert(isAdmin ? "Đăng nhập với quyền admin." : "Đăng nhập thành công.");
    redirectTo(isAdmin ? "Admin/dashboard.html" : "index.html");
    return false;
  }

    // Đăng xuất
  function logout() {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      AuthService.logout();
      redirectTo("login.html");
    }

    return false;
  }

    // Xóa form đăng ký
  function cancel() {
    setValueById("username", "");
    setValueById("email", "");
    setValueById("pwd", "");
    setValueById("pre-pwd", "");
    return false;
  }

    // Quay về trang chủ
  function turnback() {
    redirectTo("index.html");
    return false;
  }

    // Thêm vào giỏ hàng
  function addToCart(name, category, image, price) {
    CartService.addItem({
      name,
      category,
      image,
      price,
      quantity: 1,
    });

    if (document.getElementById("cart")) {
      renderCartTable();
    }

    return true;
  }

    // Lọc theo category (product page)
  function filterHTML(category, element) {
    productPageState.currentCategory = category || "all";
    productPageState.currentPage = 1;

    $$(".category-item").forEach((item) => item.classList.remove("active"));
    if (element) {
      element.classList.add("active");
    }

    runProductLogic();
  }

    // Tìm kiếm (product page)
  function searchHTML() {
    productPageState.currentPage = 1;
    runProductLogic();
  }

    // Sắp xếp (product page)
  function sortHTML(type) {
    productPageState.currentSort = type || "default";
    productPageState.currentPage = 1;
    runProductLogic();
  }

    // Chuyển trang (product page)
  function changePage(page) {
    productPageState.currentPage = page;
    runProductLogic();

    const container = document.getElementById("productListHTML");
    if (container) {
      container.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

    // Lọc danh sách (listing page)
  function filterSelection(category, button) {
    listingPageState.currentFilter = category || "all";

    $$(".filter-btn").forEach((item) => item.classList.remove("active"));
    if (button) {
      button.classList.add("active");
    }

    runListingPageLogic();
  }

    // Tìm kiếm (listing page)
  function searchProduct() {
    runListingPageLogic();
  }

    // Cập nhật UI header (gọi khi cần)
  function checkLoginStatus() {
    updateHeaderUserUI();
  }

  // ================== INITIALIZATION ==================
  function init() {
    updateHeaderUserUI();
    renderCartTable();
    hydrateProductPageStateFromUrl();
    runProductLogic();
    runListingPageLogic();
    syncProductReturnLinks();
    initDetailStoragePricing();
    // Cập nhật badge giỏ hàng khi localStorage thay đổi từ tab khác
    window.addEventListener("storage", function(e) {
      if (e.key === STORAGE_KEYS.cart) {
        updateCartBadge();
      }
    });
  }
  
  // Đưa các hàm ra global scope để HTML gọi được
  window.updateCartBadge = updateCartBadge;
  window.singup = singup;
  window.login = login;
  window.logout = logout;
  window.cancel = cancel;
  window.turnback = turnback;
  window.addToCart = addToCart;
  window.filterHTML = filterHTML;
  window.searchHTML = searchHTML;
  window.sortHTML = sortHTML;
  window.changePage = changePage;
  window.filterSelection = filterSelection;
  window.searchProduct = searchProduct;
  window.checkLoginStatus = checkLoginStatus;
  window.priceFilterState = priceFilterState;
  window.runProductLogic  = runProductLogic;

  document.addEventListener("DOMContentLoaded", init);
})();
      // === Nút cuộn lên đầu trang ===
      const toTopBtn = document.querySelector(".to-top");
      window.addEventListener("scroll", () => {
        if (window.pageYOffset > 50) toTopBtn.classList.add("active");
        else toTopBtn.classList.remove("active");
      });
      $(".to-top").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 800);
        return false;
      });

      document.addEventListener("DOMContentLoaded", function () {
        const submenuToggles = document.querySelectorAll(".submenu-toggle");

        submenuToggles.forEach((toggle) => {
          toggle.addEventListener("click", function (e) {
            e.preventDefault();
            const parentLi = this.parentElement;
            parentLi.classList.toggle("active");
          });
        });
      });

      // === Swiper slider (trang chủ) ===
      $(document).ready(function () {
        if ($(".mainSlider").length > 0) {
          new Swiper(".mainSlider", {
            loop: true,
            autoplay: {
              delay: 3500,
              disableOnInteraction: false,
            },
            pagination: {
              el: ".swiper-pagination",
              clickable: true,
            },
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
          });
        }
      });

    // === Cập nhật giao diện user từ localStorage ===
    document.addEventListener("DOMContentLoaded", function() {
        const storedUser = localStorage.getItem('username');
        const displaySpan = document.getElementById('display-username');
        const userMenu = document.getElementById('user-menu');

        if (storedUser && displaySpan) {
            displaySpan.innerText = storedUser.split('@')[0];

            if (userMenu) {
                userMenu.innerHTML = `
                    <li><a class="dropdown-item text-secondary" href="#">Hồ sơ cá nhân</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-secondary" href="#" id="logout-btn">Đăng xuất</a></li>
                `;
              document.getElementById('logout-btn').addEventListener('click', function(e) {
                    e.preventDefault();
                    localStorage.removeItem('username');
                    window.location.reload();
                });
            }
        }
    });
