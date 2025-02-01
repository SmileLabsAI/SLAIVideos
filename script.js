// Função para redirecionar para a página de pagamento da "Kiwify"
function comprarPack(link) {
    window.location.href = link;
}

// Função para abrir/fechar o menu mobile
function toggleMenu() {
    const menu = document.querySelector('.mobile-menu');
    menu.classList.toggle('open');
}

// Executa ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    console.log("Página carregada - Checkout via 'Kiwify' ativo");

    // Verifica se o usuário está logado
    const isLoggedIn = (localStorage.getItem("userLoggedIn") === "true");

    // Seleciona o link de Login/Logout no menu principal
    const loginLink =
        document.querySelector('.nav-links li a[href="login.html"]') ||
        document.querySelector('li a[href="login.html"]');

    // Seleciona o link de Login/Logout no menu mobile
    const loginLinkMobile = document.querySelector('.mobile-menu a[href="login.html"]');

    // Seleciona o link de "Members" no menu principal
    const membersLink = document.querySelector('.nav-links li a[href="members.html"]');
    // Seleciona o link de "Members" no menu mobile
    const membersLinkMobile = document.querySelector('.mobile-menu a[href="members.html"]');

    // Se estiver logado, altera "Login" para "Logout"
    if (isLoggedIn) {
        if (loginLink) {
            loginLink.textContent = "Logout";
            loginLink.href = "#";
            loginLink.addEventListener("click", function(e) {
                e.preventDefault();
                localStorage.removeItem("userLoggedIn");
                window.location.href = "index.html"; // ou outra página de destino
            });
        }
        if (loginLinkMobile) {
            loginLinkMobile.textContent = "Logout";
            loginLinkMobile.href = "#";
            loginLinkMobile.addEventListener("click", function(e) {
                e.preventDefault();
                localStorage.removeItem("userLoggedIn");
                window.location.href = "index.html";
            });
        }
    } else {
        // Senão, mantém "Login"
        if (loginLink) {
            loginLink.textContent = "Login";
            loginLink.href = "login.html";
        }
        if (loginLinkMobile) {
            loginLinkMobile.textContent = "Login";
            loginLinkMobile.href = "login.html";
        }
    }

    // Se clicar em "Members" e não estiver logado, redireciona para "login.html"
    if (membersLink) {
        membersLink.addEventListener("click", function(e) {
            if (!isLoggedIn) {
                e.preventDefault();
                window.location.href = "login.html";
            }
        });
    }
    if (membersLinkMobile) {
        membersLinkMobile.addEventListener("click", function(e) {
            if (!isLoggedIn) {
                e.preventDefault();
                window.location.href = "login.html";
            }
        });
    }

    // Se abrir diretamente "members.html" sem estar logado, redireciona para "login.html"
    const currentPage = window.location.pathname.split("/").pop();
    if (currentPage === "members.html" && !isLoggedIn) {
        window.location.href = "login.html";
    }
    document.addEventListener("DOMContentLoaded", function() {
        document.querySelector('.navbar-left img').addEventListener('click', function() {
            window.location.href = "catalog.html"; // Define a home
        });
    });

});
