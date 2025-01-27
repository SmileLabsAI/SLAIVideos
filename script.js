// script.js - Atualizado para adicionar ao carrinho antes de pagar
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Adiciona um item ao carrinho com 1 unidade
function adicionarAoCarrinho(id, nome, preco) {
    const itemExistente = carrinho.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.quantidade += 1;  // ✅ Aumenta a quantidade se já estiver no carrinho
    } else {
        carrinho.push({
            id: id,
            nome: nome,
            preco: parseFloat(preco),
            quantidade: 1  // ✅ Sempre começa com 1 unidade
        });
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarContadorCarrinho();
    alert(`✅ "${nome}" foi adicionado ao carrinho!`);
}

// Atualiza o contador do carrinho na interface
function atualizarContadorCarrinho() {
    const contadorElement = document.getElementById('contador-carrinho');

    if (contadorElement) {
        contadorElement.textContent = carrinho.reduce((acc, item) => acc + item.quantidade, 0).toString();
    }
}

// Envia os itens do carrinho ao backend para processar o pagamento
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
        console.log("✅ Resposta do Backend:", data); // Debug

        if (!response.ok) {
            alert(`Erro no pagamento: ${data.error || `HTTP ${response.status}`}`);
            return;
        }

        if (!data.init_point) {
            console.error("⚠️ Erro: 'init_point' não encontrado na resposta da API.", data);
            alert("Erro ao processar pagamento. O backend não retornou a URL do Mercado Pago.");
            return;
        }

        // ✅ Limpa o carrinho após iniciar o pagamento
        localStorage.removeItem('carrinho');
        carrinho = [];
        atualizarContadorCarrinho();

        // ✅ Redireciona para o Mercado Pago
        window.location.href = data.init_point;

    } catch (error) {
        console.error("❌ Erro no pagamento:", error.message);
        alert(`Erro ao processar pagamento: ${error.message}`);
    }
}

// Inicializa o contador do carrinho ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    atualizarContadorCarrinho();
    window.finalizarCompra = finalizarCompra;
});
