import { Router } from 'express'
import { createProduct, deleteProduct, getProducts, getProductsById, updateAvailability, updateProduct } from './handlers/product'
import { body, param } from 'express-validator'
import { handleInputErrors } from './middleware'

const router = Router()

/**
 * @swagger
 *  components: 
 *      schemas:
 *          product:
 *              type: object
 *              properties:
 *                  id: 
 *                      type: integer
 *                      descroption: the Product ID
 *                      example: 1
 *                  name: 
 *                      type: string
 *                      descroption: the Product Name
 *                      example: Monitor Curvo de 45 Pulgadas
 *                  price: 
 *                      type: number
 *                      descroption: the Product price
 *                      example: 300
 *                  availability: 
 *                      type: boolean
 *                      descroption: the Product availability
 *                      example: true
 */


/* Routing */

/**
 * @swagger
 *  /api/products:
 *      get:
 *          sumary: Get a List of Product
 *          tags: 
 *              - Products
 *          description: Returns a list of Products
 *          responses: 
 *              200: 
 *                  description: Successful response
 *                  content: 
 *                      application/json: 
 *                          schema: 
 *                              type: array
 *                              items: 
 *                                  $ref: '#/components/schemas/product'
 */
router.get('/', getProducts)

/**
 *  @swagger
 *  /api/products/{id}:
 *      get: 
 *          sumary: Get a Product by ID
 *          tags: 
 *              - Products
 *          description: Returns a Product based on its unique ID
 *          parameters:
 *            - in: path
 *              name: id 
 *              description: the ID of the Product to retrieve
 *              required: true
 *              schema: 
 *                  type: integer
 *          responses: 
 *              200: 
 *                  description: Successful response
 *                  content: 
 *                      application/json: 
 *                          schema: 
 *                              $ref: '#/components/schemas/product'
 *              404: 
 *                  description: Not found
 *                  
 *              400:
 *                  description: Bad request - Invalid ID 
 * 
 */

router.get('/:id',
    param('id')
        .isInt().withMessage('ID no valido'),
    handleInputErrors,
    getProductsById
)

/**
 * @swagger
 *  /api/products:
 *      post: 
 *          summary: Creates a new Product
 *          tags: 
 *              - Products
 *          description: Returns a new record in the Database
 *          requestBody: 
 *              required: true
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties: 
 *                              name: 
 *                                  type: string
 *                                  example: "monitor curvo 49 pulgadas" 
 *                              price: 
 *                                  type: number
 *                                  example: 399
 *  
 *          responses: 
 *              201: 
 *                  description: Product updated successfully
 *                  content: 
 *                      application/json:
 *                          schema: 
 *                              $ref: '#/components/schemas/product'
 *              400: 
 *                  description: Bad request - Invalid input data
 */

router.post('/',
    /* Validacion */
    body('name')
        .notEmpty().withMessage("el nombre del producto no puede ir vacio"),
    body('price').custom((value) => value > 0).withMessage("precio no valido")
        .isNumeric().withMessage("Valor no valido")
        .notEmpty().withMessage("el precio del producto no puede ir vacio"),
    handleInputErrors,
    createProduct
)

/**
 * @swagger
 *  /api/products/{id}: 
 *      put: 
 *          sumary: Updates a product with user input
 *          tags: 
 *              - Products 
 *          description: Returns the updated product 
 *          parameters:
 *            - in: path
 *              name: id 
 *              description: the ID of the Product to retrieve
 *              required: true
 *              schema: 
 *                  type: integer
 *          requestBody: 
 *              required: true
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties: 
 *                              name: 
 *                                  type: string
 *                                  example: "monitor curvo 49 pulgadas" 
 *                              price: 
 *                                  type: number
 *                                  example: 399
 *                              availability: 
 *                                  type: boolean
 *                                  example: true
 *          responses: 
 *              200: 
 *                  description: Product updated successfully
 *                  content: 
 *                      application/json:
 *                          schema: 
 *                              $ref: '#/components/schemas/product'
 *              400: 
 *                  description: Bad request - Invalid Id or Input Data
 *              404: 
 *                  description: Product Not Found
 */

router.put('/:id',
    param('id')
        .isInt().withMessage('ID no valido'),
    body('name')
        .notEmpty().withMessage("el nombre del producto no puede ir vacio"),
    body('price').custom((value) => value > 0).withMessage("precio no valido")
        .isNumeric().withMessage("Valor no valido")
        .notEmpty().withMessage("el precio del producto no puede ir vacio"),
    body('availability').isBoolean().withMessage("Valor para disponibilidad no valido"),
    handleInputErrors,
    updateProduct
)

/** 
 * @swagger
 * /api/products/{id}:
 *      patch: 
 *          sumary: Update product availability
 *          tags: 
 *              - Products
 *          description: Returns the updated availability
 *          parameters:
 *            - in: path
 *              name: id 
 *              description: the ID of the Product to retrieve
 *              required: true
 *              schema: 
 *                  type: integer
 *          responses: 
 *              200: 
 *                  description: Successfully responses
 *                  content: 
 *                      application/json:
 *                          schema: 
 *                              $ref: '#/components/schemas/product'
 *              400: 
 *                  description: Bad request - Invalid Id 
 *              404: 
 *                  description: Product Not Found
 * 
 * 
*/

router.patch('/:id', 
    param('id')
        .isInt().withMessage('ID no valido'),
    handleInputErrors,
    updateAvailability
)

/** 
 * @swagger
 * /api/products/{id}:
 *      delete: 
 *          sumary: Deletes a product by a given ID 
 *          tags: 
 *              - Products
 *          description: Returns a confirmation message
 *          parameters:
 *            - in: path
 *              name: id 
 *              description: the ID of the Product to delete
 *              required: true
 *              schema: 
 *                  type: integer
 *          responses: 
 *              200: 
 *                  description: Successfully responses
 *                  content: 
 *                     application/json:
 *                          schema: 
 *                              type: string
 *                              value: "Product deleted successfully"
 *              400: 
 *                  description: Bad request - Invalid Id 
 *              404: 
 *                  description: Product Not Found
 * 
 * 
*/

router.delete('/:id', 
    param('id')
        .isInt().withMessage('ID no valido'),
    handleInputErrors,
    deleteProduct
)

export default router