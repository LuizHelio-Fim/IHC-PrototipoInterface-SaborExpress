// Data
const products = [
  {
    id: 1,
    name: "X-Burger Clássico",
    category: "sanduiches",
    price: 18.9,
    image: "public/classic-burger.png",
    description: "Hambúrguer suculento com queijo, alface e tomate",
    ingredients: ["Pão", "Hambúrguer", "Queijo", "Alface", "Tomate", "Maionese"],
  },
  {
    id: 2,
    name: "X-Bacon Especial",
    category: "sanduiches",
    price: 22.9,
    image: "public/bacon-burger.png",
    description: "Hambúrguer com bacon crocante e queijo cheddar",
    ingredients: ["Pão", "Hambúrguer", "Bacon", "Queijo Cheddar", "Cebola Caramelizada"],
  },
  {
    id: 3,
    name: "X-Salada Premium",
    category: "sanduiches",
    price: 20.9,
    image: "public/salad-burger.jpg",
    description: "Opção mais leve com vegetais frescos",
    ingredients: ["Pão Integral", "Hambúrguer", "Alface", "Tomate", "Cenoura", "Molho Especial"],
  },
  {
    id: 4,
    name: "X-Tudo Supremo",
    category: "sanduiches",
    price: 28.9,
    originalPrice: 32.9,
    image: "public/supreme-burger.jpg",
    description: "O mais completo! Tudo que você imaginar",
    ingredients: ["Pão", "Hambúrguer Duplo", "Bacon", "Queijo", "Ovo", "Presunto", "Alface", "Tomate"],
  },
  {
    id: 5,
    name: "Batata Frita Grande",
    category: "acompanhamentos",
    price: 12.9,
    image: "public/crispy-french-fries.png",
    description: "Batatas crocantes e sequinhas",
    ingredients: ["Batata", "Sal"],
  },
  {
    id: 6,
    name: "Onion Rings",
    category: "acompanhamentos",
    price: 14.9,
    image: "public/crispy-onion-rings.png",
    description: "Anéis de cebola empanados",
    ingredients: ["Cebola", "Farinha Especial"],
  },
  {
    id: 7,
    name: "Nuggets (10un)",
    category: "acompanhamentos",
    price: 16.9,
    image: "public/crispy-chicken-nuggets.png",
    description: "Nuggets de frango crocantes",
    ingredients: ["Frango", "Empanado Crocante"],
  },
  {
    id: 8,
    name: "Refrigerante Lata",
    category: "bebidas",
    price: 5.9,
    image: "public/soda-can.png",
    description: "Escolha o Refri de sua preferência",
    flavors: ["Coca-Cola", "Guaraná Antarctica", "Fanta Laranja"],
    selectedFlavor: null,
  },
  {
    id: 9,
    name: "Suco Natural 500ml",
    category: "bebidas",
    price: 8.9,
    image: "public/glass-of-orange-juice.png",
    description: "Suco natural fresquinho",
    flavors: ["Laranja", "Limão", "Morango"],
    selectedFlavor: null,
  },
  {
    id: 10,
    name: "Milkshake",
    category: "bebidas",
    price: 12.9,
    originalPrice: 15.9,
    image: "public/classic-milkshake.png",
    description: "Cremoso e delicioso",
    flavors: ["Chocolate", "Morango", "Baunilha"],
    selectedFlavor: null,
  },
  {
    id: 11,
    name: "Combo Clássico",
    category: "combos",
    price: 32.9,
    image: "public/burger-combo.png",
    description: "X-Burger + Batata + Refrigerante",
    ingredients: ["X-Burger", "Batata Média", "Refrigerante"],
  },
  {
    id: 12,
    name: "Combo Família",
    category: "combos",
    price: 89.9,
    originalPrice: 112.4,
    image: "public/family-meal.png",
    description: "3 X-Burgers + 2 Batatas + 3 Refrigerantes",
    ingredients: ["3 X-Burgers", "2 Batatas Grandes", "3 Refrigerantes"],
  },
]

// State
let currentScreen = "splash"
let selectedCategory = "sanduiches"
let selectedProduct = null
let cart = []
let customizations = []
let currentOrder = null
let paymentMethod = "card"
let orderStatus = "preparing"

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  showSplashScreen()
})

