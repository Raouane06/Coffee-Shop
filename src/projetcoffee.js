// Shop functionality
const shop = {
    items: [],
    total: 0,
    
    addItem: function(item) {
        this.items.push(item);
        this.total += item.price;
        this.updateOrder();
        this.showNotice(`${item.name} added to order`);
    },
    
    removeItem: function(index) {
        this.total -= this.items[index].price;
        this.items.splice(index, 1);
        this.updateOrder();
    },
    
    updateOrder: function() {
        // Update cart count
        document.querySelector('.cart-count').textContent = this.items.length;
        
        // Update order items
        const orderItems = document.querySelector('.order-items');
        orderItems.innerHTML = '';
        
        this.items.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'order-item';
            div.innerHTML = `
                <span>${item.name}</span>
                <span>
                    $${item.price.toFixed(2)}
                    <span class="order-item-remove" data-index="${index}">×</span>
                </span>
            `;
            orderItems.appendChild(div);
        });
        
        // Update total
        document.querySelector('.total-amount').textContent = this.total.toFixed(2);
        
        // Save to localStorage
        localStorage.setItem('shopOrder', JSON.stringify(this.items));
    },
    
    showNotice: function(message) {
        const notice = document.createElement('div');
        notice.className = 'added-notice';
        notice.textContent = message;
        document.body.appendChild(notice);
        
        notice.style.display = 'block';
        setTimeout(() => {
            notice.style.display = 'none';
            notice.remove();
        }, 2000);
    },
    
    loadOrder: function() {
        const savedOrder = localStorage.getItem('shopOrder');
        if (savedOrder) {
            this.items = JSON.parse(savedOrder);
            this.total = this.items.reduce((sum, item) => sum + item.price, 0);
            this.updateOrder();
        }
    },
    
    loadMenuItems: function() {
        // Coffee items
        const coffeeTab = document.querySelector('#coffee-tab');
        document.querySelectorAll('#menu .menu-item').forEach(item => {
            const clone = item.cloneNode(true);
            clone.classList.add('shop-item');
            clone.querySelector('.add-to-cart').textContent = 'Add';
            coffeeTab.appendChild(clone);
        });
        
        // Brunch items
        const brunchTab = document.querySelector('#brunch-tab');
        document.querySelectorAll('#brunch .menu-item').forEach(item => {
            const clone = item.cloneNode(true);
            clone.classList.add('shop-item');
            clone.querySelector('.add-to-cart').textContent = 'Add';
            brunchTab.appendChild(clone);
        });
    }
};

// Initialize shop
document.addEventListener('DOMContentLoaded', function() {
    shop.loadOrder();
    shop.loadMenuItems();
    
    // Toggle shop
    document.querySelector('.shop-toggle').addEventListener('click', function() {
        document.querySelector('.shop-overlay').style.display = 'block';
    });
    
    // Close shop
    document.querySelector('.close-shop').addEventListener('click', function() {
        document.querySelector('.shop-overlay').style.display = 'none';
    });
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.shop-items').forEach(tab => {
                tab.style.display = 'none';
            });
            document.querySelector(`#${this.dataset.tab}-tab`).style.display = 'grid';
        });
    });
    
    // Add item to order
    document.querySelector('.shop-container').addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const item = e.target.closest('.menu-item');
            const name = item.querySelector('h3').textContent.split('$')[0].trim();
            const price = parseFloat(item.querySelector('.price').textContent.replace('$', ''));
            shop.addItem({ name, price });
        }
    });
    
    // Remove item
    document.querySelector('.order-items').addEventListener('click', function(e) {
        if (e.target.classList.contains('order-item-remove')) {
            const index = e.target.getAttribute('data-index');
            shop.removeItem(index);
        }
    });
    
    // Checkout
    document.querySelector('.checkout-btn').addEventListener('click', function() {
        if (shop.items.length === 0) {
            alert('Your order is empty');
            return;
        }
        alert(`Order placed! Total: $${shop.total.toFixed(2)}`);
        shop.items = [];
        shop.total = 0;
        shop.updateOrder();
        document.querySelector('.shop-overlay').style.display = 'none';
    });
});