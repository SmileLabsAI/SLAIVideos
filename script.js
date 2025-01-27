// script.js - Correções finais
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Função para adicionar ao carrinho (remova se não estiver sendo usada no HTML)
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
    const contadorElement = document.getElementById('contador-carrinho');

    if (contadorElement) {
        contadorElement.textContent = carrinho.reduce((acc, item) => acc + item.quantidade, 0).toString();
    } else {
        console.warn("⚠️ Elemento '#contador-carrinho' não encontrado no DOM.");
    }
}

// Função de pagamento revisada
async function iniciarPagamento() {
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
        console.log("✅ Resposta do Backend:", data); // 🔥 Mostra a resposta da API para debug

        if (!response.ok) {
            alert(`Erro no pagamento: ${data.error || `HTTP ${response.status}`}`);
            return;
        }

        // 🔥 Verifica se 'init_point' realmente existe antes de tentar usar
        if (!data.init_point) {
            console.error("⚠️ Erro: 'init_point' não encontrado na resposta da API.", data);
            alert("Erro ao processar pagamento. O backend não retornou a URL do Mercado Pago.");
            return;
        }

        // Limpa o carrinho após o pagamento
        localStorage.removeItem('carrinho');
        carrinho = [];
        atualizarContadorCarrinho();

        // ✅ Redirecionamento correto para o Mercado Pago
        window.location.href = data.init_point;

    } catch (error) {
        console.error("❌ Erro no pagamento:", error.message);
        alert(`Erro ao processar pagamento: ${error.message}`);
    }
}

// Inicialização do script
document.addEventListener('DOMContentLoaded', () => {
    atualizarContadorCarrinho();
    window.iniciarPagamento = iniciarPagamento;
});
