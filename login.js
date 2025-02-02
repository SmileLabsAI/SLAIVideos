document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Página carregada. Inicializando login.js...");

    // Inicializa o cliente Supabase via CDN (o Supabase deve estar carregado no HTML)
    const supabaseUrl = "https://rxqieqpxjztnelrsibqc.supabase.co";
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4cWllcXB4anp0bmVscnNpYnFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MzAzMDYsImV4cCI6MjA1MzQwNjMwNn0.-eFyRvUhRRGwS5u2zOdKjhHronlw8u-POJzCaBocBxc";
    const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

    const loginForm = document.getElementById("login-form");
    const logoutButton = document.getElementById("menu-logout");
    const userToken = localStorage.getItem("userToken");

    const BACKEND_URL = "https://slaivideos-backend-1.onrender.com/usuarios/login";
    const MEMBERS_PAGE = "members.html";

    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
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
                    console.log("✅ Token recebido:", data.token);

                    // Salva o token no localStorage
                    localStorage.setItem("userToken", data.token);

                    // Agora buscamos os dados do usuário no Supabase
                    const { data: user, error } = await supabase
                        .from('usuarios')
                        .select('*')
                        .eq('email', email)
                        .single();

                    if (error) {
                        console.error('Erro ao buscar usuário no Supabase:', error);
                    } else {
                        console.log('Usuário do Supabase:', user);
                    }

                    // Redireciona após o login bem-sucedido
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
