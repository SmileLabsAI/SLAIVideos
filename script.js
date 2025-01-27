// script.js - Adicionado suporte ao carrinho no modal
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Adiciona um item ao carrinho com 1 unidade
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
    alert(`✅ "${nome}" foi adicionado ao carrinho!`);
}

// Atualiza o contador do carrinho na interface
function atualizarContadorCarrinho() {
    const contadorElement = document.getElementById('contador-carrinho');

    if (contadorElement) {
        contadorElement.textContent = carrinho.reduce((acc, item) => acc + item.quantidade, 0).toString();
    }
}

// Abre o modal do carrinho
function abrirCarrinho() {
    const modal = document.getElementById('modal-carrinho');
    const listaCarrinho = document.getElementById('lista-carrinho');
    const totalCarrinho = document.getElementById('total-carrinho');

    listaCarrinho.innerHTML = "";
    let total = 0;

    carrinho.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)} x ${item.quantidade}`;
        listaCarrinho.appendChild(li);
        total += item.preco * item.quantidade;
    });

    totalCarrinho.textContent = `Total: R$ ${total.toFixed(2)}`;
    modal.style.display = "block";
}

// Fecha o modal do carrinho
function fecharCarrinho() {
    document.getElementById('modal-carrinho').style.display = "none";
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
        if (!data.init_point) {
            alert("Erro ao processar pagamento.");
            return;
        }

        localStorage.removeItem('carrinho');
        carrinho = [];
        atualizarContadorCarrinho();
        window.location.href = data.init_point;

    } catch (error) {
        alert(`Erro ao processar pagamento: ${error.message}`);
    }
}

// Inicializa o contador do carrinho ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    atualizarContadorCarrinho();
});
