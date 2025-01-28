// Recupera o carrinho do localStorage ou inicia um vazio
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Atualiza o número de itens no carrinho na interface
function atualizarContadorCarrinho() {
    const contadorCarrinho = document.getElementById('contador-carrinho');
    if (contadorCarrinho) {
        contadorCarrinho.textContent = carrinho.reduce((acc, item) => acc + item.quantidade, 0).toString();
    }
}

// Adiciona um item ao carrinho
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

// Carrega os itens do carrinho na página
function carregarCarrinho() {
    const carrinhoContainer = document.getElementById('itens-carrinho');
    const totalCarrinho = document.getElementById('total-carrinho');

    if (!carrinhoContainer || !totalCarrinho) {
        console.error("Elementos do carrinho não encontrados no HTML.");
        return;
    }

    carrinhoContainer.innerHTML = "";
    let total = 0;

    if (carrinho.length === 0) {
        carrinhoContainer.innerHTML = "<p>🛒 Seu carrinho está vazio.</p>";
        totalCarrinho.textContent = "R$ 0,00";
        return;
    }

    carrinho.forEach((item, index) => {
        total += item.preco * item.quantidade;

        const itemElement = document.createElement("div");
        itemElement.classList.add("item-carrinho");
        itemElement.innerHTML = `
            <div class="produto">
                <p><strong>${item.nome}</strong></p>
                <p>R$ ${item.preco.toFixed(2)}</p>
            </div>
            <div class="quantidade">
                <button class="diminuir" onclick="alterarQuantidade(${index}, -1)">➖</button>
                <span>${item.quantidade}</span>
                <button class="aumentar" onclick="alterarQuantidade(${index}, 1)">➕</button>
            </div>
            <p class="subtotal">Subtotal: R$ ${(item.preco * item.quantidade).toFixed(2)}</p>
            <button class="remover" onclick="removerDoCarrinho(${index})">🗑 Remover</button>
        `;
        carrinhoContainer.appendChild(itemElement);
    });

    totalCarrinho.textContent = `R$ ${total.toFixed(2)}`;
}

// Altera a quantidade de um item no carrinho
function alterarQuantidade(index, delta) {
    if (carrinho[index]) {
        carrinho[index].quantidade += delta;
        if (carrinho[index].quantidade <= 0) {
            carrinho.splice(index, 1);
        }
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        carregarCarrinho();
        atualizarContadorCarrinho();
    }
}

// Remove um item do carrinho
function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    carregarCarrinho();
    atualizarContadorCarrinho();
}

// Finaliza a compra via Mercado Pago
async function finalizarCompra() {
    if (carrinho.length === 0) {
        alert('🛒 Carrinho vazio! Adicione itens antes de continuar.');
        return;
    }

    try {
        const response = await fetch("https://slaivideos-backend-1.onrender.com/api/payment/process", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({
                items: carrinho.map(item => ({
                    title: item.nome,
                    unit_price: item.preco,
                    quantity: item.quantidade
                }))
            })
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
    if (window.location.pathname.includes("carrinho.html")) {
        carregarCarrinho();
    }
});
