document.addEventListener("DOMContentLoaded", function() {
    console.log("✅ Página carregada. Inicializando login.js...");

    const loginForm = document.getElementById("login-form");
    const logoutButton = document.getElementById("menu-logout");
    const userToken = localStorage.getItem("userToken");

    const BACKEND_URL = "https://slaivideos-backend-1.onrender.com/usuarios/login";
    const MEMBERS_PAGE = "members.html"; // Página protegida

    function isTokenValid(token) {
        if (!token) return false;
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const now = Math.floor(Date.now() / 1000);
            return payload.exp > now;
        } catch (e) {
            return false;
        }
    }

    if (userToken && isTokenValid(userToken)) {
        console.log("✅ Usuário autenticado e token válido.");
        if (window.location.pathname.endsWith("login.html")) {
            window.location.href = MEMBERS_PAGE;
        }
    }

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
                console.log("🔍 Resposta da API:", data);

                if (response.ok && data.token) {
                    localStorage.setItem("userToken", data.token);
                    console.log("✅ Login bem-sucedido. Redirecionando...");

                    setTimeout(() => {
                        window.location.href = MEMBERS_PAGE;
                    }, 500);
                } else {
                    console.error("❌ Erro de login:", data.message || "Usuário ou senha incorretos.");
                    alert("❌ Erro ao fazer login. Verifique suas credenciais.");
                }
            } catch (error) {
                console.error("❌ Erro ao conectar com o servidor:", error);
                alert("Erro ao conectar com o servidor. Tente novamente mais tarde.");
            }
        });
    }
});
