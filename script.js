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
    // Seleciona os elementos usando as classes
    const carousel = document.querySelector(".carousel");
    const plans = document.querySelectorAll(".members-pack");
    const prevButton = document.querySelector(".anterior");
    const nextButton = document.querySelector(".proximo");
    const carouselWrapper = document.querySelector(".carousel-wrapper");

    if (!carousel || !plans.length || !prevButton || !nextButton || !carouselWrapper) {
        console.error("Erro: Elementos do carrossel não encontrados!");
        return;
    }

    let index = 0;
    const totalPlans = plans.length;
    const gap = 20; // espaçamento entre os containers

    // Função que retorna a largura de cada item do carrossel (incluindo o gap)
    function getPlanWidth() {
        if (!plans.length) return 0;
        const planRect = plans[0].getBoundingClientRect();
        return planRect.width + gap;
    }

    // Atualiza o posicionamento do carrossel para desktop,
    // garantindo que não ultrapasse o primeiro ou o último item,
    // deixando uma margem igual ao gap.
    function updateCarousel() {
        const planWidth = getPlanWidth();

        // Limita o index para não ultrapassar os limites
        if (index > totalPlans - 1) {
            index = totalPlans - 1;
        }
        if (index < 0) {
            index = 0;
        }

        /*
           Para desktop, vamos calcular a translação da seguinte forma:
           - Quando o primeiro item está visível, queremos que a margem à esquerda seja igual a gap.
           - À medida que avançamos, a translação será: margem_inicial - (index * planWidth)
           - Porém, precisamos impedir que a translação ultrapasse o limite onde o último item
             ainda deixa gap à direita. Para isso, calculamos o valor máximo de translação.
        */
        // Valor máximo de translação (lado direito)
        const maxTranslateX = -(carousel.scrollWidth - carouselWrapper.clientWidth - gap);

        // Calcula a translação desejada
        let translateX = gap - index * planWidth;

        // Garante que não ultrapasse os limites
        if (translateX < maxTranslateX) {
            translateX = maxTranslateX;
        }
        if (translateX > gap) {
            translateX = gap;
        }

        carousel.style.transform = `translateX(${translateX}px)`;
        carousel.style.transition = "transform 0.4s ease-in-out";
    }

    // Para mobile, centraliza o item atual, mas sem ultrapassar os limites
    function centerPlanMobile() {
        const planWidth = getPlanWidth();
        // O máximo scroll é calculado a partir do scrollWidth do carrossel, descontando a largura do wrapper e considerando a margem final
        const maxScroll = carousel.scrollWidth - carouselWrapper.clientWidth - gap;

        // Calcula a posição de scroll para centralizar o item atual
        let scrollPosition = index * planWidth - (carouselWrapper.clientWidth / 2) + (planWidth / 2);

        // Impede que o scroll ultrapasse o início ou o fim
        if (scrollPosition < gap) {
            scrollPosition = gap;
            index = 0;
        }
        if (scrollPosition > maxScroll) {
            scrollPosition = maxScroll;
            index = totalPlans - 1;
        }

        carousel.scrollTo({ left: scrollPosition, behavior: "smooth" });
    }

    // Função para o botão "próximo"
    function nextPlan(event) {
        event.preventDefault();
        if (window.innerWidth <= 768) {
            // Mobile: se não estiver no último item, avança
            if (index < totalPlans - 1) {
                index++;
            }
            centerPlanMobile();
        } else {
            // Desktop: se não estiver no último item, avança
            if (index < totalPlans - 1) {
                index++;
            }
            updateCarousel();
        }
    }

    // Função para o botão "anterior"
    function prevPlan(event) {
        event.preventDefault();
        if (window.innerWidth <= 768) {
            // Mobile: se não estiver no primeiro item, retrocede
            if (index > 0) {
                index--;
            }
            centerPlanMobile();
        } else {
            // Desktop: se não estiver no primeiro item, retrocede
            if (index > 0) {
                index--;
            }
            updateCarousel();
        }
    }

    nextButton.addEventListener("click", nextPlan);
    prevButton.addEventListener("click", prevPlan);

    // Atualiza a posição se a janela for redimensionada
    window.addEventListener("resize", function() {
        if (window.innerWidth <= 768) {
            centerPlanMobile();
        } else {
            updateCarousel();
        }
    });

    // Inicializa o carrossel conforme o tamanho da tela
    if (window.innerWidth <= 768) {
        centerPlanMobile();
    } else {
        updateCarousel();
    }
});
function centerPlanMobile() {
    const planWidth = getPlanWidth();
    const maxScroll = carouselWrapper.scrollWidth - carouselWrapper.clientWidth - gap;
    let scrollPosition = index * planWidth - (carouselWrapper.clientWidth / 2) + (planWidth / 2);

    if (scrollPosition < gap) {
        scrollPosition = gap;
        index = 0;
    }
    if (scrollPosition > maxScroll) {
        scrollPosition = maxScroll;
        index = totalPlans - 1;
    }

    carouselWrapper.scrollTo({ left: scrollPosition, behavior: "smooth" });
}

