import express from 'express';

const router = express.Router();

// Get all carts
router.get('/', (req, res) => {
  res.json({ message: 'Get all carts' });
});

// Get a cart by ID
router.get('/:id', (req, res) => {
  res.json({ message: `Get cart with ID ${req.params.id}` });
});

// Create a new cart
router.post('/', (req, res) => {
  res.json({ message: 'Create a new cart' });
});

// Update cart
router.put('/:id', (req, res) => {
  res.json({ message: `Update cart with ID ${req.params.id}` });
});

// Delete cart
router.delete('/:id', (req, res) => {
  res.json({ message: `Delete cart with ID ${req.params.id}` });
});

export default router;
