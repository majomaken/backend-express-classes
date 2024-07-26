const express = require("express");
const app = express();
const PORT = 5000;

const products = [
  { id: 1, name: 'Laptop', price: 1200 },
  { id: 2, name: 'Tablet', price: 400 },
]

// Middlewares
app.use(express.json());

app.get('/products', (request, response) => {
  response.json(products);
});

app.listen(PORT, () => {
  console.log(`Servidor express escuchando en http://localhost:${PORT}`);
})