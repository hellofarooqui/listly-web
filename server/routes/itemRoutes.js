const express = require('express');
const router = express.Router();
const {
  getAllItems,
  getItemsGroupedByCategory,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} = require('../controllers/itemController');

router.route('/')
  .get(getAllItems)
  .post(createItem);

router.get('/grouped', getItemsGroupedByCategory);

router.route('/:id')
  .get(getItemById)
  .put(updateItem)
  .delete(deleteItem);

module.exports = router;