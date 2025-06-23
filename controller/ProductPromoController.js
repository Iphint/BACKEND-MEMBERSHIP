const ProductPromoModel = require('../models/ProductPromoModel');

exports.createProductPromo = async (req, res) => {
  try {
    const productData = req.body;
    const imageFiles = req.files;

    // Validasi sederhana
    const requiredFields = [
      'product_name',
      'price_normal',
      'discount',
      'product_category',
      'start_date',
      'end_date',
      'stock',
    ];
    for (const field of requiredFields) {
      if (!productData[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    const result = await ProductPromoModel.createProductPromo(
      productData,
      imageFiles
    );

    res.status(201).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message });
  }
};
exports.getAllProductPromos = async (req, res) => {
  try {
    const promos = await ProductPromoModel.getAllProductPromos();
    res.status(200).json({
      message: 'Product promos fetched successfully',
      data: promos,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message });
  }
};
exports.getProductPromoById = async (req, res) => {
  const { id } = req.params;

  try {
    const promo = await ProductPromoModel.getProductPromoById(id);
    if (!promo) {
      return res.status(404).json({ message: 'Product promo not found' });
    }
    res.status(200).json({
      message: 'Product promo fetched successfully',
      data: promo,
    });
  } catch (error) {
    console.error('Error fetching product promo by ID:', error);
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message });
  }
};
exports.deleteProductPromo = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await ProductPromoModel.deleteProductPromo(id);
    if (!result) {
      return res.status(404).json({ message: 'Product promo not found' });
    }
    res.status(200).json({
      message: 'Product promo deleted successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error deleting product promo:', error);
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message });
  }
};
exports.updateProductPromo = async (req, res) => {
  const { id } = req.params;
  const {
    product_name,
    price_normal,
    discount,
    product_description,
    product_category,
    start_date,
    end_date,
    stock,
    is_available,
  } = req.body;

  try {
    const updatedPromo = await ProductPromoModel.updateProductPromo(
      id,
      {
        product_name,
        price_normal: parseInt(price_normal),
        discount: parseInt(discount),
        product_description,
        product_category,
        start_date,
        end_date,
        stock: parseInt(stock),
        is_available: is_available === 'true' || is_available === true,
      },
      req.files
    );

    res.status(200).json({
      message: 'Product promo updated successfully',
      data: updatedPromo,
    });
  } catch (error) {
    console.error('Error updating product promo:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
