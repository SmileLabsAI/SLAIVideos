document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const logoutButton = document.getElementById("menu-logout");
    const userToken = localStorage.getItem("userToken"); // Armazena o token do usuário

    const BACKEND_URL = "https://slaivideos-backend-1.onrender.com/usuarios/login"; // Backend no Render
    const SUPABASE_URL = "https://rxqieqpxjztnelrsibqc.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4cWllcXB4anp0bmVscnNpYnFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MzAzMDYsImV4cCI6MjA1MzQwNjMwNn0.-eFyRvUhRRGwS5u2zOdKjhHronlw8u-POJzCaBocBxc";
    const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // 🔹 Se o usuário já está logado, mostrar botão de logout
    if (userToken) {
        if (logoutButton) {
            logoutButton.style.display = "inline-block";
            logoutButton.addEventListener("click", () => {
                localStorage.removeItem("userToken"); // Remove o token
                window.location.href = "index.html"; // Redireciona para a página inicial
            });
        }
    }

    // 🔹 Captura o envio do formulário de login
    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // Evita recarregar a página

            const email = document.getElementById("email").value;
            const senha = document.getElementById("password").value;

            try {
                const response = await fetch(BACKEND_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, senha }),
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem("userToken", data.token); // Salva token no navegador
                    alert("Login realizado com sucesso!");
                    window.location.href = "members.html"; // Redireciona para área logada
                } else {
                    alert(data.error || "Erro ao fazer login. Verifique suas credenciais.");
                }
            } catch (error) {
                console.error("Erro ao conectar com o servidor:", error);
                alert("Erro ao conectar com o servidor. Tente novamente mais tarde.");
            }
        });
    }
});

// 🔹 Login com Google (Mantido para futura implementação)
async function loginWithGoogle() {
    const { user, session, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: window.location.origin + "/members.html"
        }
    });

    if (error) {
        console.error("Erro ao fazer login:", error.message);
        alert("Erro ao autenticar com o Google!");
    }
}

// Evento de clique para login com Google
document.getElementById("login-google").addEventListener("click", loginWithGoogle);

// 🔹 Verifica a autenticação ao carregar a página
async function checkAuth() {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
        window.location.href = "members.html"; // Redireciona se já estiver logado
    }
}

document.addEventListener("DOMContentLoaded", checkAuth);
