const PRODUCTS = [
  {
    id: "tiramisu",
    name: "Tiramisu Bánh Nhà",
    category: "cake",
    price: 145000,
    tag: "BEST SELLER",
    desc: "Cà phê Arabica · mascarpone · cacao",
    image:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "strawberry",
    name: "Strawberry Shortcake",
    category: "cake",
    price: 185000,
    tag: "MỚI RA LÒ",
    desc: "Dâu tươi · kem vani · cốt bánh mềm",
    image:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "croissant",
    name: "Croissant Bơ Pháp",
    category: "pastry",
    price: 55000,
    tag: "",
    desc: "Bơ Pháp · ủ 48 giờ · vỏ giòn ruộm",
    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "chocolate",
    name: "Chocolate Fudge",
    category: "cake",
    price: 165000,
    tag: "",
    desc: "Chocolate đen · ganache · hạt óc chó",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "cookie",
    name: "Cookie Sô-cô-la",
    category: "cookie",
    price: 75000,
    tag: "SIGNATURE",
    desc: "Chocolate chip · muối biển · hộp 6 cái",
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "matcha",
    name: "Matcha Latte",
    category: "drink",
    price: 65000,
    tag: "",
    desc: "Matcha Uji · sữa tươi · ngọt dịu",
    image:
      "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "cinnamon",
    name: "Cinnamon Roll",
    category: "pastry",
    price: 60000,
    tag: "",
    desc: "Quế Ceylon · cream cheese · nướng mới",
    image:
      "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "lemon",
    name: "Lemon Tart",
    category: "pastry",
    price: 95000,
    tag: "",
    desc: "Chanh vàng · meringue · đế bơ giòn",
    image:
      "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=700&q=85",
  },
];

const CART_KEY = "banh_nha_cart";
const CONTACT_KEY = "banh_nha_messages";
const ORDER_KEY = "banh_nha_orders";

const readJSON = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
};
const money = (value) => new Intl.NumberFormat("vi-VN").format(value) + "đ";
const getCart = () => readJSON(CART_KEY, []);
const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
};

