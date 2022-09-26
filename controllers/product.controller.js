const Product = require("../models/Product");
const { getProductsSerive, createProductService, updateProductService, bulkUpdateProductService, deleteProductByIdService, bulkDeleteProductService } = require("../services/product.service")

//getproducts
const getProducts = async(req,res)=>{
    try {
    //status,sort,page,limit ->query parameter
    //sort,page,limit -> exclude
     let filters = {...req.query};
     console.log('filters',filters);
     const excludeFields = ["sort","page","limit"];
     excludeFields.forEach(field => delete filters[field]);

     //console.log(req.query,filters);

     const queries = {};

     if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        queries.sortBy = sortBy;
       
     }

     if(req.query.fields){
       const fields = req.query.fields.split(',').join(' ');
       queries.fields = fields;
       console.log(fields);
     }

     //gt,gte,lt,lte
    let filtersString = JSON.stringify(filters);
    console.log('string',filtersString);
    filtersString = filtersString.replace(/\b(gt|gte|lt|lte)\b/g,match=>`$${match}`)
   console.log(filtersString);
   filters = JSON.parse(filtersString);
   console.log('regrex',filters);
   

   if(req.query.page){
      const {page = 1,limit = 10} = req.query;
      //50 products
      //each page 10 products
      //page 1->1-10
      //page 2->11-20
      //page 3->21-30->page 3 -> skip 1-20 -> 3-1 ->  2*10
      //page 4->31-40
      //page 5->41-50
    //  const skip = (page-1)*(limit*1);
    const skip = (page-1)*parseInt(limit);
    queries.skip = skip;
    queries.limit = parseInt(limit);

   }
   
     

     const products = await getProductsSerive(filters,queries);

     res.status(200).json({
         products
     })
     
    } catch (error) {
      res.status(400).json({
         status:"fail",
         message:"cant get data",
         error:error.message
      })
    }
 }


//create product
 const createProduct = async (req, res) => {
    try {
      //save method
      // const product = new Product(req.body);
      // const result = await product.save();
  
      //create method
      const result = await createProductService(req.body);
      //instance method called;
      result.logger();
      res.status(200).json({
        data: result,
      });
    } catch (error) {
       res.status(400).json({
          error:error.message
       })
    }
  }

const updateProduct = async(req,res,next)=>{
   try {
     const { id } = req.params;
     console.log(id);
     const result = await updateProductService(id,req.body);
     res.status(201).json({
      result
     })
   } catch (error) {
      res.status(400).json({
      error:error.message
      })
   }
}


const bulkUpdateProduct = async(req,res,next) =>{
  try {
     const result = await bulkUpdateProductService(req.body);
     res.status(202).json({
      result
     })
  } catch (error) {
     res.status(400).json({
      error:error.message
      })
  }
}

const deleteProductById = async (req,res) =>{
    try {
       const {id} = req.params;
       const result = await deleteProductByIdService(id);

       if(!result.deletedCount){
         return res.status(400).json({
            message:"didnt delete data"
         })
       }

       res.json({
         result
       })
    } catch (error) {
      res.status(400).json({
         error:error.message
         })
    }
}

const bulkDeleteProduct = async(req,res)=>{
   try {
      const result = await bulkDeleteProductService(req.body.ids)
      res.json({
         result
      })
   } catch (error) {
      res.status(400).json({
         error:error.message
         })
   }
}
module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    bulkUpdateProduct,
    deleteProductById,
    bulkDeleteProduct
    
}

