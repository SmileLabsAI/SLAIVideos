async function iniciarPagamento(titulo, preco) {
    console.log(`Iniciando pagamento: ${titulo} - R$ ${preco}`);

    try {
        // Obtém a chave pública do backend
        const keyResponse = await fetch("https://slaivideos-backend-1.onrender.com/api/payment/public-key");
        if (!keyResponse.ok) {
            throw new Error("Erro ao obter a chave pública.");
        }
        const keyData = await keyResponse.json();
        console.log("Chave Pública:", keyData.publicKey);

        // Chama o backend para criar a preferência de pagamento
        const response = await fetch("https://slaivideos-backend-1.onrender.com/api/payment/process", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ title: titulo, amount: preco })
        });

        if (!response.ok) {
            throw new Error(`Erro na criação da preferência: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Resposta do Backend:", data);

        if (!data.init_point) {
            throw new Error("Erro: Link de pagamento não recebido.");
        }

        console.log("Redirecionando para:", data.init_point);

        // ✅ Abre o checkout do Mercado Pago em uma nova aba para evitar bloqueios de cookies
        window.location.href = data.init_point;

    } catch (error) {
        console.error("Erro ao iniciar pagamento:", error);
        alert("Erro ao processar o pagamento. Tente novamente.");
    }
}

// Garante que a função seja acessível no HTML
window.iniciarPagamento = iniciarPagamento;
