import React, { useState, useEffect } from "react";
import axios from "axios";
import AddProduct from "./AddProduct"; 
import SearchBar from "./SearchBar";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; 
import DeleteProduct from "./DeleteProduct";


const Products = () => {
  const { isAuthenticated } = useAuth(); 
  const navigate = useNavigate(); 
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddProduct, setShowAddProduct] = useState(false); // Controla se exibe o formulário de cadastro de produto

  // Função para buscar produtos do servidor
  const fetchProducts = async () => {
    try {
      const response = await axios.get("/produtos");
      setProducts(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  // Função para adicionar um novo produto no servidor
  const addProduct = async (formData) => {
    try {
      const response = await axios.post("/adicionar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      // Atualiza a lista de produtos com a resposta do servidor
      setProducts([...products, response.data]);
      setShowAddProduct(false);
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      alert("Erro ao adicionar o produto!");
    }
  };
  

  // Busca os produtos ao carregar o componente
  useEffect(() => {
    fetchProducts();
  }, []);


  const handleDelete = (productId) => {
    setProducts(products.filter((product) => product._id !== productId));
  };
  
  const handleAddProduct = () => {
    if (isAuthenticated) {
      setShowAddProduct(true); // Exibe o formulário de cadastro de produto ao invés de navegar
    } else {
      navigate("/login"); // Redireciona para o login se não estiver autenticado
    }
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product) => {
  
    
    const existingProduct = cart.find((item) => item._id === product._id); 
    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };
  
  const increaseQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item._id === id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };
  
  const decreaseQuantity = (id) => {
    setCart(
      cart
        .map((item) =>
          item._id === id 
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0) // Remove produtos com quantidade <= 0
    );
  };
  
  const calculateItemTotal = (item) => {
    return (item.price * item.quantity).toFixed(2);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div>
      <button onClick={handleAddProduct} className="add-product-button">
        Cadastrar Produto
      </button>

      {showAddProduct && <AddProduct onAddProduct={addProduct} />}

      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <div
        className="cart-button"
        onClick={() => setShowCart(!showCart)} 
      >
        🛒 Carrinho ({cart.length})
      </div>

      {showCart && (
        <div className="cart">
          <h2>Carrinho de Compras</h2>
          {cart.length === 0 ? (
            <p>Seu carrinho está vazio.</p>
          ) : (
            <>
              <ul>
                {cart.map((item) => (
                  <li key={item.id} className="cart-item">
                    <img src={item.image} alt={item.title} />
                    <div>
                      <h3>{item.title}</h3>
                      <p>{`Preço Unitário: R$ ${item.price.toFixed(2)}`}</p>
                      <div className="quantity-controls">
                        <button onClick={() => decreaseQuantity(item._id)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => increaseQuantity(item._id)}>+</button>
                      </div>
                      <p>{`Total: R$ ${calculateItemTotal(item)}`}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div>
                <strong>Total Geral:</strong> R$ {calculateTotal()}
              </div>

              {cart.length > 0 && (
                <button className="checkout-button"> 
                  <Link className="finaliza" to="/checkout" state={{ cart }}>
                    Finalizar Compra
                  </Link>
                </button>
              )}
            </>
          )}
        </div>
      )}

<section id="produtos" className="products">
  {filteredProducts.length > 0 ? (
    filteredProducts.map((product) => (
      <div className="product" key={product._id} style={{ position: "relative" }}>
        <img src={product.image} alt={product.title} loading="lazy" />
        <h3>{product.title}</h3>
        <p>{`Preço: R$ ${product.price.toFixed(2)}`}</p>
        <button onClick={() => addToCart(product)}>Adicionar ao Carrinho</button>
        <DeleteProduct productId={product._id} onDelete={handleDelete} />
      </div>
    ))
  ) : (
    <p>Nenhum produto encontrado.</p>
  )}
</section>
    </div>
  );
};

export default Products;