function showSplashScreen() {
  const splashScreen = document.getElementById('splash-screen');
  if (splashScreen) {
    splashScreen.classList.add('active');
    splashScreen.style.display = 'flex';
  }
  // Hide all other screens
  document.querySelectorAll(".screen:not(#splash-screen)").forEach((screen) => {
    screen.classList.remove("active")
  })
  currentScreen = "splash"
}

function startOrder() {
  const splashScreen = document.getElementById('splash-screen');
  if (splashScreen) {
    splashScreen.classList.remove('active');
    splashScreen.style.display = 'none';
  }
  navigateTo("home-screen")
}

// Navigation
function navigateTo(screenId, category = null) {
  if (screenId === 'splash-screen') {
    showSplashScreen()
    return
  }
  
  const splashScreen = document.getElementById('splash-screen');
  if (splashScreen) {
    splashScreen.classList.remove('active');
    splashScreen.style.display = 'none';
  }
  
  document.querySelectorAll(".screen:not(#splash-screen)").forEach((screen) => {
    screen.classList.remove("active")
  })
  document.getElementById(screenId).classList.add("active")
  currentScreen = screenId

  if (category) {
    selectedCategory = category
  }

  // Screen-specific actions
  if (screenId === "menu-screen") {
    renderMenu()
  } else if (screenId === "cart-screen") {
    renderCart()
  } else if (screenId === "tracking-screen") {
    renderTracking()
    simulateOrderProgress()
  } else if (screenId === "payment-screen") {
    renderPaymentSummary()
  }

  // Scroll to top
  window.scrollTo(0, 0)
}

// Update cart badges
function updateCartBadges() {
  const count = cart.length
  const badges = ["cart-badge-home", "cart-badge-menu", "cart-badge-nav"]
  badges.forEach((id) => {
    const badge = document.getElementById(id)
    if (badge) {
      badge.textContent = count
      badge.classList.toggle("visible", count > 0)
    }
  })
}

// Menu rendering
function renderMenu() {
  const categories = [
    { name: "Sanduíches", value: "sanduiches" },
    { name: "Acompanhamentos", value: "acompanhamentos" },
    { name: "Bebidas", value: "bebidas" },
    { name: "Combos", value: "combos" },
  ]

  const tabsHtml = categories
    .map(
      (cat) => `
        <button class="category-tab ${selectedCategory === cat.value ? "active" : ""}" 
                onclick="filterByCategory('${cat.value}')">
            ${cat.name}
        </button>
    `,
    )
    .join("")

  document.getElementById("category-tabs").innerHTML = tabsHtml

  const filteredProducts = products.filter((p) => p.category === selectedCategory)
  const productsHtml = filteredProducts
    .map(
      (product) => `
        <div class="product-card" onclick="showProductDetail(${product.id})">
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='/placeholder.svg?height=96&width=96'">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-footer">
                    <div class="product-price-container">
                        ${product.originalPrice ? `<div class="product-original-price">R$ ${product.originalPrice.toFixed(2)}</div>` : ""}
                        <div class="product-price">R$ ${product.price.toFixed(2)}</div>
                    </div>
                    <button class="btn-add" onclick="event.stopPropagation(); showProductDetail(${product.id})">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `,
    )
    .join("")

  document.getElementById("products-grid").innerHTML = productsHtml
}

function filterByCategory(category) {
  selectedCategory = category
  renderMenu()
}

