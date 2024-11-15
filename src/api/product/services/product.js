const { createCoreService } = require('@strapi/strapi').factories
const { uploadPhotoToS3 } = require("../../../../utils/aws")
const { uuidGenerator } = require('../../../../utils/uuid_generator')

module.exports = createCoreService('api::product.product', ({ strapi }) => ({
    async createProduct(body, files){
        try{
            const imagesFroms3 = []
            if(files.images != undefined){
                if(typeof files.images == Array){
                    for (let image of files.images){
                        const imageUrl =  await uploadPhotoToS3(image, 'testsurano')
                        imagesFroms3.push(imageUrl)
                    }
                }else{
                    const imageUnit = await uploadPhotoToS3(files.images, 'testsurano')
                    imagesFroms3.push(imageUnit)
                }
            }
            // console.log('chegou no service 2, aqui vai parsear o json', body.data.customAttributes)
            body.data.customAttributes = JSON.parse(body.data.customAttributes)
            // console.log('chegou no service 3')
            body.data.dimensions = JSON.parse(body.data.dimensions)
            // console.log('chegou no service 4')
            body.data.images = new Object({locations:imagesFroms3})
            // console.log('chegou no service 5')
            body.data.uuid = uuidGenerator()
            // console.log('esse é o product body antes de ir pra criação:', body.data)
            const product = await strapi.entityService.create("api::product.product", body)
            // console.log('Esse é product depois de ser criado:', product)
            return product
        } catch (error) {
            console.log(error)
            return error
        }
    },
    async getAllProducts(){
        try {
            const allProducts = await strapi.entityService.findMany("api::product.product", {select: "*", fields: ["id", "name"]})
            return allProducts
        } catch(error) {
            return error
        }
    }
}))
