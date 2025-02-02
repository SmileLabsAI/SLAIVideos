document.addEventListener("DOMContentLoaded", function() {
    console.log("✅ Página carregada. Inicializando login.js...");

    // Importe a biblioteca Supabase (se você ainda não a importou em outro lugar)
    import { createClient } from '@supabase/supabase-js';

    const loginForm = document.getElementById("login-form");
    const logoutButton = document.getElementById("menu-logout");
    const userToken = localStorage.getItem("userToken");

    const supabaseUrl = "https://rxqieqpxjztnelrsibqc.supabase.co";
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4cWllcXB4anp0bmVscnNpYnFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MzAzMDYsImV4cCI6MjA1MzQwNjMwNn0.-eFyRvUhRRGwS5u2zOdKjhHronlw8u-POJzCaBocBxc";
    const supabase = createClient(supabaseUrl, supabaseAnonKey); // Inicializa o cliente Supabase

    const BACKEND_URL = "https://slaivideos-backend-1.onrender.com/usuarios/login";
    const MEMBERS_PAGE = "members.html";

    // ... (seu código para validar o token - mantenha este código) ...

    if (loginForm) {
        loginForm.addEventListener("submit", async function(event) {
            event.preventDefault();

            const email = document.getElementById("email").value.trim();
            const senha = document.getElementById("password").value.trim();

            // ... (seu código para validar os campos - mantenha este código) ...

            try {
                const response = await fetch(BACKEND_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, senha })
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem("userToken", data.token);
                    console.log("✅ Login bem-sucedido. Redirecionando para:", MEMBERS_PAGE);

                    // Exemplo de como usar o cliente Supabase após o login:
                    const { data: user, error } = await supabase
                        .from('usuarios') // Nome da sua tabela de usuários
                        .select('*')
                        .eq('email', email)
                        .single();

                    if (error) {
                        console.error('Erro ao buscar usuário no Supabase:', error);
                    } else {
                        console.log('Usuário do Supabase:', user);
                        // Faça algo com os dados do usuário, se necessário
                    }


                    window.location.href = MEMBERS_PAGE;
                } else {
                    const errorData = await response.json();
                    const errorMessage = errorData.error || "Erro desconhecido";
                    console.error("❌ Erro de login:", errorMessage);
                    alert(`❌ Erro ao fazer login: ${errorMessage}`);
                }
            } catch (error) {
                console.error("❌ Erro ao conectar com o servidor:", error);
                alert("Erro ao conectar com o servidor. Tente novamente mais tarde.");
            }
        });
    }

    // ... (resto do seu código - mantenha este código) ...
});