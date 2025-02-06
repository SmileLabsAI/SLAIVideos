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

    // Seleção dos elementos do carrossel
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');
    const container = document.querySelector('.carousel-track-container');

    if (!track || !slides.length || !nextButton || !prevButton || !container) return;

    let currentIndex = 0;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let touchStartTime = 0;

    // Melhorado sistema de touch
    track.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        currentX = startX;
        touchStartTime = Date.now();
        track.style.transition = 'none';
        e.preventDefault(); // Previne comportamento padrão
    }, { passive: false });

    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        track.style.transform = `translateX(${-currentIndex * (slides[0].offsetWidth + 20) + diff}px)`;
        e.preventDefault(); // Previne scroll da página
    }, { passive: false });

    track.addEventListener('touchend', (e) => {
        isDragging = false;
        const touchEndTime = Date.now();
        const touchDuration = touchEndTime - touchStartTime;
        const diff = currentX - startX;
        const threshold = 50; // Sensibilidade do swipe

        track.style.transition = 'transform 0.5s ease-in-out';

        // Melhorada lógica de detecção de swipe
        if (Math.abs(diff) > threshold && touchDuration < 300) {
            if (diff > 0 && currentIndex > 0) {
                currentIndex--;
            } else if (diff < 0 && currentIndex < slides.length - 1) {
                currentIndex++;
            }
        }

        updateCarousel();
        e.preventDefault();
    }, { passive: false });

    function updateCarousel() {
        const containerWidth = container.offsetWidth;
        const slideWidth = slides[0].offsetWidth;
        const gap = window.innerWidth <= 768 ? 1 : 20;
        
        const totalWidth = slides.length * (slideWidth + gap);
        const extraMargin = 30;
        const centerOffset = (containerWidth - slideWidth) / 2;
        let offset = (currentIndex * (slideWidth + gap)) - centerOffset;
        
        const maxOffset = totalWidth - containerWidth + extraMargin;
        offset = Math.max(0, Math.min(offset, maxOffset));
        
        track.style.transform = `translateX(-${offset}px)`;

        // Atualiza estado dos botões
        prevButton.disabled = currentIndex <= 0;
        nextButton.disabled = currentIndex >= slides.length - 1;
        prevButton.style.opacity = currentIndex <= 0 ? '0.5' : '1';
        nextButton.style.opacity = currentIndex >= slides.length - 1 ? '0.5' : '1';
    }

    // Botões de navegação
    nextButton.addEventListener('click', () => {
        if (currentIndex < slides.length - 1) {
            currentIndex++;
            updateCarousel();
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    // Ajuste para resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateCarousel, 250);
    });

    updateCarousel();
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
