// Função para redirecionar para a página de pagamento da Kiwify
function comprarPack(link) {
    window.location.href = link;
}

// Executa ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    console.log("Página carregada - Checkout via Kiwify ativo");
});

function toggleMenu() {
    const menu = document.querySelector('.mobile-menu');
    menu.classList.toggle('open');
}
