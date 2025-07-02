// Sample products data
let products = [
    {
        id: 1,
        code: '#001',
        name: 'Notebook Dell Inspiron',
        category: 'Eletrônicos',
        price: 2500.00,
        stock: 15,
        minStock: 5,
        description: 'Notebook Dell Inspiron 15 3000, Intel Core i5, 8GB RAM, 256GB SSD'
    },
    {
        id: 2,
        code: '#002',
        name: 'Mouse Logitech MX Master',
        category: 'Periféricos',
        price: 350.00,
        stock: 8,
        minStock: 10,
        description: 'Mouse sem fio Logitech MX Master 3 com sensor Darkfield'
    },
    {
        id: 3,
        code: '#003',
        name: 'Teclado Mecânico Corsair',
        category: 'Periféricos',
        price: 450.00,
        stock: 0,
        minStock: 3,
        description: 'Teclado mecânico Corsair K70 RGB com switches Cherry MX'
    },
    {
        id: 4,
        code: '#004',
        name: 'Monitor Samsung 24"',
        category: 'Eletrônicos',
        price: 800.00,
        stock: 12,
        minStock: 5,
        description: 'Monitor Samsung 24" Full HD IPS com ajuste de altura'
    },
    {
        id: 5,
        code: '#005',
        name: 'Cabo HDMI 2.0',
        category: 'Acessórios',
        price: 25.00,
        stock: 50,
        minStock: 20,
        description: 'Cabo HDMI 2.0 de 1.5 metros com suporte a 4K'
    }
];

let currentProductId = null;
let productIdToDelete = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
});

// Function to get product status
function getProductStatus(stock, minStock) {
    if (stock === 0) return { status: 'Esgotado', class: 'bg-danger' };
    if (stock <= minStock) return { status: 'Baixo', class: 'bg-warning' };
    return { status: 'Normal', class: 'bg-success' };
}

// Function to render products table
function renderProducts(productsToRender = products) {
    const tbody = document.getElementById('productsTable');
    tbody.innerHTML = '';

    productsToRender.forEach(product => {
        const statusInfo = getProductStatus(product.stock, product.minStock);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.code}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>R$ ${product.price.toFixed(2).replace('.', ',')}</td>
            <td>${product.stock}</td>
            <td><span class="badge ${statusInfo.class}">${statusInfo.status}</span></td>
            <td>
                <button class="btn btn-success btn-sm me-1" onclick="viewProduct(${product.id})" title="Visualizar">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-warning btn-sm me-1" onclick="editProduct(${product.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})" title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
        }

// Function to open add product modal
function openAddModal() {
    currentProductId = null;
    document.getElementById('modalTitle').textContent = 'Novo Produto';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}

// Function to view product details
function viewProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const statusInfo = getProductStatus(product.stock, product.minStock);

    document.getElementById('viewCode').textContent = product.code;
    document.getElementById('viewName').textContent = product.name;
    document.getElementById('viewCategory').textContent = product.category;
    document.getElementById('viewPrice').textContent = `R$ ${product.price.toFixed(2).replace('.', ',')}`;
    document.getElementById('viewStock').textContent = product.stock;
    document.getElementById('viewMinStock').textContent = product.minStock;
    document.getElementById('viewStatus').innerHTML = `<span class="badge ${statusInfo.class}">${statusInfo.status}</span>`;
    document.getElementById('viewDescription').textContent = product.description || 'Sem descrição';

    const modal = new bootstrap.Modal(document.getElementById('viewProductModal'));
    modal.show();
}

// Function to edit product
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    currentProductId = id;
    document.getElementById('modalTitle').textContent = 'Editar Produto';
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCode').value = product.code;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productMinStock').value = product.minStock;
    document.getElementById('productDescription').value = product.description || '';

    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}

