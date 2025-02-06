// Função para redirecionar para a página de pagamento da "Kiwify"
function comprarPack(link) {
    window.location.href = link;
}

// Função para abrir/fechar o menu mobile
function toggleMenu() {
    const menu = document.querySelector('.mobile-menu');
    if (menu) {
        menu.classList.toggle('open');
        console.log(menu.classList.contains('open')
            ? "📂 Menu hambúrguer aberto"
            : "❌ Menu hambúrguer fechado");
    }
}

// Fecha o menu ao clicar em um link dentro dele
function closeMenu() {
    const menu = document.querySelector('.mobile-menu');
    if (menu && menu.classList.contains('open')) {
        menu.classList.remove('open');
        console.log("❌ Menu fechado ao clicar fora ou em um link");
    }
}

// Espera o DOM carregar antes de adicionar eventos
document.addEventListener('DOMContentLoaded', function () {
    console.log("✅ Script.js inicializado");

    // Botão hambúrguer
    const menuButton = document.querySelector('.hamburger');
    if (menuButton) {
        menuButton.addEventListener('click', toggleMenu);
        // Remove o atributo inline para evitar chamada dupla da função
        menuButton.removeAttribute('onclick');
        console.log("🍔 Botão de menu hambúrguer ativado.");
    }

    // Captura clique em qualquer link dentro do menu para fechar
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

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

    // --> Adicionando código para ocultar o botão "Sign In" caso o usuário esteja logado
    const signInButton = document.querySelector('.nav-links li a[href="cadastro.html"]');
    const signInButtonMobile = document.querySelector('.mobile-menu a[href="cadastro.html"]');
    if (isLoggedIn) {
        if (signInButton) signInButton.style.display = "none";
        if (signInButtonMobile) signInButtonMobile.style.display = "none";
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
            window.location.href = "home.html";
        });
    }
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

document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.querySelector(".carousel");
    const plans = document.querySelectorAll(".plano");
    const prevButton = document.querySelector(".anterior");
    const nextButton = document.querySelector(".proximo");
    const carouselWrapper = document.querySelector(".carousel-wrapper");

    if (!carousel || !plans.length || !prevButton || !nextButton || !carouselWrapper) {
        console.error("Erro: Elementos do carrossel não encontrados!");
        return;
    }

    let index = 0;
    const gap = 20;

    function getPlanWidth() {
        return plans[0] ? plans[0].offsetWidth + gap : 0;
    }

    function getMaxIndex() {
        const planWidth = getPlanWidth();
        return Math.max(0, plans.length - Math.floor(carouselWrapper.offsetWidth / planWidth));
    }

    function updateCarousel() {
        const planWidth = getPlanWidth();
        index = Math.max(0, Math.min(index, getMaxIndex())); // Garante que index nunca seja menor que 0
        let translateX = -index * planWidth;
        carousel.style.transform = `translateX(${translateX}px)`;
        carousel.style.transition = "transform 0.4s ease-in-out";
    }

    function centerPlanMobile() {
        const planWidth = getPlanWidth();
        const maxScrollLeft = carouselWrapper.scrollWidth - carouselWrapper.clientWidth;

        let scrollPosition = index * planWidth;
        scrollPosition = Math.max(0, Math.min(scrollPosition, maxScrollLeft)); // Garante que nunca role para um valor menor que 0

        carouselWrapper.scrollLeft = scrollPosition;
    }

    function nextPlan(event) {
        event?.preventDefault();
        if (index < getMaxIndex()) {
            index++;
            window.innerWidth <= 768 ? centerPlanMobile() : updateCarousel();
        }
    }

    function prevPlan(event) {
        event?.preventDefault();
        if (index > 0) {
            index--;
            window.innerWidth <= 768 ? centerPlanMobile() : updateCarousel();
        }
    }

    nextButton.addEventListener("click", nextPlan);
    prevButton.addEventListener("click", prevPlan);

    window.addEventListener("resize", function () {
        window.innerWidth <= 768 ? centerPlanMobile() : updateCarousel();
    });

    updateCarousel(); // Garante que o carrossel inicie corretamente

    let startX = 0, endX = 0, threshold = 50;

    carouselWrapper.addEventListener("touchstart", function (e) {
        startX = e.touches[0].clientX;
    });

    carouselWrapper.addEventListener("touchmove", function (e) {
        endX = e.touches[0].clientX;
    });

    carouselWrapper.addEventListener("touchend", function () {
        const diffX = startX - endX;
        if (Math.abs(diffX) >= threshold) {
            diffX > 0 ? nextPlan() : prevPlan();
        }
    });

    prevButton.style.position = "absolute";
    prevButton.style.left = "10px";
    prevButton.style.top = "50%";
    prevButton.style.transform = "translateY(-50%)";
    prevButton.style.zIndex = "10";

    nextButton.style.position = "absolute";
    nextButton.style.right = "10px";
    nextButton.style.top = "50%";
    nextButton.style.transform = "translateY(-50%)";
    nextButton.style.zIndex = "10";
});
