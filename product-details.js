document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    if (productId) {
        loadProductDetails(productId);
    }
});

async function loadProductDetails(id) {
    const response = await fetch(`http://localhost:3002/produtos/${id}`);
    const productDetails = await response.json();
    renderProductDetails(productDetails);
}

function renderProductDetails(details) {
    const productDetails = document.getElementById('product-details');
    const { produto, avaliacoes, detalhesPedido, categorias, fornecedores } = details;

    productDetails.innerHTML = `
        <h2>${produto.Nome}</h2>
        <p>Preço: R$ ${produto.Preco}</p>
        <h3>Avaliações:</h3>
        ${avaliacoes.map(avaliacao => `<p>${avaliacao.texto}</p>`).join('')}
        <h3>Detalhes do Pedido:</h3>
        ${detalhesPedido.map(detalhe => `<p>${detalhe.descricao}</p>`).join('')}
        <h3>Categorias:</h3>
        ${categorias.map(categoria => `<p>${categoria.nome}</p>`).join('')}
        <h3>Fornecedores:</h3>
        ${fornecedores.map(fornecedor => `<p>${fornecedor.nome}</p>`).join('')}
    `;
}

function goBack() {
    window.history.back();
}
