module.exports = {
    routes: [
        {
            method: "POST",
            path: "/product",
            handler: "product.createProduct",
            config: {
                auth: false,
            },
        },
        {
            method: "GET",
            path: "/get-all-relevant-entries",
            handler: "product.getAllRelevantEntries",
            config: {
                auth: false,
            },
        },
        {
            method: "GET",
            path: "/product/getStream",
            handler: "product.startSendingEvents",
            config: {
                auth: false,
            },
        },
    ],
}
