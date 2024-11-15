const { createCoreService } = require('@strapi/strapi').factories;
module.exports = createCoreService('api::brand.brand', ({ strapi }) => ({
    async getAllBrands(){
        try {
            const allBrands = await strapi.entityService.findMany("api::brand.brand", {select: "*", fields: ["id", "name"]})
            return allBrands
        } catch(error) {
            return error
        }
    }
}))
