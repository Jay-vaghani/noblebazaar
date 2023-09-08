const Product = require("../model/productModel");

const updateStock = async (productID, productQuantity, arithmeticOperation) => {
  const product = await Product.findById(productID);

  if (arithmeticOperation === "minuses") {
    product.stock -= productQuantity;
  }

  if (arithmeticOperation === "plus") {
    product.stock += productQuantity;
  }

  product.save({ validateBeforeSave: false });
};

module.exports = updateStock;
