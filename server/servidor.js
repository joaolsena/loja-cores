const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

// Configuração do MongoDB Atlas
const uri = "mongo";
mongoose
  .connect(uri)
  .then(() => console.log("Conectado ao MongoDB Atlas"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB Atlas", err));

// Modelo de Produto
const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  image: String, // URL da imagem armazenada no Cloudinary
});

const Product = mongoose.model("Product", productSchema);

// Configuração do Multer para upload de imagens 
const storage = multer.memoryStorage(); // Usando memoryStorage para enviar a imagem diretamente para o Cloudinary
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de tamanho do arquivo (5MB)
  },
});

// Rota para cadastrar produtos (com upload de imagem para o Cloudinary)
app.post("/adicionar", upload.single("image"), async (req, res) => {
    try {
      const { title, price } = req.body;
  
      // Validação dos campos obrigatórios
      if (!title || !price || !req.file) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
      }
  
      // Fazendo o upload para o Cloudinary
      cloudinary.uploader.upload_stream(
        { resource_type: "auto" }, // Determina automaticamente o tipo de recurso (imagem, vídeo, etc.)
        async (error, result) => {
          if (error) {
            return res.status(500).json({ message: "Erro ao fazer upload da imagem", error });
          }
  
          const imageUrl = result.secure_url; // URL da imagem no Cloudinary
  
          const novoProduto = new Product({ title, price, image: imageUrl });
  
          await novoProduto.save(); // Salva no banco de dados
          return res.status(201).json(novoProduto); // Retorna o produto cadastrado com a URL da imagem
        }
      ).end(req.file.buffer); // Passa o buffer da imagem para o Cloudinary
    } catch (error) {
      res.status(500).json({ message: "Erro ao cadastrar produto", error });
    }
  });
  

// Rota para listar produtos
app.get("/produtos", async (req, res) => {
  try {
    const produtos = await Product.find(); // Busca todos os produtos
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar produtos", error });
  }
});

// Rota para excluir um produto
app.delete("/produtos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await Product.findById(id);

    if (!produto) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    // Exclui a imagem do Cloudinary
    const imagePublicId = produto.image.split("/").pop().split(".")[0]; // Extrai o ID da imagem do URL
    await cloudinary.uploader.destroy(imagePublicId); // Exclui a imagem do Cloudinary

    await Product.findByIdAndDelete(id); // Exclui o produto no banco
    res.status(200).json({ message: "Produto excluído com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir produto", error });
  }
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
