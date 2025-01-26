async function iniciarPagamento(titulo, preco) {
    console.log(`Iniciando pagamento: ${titulo} - R$ ${preco}`);

    try {
        // Obtém a chave pública do backend
        const keyResponse = await fetch("https://slaivideos-backend-1.onrender.com/api/payment/public-key");
        if (!keyResponse.ok) {
            throw new Error("Erro ao obter a chave pública.");
        }
        const keyData = await keyResponse.json();
        const mp = new MercadoPago(keyData.publicKey, { locale: "pt-BR" });

        // Chama o backend para criar a preferência de pagamento
        const response = await fetch("https://slaivideos-backend-1.onrender.com/api/payment/process", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ title: titulo, amount: preco }) // Garante que "amount" seja reconhecido
        });

        if (!response.ok) {
            throw new Error(`Erro na criação da preferência: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.id) { // Alterado de "preferenceId" para "id"
            throw new Error("Erro: ID de preferência não recebido.");
        }

        console.log("ID da preferência:", data.id);

        // Abre o Checkout Pro do Mercado Pago
        mp.checkout({
            preference: { id: data.id },
            autoOpen: true
        });

    } catch (error) {
        console.error("Erro ao iniciar pagamento:", error);
        alert("Erro ao processar o pagamento. Tente novamente.");
    }
}

// Garante que a função seja acessível no HTML
window.iniciarPagamento = iniciarPagamento;
