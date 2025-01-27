let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

function adicionarAoCarrinho(id, nome, preco) {
    preco = parseFloat(preco);
    if (!id || !nome || isNaN(preco)) {
        console.error("Erro ao adicionar ao carrinho: Parâmetros inválidos", { id, nome, preco });
        return;
    }

    const itemExistente = carrinho.find(item => item.id === id);
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ id, nome, preco, quantidade: 1 });
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarContadorCarrinho();
}

// Atualiza o número de itens no carrinho na interface
function atualizarContadorCarrinho() {
    const contadorCarrinho = document.getElementById('contador-carrinho');
    if (contadorCarrinho) {
        contadorCarrinho.textContent = carrinho.reduce((acc, item) => acc + item.quantidade, 0).toString();
    }
}

// Carrega os itens do carrinho na página carrinho.html
function carregarCarrinho() {
    const carrinhoContainer = document.getElementById('itens-carrinho');
    if (!carrinhoContainer) {
        console.error("Elemento 'itens-carrinho' não encontrado no carrinho.html");
        return;
    }

    carrinhoContainer.innerHTML = "";

    if (carrinho.length === 0) {
        carrinhoContainer.innerHTML = "<p>🛒 Seu carrinho está vazio.</p>";
        return;
    }

    carrinho.forEach((item, index) => {
        const itemElement = document.createElement("div");
        itemElement.innerHTML = `
            <p><strong>${item.nome}</strong> - R$ ${item.preco.toFixed(2)} x ${item.quantidade}</p>
            <button onclick="removerDoCarrinho(${index})">🗑 Remover</button>
        `;
        carrinhoContainer.appendChild(itemElement);
    });
}

// Remove um item do carrinho e atualiza a interface
function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    carregarCarrinho();
    atualizarContadorCarrinho();
}

// Finaliza a compra enviando os dados para o backend
async function finalizarCompra() {
    if (carrinho.length === 0) {
        alert('🛒 Carrinho vazio! Adicione itens antes de continuar.');
        return;
    }

    try {
        const response = await fetch("https://slaivideos-backend-1.onrender.com/api/payment/process", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({ items: carrinho.map(item => ({ title: item.nome, unit_price: item.preco, quantity: item.quantidade })) })
        });

        const data = await response.json();

        if (!response.ok || !data.init_point) {
            alert("Erro ao processar pagamento.");
            return;
        }

        localStorage.removeItem('carrinho');
        window.location.href = data.init_point;
    } catch (error) {
        alert(`Erro ao processar pagamento: ${error.message}`);
    }
}

// Executa ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    atualizarContadorCarrinho();

    // Carregar os itens do carrinho apenas na página carrinho.html
    if (window.location.pathname.includes("carrinho.html")) {
        carregarCarrinho();
    }
});
