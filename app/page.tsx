"use client"

import { useState, useEffect } from "react"
import {
  ShoppingCart,
  User,
  Clock,
  ChevronRight,
  Plus,
  Minus,
  Trash2,
  MapPin,
  CreditCard,
  Check,
  HomeIcon,
  History,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

// Types
type Product = {
  id: number
  name: string
  category: string
  price: number
  originalPrice?: number
  image: string
  description: string
  ingredients: string[]
}

type CartItem = Product & {
  quantity: number
  customizations: string[]
}

type Order = {
  id: string
  items: CartItem[]
  total: number
  status: "preparing" | "ready" | "delivered"
  date: string
}

// Mock Products Data
const products: Product[] = [
  // Sanduíches
  {
    id: 1,
    name: "X-Burger Clássico",
    category: "sanduiches",
    price: 18.9,
    image: "/classic-burger.png",
    description: "Hambúrguer suculento com queijo, alface e tomate",
    ingredients: ["Pão", "Hambúrguer", "Queijo", "Alface", "Tomate", "Maionese"],
  },
  {
    id: 2,
    name: "X-Bacon Especial",
    category: "sanduiches",
    price: 22.9,
    image: "/bacon-burger.png",
    description: "Hambúrguer com bacon crocante e queijo cheddar",
    ingredients: ["Pão", "Hambúrguer", "Bacon", "Queijo Cheddar", "Cebola Caramelizada"],
  },
  {
    id: 3,
    name: "X-Salada Premium",
    category: "sanduiches",
    price: 20.9,
    image: "/salad-burger.jpg",
    description: "Opção mais leve com vegetais frescos",
    ingredients: ["Pão Integral", "Hambúrguer", "Alface", "Tomate", "Cenoura", "Molho Especial"],
  },
  {
    id: 4,
    name: "X-Tudo Supremo",
    category: "sanduiches",
    originalPrice: 32.9,
    price: 28.9,
    image: "/supreme-burger.jpg",
    description: "O mais completo! Tudo que você imaginar",
    ingredients: ["Pão", "Hambúrguer Duplo", "Bacon", "Queijo", "Ovo", "Presunto", "Alface", "Tomate"],
  },

  // Acompanhamentos
  {
    id: 5,
    name: "Batata Frita Grande",
    category: "acompanhamentos",
    price: 12.9,
    image: "/crispy-french-fries.png",
    description: "Batatas crocantes e sequinhas",
    ingredients: ["Batata", "Sal"],
  },
  {
    id: 6,
    name: "Onion Rings",
    category: "acompanhamentos",
    price: 14.9,
    image: "/crispy-onion-rings.png",
    description: "Anéis de cebola empanados",
    ingredients: ["Cebola", "Farinha Especial"],
  },
  {
    id: 7,
    name: "Nuggets (10un)",
    category: "acompanhamentos",
    price: 16.9,
    image: "/crispy-chicken-nuggets.png",
    description: "Nuggets de frango crocantes",
    ingredients: ["Frango", "Empanado Crocante"],
  },

  // Bebidas
  {
    id: 8,
    name: "Refrigerante Lata",
    category: "bebidas",
    price: 5.9,
    image: "/soda-can.png",
    description: "Coca-Cola, Guaraná ou Fanta",
    ingredients: [],
  },
  {
    id: 9,
    name: "Suco Natural 500ml",
    category: "bebidas",
    price: 8.9,
    image: "/glass-of-orange-juice.png",
    description: "Laranja, Limão ou Morango",
    ingredients: [],
  },
  {
    id: 10,
    name: "Milkshake",
    category: "bebidas",
    originalPrice: 15.9,
    price: 12.9,
    image: "/classic-milkshake.png",
    description: "Chocolate, Morango ou Baunilha",
    ingredients: [],
  },

  // Combos
  {
    id: 11,
    name: "Combo Clássico",
    category: "combos",
    price: 32.9,
    image: "/burger-combo.png",
    description: "X-Burger + Batata + Refrigerante",
    ingredients: ["X-Burger", "Batata Média", "Refrigerante"],
  },
  {
    id: 12,
    name: "Combo Família",
    category: "combos",
    originalPrice: 112.4,
    price: 89.9,
    image: "/family-meal.png",
    description: "3 X-Burgers + 2 Batatas + 3 Refrigerantes",
    ingredients: ["3 X-Burgers", "2 Batatas Grandes", "3 Refrigerantes"],
  },
]

export default function FastFoodApp() {
  // State Management
  const [currentScreen, setCurrentScreen] = useState<
    "splash" | "home" | "menu" | "product" | "cart" | "address" | "payment" | "confirmation" | "tracking" | "history"
  >("splash")
  const [selectedCategory, setSelectedCategory] = useState<string>("sanduiches")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [customizations, setCustomizations] = useState<string[]>([])
  const [orderHistory, setOrderHistory] = useState<Order[]>([])
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [address, setAddress] = useState({ street: "", number: "", complement: "", neighborhood: "" })
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix" | "cash">("card")
  const [orderStatus, setOrderStatus] = useState<"preparing" | "ready" | "delivered">("preparing")

  // Splash Screen Effect
  useEffect(() => {
    if (currentScreen === "splash") {
      const timer = setTimeout(() => setCurrentScreen("home"), 2500)
      return () => clearTimeout(timer)
    }
  }, [currentScreen])

  // Cart Functions
  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1, customizations: [...customizations] } : item,
        ),
      )
    } else {
      setCart([...cart, { ...product, quantity: 1, customizations: [...customizations] }])
    }
    setCustomizations([])
  }

  const updateQuantity = (id: number, delta: number) => {
    setCart(
      cart
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const toggleCustomization = (ingredient: string) => {
    if (customizations.includes(ingredient)) {
      setCustomizations(customizations.filter((i) => i !== ingredient))
    } else {
      setCustomizations([...customizations, ingredient])
    }
  }

  const confirmOrder = () => {
    const newOrder: Order = {
      id: `#${Math.floor(Math.random() * 10000)}`,
      items: [...cart],
      total: getCartTotal(),
      status: "preparing",
      date: new Date().toLocaleString("pt-BR"),
    }
    setCurrentOrder(newOrder)
    setOrderHistory([newOrder, ...orderHistory])
    setCart([])
    setCurrentScreen("confirmation")
  }

  // Tracking Effect
  useEffect(() => {
    // Simulate order progress
    const timer1 = setTimeout(() => setOrderStatus("ready"), 3000)
    const timer2 = setTimeout(() => setOrderStatus("delivered"), 6000)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  // Render Functions for Each Screen
  const renderSplash = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 flex flex-col items-center justify-center animate-fade-in">
      <div className="text-center animate-bounce-in">
        <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-2xl">
          <span className="text-6xl">🍔</span>
        </div>
        <h1 className="text-5xl font-bold text-white mb-2 font-sans">Sabor Express</h1>
        <p className="text-xl text-orange-100">Fast Food de Qualidade</p>
      </div>
      <div className="mt-12">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  )

  const renderHome = () => (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 lg:p-8 rounded-b-3xl shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold font-sans">Sabor Express</h1>
              <p className="text-orange-100 text-sm lg:text-base">Shopping Vitória - Piso 2</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Entrega em 25-35 min</span>
              </div>
              <button
                onClick={() => setCurrentScreen("history")}
                className="relative p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              >
                <User className="w-6 h-6" />
              </button>
              <button
                onClick={() => setCurrentScreen("cart")}
                className="relative p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors lg:block"
              >
                <ShoppingCart className="w-6 h-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
          <div className="flex lg:hidden items-center gap-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Entrega em 25-35 min</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Hero Banner */}
        <div className="p-6 lg:p-8">
          <Card className="bg-gradient-to-r from-yellow-400 to-orange-400 p-6 lg:p-8 rounded-2xl shadow-lg border-0 overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Promoção Especial! 🎉</h2>
              <p className="text-gray-800 mb-4 lg:text-lg">Combo Família com 20% OFF</p>
              <Button
                onClick={() => {
                  setSelectedCategory("combos")
                  setCurrentScreen("menu")
                }}
                className="bg-gray-900 text-white hover:bg-gray-800"
              >
                Ver Ofertas
              </Button>
            </div>
            <div className="absolute right-0 top-0 text-9xl opacity-20">🍔</div>
          </Card>
        </div>

        {/* Quick Categories */}
        <div className="px-6 lg:px-8 mb-6">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">Categorias</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Sanduíches", icon: "🍔", category: "sanduiches" },
              { name: "Acompanhamentos", icon: "🍟", category: "acompanhamentos" },
              { name: "Bebidas", icon: "🥤", category: "bebidas" },
              { name: "Combos", icon: "🎁", category: "combos" },
            ].map((cat) => (
              <Card
                key={cat.category}
                onClick={() => {
                  setSelectedCategory(cat.category)
                  setCurrentScreen("menu")
                }}
                className="p-6 lg:p-8 text-center cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-2 border-transparent hover:border-orange-500"
              >
                <div className="text-4xl lg:text-5xl mb-2">{cat.icon}</div>
                <p className="font-semibold text-gray-900 lg:text-lg">{cat.name}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="px-6 lg:px-8 pb-24">
          <Button
            onClick={() => setCurrentScreen("menu")}
            className="w-full lg:w-auto lg:px-12 bg-gradient-to-r from-orange-500 to-red-500 text-white py-6 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Ver Cardápio Completo
            <ChevronRight className="ml-2" />
          </Button>
        </div>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-around items-center shadow-lg">
        <button className="flex flex-col items-center text-orange-500">
          <HomeIcon className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Início</span>
        </button>
        <button
          onClick={() => setCurrentScreen("menu")}
          className="flex flex-col items-center text-gray-400 hover:text-orange-500 transition-colors"
        >
          <span className="text-2xl mb-1">🍔</span>
          <span className="text-xs">Cardápio</span>
        </button>
        <button
          onClick={() => setCurrentScreen("cart")}
          className="flex flex-col items-center text-gray-400 hover:text-orange-500 transition-colors relative"
        >
          <ShoppingCart className="w-6 h-6 mb-1" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {cart.length}
            </span>
          )}
          <span className="text-xs">Carrinho</span>
        </button>
        <button
          onClick={() => setCurrentScreen("history")}
          className="flex flex-col items-center text-gray-400 hover:text-orange-500 transition-colors"
        >
          <History className="w-6 h-6 mb-1" />
          <span className="text-xs">Pedidos</span>
        </button>
      </div>
    </div>
  )

  const renderMenu = () => (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between p-4 lg:p-6">
            <button
              onClick={() => setCurrentScreen("home")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-6 h-6 rotate-180 text-gray-700" />
            </button>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Cardápio</h2>
            <button
              onClick={() => setCurrentScreen("cart")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 px-4 lg:px-6 pb-4 overflow-x-auto">
            {[
              { name: "Sanduíches", value: "sanduiches" },
              { name: "Acompanhamentos", value: "acompanhamentos" },
              { name: "Bebidas", value: "bebidas" },
              { name: "Combos", value: "combos" },
            ].map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.value
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto p-4 lg:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {products
          .filter((p) => p.category === selectedCategory)
          .map((product) => (
            <Card
              key={product.id}
              onClick={() => {
                setSelectedProduct(product)
                setCurrentScreen("product")
              }}
              className="flex md:flex-col gap-4 p-4 cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-orange-500"
            >
              <div className="w-24 h-24 md:w-full md:h-48 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1 lg:text-lg">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-col gap-1">
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">R$ {product.originalPrice.toFixed(2)}</span>
                    )}
                    <span className="text-lg lg:text-xl font-bold text-orange-600">R$ {product.price.toFixed(2)}</span>
                  </div>
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </div>
  )

  const renderProduct = () => {
    if (!selectedProduct) return null

    return (
      <div className="min-h-screen bg-white pb-32">
        <div className="max-w-5xl mx-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            {/* Product Image */}
            <div className="relative h-64 lg:h-[600px] bg-gradient-to-br from-orange-100 to-orange-50">
              <button
                onClick={() => setCurrentScreen("menu")}
                className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-lg z-10 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-6 h-6 rotate-180 text-gray-700" />
              </button>
              {selectedProduct.originalPrice && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg z-10">
                  {Math.round(
                    ((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100,
                  )}
                  % OFF
                </div>
              )}
              <div className="w-full h-full flex items-center justify-center p-8">
                <Image
                  src={selectedProduct.image || "/placeholder.svg"}
                  alt={selectedProduct.name}
                  width={400}
                  height={400}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6 lg:p-8 lg:overflow-y-auto lg:max-h-[600px]">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h2>
              <p className="text-gray-600 mb-4 lg:text-lg">{selectedProduct.description}</p>
              <div className="mb-6">
                {selectedProduct.originalPrice && (
                  <div className="text-xl text-gray-400 line-through mb-1">
                    R$ {selectedProduct.originalPrice.toFixed(2)}
                  </div>
                )}
                <div className="text-3xl lg:text-4xl font-bold text-orange-600">
                  R$ {selectedProduct.price.toFixed(2)}
                </div>
                {selectedProduct.originalPrice && (
                  <div className="inline-block mt-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    Economize R$ {(selectedProduct.originalPrice - selectedProduct.price).toFixed(2)}
                  </div>
                )}
              </div>

              {/* Customizations */}
              {selectedProduct.ingredients.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-3">Personalize seu pedido</h3>
                  <p className="text-sm text-gray-600 mb-3">Remova ingredientes que não deseja:</p>
                  <div className="space-y-2">
                    {selectedProduct.ingredients.map((ingredient) => (
                      <label
                        key={ingredient}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={customizations.includes(ingredient)}
                          onChange={() => toggleCustomization(ingredient)}
                          className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                        />
                        <span className="text-gray-700">
                          {customizations.includes(ingredient) ? `Sem ${ingredient}` : ingredient}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart Button - Desktop */}
              <div className="hidden lg:block mt-8">
                <Button
                  onClick={() => {
                    addToCart(selectedProduct)
                    setCurrentScreen("cart")
                  }}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Adicionar ao Carrinho
                </Button>
              </div>
            </div>
          </div>

          {/* Add to Cart Button - Mobile */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 shadow-lg">
            <Button
              onClick={() => {
                addToCart(selectedProduct)
                setCurrentScreen("cart")
              }}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Adicionar ao Carrinho
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const renderCart = () => (
    <div className="min-h-screen bg-gray-50 pb-48">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4 lg:p-6">
          <button
            onClick={() => setCurrentScreen("menu")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6 rotate-180 text-gray-700" />
          </button>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Meu Carrinho</h2>
          <div className="w-10"></div>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Carrinho vazio</h3>
          <p className="text-gray-600 mb-6">Adicione itens do cardápio</p>
          <Button onClick={() => setCurrentScreen("menu")} className="bg-orange-500 hover:bg-orange-600 text-white">
            Ver Cardápio
          </Button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-3 lg:gap-8 lg:p-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 p-4 lg:p-0 space-y-4">
            {cart.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900 lg:text-lg">{item.name}</h3>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    {item.customizations.length > 0 && (
                      <p className="text-xs text-gray-600 mb-2">Sem: {item.customizations.join(", ")}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-orange-600 lg:text-lg">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </span>
                      <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-gray-700 hover:text-orange-500 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-gray-900 w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-gray-700 hover:text-orange-500 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Summary - Desktop */}
          <div className="hidden lg:block">
            <Card className="p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Resumo do Pedido</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>R$ {getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxa de entrega</span>
                  <span className="text-green-600 font-medium">Grátis</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t">
                  <span>Total</span>
                  <span className="text-orange-600">R$ {getCartTotal().toFixed(2)}</span>
                </div>
              </div>
              <Button
                onClick={() => setCurrentScreen("address")}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Continuar para Entrega
              </Button>
            </Card>
          </div>

          {/* Summary - Mobile */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 shadow-lg">
            <div className="mb-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>R$ {getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Taxa de entrega</span>
                <span className="text-green-600 font-medium">Grátis</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span className="text-orange-600">R$ {getCartTotal().toFixed(2)}</span>
              </div>
            </div>
            <Button
              onClick={() => setCurrentScreen("address")}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Continuar para Entrega
            </Button>
          </div>
        </div>
      )}
    </div>
  )

  const renderAddress = () => (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between p-4 lg:p-6">
          <button
            onClick={() => setCurrentScreen("cart")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6 rotate-180 text-gray-700" />
          </button>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Endereço de Entrega</h2>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-4">
        <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <MapPin className="w-5 h-5 text-orange-600" />
          <p className="text-sm lg:text-base text-gray-700">Entregamos no Shopping e região próxima</p>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-4 lg:space-y-0">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rua</label>
            <input
              type="text"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              placeholder="Nome da rua"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
            <input
              type="text"
              value={address.number}
              onChange={(e) => setAddress({ ...address, number: e.target.value })}
              placeholder="123"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Complemento</label>
            <input
              type="text"
              value={address.complement}
              onChange={(e) => setAddress({ ...address, complement: e.target.value })}
              placeholder="Apto 101"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
            <input
              type="text"
              value={address.neighborhood}
              onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
              placeholder="Centro"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Quick Options */}
        <div className="pt-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Ou escolha:</p>
          <div className="space-y-2">
            <button
              onClick={() =>
                setAddress({
                  street: "Shopping Vitória",
                  number: "Piso 2",
                  complement: "Praça de Alimentação",
                  neighborhood: "Centro",
                })
              }
              className="w-full p-4 bg-white border-2 border-gray-200 rounded-lg text-left hover:border-orange-500 transition-colors"
            >
              <div className="font-medium text-gray-900">🏢 Retirar no Shopping</div>
              <div className="text-sm text-gray-600">Praça de Alimentação - Piso 2</div>
            </button>
          </div>
        </div>

        {/* Continue Button - Desktop */}
        <div className="hidden lg:block pt-6">
          <Button
            onClick={() => setCurrentScreen("payment")}
            disabled={!address.street || !address.number || !address.neighborhood}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuar para Pagamento
          </Button>
        </div>
      </div>

      {/* Continue Button - Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 shadow-lg">
        <Button
          onClick={() => setCurrentScreen("payment")}
          disabled={!address.street || !address.number || !address.neighborhood}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continuar para Pagamento
        </Button>
      </div>
    </div>
  )

  const renderPayment = () => (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between p-4 lg:p-6">
          <button
            onClick={() => setCurrentScreen("address")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6 rotate-180 text-gray-700" />
          </button>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Pagamento</h2>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-4">
        <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4">Escolha a forma de pagamento</h3>

        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          <div className="space-y-4">
            <button
              onClick={() => setPaymentMethod("card")}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                paymentMethod === "card"
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "card" ? "border-orange-500" : "border-gray-300"
                  }`}
                >
                  {paymentMethod === "card" && <div className="w-3 h-3 bg-orange-500 rounded-full"></div>}
                </div>
                <CreditCard className="w-6 h-6 text-gray-700" />
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900">Cartão de Crédito/Débito</div>
                  <div className="text-sm text-gray-600">Visa, Mastercard, Elo</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setPaymentMethod("pix")}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                paymentMethod === "pix"
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "pix" ? "border-orange-500" : "border-gray-300"
                  }`}
                >
                  {paymentMethod === "pix" && <div className="w-3 h-3 bg-orange-500 rounded-full"></div>}
                </div>
                <span className="text-2xl">💳</span>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900">PIX</div>
                  <div className="text-sm text-gray-600">Pagamento instantâneo</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setPaymentMethod("cash")}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                paymentMethod === "cash"
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "cash" ? "border-orange-500" : "border-gray-300"
                  }`}
                >
                  {paymentMethod === "cash" && <div className="w-3 h-3 bg-orange-500 rounded-full"></div>}
                </div>
                <span className="text-2xl">💵</span>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900">Dinheiro</div>
                  <div className="text-sm text-gray-600">Pagar na entrega</div>
                </div>
              </div>
            </button>
          </div>

          {/* Order Summary */}
          <Card className="p-4 lg:p-6 mt-6 lg:mt-0 bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
            <h4 className="font-bold text-gray-900 mb-3 lg:text-lg">Resumo do Pedido</h4>
            <div className="space-y-2 text-sm lg:text-base">
              <div className="flex justify-between text-gray-700">
                <span>
                  Subtotal ({cart.length} {cart.length === 1 ? "item" : "itens"})
                </span>
                <span>R$ {getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Taxa de entrega</span>
                <span className="text-green-600 font-medium">Grátis</span>
              </div>
              <div className="flex justify-between text-lg lg:text-xl font-bold text-gray-900 pt-2 border-t border-orange-200">
                <span>Total</span>
                <span className="text-orange-600">R$ {getCartTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Confirm Button - Desktop */}
            <div className="hidden lg:block mt-6">
              <Button
                onClick={confirmOrder}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Confirmar Pedido
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Confirm Button - Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 shadow-lg">
        <Button
          onClick={confirmOrder}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          Confirmar Pedido
        </Button>
      </div>
    </div>
  )

  const renderConfirmation = () => (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center p-6">
      <div className="text-center animate-bounce-in max-w-2xl mx-auto">
        <div className="w-24 h-24 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center shadow-xl">
          <Check className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Pedido Confirmado!</h2>
        <p className="text-gray-600 lg:text-lg mb-6">Seu pedido foi recebido com sucesso</p>

        {currentOrder && (
          <Card className="p-6 lg:p-8 mb-6 text-left max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4 pb-4 border-b">
              <span className="text-gray-600">Número do pedido</span>
              <span className="font-bold text-xl lg:text-2xl text-orange-600">{currentOrder.id}</span>
            </div>
            <div className="space-y-2 text-sm lg:text-base">
              <div className="flex justify-between">
                <span className="text-gray-600">Itens</span>
                <span className="font-medium">{currentOrder.items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total</span>
                <span className="font-bold text-orange-600">R$ {currentOrder.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tempo estimado</span>
                <span className="font-medium text-green-600">25-35 min</span>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-3 w-full max-w-md mx-auto">
          <Button
            onClick={() => setCurrentScreen("tracking")}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Acompanhar Pedido
          </Button>
          <Button
            onClick={() => setCurrentScreen("home")}
            variant="outline"
            className="w-full py-4 text-lg font-bold rounded-xl border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 transition-all"
          >
            Voltar ao Início
          </Button>
        </div>
      </div>
    </div>
  )

  const renderTracking = () => (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between p-4 lg:p-6">
          <button
            onClick={() => setCurrentScreen("home")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6 rotate-180 text-gray-700" />
          </button>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Acompanhar Pedido</h2>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Order Info */}
      <div className="max-w-4xl mx-auto p-6 lg:p-8">
        {currentOrder && (
          <Card className="p-6 mb-6 bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 lg:text-lg">Pedido</span>
              <span className="font-bold text-xl lg:text-2xl text-orange-600">{currentOrder.id}</span>
            </div>
            <div className="text-sm lg:text-base text-gray-600">{currentOrder.date}</div>
          </Card>
        )}

        {/* Status Timeline */}
        <div className="space-y-6 lg:space-y-8">
          {/* Preparing */}
          <div className="flex gap-4 lg:gap-6">
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center ${
                  orderStatus === "preparing" || orderStatus === "ready" || orderStatus === "delivered"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {orderStatus === "preparing" ? (
                  <div className="w-6 h-6 lg:w-8 lg:h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Check className="w-6 h-6 lg:w-8 lg:h-8" />
                )}
              </div>
              {(orderStatus === "ready" || orderStatus === "delivered") && (
                <div className="w-1 h-16 lg:h-20 bg-orange-500"></div>
              )}
            </div>
            <div className="flex-1 pt-2 lg:pt-4">
              <h3 className="font-bold text-gray-900 mb-1 lg:text-xl">Preparando seu pedido</h3>
              <p className="text-sm lg:text-base text-gray-600">Estamos preparando seus itens com carinho</p>
            </div>
          </div>

          {/* Ready */}
          <div className="flex gap-4 lg:gap-6">
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center ${
                  orderStatus === "ready" || orderStatus === "delivered"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {orderStatus === "ready" && orderStatus !== "delivered" ? (
                  <div className="w-6 h-6 lg:w-8 lg:h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : orderStatus === "delivered" ? (
                  <Check className="w-6 h-6 lg:w-8 lg:h-8" />
                ) : (
                  <Clock className="w-6 h-6 lg:w-8 lg:h-8" />
                )}
              </div>
              {orderStatus === "delivered" && <div className="w-1 h-16 lg:h-20 bg-orange-500"></div>}
            </div>
            <div className="flex-1 pt-2 lg:pt-4">
              <h3 className="font-bold text-gray-900 mb-1 lg:text-xl">Pedido pronto</h3>
              <p className="text-sm lg:text-base text-gray-600">Seu pedido está pronto para retirada/entrega</p>
            </div>
          </div>

          {/* Delivered */}
          <div className="flex gap-4 lg:gap-6">
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center ${
                  orderStatus === "delivered" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"
                }`}
              >
                <Check className="w-6 h-6 lg:w-8 lg:h-8" />
              </div>
            </div>
            <div className="flex-1 pt-2 lg:pt-4">
              <h3 className="font-bold text-gray-900 mb-1 lg:text-xl">Pedido entregue</h3>
              <p className="text-sm lg:text-base text-gray-600">Aproveite sua refeição!</p>
            </div>
          </div>
        </div>

        {/* Estimated Time */}
        {orderStatus !== "delivered" && (
          <Card className="p-4 lg:p-6 mt-6 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
              <div>
                <div className="font-medium text-gray-900 lg:text-lg">Tempo estimado</div>
                <div className="text-sm lg:text-base text-gray-600">
                  {orderStatus === "preparing" ? "20-30 minutos" : "5-10 minutos"}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="mt-6 space-y-3 max-w-md mx-auto">
          {orderStatus === "delivered" && (
            <Button
              onClick={() => setCurrentScreen("home")}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Fazer Novo Pedido
            </Button>
          )}
          <Button
            onClick={() => setCurrentScreen("history")}
            variant="outline"
            className="w-full py-4 text-lg font-bold rounded-xl border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 transition-all"
          >
            Ver Histórico de Pedidos
          </Button>
        </div>
      </div>
    </div>
  )

  const renderHistory = () => (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4 lg:p-6">
          <button
            onClick={() => setCurrentScreen("home")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6 rotate-180 text-gray-700" />
          </button>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Meus Pedidos</h2>
          <div className="w-10"></div>
        </div>
      </div>

      {orderHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Nenhum pedido ainda</h3>
          <p className="text-gray-600 lg:text-lg mb-6">Faça seu primeiro pedido!</p>
          <Button onClick={() => setCurrentScreen("menu")} className="bg-orange-500 hover:bg-orange-600 text-white">
            Ver Cardápio
          </Button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto p-4 lg:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orderHistory.map((order) => (
            <Card key={order.id} className="p-4 lg:p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-bold text-lg lg:text-xl text-gray-900">{order.id}</div>
                  <div className="text-sm text-gray-600">{order.date}</div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "ready"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {order.status === "delivered" ? "Entregue" : order.status === "ready" ? "Pronto" : "Preparando"}
                </div>
              </div>

              <div className="space-y-2 mb-3">
                {order.items.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="text-sm lg:text-base text-gray-700">
                    {item.quantity}x {item.name}
                  </div>
                ))}
                {order.items.length > 2 && (
                  <div className="text-sm text-gray-500">
                    +{order.items.length - 2} {order.items.length - 2 === 1 ? "item" : "itens"}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-3 border-t">
                <span className="font-bold text-orange-600 lg:text-lg">R$ {order.total.toFixed(2)}</span>
                <Button
                  size="sm"
                  onClick={() => {
                    setCurrentOrder(order)
                    setCurrentScreen("tracking")
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Ver Detalhes
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  // Main Render
  return (
    <div className="mx-auto bg-white min-h-screen relative">
      {currentScreen === "splash" && renderSplash()}
      {currentScreen === "home" && renderHome()}
      {currentScreen === "menu" && renderMenu()}
      {currentScreen === "product" && renderProduct()}
      {currentScreen === "cart" && renderCart()}
      {currentScreen === "address" && renderAddress()}
      {currentScreen === "payment" && renderPayment()}
      {currentScreen === "confirmation" && renderConfirmation()}
      {currentScreen === "tracking" && renderTracking()}
      {currentScreen === "history" && renderHistory()}
    </div>
  )
}
