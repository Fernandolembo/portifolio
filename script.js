// Seleção de elementos
const header = document.getElementById("header");
const backToTopButton = document.getElementById('back-to-top');
const images = document.querySelectorAll('.carousel img');
let currentIndex = 0;

// SISTEMA DE CARRINHO
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    
    // Atualiza o contador no header
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Atualiza os itens do carrinho
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart"><p>🛒 Seu carrinho está vazio</p><p>Adicione cookies para começar!</p></div>';
        document.getElementById('checkout-btn').disabled = true;
    } else {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="changeQuantity(${index}, -1)">−</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="changeQuantity(${index}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${index})">🗑️</button>
                </div>
            </div>
        `).join('');
        document.getElementById('checkout-btn').disabled = false;
    }
    
    // Calcula o total e aplica desconto se necessário
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const hasDiscount = totalItems >= 5;
    const discount = hasDiscount ? subtotal * 0.05 : 0;
    const total = subtotal - discount;
    
    // Atualiza o display do preço
    let priceDisplay = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    if (hasDiscount) {
        priceDisplay += `<br><span class="discount-text">Desconto (5%): -R$ ${discount.toFixed(2).replace('.', ',')}</span><br><strong>Total com Desconto: R$ ${total.toFixed(2).replace('.', ',')}</strong>`;
    }
    
    totalPrice.innerHTML = priceDisplay;
    
    // Salva no localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: parseFloat(price),
            quantity: 1
        });
    }
    
    updateCartDisplay();
    // Abre o carrinho automaticamente
    openCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

function changeQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        updateCartDisplay();
    }
}

function openCart() {
    document.getElementById('cart-modal').classList.add('open');
}

function closeCart() {
    document.getElementById('cart-modal').classList.remove('open');
}

function generateWhatsAppMessage() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    let message = 'Olá! Gostaria de fazer um pedido:\n\n';
    let subtotal = 0;
    let totalItems = 0;
    
    cart.forEach(item => {
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;
        totalItems += item.quantity;
        message += `• ${item.quantity}x Cookie ${item.name} - R$ ${itemSubtotal.toFixed(2).replace('.', ',')}\n`;
    });
    
    // Calcula desconto se houver 5 ou mais cookies
    const hasDiscount = totalItems >= 5;
    const discount = hasDiscount ? subtotal * 0.05 : 0;
    const total = subtotal - discount;
    
    message += `\n*Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
    
    if (hasDiscount) {
        message += `*Desconto (5%): -R$ ${discount.toFixed(2).replace('.', ',')}\n`;
    }
    
    message += `*Total: R$ ${total.toFixed(2).replace('.', ',')}\n\nObrigado! 🍪`;
    
    const whatsappUrl = `https://wa.me/5511945566009?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Limpa o carrinho após enviar
    cart = [];
    updateCartDisplay();
    closeCart();
}

// Event Listeners do Carrinho
document.getElementById('cart-button').addEventListener('click', openCart);
document.getElementById('open-cart-footer').addEventListener('click', openCart);
document.getElementById('close-cart').addEventListener('click', closeCart);
document.getElementById('checkout-btn').addEventListener('click', generateWhatsAppMessage);

// Fecha o carrinho ao clicar fora dele
document.getElementById('cart-modal').addEventListener('click', (e) => {
    if (e.target.id === 'cart-modal') {
        closeCart();
    }
});

// Event listeners para os botões "Adicionar ao Carrinho"
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        const productName = card.dataset.product;
        const productPrice = card.dataset.price;
        addToCart(productName, productPrice);
    });
});

// Atualiza a exibição do carrinho ao carregar a página
updateCartDisplay();

// Atualiza a exibição do carrinho ao carregar a página
updateCartDisplay();

// 1. Controle do Header e Botão Voltar ao Topo durante o Scroll
window.addEventListener("scroll", () => {
    // Muda o fundo do header ao rolar mais de 50px
    header.classList.toggle("scrolled", window.scrollY > 50);

    // Mostra ou esconde o botão de voltar ao topo
    if (window.scrollY > 300) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
});

// 2. Scroll Suave para os links de navegação
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
            closeCart(); // Fecha o carrinho ao navegar
        }
    });
});

// 3. Animação de Entrada (Fade-in) ao rolar a página
const observerOptions = {
    threshold: 0.1 // Ativa quando 10% da seção aparece
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Aplica o observador em todas as seções
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// 4. Funcionalidade do Carrossel (Troca de Imagem)
function changeImage() {
    // Remove a classe 'active' da imagem atual (isso reseta o zoom e a opacidade)
    images[currentIndex].classList.remove('active');
    
    // Calcula o próximo índice (volta ao zero se chegar no final)
    currentIndex = (currentIndex + 1) % images.length;
    
    // Adiciona a classe 'active' na nova imagem (isso inicia o zoom suave do CSS)
    images[currentIndex].classList.add('active');
}

// Troca a imagem a cada 4 segundos (tempo ideal para apreciar o efeito de zoom)
setInterval(changeImage, 4000);

// 5. Clique do Botão Voltar ao Topo
backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
