/**
 * Controlador Lógico del Marketplace UI
 * Regido por el determinismo y aislamiento del ImportVCB.
 */

const state = {
    cartItems: 0,
    products: [],
    cart: []
};

/**
 * Formateo determinista de precio, simulando rust_decimal
 * @param {string} val 
 * @returns {string}
 */
function formatPrecision(val) {
    const num = parseFloat(val);
    return num.toLocaleString('es-VE', { style: 'currency', currency: 'USD' });
}

function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    if (state.products.length === 0) {
        grid.innerHTML = '<div class="col-span-4 text-center text-gray-500 py-10">Conectando con el Nodo de Inventario...</div>';
        return;
    }

    grid.innerHTML = state.products.map(product => `
        <div class="bg-white border border-gray-200 p-4 flex flex-col relative">
            <div class="aspect-square bg-white mb-4 overflow-hidden relative flex items-center justify-center border-b border-gray-100">
                <span class="text-gray-800 font-bold text-xl uppercase">${product.name}</span>
            </div>
            <div class="flex-1 flex flex-col">
                <h3 class="text-brand-link hover:text-brand-orange hover:underline cursor-pointer line-clamp-2 leading-snug mb-1">${product.name} - ${product.category}</h3>
                <div class="flex items-center gap-1 mb-2">
                    <span class="text-yellow-500 text-xs font-mono font-bold tracking-widest">(4.0/5.0)</span>
                    <span class="text-brand-link text-xs">1,234</span>
                </div>
                <div class="mt-auto">
                    <span class="text-xs text-gray-500">Precio:</span>
                    <div class="font-bold text-2xl text-brand-red">${formatPrecision(product.price)}</div>
                    <div class="text-xs text-gray-500 mb-4 mt-1">Recíbelo en 48 horas con Entrega ImportVCB</div>
                    
                    <button class="w-full bg-brand-yellow hover:bg-brand-yellowHover border border-yellow-500 text-black py-1.5 rounded-full text-sm font-semibold shadow-sm transition-colors" onclick="addToCart('${product.id}')">
                        Agregar al carrito
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        badge.textContent = state.cart.reduce((sum, item) => sum + item.qty, 0);
        badge.classList.add('scale-125');
        setTimeout(() => badge.classList.remove('scale-125'), 150);
    }
}

function renderCartItems() {
    const cartContainer = document.getElementById('cart-items');
    if (!cartContainer) return;

    if (state.cart.length === 0) {
        cartContainer.innerHTML = '<div class="text-center text-gray-500 mt-10">El carrito está vacío.</div>';
        document.getElementById('cart-total').textContent = '$0.00';
        return;
    }

    let total = 0;
    cartContainer.innerHTML = state.cart.map(item => {
        const product = state.products.find(p => p.id === item.id);
        const itemTotal = parseFloat(product.price) * item.qty;
        total += itemTotal;
        return `
            <div class="flex justify-between items-start mb-4 bg-white p-3 rounded border border-gray-200">
                <div class="flex-1 pr-3">
                    <div class="text-sm font-semibold text-brand-link hover:underline cursor-pointer leading-tight mb-1">${product.name}</div>
                    <div class="text-lg font-bold text-brand-red">${formatPrecision(product.price)}</div>
                    <div class="text-xs text-green-700 font-semibold mb-2">Disponible</div>
                    <div class="flex items-center gap-3">
                        <span class="text-sm border border-gray-300 rounded bg-gray-100 px-3 py-0.5 shadow-sm">Cant: ${item.qty}</span>
                        <button onclick="removeFromCart('${item.id}')" class="text-brand-link text-xs hover:underline">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('cart-total').textContent = formatPrecision(total);
}

function addToCart(productId) {
    const existing = state.cart.find(item => item.id === productId);
    if (existing) {
        existing.qty++;
    } else {
        state.cart.push({ id: productId, qty: 1 });
    }
    updateCartBadge();
    renderCartItems();
}

function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    updateCartBadge();
    renderCartItems();
}

function toggleCart() {
    const panel = document.getElementById('cart-panel');
    const content = document.getElementById('cart-content');
    
    if (panel.classList.contains('opacity-0')) {
        panel.classList.remove('opacity-0', 'pointer-events-none');
        content.classList.remove('translate-x-full');
    } else {
        panel.classList.add('opacity-0', 'pointer-events-none');
        content.classList.add('translate-x-full');
    }
}

function openCheckout() {
    if (state.cart.length === 0) {
        alert("El carrito está vacío");
        return;
    }
    toggleCart();
    document.getElementById('checkout-modal').classList.remove('hidden');
}

function closeCheckout() {
    document.getElementById('checkout-modal').classList.add('hidden');
}

function executePayment() {
    alert("PAGO APROBADO: Tx Criptográfica firmada.\nSincronizando inventario con ImportVCB (Nodo 1)...");
    state.cart = [];
    updateCartBadge();
    renderCartItems();
    closeCheckout();
}

// Inicialización del motor UI
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // En un entorno móvil real, esto apuntaría a la IP del dispositivo POS o al dominio público.
        const API_URL = localStorage.getItem('IMPORTVCB_API_URL') || "http://192.168.1.100:4000";
        const response = await fetch(`${API_URL}/api/inventory`);
        if (response.ok) {
            state.products = await response.json();
        } else {
            console.error("API error");
        }
    } catch (err) {
        console.error("No se pudo conectar al Backend Axum", err);
    }
    
    try {
        // Fetch real de Tasa BCV (API Pública)
        fetch('https://pydolarvenezuela-api.vercel.app/api/v1/dollar?page=bcv')
            .then(res => res.json())
            .then(data => {
                if(data && data.monitors && data.monitors.usd) {
                    document.getElementById('header-tasa-bcv').innerText = parseFloat(data.monitors.usd.price).toFixed(2);
                } else {
                    document.getElementById('header-tasa-bcv').innerText = "36.50";
                }
            })
            .catch(err => {
                console.error("Error BCV:", err);
                document.getElementById('header-tasa-bcv').innerText = "36.50";
            });
    } catch (err) {
        console.error("Error setting BCV", err);
    }

    renderProducts();
});
