
const express = require('express');
const app = express();

app.use(express.json());

let products = [];
let id = 1;

// POST - Add Product
app.post('/api/products', (req, res) => {
    const { name, price, category } = req.body;

    if (typeof name !== 'string' || !name.trim() ||
        typeof category !== 'string' || !category.trim() ||
        price === undefined || price === null ||
        price === '' || !Number.isFinite(price)) {
        return res.status(400).json({ message: 'Missing or invalid data' });
    }

    if (products.some(p => p.name.toLowerCase() === name.trim().toLowerCase())) {
        return res.status(409).json({ message: 'Same name already exists' });
    }

    const product = {
        id: id++,
        name: name.trim(),
        price: price,
        category: category.trim()
    };

    products.push(product);
    res.status(201).json(product);
});

// GET - All Products with Category Filter
app.get('/api/products', (req, res) => {
    let result = products;

    if (req.query.category) {
        result = products.filter(p =>
            p.category.toLowerCase() === req.query.category.toLowerCase()
        );
    }

    res.status(200).json(result);
});

// GET - Product by ID
app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === Number(req.params.id));

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
});

// PUT - Update Product
app.put('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === Number(req.params.id));

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const { name, price, category } = req.body;

    if (typeof name !== 'string' || !name.trim() ||
        typeof category !== 'string' || !category.trim() ||
        price === undefined || price === null ||
        price === '' || !Number.isFinite(price)) {
        return res.status(400).json({ message: 'Missing or invalid data' });
    }

    if (products.some(p => p.id !== product.id &&
        p.name.toLowerCase() === name.trim().toLowerCase())) {
        return res.status(409).json({ message: 'Same name already exists' });
    }

    product.name = name.trim();
    product.price = price;
    product.category = category.trim();

    res.status(200).json(product);
});

// DELETE - Delete Product
app.delete('/api/products/:id', (req, res) => {
    const index = products.findIndex(p => p.id === Number(req.params.id));

    if (index === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }

    products.splice(index, 1);
    res.status(200).json({ message: 'Product deleted successfully' });
});

// Start Server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