// Product detail
function showProductDetail(productId) {
  selectedProduct = products.find((p) => p.id === productId)
  customizations = []

  const discountPercent = selectedProduct.originalPrice
    ? Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)
    : 0

  const savingsAmount = selectedProduct.originalPrice
    ? (selectedProduct.originalPrice - selectedProduct.price).toFixed(2)
    : 0

  // Renderiza sabores para bebidas
  const flavorsHtml = selectedProduct.flavors
    ? `
        <div class="customizations-section">
            <h3 class="customizations-title">Escolha o sabor</h3>
            <p class="customizations-subtitle">Selecione uma opção:</p>
            <div class="flavors-grid">
                ${selectedProduct.flavors
                  .map(
                    (flavor) => `
                    <div class="flavor-option" onclick="selectFlavor('${flavor}')">
                        <input type="radio" name="flavor" id="flavor-${flavor}" class="flavor-radio">
                        <label for="flavor-${flavor}" class="flavor-label">
                            ${flavor}
                        </label>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>
    `
    : ""

  // Renderiza ingredientes removíveis
  const customizationsHtml =
    selectedProduct.ingredients && selectedProduct.ingredients.length > 0
      ? `
        <div class="customizations-section">
            <h3 class="customizations-title">Personalize seu pedido</h3>
            <p class="customizations-subtitle">Remova ingredientes que não deseja:</p>
            <div class="customizations-grid">
                ${selectedProduct.ingredients
                  .map(
                    (ingredient) => `
                    <div class="customization-item">
                        <input type="checkbox" class="customization-checkbox" 
                               id="custom-${ingredient}" 
                               onchange="toggleCustomization('${ingredient}')">
                        <label class="customization-label" for="custom-${ingredient}">
                            ${ingredient}
                        </label>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>
    `
      : ""

  const detailHtml = `
        <div class="product-header-image">
            <button class="product-back-btn" onclick="navigateTo('menu-screen')">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>
            ${selectedProduct.originalPrice ? `<div class="product-discount-badge">${discountPercent}% OFF</div>` : ""}
            <img src="${selectedProduct.image}" alt="${selectedProduct.name}" onerror="this.src='/placeholder.svg?height=400&width=400'">
        </div>
        <div class="product-detail-info">
            <h2 class="product-detail-name">${selectedProduct.name}</h2>
            <p class="product-detail-description">${selectedProduct.description}</p>
            <div class="product-detail-price-container">
                ${selectedProduct.originalPrice ? `<div class="product-detail-original-price">R$ ${selectedProduct.originalPrice.toFixed(2)}</div>` : ""}
                <div class="product-detail-price">R$ ${selectedProduct.price.toFixed(2)}</div>
                ${selectedProduct.originalPrice ? `<div class="product-savings">Economize R$ ${savingsAmount}</div>` : ""}
            </div>
            ${flavorsHtml}
            ${customizationsHtml}
        </div>
        <div class="fixed-footer">
            <button class="btn btn-primary btn-large" onclick="addToCart()">
                Adicionar ao Carrinho
            </button>
        </div>
    `

  document.getElementById("product-detail-content").innerHTML = detailHtml
  navigateTo("product-screen")
}

function selectFlavor(flavor) {
  if (selectedProduct) {
    selectedProduct.selectedFlavor = flavor
    // Atualiza visualmente a seleção
    document.querySelectorAll('.flavor-option').forEach(option => {
      option.classList.remove('selected')
    })
    event.currentTarget.classList.add('selected')
    document.getElementById(`flavor-${flavor}`).checked = true
  }
}

// Cart operations
function addToCart() {
  // Verifica se é uma bebida e se o sabor foi selecionado
  if (selectedProduct.flavors && !selectedProduct.selectedFlavor) {
    alert('Por favor, selecione um sabor!')
    return
  }

  const existingItem = cart.find((item) => 
    item.id === selectedProduct.id && 
    item.selectedFlavor === selectedProduct.selectedFlavor &&
    JSON.stringify(item.customizations) === JSON.stringify(customizations)
  )
  
  if (existingItem) {
    existingItem.quantity++
  } else {
    cart.push({
      ...selectedProduct,
      quantity: 1,
      customizations: [...customizations],
      selectedFlavor: selectedProduct.selectedFlavor,
    })
  }
  customizations = []
  if (selectedProduct.selectedFlavor) {
    selectedProduct.selectedFlavor = null
  }
  updateCartBadges()
  navigateTo("cart-screen")
}

function updateQuantity(productId, delta, flavor = '') {
  const item = cart.find((i) => i.id === productId && (i.selectedFlavor || '') === flavor)
  if (item) {
    item.quantity += delta
    if (item.quantity <= 0) {
      removeFromCart(productId, flavor)
    } else {
      updateCartBadges()
      renderCart()
    }
  }
}

function removeFromCart(productId, flavor = '') {
  cart = cart.filter((item) => !(item.id === productId && (item.selectedFlavor || '') === flavor))
  updateCartBadges()
  renderCart()
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

function renderCart() {
  const cartContent = document.getElementById("cart-content")
  const cartFooter = document.getElementById("cart-footer")

  if (cart.length === 0) {
    cartContent.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🛒</div>
                <h3 class="empty-title">Carrinho vazio</h3>
                <p class="empty-text">Adicione itens do cardápio</p>
                <button class="btn btn-primary" onclick="navigateTo('menu-screen')">Ver Cardápio</button>
            </div>
        `
    cartFooter.innerHTML = ""
    return
  }

  const itemsHtml = cart
    .map(
      (item) => `
        <div class="cart-item">
            <div class="cart-item-content">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='/placeholder.svg?height=80&width=80'">
                <div class="cart-item-info">
                    <div class="cart-item-header">
                        <div class="cart-item-name">${item.name}</div>
                        <button class="btn-remove" onclick="removeFromCart(${item.id}, '${item.selectedFlavor || ''}')">
                            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                    ${item.selectedFlavor ? `<div class="cart-item-flavor">Sabor: ${item.selectedFlavor}</div>` : ""}
                    ${item.customizations.length > 0 ? `<div class="cart-item-customizations">Sem: ${item.customizations.join(", ")}</div>` : ""}
                    <div class="cart-item-footer">
                        <div class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2)}</div>
                        <div class="quantity-controls">
                            <button class="btn-quantity" onclick="updateQuantity(${item.id}, -1, '${item.selectedFlavor || ''}')">
                                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                            </button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="btn-quantity" onclick="updateQuantity(${item.id}, 1, '${item.selectedFlavor || ''}')">
                                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    )
    .join("")

  cartContent.innerHTML = `<div class="cart-items">${itemsHtml}</div>`

  const total = getCartTotal()
  cartFooter.innerHTML = `
        <div class="cart-summary">
            <div class="cart-summary-row">
                <span>Subtotal</span>
                <span>R$ ${total.toFixed(2)}</span>
            </div>
            <div class="cart-summary-total">
                <span>Total</span>
                <span class="cart-summary-total-value">R$ ${total.toFixed(2)}</span>
            </div>
        </div>
        <button class="btn btn-primary btn-large" onclick="navigateTo('payment-screen')">
            Continuar para Pagamento
        </button>
    `
}

