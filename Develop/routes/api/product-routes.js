const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    // Find all products
    const products = await Product.findAll({
      // Include associated Category and Tag data
      include: [
        {
          model: Category,
        },
        {
          model: Tag,
          through: ProductTag, // To include the Tag data with the ProductTag association
        },
      ],
    });

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});


// get one product
router.get('/:id', async (req, res) => {
  try {
    
    const product = await Product.findByPk(req.params.id, {// Find a single product by its `id`// To include the Tag data with the ProductTag association
      include: [{model: Category,},{model: Tag,through: ProductTag, },],});

      if(!product){
        res.status(404).json({ message: 'Product not found' });
        return;
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});






// create new product
router.post('/', async (req, res) => {
  try {
    // Create a new product
    const product = await Product.create(req.body);

    // If there are product tags, create pairings to bulk create in the ProductTag model
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }

    res.status(201).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {

        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
// delete a product by its `id` value
try {
  // Delete a product by its `id` value
  await Product.destroy({
    where: { id: req.params.id },
  });
  res.status(200).json({message:"Deleted Successfully"});
}catch (err) {
  res.status(500).json({err, message:"Error With Delete"});
}
});

module.exports = router;
