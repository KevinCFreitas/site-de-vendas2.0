const products = [
  { id: 1, name: 'Smartwatch Elite', category: 'Wearables', price: 199.99, oldPrice: 249.99, rating: 4.8, color: '#1f2937', emoji: '⌚' },
  { id: 2, name: 'Wireless Headphones', category: 'Audio', price: 129.99, oldPrice: 179.99, rating: 4.9, color: '#374151', emoji: '🎧' },
  { id: 3, name: 'Sneakers Urban', category: 'Calçados', price: 89.99, oldPrice: 112, rating: 4.6, color: '#4b5563', emoji: '👟' },
  { id: 4, name: 'Leather Bag', category: 'Acessórios', price: 149.99, oldPrice: 199.99, rating: 4.7, color: '#78350f', emoji: '👜' },
  { id: 5, name: '4K Smart TV', category: 'Eletrônicos', price: 499.99, oldPrice: 649.99, rating: 4.8, color: '#1e3a8a', emoji: '📺' },
  { id: 6, name: 'Gaming Console', category: 'Games', price: 349.99, oldPrice: 429.99, rating: 4.7, color: '#111827', emoji: '🎮' },
  { id: 7, name: 'Fashion Watch', category: 'Moda', price: 79.99, oldPrice: 129.99, rating: 4.5, color: '#6b7280', emoji: '⌚' },
  { id: 8, name: 'Wireless Speaker', category: 'Audio', price: 59.99, oldPrice: 89.99, rating: 4.6, color: '#334155', emoji: '🔊' }
];

const state = {
  cart: [],
  filteredProducts: products,
  shipping: 0,
  shippingLabel: 'Informe seu CEP para ver o frete.',
  paymentMethod: 'pix'
};

const productsEl = document.getElementById('products');
const bestProductsEl = document.getElementById('best-products');
const resultCountEl = document.getElementById('result-count');
const cartItemsEl = document.getElementById('cart-items');
const subtotalEl = document.getElementById('subtotal');
const shippingTotalEl = document.getElementById('shipping-total');
const paymentAdjustEl = document.getElementById('payment-adjust');
const grandTotalEl = document.getElementById('grand-total');
const paymentMethodEl = document.getElementById('payment-method');
const paymentInfoEl = document.getElementById('payment-info');
const shippingInfoEl = document.getElementById('shipping-info');
const cartBadgeEl = document.getElementById('cart-badge');
const searchEl = document.getElementById('search');
const cepEl = document.getElementById('cep');
const cartPanelEl = document.getElementById('cart-panel');
const overlayEl = document.getElementById('overlay');

