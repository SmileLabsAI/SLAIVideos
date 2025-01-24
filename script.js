// Inicializa o Mercado Pago com a Public Key correta
const mp = new MercadoPago("APP_USR-7a366cc9-b73c-409f-a12a-c4f978c4b569", { locale: "pt-BR" });

// Adiciona eventos aos botões de compra
document.getElementById("checkout-button-5").addEventListener("click", () => {
    iniciarPagamento("pack5", 100.00); // Corrige o preço para reais (R$ 100,00)
});

document.getElementById("checkout-button-10").addEventListener("click", () => {
    iniciarPagamento("pack10", 180.00); // Corrige o preço para reais (R$ 180,00)
});

// Função para criar a preferência no backend
async function iniciarPagamento(pack, price) {
    console.log(`Iniciando pagamento para ${pack} - R$ ${price}`);

    try {
        const response = await fetch("https://slaivideos-backend.onrender.com/api/payment/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                title: pack, 
                price: price
            })
        });

        // Verifica se o response não teve erro (exemplo: erro 500 no servidor)
        if (!response.ok) {
            throw new Error(`Erro ao criar preferência: ${response.status} - ${response.statusText}`);
        }

        // Obtém o texto da resposta primeiro para verificar sua validade
        const text = await response.text();
        console.log("Resposta do backend (bruta):", text);

        let data;
        try {
            data = JSON.parse(text); // Tenta converter para JSON
        } catch (error) {
            throw new Error("Resposta do backend não é um JSON válido.");
        }

        // Se a resposta não contém um ID, há um problema na API
        if (!data.id) {
            throw new Error("Resposta do backend não contém um ID de preferência válido.");
        }

        console.log("ID da preferência de pagamento recebido:", data.id);

        // Inicializa o Checkout Pro do Mercado Pago
        mp.checkout({
            preference: {
                id: data.id
            },
            autoOpen: true
        });

    } catch (error) {
        console.error("Erro ao iniciar pagamento:", error);
        alert("Erro ao processar o pagamento. Tente novamente.");
    }
}
