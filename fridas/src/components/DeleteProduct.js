import React from "react";
import axios from "axios";
import { useAuth } from "./AuthContext"; 

const DeleteProduct = ({ productId, onDelete }) => {
  const { isAuthenticated } = useAuth(); // Verifica se o usuário está autenticado

  const handleDelete = async () => {
    if (!isAuthenticated) {
      alert("Você precisa estar logado para deletar um produto.");
      return;
    }

    try {
      await axios.delete(`/produtos/${productId}`);
      onDelete(productId); // Chama a função de callback para atualizar a lista de produtos
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      alert("Erro ao tentar deletar o produto.");
    }
  };

  return (
    isAuthenticated && ( // Exibe a lixeira somente se estiver autenticado
      <button onClick={handleDelete} className="delete-button">
        🗑️
      </button>
    )
  );
};

export default DeleteProduct;
