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

function atualizarContadorCarrinho() {
    document.getElementById('contador-carrinho').textContent = carrinho.reduce((acc, item) => acc + item.quantidade, 0).toString();
}

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

document.addEventListener('DOMContentLoaded', () => {
    atualizarContadorCarrinho();
});