function updateCartCount() {
  const total = getCart().reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll(".cart-count").forEach((el) => {
    el.textContent = total;
  });
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function addToCart(id) {
  const product = PRODUCTS.find((item) => item.id === id);
  if (!product) return;
  const cart = getCart();
  const found = cart.find((item) => item.id === id);
  found ? found.qty++ : cart.push({ id, qty: 1 });
  saveCart(cart);
  showToast(`${product.name} đã được thêm vào giỏ hàng`);
}

function productCard(product) {
  return `<article class="product-card">
    <div class="product-image"><img src="${product.image}" alt="${product.name}" loading="lazy">${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}</div>
    <div class="product-info"><h3>${product.name}</h3><p class="product-desc">${product.desc}</p>
      <div class="product-bottom"><span class="price">${money(product.price)}</span><button class="add-btn" data-add="${product.id}" aria-label="Thêm ${product.name}">+</button></div>
    </div>
  </article>`;
}

function renderProducts(target, products) {
  const element = document.getElementById(target);
  if (element)
    element.innerHTML = products.length
      ? products.map(productCard).join("")
      : '<p class="empty-cart">Không tìm thấy món bánh phù hợp.</p>';
}

function initProducts() {
  if (document.getElementById("featured-products"))
    renderProducts("featured-products", PRODUCTS.slice(0, 3));
  const menu = document.getElementById("menu-products");
  if (!menu) return;
  let category = "all";
  let query = "";
  const draw = () =>
    renderProducts(
      "menu-products",
      PRODUCTS.filter(
        (p) =>
          (category === "all" || p.category === category) &&
          p.name.toLowerCase().includes(query.toLowerCase()),
      ),
    );
  draw();
  document.querySelectorAll(".filter").forEach((button) =>
    button.addEventListener("click", () => {
      document
        .querySelectorAll(".filter")
        .forEach((b) => b.classList.remove("active"));
      button.classList.add("active");
      category = button.dataset.category;
      draw();
    }),
  );
  document
    .getElementById("product-search")
    ?.addEventListener("input", (event) => {
      query = event.target.value;
      draw();
    });
}

function renderCart() {
  const itemsElement = document.getElementById("cart-items");
  const summary = document.getElementById("cart-summary");
  if (!itemsElement || !summary) return;
  const cart = getCart();
  if (!cart.length) {
    itemsElement.innerHTML =
      '<div class="empty-cart"><h2>Giỏ hàng đang trống</h2><p>Hãy chọn một chút ngọt ngào cho ngày hôm nay nhé.</p><a class="btn btn-dark" href="menu.html">Xem thực đơn <span>→</span></a></div>';
    summary.innerHTML = "";
    return;
  }
  const items = cart.map((row) => ({
    ...PRODUCTS.find((p) => p.id === row.id),
    qty: row.qty,
  }));
  const subtotal = items.reduce((sum, p) => sum + p.price * p.qty, 0);
  const shipping = subtotal >= 350000 ? 0 : 25000;
  itemsElement.innerHTML = items
    .map(
      (p) =>
        `<div class="cart-row"><img src="${p.image}" alt="${p.name}"><div><h3>${p.name}</h3><p>${money(p.price)}</p><div class="qty"><button data-minus="${p.id}">−</button><span>${p.qty}</span><button data-plus="${p.id}">+</button><span class="remove" data-remove="${p.id}">Xóa</span></div></div><div class="cart-price">${money(p.price * p.qty)}</div></div>`,
    )
    .join("");
  summary.innerHTML = `<h2>Tóm tắt đơn hàng</h2><div class="summary-line"><span>Tạm tính</span><b>${money(subtotal)}</b></div><div class="summary-line"><span>Phí giao hàng</span><b>${shipping ? money(shipping) : "Miễn phí"}</b></div><div class="summary-line summary-total"><span>Tổng cộng</span><b>${money(subtotal + shipping)}</b></div><button class="btn btn-dark" id="checkout">Tiến hành đặt hàng <span>→</span></button>`;
}

function changeQuantity(id, delta) {
  const cart = getCart();
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;
  item.qty += delta;
  saveCart(item.qty <= 0 ? cart.filter((entry) => entry.id !== id) : cart);
  renderCart();
}

document.addEventListener("click", (event) => {
  const add = event.target.closest("[data-add]");
  if (add) addToCart(add.dataset.add);
  const plus = event.target.closest("[data-plus]");
  if (plus) changeQuantity(plus.dataset.plus, 1);
  const minus = event.target.closest("[data-minus]");
  if (minus) changeQuantity(minus.dataset.minus, -1);
  const remove = event.target.closest("[data-remove]");
  if (remove) {
    changeQuantity(remove.dataset.remove, -99);
    showToast("Đã xóa sản phẩm khỏi giỏ hàng");
  }
  if (event.target.id === "checkout") {
    const orders = readJSON(ORDER_KEY, []);
    orders.push({
      id: Date.now(),
      items: getCart(),
      createdAt: new Date().toISOString(),
      status: "pending",
    });
    localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
    localStorage.removeItem(CART_KEY);
    renderCart();
    updateCartCount();
    showToast("Đặt hàng thành công! Bánh Nhà sẽ liên hệ bạn sớm.");
  }
});

document
  .querySelector(".menu-toggle")
  ?.addEventListener("click", () =>
    document.querySelector(".main-nav")?.classList.toggle("open"),
  );
document.getElementById("contact-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const messages = readJSON(CONTACT_KEY, []);
  messages.push({
    ...Object.fromEntries(new FormData(event.target)),
    createdAt: new Date().toISOString(),
    status: "new",
  });
  localStorage.setItem(CONTACT_KEY, JSON.stringify(messages));
  event.target.reset();
  showToast("Cảm ơn bạn! Tin nhắn đã được gửi đến Bánh Nhà.");
});

updateCartCount();
initProducts();
renderCart();
