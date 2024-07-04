document.addEventListener('DOMContentLoaded', () => {
    let cart = [];
    const categoryButtonsContainer = document.getElementById('category-buttons');
    const productsContainer = document.getElementById('products');
    const cartContainer = document.getElementById('cart');
    const totalContainer = document.getElementById('total');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    function updateCart() {
        cartContainer.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const li = document.createElement('li');
            li.className = 'list-group-item cart-item';
            li.innerHTML = `
                <div class="item-info">
                    <span>${item.name}</span>
                    <span>${item.price} RON</span>
                    <span>
                        <button class="btn btn-sm btn-secondary" data-id="${item.id}" data-action="decrease">-</button>
                        <span>${item.count}</span>
                        <button class="btn btn-sm btn-secondary" data-id="${item.id}" data-action="increase">+</button>
                        <button class="btn btn-sm btn-danger" data-id="${item.id}" data-action="remove">&times;</button>
                    </span>
                </div>
            `;
            cartContainer.appendChild(li);
            total += item.price * item.count;
        });
        totalContainer.innerText = total;
    }

    function loadProducts(category) {
        productsContainer.innerHTML = '';
        if (products[category]) {
            products[category].forEach(product => {
                const col = document.createElement('div');
                col.className = 'col-md-4 mb-4';
                col.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.price} RON</p>
                            <button class="btn btn-primary" data-id="${product.id}">Adaugă în Coș</button>
                        </div>
                    </div>
                `;
                productsContainer.appendChild(col);
            });
        }
    }

    function searchProducts(query) {
        productsContainer.innerHTML = '';
        const results = [];
        for (const category in products) {
            results.push(...products[category].filter(product => product.name.toLowerCase().includes(query.toLowerCase())));
        }
        results.forEach(product => {
            const col = document.createElement('div');
            col.className = 'col-md-4 mb-4';
            col.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.price} RON</p>
                        <button class="btn btn-primary" data-id="${product.id}">Adaugă în Coș</button>
                    </div>
                </div>
            `;
            productsContainer.appendChild(col);
        });
    }

    categoryButtonsContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const category = e.target.getAttribute('data-category');
            loadProducts(category);
        }
    });

    productsContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const id = parseInt(e.target.getAttribute('data-id'));
            const category = Object.keys(products).find(cat => products[cat].some(prod => prod.id === id));
            const product = products[category].find(p => p.id === id);
            const cartItem = cart.find(item => item.id === product.id);
            if (cartItem) {
                cartItem.count++;
            } else {
                cart.push({ ...product, count: 1 });
            }
            updateCart();
        }
    });

    cartContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const id = parseInt(e.target.getAttribute('data-id'));
            const action = e.target.getAttribute('data-action');
            const cartItem = cart.find(item => item.id === id);
            if (action === 'increase') {
                cartItem.count++;
            } else if (action === 'decrease') {
                cartItem.count--;
                if (cartItem.count === 0) {
                    cart = cart.filter(item => item.id !== id);
                }
            } else if (action === 'remove') {
                cart = cart.filter(item => item.id !== id);
            }
            updateCart();
        }
    });

    searchButton.addEventListener('click', () => {
        const query = searchInput.value;
        searchProducts(query);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value;
            searchProducts(query);
        }
    });
});
