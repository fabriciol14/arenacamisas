document.addEventListener('DOMContentLoaded', function() {
    fetch('produtos.json')
        .then(response => response.json())
        .then(products => {
            if (Array.isArray(products)) {
                const productListElement = document.getElementById('product-list');
                products.forEach(product => {
                    const productElement = document.createElement('div');
                    productElement.classList.add('product');
                    productElement.innerHTML = `
                        <a href="product.html?name=${encodeURIComponent(product.name)}&price=${product.price}&image=${encodeURIComponent(product.image)}&description=${encodeURIComponent(product.description || '')}">
                            <img src="${product.image}" alt="${product.name}">
                            <h3>${product.name}</h3>
                            <p>R$ ${product.price.toFixed(2)}</p>
                        </a>
                        <button onclick="addToCart('${product.name}', ${product.price})">Adicionar ao Carrinho</button>
                    `;
                    productListElement.appendChild(productElement);
                });
            } else {
                console.error('Produtos não encontrados ou o formato é inválido.');
            }
        })
        .catch(error => {
            console.error('Erro ao carregar produtos:', error);
        });

    updateCartCount(); // Atualiza o contador do carrinho na inicialização
});

function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(item => item.name === name);
    if (productIndex > -1) {
        cart[productIndex].quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(); // Atualiza o contador do carrinho
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').innerText = cartCount;
}

function openCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    cartItemsElement.innerHTML = '';
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.innerText = `${item.name} - R$ ${item.price.toFixed(2)} x ${item.quantity}`;
        cartItemsElement.appendChild(itemElement);
    });
    const total = cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    cartTotalElement.innerText = `Total: R$ ${total}`;
    document.getElementById('cart-modal').style.display = 'flex';
}

function closeCart() {
    document.getElementById('cart-modal').style.display = 'none';
}

function finalizePurchase() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    window.location.href = `payment.html?total=${totalAmount}`;
}

document.getElementById('cart-icon').addEventListener('click', openCart);
document.querySelector('.close-button').addEventListener('click', closeCart);
