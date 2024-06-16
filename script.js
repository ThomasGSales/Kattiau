document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});

const productForm = document.getElementById('product-form');
const productList = document.getElementById('product-list');
const updateFormContainer = document.getElementById('update-form-container');
const updateForm = document.getElementById('update-form');

productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;

    const product = {
        nome: name,
        preco: price
    };

    await addProduct(product);
    loadProducts();
    productForm.reset();
});

async function addProduct(product) {
    const response = await fetch('http://localhost:3002/adicionar-produto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    });
    if (!response.ok) {
        alert('Erro ao adicionar produto.');
    }
}

async function loadProducts() {
    const response = await fetch('http://localhost:3002/produtos');
    const products = await response.json();
    renderProducts(products);
}

function renderProducts(products) {
    productList.innerHTML = '';
    products.forEach(product => renderProduct(product));
}

function renderProduct(product) {
    const div = document.createElement('div');
    div.classList.add('product');
    div.innerHTML = `
        <h3><a href="product-details.html?id=${product.ID_Produto}">${product.Nome}</a></h3>
        <p>Preço: R$ ${product.Preco}</p>
        <button onclick="deleteProduct(${product.ID_Produto})">Excluir</button>
        <button onclick="updateProduct(${product.ID_Produto})">Atualizar</button>
    `;
    productList.appendChild(div);
}


async function deleteProduct(id) {
    const response = await fetch(`http://localhost:3002/produtos/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        alert('Erro ao deletar produto.');
    } else {
        loadProducts();
    }
}

async function showUpdateForm(id) {
    const response = await fetch(`http://localhost:3002/produtos/${id}`);
    const product = await response.json();
    
    document.getElementById('update-id').value = product.produto.ID_Produto;
    document.getElementById('update-name').value = product.produto.Nome;
    document.getElementById('update-price').value = product.produto.Preco;

    // Preencher outros campos de detalhes aqui

    updateFormContainer.style.display = 'block';
}

async function updateProduct(id) {
    const name = prompt("Novo nome do produto:");
    const price = prompt("Novo preço do produto:");

    const updatedProduct = {
        nome: name,
        preco: price
    };

    const response = await fetch(`http://localhost:3002/produtos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProduct)
    });

    if (!response.ok) {
        alert('Erro ao atualizar produto.');
    } else {
        loadProducts();
    }
}
