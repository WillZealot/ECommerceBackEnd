const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const allTags = await Tag.findAll({
      include: [{model: Product, through: ProductTag}],
    });

    res.status(200).json(allTags);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try{  
    const singleTag = await Tag.findByPk(req.params.id,{
      include:[{model: Product, through: ProductTag}],
    });

    if(!singleTag){
      res.status(404).json({ message: 'Tag not found' });
      return;
  }

    res.status(200).json(singleTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try{
    const newTag = await Tag.create(req.body);
    res.status(200).json(newTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try{
    await Tag.update(req.body, {
      where: { id: req.params.id },
    });
    res.status(200).json({message: "Updated Tag Successfully"});
  } catch (err) {
    res.status(500).json({err, message:"Error With Update"});
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    await Tag.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({message:"Deleted Successfully"});
  }catch(err) {
    res.status(500).json({err, message:"Error With Delete"});
  }
});

module.exports = router;
