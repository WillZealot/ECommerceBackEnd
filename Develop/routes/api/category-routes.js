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

router.post('/', async (req, res) => {
  // create a new category
  try{
    const newCategory = await Category.create(req.body);
    res.status(200).json(newCategory);
  } catch (err) {
    res.status(500).json(err);
  }
  }
  
);

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try{
    const updatedCategory = await Category.update(req.body, {
      where: { id: req.params.id },
    });
    res.status(200).json({message: "Updated Category Name Successfully"});
  } catch (err) {
    res.status(500).json({err, message:"Error With Update"});
  }

});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    // Delete a category by its `id` value
    await Category.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({message:"Deleted Successfully"});
  }catch(err) {
    res.status(500).json({err, message:"Error With Delete"});
  }
});

module.exports = router;
