const Product = require('../models/Product');

module.exports.getProductsSerive = async(filters,queries)=>{
   
    const products = await Product
    .find(filters)
    .select(queries.fields)
    .sort(queries.sortBy)
    return products;
}

module.exports.createProductService = async(data) =>{
  const product =  await Product.create(data);
  return product;
}


module.exports.updateProductService = async(productId,data)=>{
  // const result = await Product.updateOne({_id:productId},{$set:data},{runValidators:true})
  // const product = await Product.findById(productId);
  // const result = await product.set(data).save();
  const result = await Product.updateOne({_id:productId},{$inc:{price:5}},{runValidators:true})
  return result;
}


module.exports.bulkUpdateProductService = async(data) =>{
  //  const result = await Product.updateMany({_id:data.ids},data.data,{runValidators:true})
  const products = [];
  data.ids.forEach(product => {
     products.push(Product.updateOne({_id:product.id},product.data))
  })

   const result = Promise.all(products);
   return result;
}

module.exports.deleteProductByIdService = async(id)=>{
  const result = await Product.deleteOne({_id:id});
  return result;
}

module.exports.bulkDeleteProductService = async(ids) =>{
    const result = await Product.deleteMany({_id:ids})
    return result;
}