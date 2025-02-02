// Função para redirecionar para a página de pagamento da "Kiwify"
function comprarPack(link) {
    window.location.href = link;
}

// Função para abrir/fechar o menu mobile
function toggleMenu() {
    const menu = document.querySelector('.mobile-menu');
    if (menu) {
        menu.classList.toggle('open');
    }
}

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
    console.log("✅ Página carregada - Checkout via 'Kiwify' ativo");

    // Verifica se o usuário está logado usando o token JWT
    const userToken = localStorage.getItem("userToken");
    const isLoggedIn = userToken && isTokenValid(userToken);

    // Seleciona os links de Login/Logout e Members nos menus
    const loginLink = document.querySelector('.nav-links li a[href="login.html"]') || document.querySelector('li a[href="login.html"]');
    const loginLinkMobile = document.querySelector('.mobile-menu a[href="login.html"]');
    const membersLink = document.querySelector('.nav-links li a[href="members.html"]');
    const membersLinkMobile = document.querySelector('.mobile-menu a[href="members.html"]');

    // Se estiver logado, altera "Login" para "Logout"
    if (isLoggedIn) {
        if (loginLink) {
            loginLink.textContent = "Logout";
            loginLink.href = "#";
            loginLink.addEventListener("click", function (e) {
                e.preventDefault();
                logoutUser();
            });
        }
        if (loginLinkMobile) {
            loginLinkMobile.textContent = "Logout";
            loginLinkMobile.href = "#";
            loginLinkMobile.addEventListener("click", function (e) {
                e.preventDefault();
                logoutUser();
            });
        }
    } else {
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
        membersLink.addEventListener("click", function (e) {
            if (!isLoggedIn) {
                e.preventDefault();
                window.location.href = "login.html";
            }
        });
    }
    if (membersLinkMobile) {
        membersLinkMobile.addEventListener("click", function (e) {
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

    // Redirecionamento do logo para a página inicial (catalog.html)
    const navbarLogo = document.querySelector('.navbar-left img');
    if (navbarLogo) {
        navbarLogo.addEventListener('click', function () {
            window.location.href = "catalog.html";
        });
    }

    // Correção: adiciona evento ao botão de hambúrguer para abrir/fechar o menu mobile
    const menuButton = document.querySelector('.hamburger');
    if (menuButton) {
        menuButton.addEventListener('click', toggleMenu);
    }
});
