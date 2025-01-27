// script.js - Correções aplicadas
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Função para adicionar ao carrinho
function adicionarAoCarrinho(id, nome, preco) {
    const itemExistente = carrinho.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            id: id,
            nome: nome,
            preco: parseFloat(preco),
            quantidade: 1
        });
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarContadorCarrinho();
}

// Atualiza o contador do carrinho
function atualizarContadorCarrinho() {
    document.getElementById('contador-carrinho').textContent =
        carrinho.reduce((acc, item) => acc + item.quantidade, 0).toString();
}

// Função de pagamento revisada
async function iniciarPagamento() {
    if (carrinho.length === 0) {
        alert('Carrinho vazio!');
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

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (!data.init_point) {
            console.error("Erro: init_point não encontrado na resposta da API.");
            return alert("Erro ao processar pagamento. Tente novamente mais tarde.");
        }

        // Limpa o carrinho após o pagamento
        localStorage.removeItem('carrinho');
        carrinho = [];
        atualizarContadorCarrinho();

        // Redirecionamento correto para o Mercado Pago
        window.location.href = data.init_point;

    } catch (error) {
        console.error("Erro no pagamento:", error.message);
        alert(`Erro ao processar pagamento: ${error.message}`);
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    atualizarContadorCarrinho();
    window.iniciarPagamento = iniciarPagamento;
});
