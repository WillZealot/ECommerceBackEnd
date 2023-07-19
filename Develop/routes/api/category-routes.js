const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    const category = await Category.findAll({
      include: [Product],
    });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try{
    const oneCategory = await Category.findByPk(req.params.id, {// find one category by its `id` value
      include:[Product],// be sure to include its associated Products
  });
  res.status(200).json(oneCategory);
  } catch (err) {
    res.status(500).json(err);
  }
  
  
});

router.post('/', (req, res) => {
  // create a new category
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