function formatBRL(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function getSubtotal() {
  return state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getPaymentAdjust(subtotal, shipping) {
  const partial = subtotal + shipping;
  if (state.paymentMethod === 'pix') return partial * -0.05;
  if (state.paymentMethod === 'card') return partial * 0.03;
  return 0;
}

function getGrandTotal() {
  const subtotal = getSubtotal();
  const adjust = getPaymentAdjust(subtotal, state.shipping);
  return subtotal + state.shipping + adjust;
}

function updateTotals() {
  const subtotal = getSubtotal();
  const adjust = getPaymentAdjust(subtotal, state.shipping);

  subtotalEl.textContent = formatBRL(subtotal);
  shippingTotalEl.textContent = formatBRL(state.shipping);
  paymentAdjustEl.textContent = `${adjust >= 0 ? '+' : '-'} ${formatBRL(Math.abs(adjust))}`;
  grandTotalEl.textContent = formatBRL(getGrandTotal());
  cartBadgeEl.textContent = state.cart.reduce((sum, item) => sum + item.qty, 0);
}

function productCard(product) {
  return `
    <article class="product">
      <div class="product__media" style="background: linear-gradient(135deg, ${product.color}, #8e99ad);">${product.emoji}</div>
      <div class="product__body">
        <h3>${product.name}</h3>
        <p class="meta">${product.category} • ⭐ ${product.rating}</p>
        <div class="price-line">
          <span class="old-price">${formatBRL(product.oldPrice)}</span>
          <span class="current-price">${formatBRL(product.price)}</span>
        </div>
        <button type="button" data-add="${product.id}">Add to Cart</button>
      </div>
    </article>
  `;
}

function renderProducts() {
  if (!state.filteredProducts.length) {
    productsEl.innerHTML = '<p class="empty">Nenhum produto encontrado para essa busca.</p>';
    resultCountEl.textContent = 'Exibindo 0 produtos';
    return;
  }

  resultCountEl.textContent = `Exibindo ${state.filteredProducts.length} produtos`;
  productsEl.innerHTML = state.filteredProducts.slice(0, 4).map(productCard).join('');
  bestProductsEl.innerHTML = state.filteredProducts.slice(4).map(productCard).join('');
}

function renderCart() {
  cartItemsEl.innerHTML = '';

  if (!state.cart.length) {
    cartItemsEl.innerHTML = '<li class="empty">Seu carrinho está vazio.</li>';
    updateTotals();
    return;
  }

  state.cart.forEach((item) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="cart-item__row">
        <div>
          <strong>${item.name}</strong>
          <p class="muted">${formatBRL(item.price)} cada</p>
        </div>
        <strong>${formatBRL(item.price * item.qty)}</strong>
      </div>
      <div class="cart-item__row">
        <div class="qty-actions">
          <button type="button" data-minus="${item.id}">-</button>
          <button type="button" disabled>${item.qty}</button>
          <button type="button" data-plus="${item.id}">+</button>
        </div>
        <button type="button" data-remove="${item.id}">Remover</button>
      </div>
    `;
    cartItemsEl.appendChild(li);
  });

  updateTotals();
}

function addToCart(productId) {
  const product = products.find((p) => p.id === Number(productId));
  if (!product) return;

  const inCart = state.cart.find((item) => item.id === product.id);
  if (inCart) inCart.qty += 1;
  else state.cart.push({ ...product, qty: 1 });

  renderCart();
}

function calculateShipping() {
  const cep = cepEl.value.replace(/\D/g, '');
  const subtotal = getSubtotal();

  if (subtotal === 0) {
    state.shipping = 0;
    state.shippingLabel = 'Adicione itens ao carrinho para calcular o frete.';
    shippingInfoEl.textContent = state.shippingLabel;
    updateTotals();
    return;
  }

  if (cep.length !== 8) {
    state.shipping = 0;
    state.shippingLabel = 'CEP inválido. Use 8 números.';
    shippingInfoEl.textContent = state.shippingLabel;
    updateTotals();
    return;
  }

  if (subtotal >= 299) {
    state.shipping = 0;
    state.shippingLabel = 'Frete grátis aplicado para pedidos acima de R$ 299.';
  } else {
    const region = Number(cep[0]);
    const base = region <= 3 ? 18.9 : region <= 6 ? 24.9 : 31.9;
    state.shipping = base;
    state.shippingLabel = `Frete para CEP ${cep.slice(0, 5)}-${cep.slice(5)}: ${formatBRL(base)} (3 a 7 dias úteis).`;
  }

  shippingInfoEl.textContent = state.shippingLabel;
  updateTotals();
}

function updatePaymentInfo() {
  const methodMap = {
    pix: 'PIX selecionado: desconto de 5% aplicado no total.',
    card: 'Cartão selecionado: taxa de processamento de 3%.',
    boleto: 'Boleto selecionado: sem desconto e sem taxa adicional.'
  };

  paymentInfoEl.textContent = methodMap[state.paymentMethod];
  updateTotals();
}

function openCart() {
  cartPanelEl.classList.add('open');
  overlayEl.classList.add('show');
}

function closeCart() {
  cartPanelEl.classList.remove('open');
  overlayEl.classList.remove('show');
}

document.addEventListener('click', (event) => {
  const addId = event.target.getAttribute('data-add');
  const minusId = event.target.getAttribute('data-minus');
  const plusId = event.target.getAttribute('data-plus');
  const removeId = event.target.getAttribute('data-remove');

  if (addId) {
    addToCart(addId);
    openCart();
  }

  if (minusId) {
    const item = state.cart.find((product) => product.id === Number(minusId));
    if (item) item.qty = Math.max(1, item.qty - 1);
    renderCart();
  }

  if (plusId) {
    const item = state.cart.find((product) => product.id === Number(plusId));
    if (item) item.qty += 1;
    renderCart();
  }

  if (removeId) {
    state.cart = state.cart.filter((product) => product.id !== Number(removeId));
    renderCart();
  }
});

document.getElementById('cart-toggle').addEventListener('click', openCart);
document.getElementById('cart-close').addEventListener('click', closeCart);
overlayEl.addEventListener('click', closeCart);
document.getElementById('calc-shipping').addEventListener('click', calculateShipping);

document.getElementById('checkout').addEventListener('click', () => {
  if (!state.cart.length) {
    alert('Seu carrinho está vazio. Adicione produtos para continuar.');
    return;
  }

  const cep = cepEl.value.replace(/\D/g, '');
  if (cep.length !== 8) {
    alert('Informe um CEP válido para calcular o frete antes de finalizar.');
    return;
  }

  const total = formatBRL(getGrandTotal());
  const paymentLabels = { pix: 'PIX', card: 'Cartão de crédito', boleto: 'Boleto' };
  alert(`Pedido confirmado!\nPagamento: ${paymentLabels[state.paymentMethod]}\nTotal final: ${total}\nEntrega estimada: 3 a 7 dias úteis.`);

  state.cart = [];
  state.shipping = 0;
  state.shippingLabel = 'Informe seu CEP para ver o frete.';
  shippingInfoEl.textContent = state.shippingLabel;
  renderCart();
  closeCart();
});

searchEl.addEventListener('input', (event) => {
  const term = event.target.value.toLowerCase().trim();
  state.filteredProducts = products.filter(
    (product) => product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term)
  );
  renderProducts();
});

paymentMethodEl.addEventListener('change', (event) => {
  state.paymentMethod = event.target.value;
  updatePaymentInfo();
});

renderProducts();
renderCart();
updatePaymentInfo();
