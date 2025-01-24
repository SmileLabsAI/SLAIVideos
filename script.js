// Inicializa o Mercado Pago com a Public Key
const mp = new MercadoPago(APP_USR-7a366cc9-b73c-409f-a12a-c4f978c4b569, { locale: "pt-BR" });

async function iniciarPagamento(titulo, preco) {
    console.log(`Iniciando pagamento: ${titulo} - R$ ${preco}`);

    try {
        // Chama o backend para criar a preferência de pagamento
        const response = await fetch("https://slaivideos-backend.onrender.com/api/payment/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: titulo, price: preco })
        });

        if (!response.ok) {
            throw new Error(`Erro na criação da preferência: ${response.status} - ${response.statusText}`);
        }

        // Obtém a resposta em JSON
        const data = await response.json();

        // Verifica se recebeu um ID válido
        if (!data.id) {
            throw new Error("Erro: ID de preferência não recebido.");
        }

        console.log("ID da preferência:", data.id);

        // Abre o Checkout Pro do Mercado Pago
        mp.checkout({
            preference: { id: data.id },
            autoOpen: true // Abre automaticamente o checkout
        });

    } catch (error) {
        console.error("Erro ao iniciar pagamento:", error);
        alert("Erro ao processar o pagamento. Tente novamente.");
    }
}
