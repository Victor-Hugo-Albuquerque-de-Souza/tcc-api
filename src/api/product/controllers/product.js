const { createCoreController } = require('@strapi/strapi').factories;
const schedule = require('node-schedule');

module.exports = createCoreController(
    "api::product.product",
    ({ strapi }) => ({
        async createProduct(ctx){
            try {
                const request = {data:ctx.request.body}
                const files = ctx.request.files
                const product = await strapi.service("api::product.product").createProduct(request, files)
                ctx.send(product)
            } catch (error) {
                console.log(error)
                ctx.send({message: error.message}, error.status)
            }
        },
        async getAllRelevantEntries(ctx) {
            try {
                const brands = await strapi.service("api::brand.brand").getAllBrands()
                const products = await strapi.service("api::product.product").getAllProducts()
                const tags = await strapi.service("api::tag.tag").getAllTags()
                //REFORMATANDO OS OBJETOS PARA RETORNAR PARA O FRONT:
                const formattedBrands = brands.map(brand => ({
                    id: brand.id,
                    label: brand.name,
                    value: brand.name
                }))
                const formattedProducts = products.map(product => ({
                    id: product.id,
                    label: product.name,
                    value: product.name
                }))
                const formattedTags = tags.map(tag => ({
                    id: tag.id,
                    label: tag.label,
                    value: tag.label
                }))
                const response = {
                    brands: formattedBrands,
                    products: formattedProducts,
                    tags: formattedTags
                }
                ctx.send(response)
            } catch (err) {
                ctx.send({message: err.message}, err.status)
            }
        },
        startSendingEvents: async (ctx) => {
            ctx.respond = false
            ctx.response.status = 200
            ctx.set('Content-Type', 'text/event-stream')
            ctx.set('Cache-Control', 'no-cache')
            ctx.set('Connection', 'keep-alive')
            ctx.set('Access-Control-Allow-Origin', '*')
    
            console.log('Cliente conectado')

            console.log('Essas são as querys:', ctx.query)

            const sendMessage = (message) => {
                console.log('rodou uma vez o sendMessage')
                ctx.res.write(`data: ${JSON.stringify(message)}\n\n`)
            };
            let count = 0
            const intervalId = setInterval(() => {
                sendMessage({ message: 'mensagem periódica do backend número ' + count });
                count++;
            }, 1000);
            
            ctx.req.on('close', () => {
                console.log('Cliente desconectado')
                clearInterval(intervalId);
                ctx.res.end()
            })
        }
    })
);
