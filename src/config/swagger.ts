import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerUiOptions } from "swagger-ui-express";

const options:swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi: '3.0.2',
        tags: [
            {
                name: 'Products',
                description: 'API Operations related to products'
            }
        ],
        info: {
            title: 'REST API Node.js / Express / TypeScript',
            version: '1.0.0',
            description: 'API Docs for Products'
        }
    },
    apis: [
        './src/router.ts'
    ]
}

const swaggerSpec = swaggerJSDoc(options)

const swaggerUiOptions:SwaggerUiOptions = {
    customCss: `
        .topbar-wrapper .link {
            content: url('https://www.creativefabrica.com/wp-content/uploads/2021/08/24/Flying-Phoenix-Fire-Bird-Abstract-Logo-Graphics-16278834-1.jpg');
            height: auto;
            width: auto;
        }
        .swagger-ui .topbar {
            background-color: black;
        }
    `,
    customSiteTitle: "Documentacion REST API Express / TypeScript"
}

export default swaggerSpec;
export {
    swaggerUiOptions
}