const { createCoreService } = require('@strapi/strapi').factories
module.exports = createCoreService('api::tag.tag', ({ strapi }) => ({
    async getAllTags(){
        try {
            const allTags = await strapi.entityService.findMany("api::tag.tag", {select: "*", fields:["id", "label"]})
            return allTags
        } catch(error) {
            return error
        }
    }
}))