// Function to save product (add or edit)
function saveProduct() {
    const form = document.getElementById('productForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const productData = {
        name: document.getElementById('productName').value,
        code: document.getElementById('productCode').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        minStock: parseInt(document.getElementById('productMinStock').value),
        description: document.getElementById('productDescription').value
    };

    // Check if code already exists (for new products or different products)
    const existingProduct = products.find(p => p.code === productData.code && p.id !== currentProductId);
    if (existingProduct) {
        alert('Código já existe! Por favor, escolha outro código.');
        return;
    }

    if (currentProductId) {
        // Edit existing product
        const index = products.findIndex(p => p.id === currentProductId);
        if (index !== -1) {
            products[index] = { ...products[index], ...productData };
        }
    } else {
        // Add new product
        const newId = Math.max(...products.map(p => p.id), 0) + 1;
        products.push({ id: newId, ...productData });
    }

    renderProducts();
    updateStats();
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
    modal.hide();

    // Show success message
    showNotification(currentProductId ? 'Produto atualizado com sucesso!' : 'Produto adicionado com sucesso!', 'success');
}

// Function to delete product
function deleteProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    productIdToDelete = id;
    document.getElementById('deleteProductName').textContent = product.name;
    
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
}

// Function to confirm deletion
function confirmDelete() {
    if (productIdToDelete) {
        products = products.filter(p => p.id !== productIdToDelete);
        renderProducts();
        updateStats();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        modal.hide();
        
        showNotification('Produto excluído com sucesso!', 'success');
        productIdToDelete = null;
    }
}

// Function to search products
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    let filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            product.code.toLowerCase().includes(searchTerm) ||
                            product.category.toLowerCase().includes(searchTerm);
        
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        
        let matchesStatus = true;
        if (statusFilter) {
            const status = getProductStatus(product.stock, product.minStock).status;
            matchesStatus = status === statusFilter;
        }

        return matchesSearch && matchesCategory && matchesStatus;
    });

    renderProducts(filteredProducts);
}

// Function to filter products
function filterProducts() {
    searchProducts(); // Reuse search function as it handles all filters
}

// Function to update statistics
function updateStats() {
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.stock <= p.minStock && p.stock > 0).length;
    const outOfStockProducts = products.filter(p => p.stock === 0).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const categories = [...new Set(products.map(p => p.category))].length;

    document.querySelector('.stat-mini-card:nth-child(1) .stat-mini-value').textContent = totalProducts.toLocaleString();
    document.querySelector('.stat-mini-card:nth-child(2) .stat-mini-value').textContent = (lowStockProducts + outOfStockProducts);
    document.querySelector('.stat-mini-card:nth-child(3) .stat-mini-value').textContent = categories;
    document.querySelector('.stat-mini-card:nth-child(4) .stat-mini-value').textContent = 
        `R$ ${(totalValue / 1000000).toFixed(1)}M`;
}

// Function to show notifications
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'info'} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}
// Real-time search as user types
document.getElementById('searchInput').addEventListener('input', searchProducts);

// Format price input
document.getElementById('productPrice').addEventListener('input', function() {
    let value = this.value;
    if (value && !isNaN(value)) {
        // Ensure it's a valid number with at most 2 decimal places
        this.value = parseFloat(value).toFixed(2);
    }
});

// Prevent negative values in stock fields
document.getElementById('productStock').addEventListener('input', function() {
    if (this.value < 0) this.value = 0;
});

document.getElementById('productMinStock').addEventListener('input', function() {
    if (this.value < 0) this.value = 0;
});

// Mobile responsive sidebar
function handleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const isSmallScreen = window.innerWidth <= 768;
    
    if (isSmallScreen) {
        sidebar.classList.add('mobile');
    } else {
        sidebar.classList.remove('mobile', 'show');
    }
}

window.addEventListener('resize', handleMobileMenu);
document.addEventListener('DOMContentLoaded', handleMobileMenu);

// Close sidebar when clicking outside on mobile
document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('sidebar');
    const isSmallScreen = window.innerWidth <= 768;
    
    if (isSmallScreen && sidebar.classList.contains('show')) {
        if (!sidebar.contains(e.target) && !e.target.closest('.sidebar-toggle')) {
            sidebar.classList.remove('show');
        }
    }
});

// Export/Import functionality (placeholder)
function exportProducts() {
    const dataStr = JSON.stringify(products, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'produtos_' + new Date().toISOString().split('T')[0] + '.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Add export button functionality (can be added to UI later)
console.log('Sistema de Produtos carregado com sucesso!');
console.log('Atalhos disponíveis: Ctrl+N (Novo Produto), Esc (Fechar Modal)');