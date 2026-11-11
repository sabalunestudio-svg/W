(() => {
  const cart = [];
  const drawer = document.getElementById("cartDrawer");
  const itemsHost = document.getElementById("cartItems");
  const countNodes = document.querySelectorAll(".cart-count");
  const totalNode = document.getElementById("cartTotal");
  const backdrop = document.querySelector(".cart-backdrop");
  const toast = document.createElement("div");
  toast.className = "cart-toast";
  toast.setAttribute("role", "status");
  document.body.appendChild(toast);
  let toastTimer;

  const digits = value => String(value).replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
  const numberFromPrice = value => Number(digits(value).replace(/[^\d]/g, "")) || 0;
  const faNumber = value => Number(value).toLocaleString("fa-IR");
  const money = value => `${faNumber(value)} تومان`;

  function notify(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function openCart() {
    document.body.classList.add("cart-open");
    drawer.setAttribute("aria-hidden", "false");
  }
  function closeCart() {
    document.body.classList.remove("cart-open");
    drawer.setAttribute("aria-hidden", "true");
  }

  function renderCart() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    countNodes.forEach(node => node.textContent = faNumber(count));
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    totalNode.textContent = money(total);

    if (!cart.length) {
      itemsHost.innerHTML = `<div class="cart-empty"><span>✳</span><h3>سبدت هنوز خالیه</h3><p>از بین رایحه‌های نُوا انتخاب کن و به سبدت اضافه کن.</p><button type="button" data-close-cart>دیدن محصولات</button></div>`;
      return;
    }

    itemsHost.innerHTML = cart.map(item => `
      <article class="cart-row" data-item-id="${item.id}">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h4>${item.name}</h4>
          <div class="cart-price">${money(item.price)}</div>
          <div class="qty-control">
            <button type="button" data-qty="-1" aria-label="کم کردن تعداد">−</button>
            <span>${faNumber(item.qty)}</span>
            <button type="button" data-qty="1" aria-label="زیاد کردن تعداد">＋</button>
          </div>
        </div>
        <button class="cart-remove" type="button" data-remove>حذف</button>
      </article>
    `).join("");
  }

  document.addEventListener("click", event => {
    const addButton = event.target.closest(".add-to-cart");
    if (addButton) {
      const name = addButton.dataset.name;
      const existing = cart.find(item => item.name === name);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          name,
          price: numberFromPrice(addButton.dataset.price),
          image: addButton.dataset.image,
          qty: 1
        });
      }
      renderCart();
      openCart();
      notify(`${name} به سبد خرید اضافه شد`);
      return;
    }

    if (event.target.closest("[data-open-cart]")) {
      openCart();
      return;
    }
    if (event.target.closest("[data-close-cart]")) {
      closeCart();
      return;
    }

    const row = event.target.closest(".cart-row");
    if (row) {
      const item = cart.find(product => product.id === row.dataset.itemId);
      if (!item) return;
      if (event.target.closest("[data-remove]")) {
        cart.splice(cart.indexOf(item), 1);
        renderCart();
        return;
      }
      const qtyButton = event.target.closest("[data-qty]");
      if (qtyButton) {
        item.qty += Number(qtyButton.dataset.qty);
        if (item.qty <= 0) cart.splice(cart.indexOf(item), 1);
        renderCart();
      }
    }

    if (event.target.closest("#checkoutDemo")) {
      notify("این نسخه برای نمایش است؛ پرداخت واقعی فعال نیست.");
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeCart();
  });

  renderCart();
})();