// Payment
function selectPaymentMethod(method) {
  paymentMethod = method
  document.querySelectorAll(".payment-option").forEach((option) => {
    option.classList.remove("active")
  })
  document.querySelector(`[data-method="${method}"]`).classList.add("active")
}

function renderPaymentSummary() {
  const total = getCartTotal()
  const count = cart.length

  const itemsListHtml = cart
    .map(
      (item) => `
    <div class="payment-summary-row">
      <div class="payment-summary-item-info">
        <span>${item.quantity}x ${item.name}</span>
        ${item.customizations.length > 0 ? `<span class="payment-summary-customizations">Sem: ${item.customizations.join(", ")}</span>` : ""}
      </div>
      <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
    </div>
  `
    )
    .join("")
  
  const itemsHtml = `
    ${itemsListHtml}
    <div class="payment-summary-divider"></div>
    <div class="payment-summary-total">
      <span>Total</span>
      <span class="payment-summary-total-value">R$ ${total.toFixed(2)}</span>
    </div>
  `

  const footerHtml = `
    <button class="btn btn-success btn-large" onclick="confirmOrder()">
      Confirmar Pagamento
    </button>
  `

  document.getElementById("payment-summary-items").innerHTML = itemsHtml
  document.getElementById("payment-footer").innerHTML = footerHtml
}

// Order
function confirmOrder() {
  const orderId = `#${Math.floor(Math.random() * 10000)}`
  currentOrder = {
    id: orderId,
    items: [...cart],
    total: getCartTotal(),
    status: "preparing",
    date: new Date().toLocaleString("pt-BR"),
  }

  cart = []
  updateCartBadges()

  const orderHtml = `
        <div class="order-header">
            <span class="order-label">Número do pedido</span>
            <span class="order-id">${currentOrder.id}</span>
        </div>
        <div class="order-details">
            <div class="order-detail-row">
                <span class="order-detail-label">Itens</span>
                <span class="order-detail-value">${currentOrder.items.length}</span>
            </div>
            <div class="order-detail-row">
                <span class="order-detail-label">Total</span>
                <span class="order-detail-value price">R$ ${currentOrder.total.toFixed(2)}</span>
            </div>
            <div class="order-detail-row">
                <span class="order-detail-label">Tempo de preparo</span>
                <span class="order-detail-value time">15-25 min</span>
            </div>
        </div>
    `

  document.getElementById("confirmation-order").innerHTML = orderHtml
  navigateTo("confirmation-screen")
}

