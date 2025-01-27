let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// ✅ Adiciona um item ao carrinho e atualiza o contador
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
        carrinho.push({
            id: id,
            nome: nome,
            preco: preco,
            quantidade: 1
        });
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarContadorCarrinho();
}

// ✅ Atualiza o contador do carrinho na navbar
function atualizarContadorCarrinho() {
    const contadorElement = document.getElementById('contador-carrinho');
    if (contadorElement) {
        contadorElement.textContent = carrinho.reduce((acc, item) => acc + item.quantidade, 0).toString();
    }
}

// ✅ Carrega os itens do carrinho na página "carrinho.html"
function carregarCarrinho() {
    const tabela = document.getElementById('itens-carrinho');
    const totalElement = document.getElementById('total-carrinho');
    if (!tabela || !totalElement) {
        console.error("Erro: Elementos do carrinho não encontrados no DOM");
        return;
    }

    tabela.innerHTML = "";
    let total = 0;

    carrinho.forEach((item, index) => {
        const row = tabela.insertRow();
        row.innerHTML = `
            <td>${item.nome}</td>
            <td>R$ ${item.preco.toFixed(2)}</td>
            <td>
                <button onclick="alterarQuantidade(${index}, -1)">➖</button>
                ${item.quantidade}
                <button onclick="alterarQuantidade(${index}, 1)">➕</button>
            </td>
            <td>R$ ${(item.preco * item.quantidade).toFixed(2)}</td>
            <td><button onclick="removerItem(${index})">❌ Remover</button></td>
        `;
        total += item.preco * item.quantidade;
    });

    totalElement.textContent = `R$ ${total.toFixed(2)}`;
}

// ✅ Modifica a quantidade de itens no carrinho (aumenta/diminui)
function alterarQuantidade(index, delta) {
    if (carrinho[index].quantidade + delta > 0) {
        carrinho[index].quantidade += delta;
    } else {
        carrinho.splice(index, 1);
    }
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    carregarCarrinho();
}

// ✅ Remove um item do carrinho
function removerItem(index) {
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    carregarCarrinho();
}

// ✅ Voltar para o catálogo de vídeos
function voltarCatalogo() {
    window.location.href = "index.html";
}

// ✅ Finalizar a compra e enviar para Mercado Pago
async function finalizarCompra() {
    if (carrinho.length === 0) {
        alert('🛒 Carrinho vazio! Adicione itens antes de continuar.');
        return;
    }

    try {
        const response = await fetch("https://slaivideos-backend-1.onrender.com/api/payment/process", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                items: carrinho.map(item => ({
                    title: item.nome,
                    unit_price: item.preco,
                    quantity: item.quantidade
                }))
            })
        });

        const data = await response.json();
        console.log("✅ Resposta do Backend:", data);

        if (!response.ok || !data.init_point) {
            console.error("⚠️ Erro: 'init_point' não encontrado na resposta da API.", data);
            alert(`Erro ao processar pagamento. O backend não retornou a URL correta.`);
            return;
        }

        localStorage.removeItem('carrinho');
        carrinho = [];
        atualizarContadorCarrinho();
        window.location.href = data.init_point;

    } catch (error) {
        console.error("❌ Erro no pagamento:", error.message);
        alert(`Erro ao processar pagamento: ${error.message}`);
    }
}

// ✅ Inicializa o contador do carrinho ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    atualizarContadorCarrinho();
});
