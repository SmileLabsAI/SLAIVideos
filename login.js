document.addEventListener("DOMContentLoaded", function() {
    console.log("✅ Página carregada. Inicializando login.js...");

    const loginForm = document.getElementById("login-form");

    const BACKEND_URL = "https://slaivideos-backend-1.onrender.com/usuarios/login";
    const MEMBERS_PAGE = "members.html";

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
                    console.log("✅ Login bem-sucedido. Redirecionando...");

                    setTimeout(() => {
                        window.location.href = MEMBERS_PAGE;
                    }, 500);
                } else {
                    console.error("❌ Erro de login:", data?.error || "Usuário ou senha incorretos.");
                    alert("❌ Erro ao fazer login. Verifique suas credenciais.");
                }
            } catch (error) {
                console.error("❌ Erro ao conectar com o servidor:", error);
                alert("Erro ao conectar com o servidor. Tente novamente mais tarde.");
            }
        });
    }
});
