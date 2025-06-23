const express = require('express');
const router = express.Router();
const ProductPromoController = require('../controller/ProductPromoController');
const { verifyToken } = require('../middleware/AuthMiddleware');
const upload = require('../middleware/Upload');
const { route } = require('./UserRoutes');
const { admin, general } = require('../config/Auth');

router.get(
  '/product-promos',
  verifyToken,
  general,
  ProductPromoController.getAllProductPromos
);
router.get(
  '/product-promo/:id',
  verifyToken,
  general,
  ProductPromoController.getProductPromoById
);
router.post(
  '/product-promo',
  upload.array('images', 5),
  verifyToken,
  admin,
  ProductPromoController.createProductPromo
);
router.delete(
  '/product-promo/:id',
  verifyToken,
  admin,
  ProductPromoController.deleteProductPromo
);
router.put(
  '/product-promo/:id',
  upload.array('images', 5),
  verifyToken,
  admin,
  ProductPromoController.updateProductPromo
);

module.exports = router;
