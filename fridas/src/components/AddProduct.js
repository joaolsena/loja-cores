import React, { useState } from "react";

const AddProduct = ({ onAddProduct }) => {
  const [product, setProduct] = useState({
    title: "",
    price: "",
    image: null, 
  });
  const [preview, setPreview] = useState(null); 

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: name === "price" ? (value ? parseFloat(value) : "") : value, // Converte price para número
    });
  };

 
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isValidImage = file.type.startsWith("image/"); 
      if (!isValidImage) {
        alert("Por favor, selecione um arquivo de imagem válido.");
        return;
      }

      // Limita o tamanho do arquivo para 5MB
      const MAX_SIZE = 5 * 1024 * 1024; 
      if (file.size > MAX_SIZE) {
        alert("A imagem é muito grande. O tamanho máximo é 5MB.");
        return;
      }

      setProduct({ ...product, image: file });

      // Gera a prévia da imagem
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submete o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!product.title || !product.price || !product.image) {
      alert("Por favor, preencha todos os campos!");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("title", product.title);
      formData.append("price", product.price);
      formData.append("image", product.image); 
  
      // Envia os dados para o servidor
      await onAddProduct(formData);
      setProduct({ title: "", price: "", image: null });
      setPreview(null);
      alert("Produto adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar produto:", error);
      alert("Erro ao adicionar o produto!");
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="add-product-form">
      <h2>Adicionar Produto</h2>

      {/* Campo de Nome */}
      <input
        type="text"
        name="title"
        placeholder="Nome do Produto"
        value={product.title}
        onChange={handleChange}
        required
        className="input-field"
      />

      {/* Campo de Preço */}
      <input
        type="number"
        name="price"
        placeholder="Preço"
        value={product.price}
        onChange={handleChange}
        required
        step="0.01" // Permite casas decimais
        className="input-field"
      />

      {/* Upload de Imagem */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        required
        className="file-input"
      />

      {/* Prévia da Imagem */}
      {preview && (
        <div className="image-preview">
          <p>Prévia da Imagem:</p>
          <img
            src={preview}
            alt="Prévia do Produto"
            className="preview-img"
          />
        </div>
      )}

      {/* Botão de Enviar */}
      <button type="submit" className="submit-button">Adicionar Produto</button>
    </form>
  );
};

export default AddProduct;
