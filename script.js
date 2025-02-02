// Função para redirecionar para a página de pagamento da "Kiwify"
function comprarPack(link) {
    window.location.href = link;
}

// Função para abrir/fechar o menu e overlay
function toggleMenu() {
    const menu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.menu-overlay');

    if (menu) {
        menu.classList.toggle('open');
        overlay.classList.toggle('active');
        console.log("📂 Menu hambúrguer " + (menu.classList.contains("open") ? "aberto" : "fechado"));
    }
}

// Fecha o menu ao clicar fora dele (overlay)
function closeMenu() {
    const menu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.menu-overlay');

    if (menu.classList.contains('open')) {
        menu.classList.remove('open');
        overlay.classList.remove('active');
        console.log("❌ Menu fechado ao clicar fora");
    }
}

// Espera o DOM carregar antes de adicionar eventos
document.addEventListener('DOMContentLoaded', function () {
    console.log("✅ Script.js inicializado");

    // Botão hambúrguer
    const menuButton = document.querySelector('.hamburger');
    if (menuButton) {
        menuButton.addEventListener('click', toggleMenu);
        console.log("🍔 Botão de menu hambúrguer ativado.");
    }

    // Captura clique no overlay para fechar o menu
    const overlay = document.querySelector('.menu-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }

    // Captura clique em qualquer link dentro do menu para fechar
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
});


// Função para validar se o token JWT ainda é válido
function isTokenValid(token) {
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const now = Math.floor(Date.now() / 1000);
        return payload.exp > now;
    } catch (e) {
        console.error("⚠ Token inválido:", e);
        return false;
    }
}

// Função de logout unificada para evitar código duplicado
function logoutUser() {
    localStorage.removeItem("userToken");
    console.log("🔴 Usuário fez logout.");
    window.location.href = "index.html";
}

// Executa ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
    console.log("✅ Página carregada - Inicializando script.js...");

    // 📌 Botão de hambúrguer - adiciona evento de clique
    const menuButton = document.querySelector('.hamburger');
    if (menuButton) {
        menuButton.addEventListener('click', toggleMenu);
        console.log("🍔 Botão de menu hambúrguer ativado.");
    } else {
        console.warn("⚠ Botão de menu hambúrguer não encontrado.");
    }

    // 📌 Verifica se o usuário está logado
    const userToken = localStorage.getItem("userToken");
    const isLoggedIn = userToken && isTokenValid(userToken);

    // 📌 Seleciona os links de Login/Logout e Members
    const loginLink = document.querySelector('.nav-links li a[href="login.html"]');
    const loginLinkMobile = document.querySelector('.mobile-menu a[href="login.html"]');
    const membersLink = document.querySelector('.nav-links li a[href="members.html"]');
    const membersLinkMobile = document.querySelector('.mobile-menu a[href="members.html"]');

    // 📌 Se estiver logado, altera "Login" para "Logout"
    if (isLoggedIn) {
        [loginLink, loginLinkMobile].forEach(link => {
            if (link) {
                link.textContent = "Logout";
                link.href = "#";
                link.addEventListener("click", function (e) {
                    e.preventDefault();
                    logoutUser();
                });
            }
        });
    } else {
        [loginLink, loginLinkMobile].forEach(link => {
            if (link) {
                link.textContent = "Login";
                link.href = "login.html";
            }
        });
    }

    // 📌 Se clicar em "Members" e não estiver logado, redireciona para "login.html"
    [membersLink, membersLinkMobile].forEach(link => {
        if (link) {
            link.addEventListener("click", function (e) {
                if (!isLoggedIn) {
                    e.preventDefault();
                    window.location.href = "login.html";
                }
            });
        }
    });

    // 📌 Se abrir diretamente "members.html" sem estar logado, redireciona para "login.html"
    const currentPage = window.location.pathname.split("/").pop();
    if (currentPage === "members.html" && !isLoggedIn) {
        window.location.href = "login.html";
    }

    // 📌 Redirecionamento do logo para a página inicial
    const navbarLogo = document.querySelector('.navbar-left img');
    if (navbarLogo) {
        navbarLogo.addEventListener('click', function () {
            window.location.href = "catalog.html";
        });
    }
});
