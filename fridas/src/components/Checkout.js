import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [details, setDetails] = useState({ name: "", address: "", phone: "" });

  const cartItems = state?.cart || [];

  // Função para calcular o total
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  // Função para gerar mensagem no WhatsApp
  const sendMessageToWhatsApp = () => {
    if (!cartItems || cartItems.length === 0) {
      alert("Carrinho vazio, adicione itens antes de finalizar.");
      return;
    }

    const total = calculateTotal();
    const itemsDetails = cartItems
      .map((item) => `*${item.title}* - Quantidade: ${item.quantity} - Preço: R$ ${item.price.toFixed(2)}`)
      .join("\n");

    const message = `
      *Detalhes do Pedido:*\n
      *Forma de Pagamento:* ${paymentMethod}\n
      *Forma de Entrega:* ${deliveryMethod}\n
      ${
        deliveryMethod === "Entrega"
          ? `*Nome:* ${details.name}\n*Endereço:* ${details.address}\n*Telefone:* ${details.phone}`
          : `*Nome para Retirada:* ${details.name}`
      }

      *Itens:*\n${itemsDetails}
      *Valor Total:* R$ ${total}
    `;

    const phoneNumber = "5596999999";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Função para finalizar compra
  const handleCheckout = () => {
    if (!paymentMethod) {
      alert("Por favor, selecione um método de pagamento.");
      return;
    }
  
    // Verifica se o método de entrega foi selecionado
    if (!deliveryMethod) {
      alert("Por favor, selecione uma opção de entrega.");
      return;
    }
  
    // Verifica os detalhes obrigatórios com base no método de entrega
    if (
      (deliveryMethod === "Entrega" &&
        (!details.name || !details.address || !details.phone))
    ) {
      alert("Por favor, preencha todos os campos obrigatórios para entrega.");
      return;
    }
  
    if (deliveryMethod === "Retirada" && !details.name) {
      alert("Por favor, preencha o nome para retirada.");
      return;
    }
  
    // Se todas as condições forem satisfeitas, processa o checkout
    alert("Compra finalizada com sucesso!");
    sendMessageToWhatsApp();
    return (navigate("/"));
  };

  return (
    <div className="checkout-container">
      <h2>Finalizar Compra</h2>
      <div className="payment-methods">
        <h3>Método de Pagamento</h3>
        <label>
          <input
            type="radio"
            name="payment"
            value="Cartão"
            onChange={(e) => setPaymentMethod(e.target.value)}
          />{" "}
          Cartão
        </label>
        <label>
          <input
            type="radio"
            name="payment"
            value="Pix"
            onChange={(e) => setPaymentMethod(e.target.value)}
          />{" "}
          Pix
        </label>
        <label>
          <input
            type="radio"
            name="payment"
            value="Dinheiro"
            onChange={(e) => setPaymentMethod(e.target.value)}
          />{" "}
          Dinheiro
        </label>
      </div>

      <div className="delivery-options">
        <h3>Entrega ou Retirada?</h3>
        <label>
          <input
            type="radio"
            name="delivery"
            value="Entrega"
            onChange={(e) => setDeliveryMethod(e.target.value)}
          />{" "}
          Entrega
        </label>
        <label>
          <input
            type="radio"
            name="delivery"
            value="Retirada"
            onChange={(e) => setDeliveryMethod(e.target.value)}
          />{" "}
          Retirada na Loja
        </label>
      </div>

      {/* Detalhes de entrega ou retirada */}
      {deliveryMethod === "Entrega" && (
        <div className="delivery-details">
          <input
            type="text"
            name="name"
            placeholder="Nome"
            onChange={(e) => setDetails({ ...details, name: e.target.value })}
          />
          <input
            type="text"
            name="address"
            placeholder="Endereço"
            onChange={(e) => setDetails({ ...details, address: e.target.value })}
          />
          <input
            type="text"
            name="phone"
            placeholder="Telefone"
            onChange={(e) => setDetails({ ...details, phone: e.target.value })}
          />
        </div>
      )}
      {deliveryMethod === "Retirada" && (
        <div className="pickup-details">
          <input
            type="text"
            name="name"
            placeholder="Nome para retirada"
            onChange={(e) => setDetails({ ...details, name: e.target.value })}
          />
        </div>
      )}

      <div>
        <strong>Total Geral:</strong> R$ {calculateTotal()}
      </div>

      {/* Botão para confirmar a compra */}
      <button className="submit-button" onClick={handleCheckout}>
        Confirmar Compra
      </button>
    </div>
  );
};

export default Checkout;
