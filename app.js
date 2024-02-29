const express = require("express");
const { ProductManager } = require("./src/productManager");

const app = express();

const productManager = new ProductManager("./assets/products.json");

app.use(express.urlencoded({ extended: true }));

app.get("/products", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    const limit = +req.query.limit;
    if (!limit || limit < 0) {
      res.json({ products });
      return;
    }
    const limitedProducts = [];
    for (let i = 0; i < limit; i++) {
      limitedProducts.push(products[i]);
    }
    res.json({ limitedProducts });
  } catch (err) {
    console.error(err);
  }
});

app.get("/products/:pId", async (req, res) => {
  try {
    const pId = +req.params.pId;
    const product = await productManager.getProductById(pId);
    if (!product) {
      res.send({
        status: "ERROR",
        message: "No existe un producto con ese id",
      });
      return;
    }
    res.json({ product });
  } catch (err) {
    console.error(err);
  }
});

const execute = async () => {
  try {
    await productManager.initialize();
    app.listen(8080, () => {
      console.log("Servidor listo");
    });
  } catch (err) {
    console.error(err);
  }
};

execute();
