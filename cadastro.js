document.addEventListener("DOMContentLoaded", function() {
    const cadastroForm = document.getElementById("cadastro-form");
    if (!cadastroForm) {
        console.warn("⚠ Formulário de cadastro não encontrado!");
        return;
    }

    cadastroForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        // Obtém os valores dos campos do formulário
        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("password").value.trim();
        const confirmSenha = document.getElementById("confirm-password").value.trim();

        // Valida se todos os campos foram preenchidos
        if (!nome || !email || !senha || !confirmSenha) {
            alert("⚠ Por favor, preencha todos os campos.");
            return;
        }

        // Verifica se as senhas coincidem
        if (senha !== confirmSenha) {
            alert("⚠ As senhas não coincidem.");
            return;
        }

        // Define a URL para o cadastro (endpoint do backend)
        const CADASTRO_URL = "https://slaivideos-backend-1.onrender.com/usuarios";

        try {
            // Envia a requisição POST para o backend
            const response = await fetch(CADASTRO_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: nome,
                    email: email,
                    senha: senha
                })
            });

            const data = await response.json();
            console.log("Resposta do cadastro:", data);

            if (response.ok) {
                alert("✅ Cadastro realizado com sucesso!");
                // Após o cadastro, redireciona para a página de login
                window.location.href = "login.html";
            } else {
                alert(data.error || "❌ Erro ao realizar o cadastro.");
            }
        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error);
            alert("Erro ao conectar com o servidor. Tente novamente mais tarde.");
        }
    });
});
