document.addEventListener("DOMContentLoaded", function() {
    console.log("✅ Página carregada. Inicializando login.js...");

    const loginForm = document.getElementById("login-form");
    const logoutButton = document.getElementById("menu-logout");
    const userToken = localStorage.getItem("userToken");

    // URLs do Backend e Supabase
    const BACKEND_URL = "https://slaivideos-backend-1.onrender.com/usuarios/login";
    const MEMBERS_PAGE = "members.html"; // Página protegida

    // 🔐 Função para validar token JWT
    function isTokenValid(token) {
        if (!token) return false;
        try {
            const payload = JSON.parse(atob(token.split(".")[1])); // Decodifica a parte útil do token (Payload)
            const now = Math.floor(Date.now() / 1000); // Tempo atual em segundos
            return payload.exp > now; // Verifica se o token ainda não expirou
        } catch (e) {
            console.error("⚠ Token inválido:", e);
            return false;
        }
    }

    // 🔐 Redirecionamento seguro para usuários autenticados
    if (userToken && isTokenValid(userToken)) {
        console.log("✅ Usuário autenticado e token válido.");
        if (window.location.pathname.endsWith("login.html")) {
            window.location.href = MEMBERS_PAGE;
        }
    } else {
        console.log("❌ Usuário não autenticado ou token inválido.");
        localStorage.removeItem("userToken"); // Remove tokens inválidos
    }

    // 🔴 Logout do usuário
    if (logoutButton) {
        logoutButton.style.display = "inline-block";
        logoutButton.addEventListener("click", function() {
            localStorage.removeItem("userToken");
            console.log("🔴 Usuário fez logout.");
            window.location.href = "index.html";
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async function(event) {
            event.preventDefault();

            const email = document.getElementById("email").value.trim();
            const senha = document.getElementById("password").value.trim();

            if (!email || !senha) {
                alert("⚠ Preencha todos os campos.");
                return;
            }

            console.log("🟡 Tentando login com:", { email, senha });

            try {
                const response = await fetch(BACKEND_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, senha })
                });

                const data = await response.json();

                if (response.ok && data.token) {
                    localStorage.setItem("userToken", data.token);
                    console.log("🟢 Login bem-sucedido. Redirecionando...");

                    // Aguarda um pequeno tempo antes do redirecionamento para garantir que o token seja salvo
                    setTimeout(() => {
                        window.location.href = MEMBERS_PAGE;
                    }, 500);
                } else {
                    alert(data.message || "❌ Erro ao fazer login. Verifique suas credenciais.");
                }
            } catch (error) {
                console.error("❌ Erro ao conectar com o servidor:", error);
                alert("Erro ao conectar com o servidor. Tente novamente mais tarde.");
            }
        });
    } else {
        console.warn("⚠ Formulário de login não encontrado no DOM.");
    }
});