// Tracking
function renderTracking() {
  if (!currentOrder) return

  const orderInfoHtml = `
        <div class="tracking-order-header">
            <span class="tracking-order-label">Pedido</span>
            <span class="tracking-order-id">${currentOrder.id}</span>
        </div>
        <div class="tracking-order-date">${currentOrder.date}</div>
    `

  document.getElementById("tracking-order-info").innerHTML = orderInfoHtml
  updateTrackingTimeline()
}

function updateTrackingTimeline() {
  const timelineHtml = `
        <div class="timeline-item">
            <div class="timeline-icon-wrapper">
                <div class="timeline-icon ${orderStatus === "preparing" ? "active" : "complete"}">
                    ${
                      orderStatus === "preparing"
                        ? '<div class="timeline-spinner"></div>'
                        : `
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    `
                    }
                </div>
                ${orderStatus !== "preparing" ? '<div class="timeline-line active"></div>' : ""}
            </div>
            <div class="timeline-content">
                <h3 class="timeline-title">Preparando seu pedido</h3>
                <p class="timeline-description">Estamos preparando seus itens com carinho</p>
            </div>
        </div>

        <div class="timeline-item">
            <div class="timeline-icon-wrapper">
                <div class="timeline-icon ${orderStatus === "ready" ? "active" : orderStatus === "delivered" ? "complete" : "inactive"}">
                    ${
                      orderStatus === "ready"
                        ? '<div class="timeline-spinner"></div>'
                        : `
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            ${orderStatus === "delivered" ? '<polyline points="20 6 9 17 4 12"></polyline>' : '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>'}
                        </svg>
                    `
                    }
                </div>
                ${orderStatus === "delivered" ? '<div class="timeline-line active"></div>' : ""}
            </div>
            <div class="timeline-content">
                <h3 class="timeline-title">Pedido pronto</h3>
                <p class="timeline-description">Seu pedido está pronto! Retire no balcão</p>
            </div>
        </div>

        <div class="timeline-item">
            <div class="timeline-icon-wrapper">
                <div class="timeline-icon ${orderStatus === "delivered" ? "delivered" : "inactive"}">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
            </div>
            <div class="timeline-content">
                <h3 class="timeline-title">Pedido retirado</h3>
                <p class="timeline-description">Aproveite sua refeição!</p>
            </div>
        </div>
    `

  document.getElementById("tracking-timeline").innerHTML = timelineHtml

  const timeHtml =
    orderStatus !== "delivered"
      ? `
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <div class="tracking-time-content">
            <div class="tracking-time-label">Tempo estimado</div>
            <div class="tracking-time-value">${orderStatus === "preparing" ? "15-20 minutos" : "Pronto para retirada"}</div>
        </div>
    `
      : ""

  document.getElementById("tracking-time").innerHTML = timeHtml ? `<div class="tracking-time">${timeHtml}</div>` : ""
}

function simulateOrderProgress() {
  orderStatus = "preparing"
  updateTrackingTimeline()

  setTimeout(() => {
    orderStatus = "ready"
    updateTrackingTimeline()
  }, 3000)

  setTimeout(() => {
    orderStatus = "delivered"
    updateTrackingTimeline()

    const footer = document.getElementById("tracking-footer")
    footer.innerHTML = `
      <button class="btn btn-primary btn-large" onclick="finishOrder()">
        Finalizar Atendimento
      </button>
    `
    
    setTimeout(() => {
      finishOrder()
    }, 8000)
  }, 6000)
}

function finishOrder() {
  // Reset current order and cart
  currentOrder = null
  cart = []
  orderStatus = "preparing"
  updateCartBadges()
  
  // Return to splash screen for next customer
  showSplashScreen()
}
