// Recupera o carrinho do localStorage ou inicia um vazio
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Instancia o Mercado Pago com a Public Key
const mp = new MercadoPago('SUA_PUBLIC_KEY', {
    locale: 'pt-BR'
});

// Adiciona um item ao carrinho e atualiza o localStorage
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
    const totalCarrinho = document.getElementById('total-carrinho');

    if (!carrinhoContainer) {
        console.error("Elemento 'itens-carrinho' não encontrado no carrinho.html");
        return;
    }

    carrinhoContainer.innerHTML = "";
    let total = 0;

    if (carrinho.length === 0) {
        carrinhoContainer.innerHTML = "<tr><td colspan='5'>🛒 Seu carrinho está vazio.</td></tr>";
        totalCarrinho.textContent = "R$ 0,00";
        return;
    }

    carrinho.forEach((item, index) => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;

        const itemElement = document.createElement("tr");
        itemElement.innerHTML = `
            <td>${item.nome}</td>
            <td>R$ ${item.preco.toFixed(2)}</td>
            <td>${item.quantidade}</td>
            <td>R$ ${subtotal.toFixed(2)}</td>
            <td><button onclick="removerDoCarrinho(${index})">🗑</button></td>
        `;
        carrinhoContainer.appendChild(itemElement);
    });

    totalCarrinho.textContent = `R$ ${total.toFixed(2)}`;
}

// Remove um item do carrinho e atualiza a interface
function removerDoCarrinho(index) {
    if (index < 0 || index >= carrinho.length) {
        console.error("Índice inválido ao remover item do carrinho.");
        return;
    }

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

    const apiUrl = "https://slaivideos-backend-1.onrender.com/api/payment/process";

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({
                items: carrinho.map(item => ({
                    title: item.nome,
                    unit_price: item.preco,
                    quantity: item.quantidade,
                    currency_id: "BRL"
                }))
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ao processar pagamento: ${errorText}`);
        }

        const data = await response.json();

        if (!data.init_point) {
            alert("Erro ao processar pagamento.");
            return;
        }

        localStorage.removeItem('carrinho');
        window.location.href = data.init_point;
    } catch (error) {
        console.error("Erro ao processar pagamento:", error);
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
