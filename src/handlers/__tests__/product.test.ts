import request from 'supertest';
import server from '../../server';


describe('POST /api/products', () => {

    it('should display validation errors', async () => {
        const response = await request(server).post('/api/products').send({})
        /* SI */
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(4)
        /* NO */
        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)
    })

    it('should validate that the price is greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            "name": "Monitor Curvo - TEST",
            "price": 0
        })
        /* SI */
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        /* NO */
        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)
    })

    it('should validate that the price is a number and greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            "name": "Monitor Curvo - TEST",
            "price": "HOLA"
        })
        /* SI */
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)
        /* NO */
        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(3)
    })

    it('should create a new product', async () => {
        const response = await request(server).post('/api/products').send({
            "name": "Mouse - Testing",
            "price": 50
        })
        /* SI */
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('data')
        /* NO */
        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('error')
    })
})

describe('GET /api/products', () => {
    it('should check if apu/products exists', async () => {
        const response = await request(server).get('/api/products')
        expect(response.status).not.toBe(404)
    })
    it('GET a JSOn response with products', async () => {
        const response = await request(server).get('/api/products')

        /* SI */
        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveLength(1)
        /* NO */
        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('GET /api/products/:id', () => {
    it('Should return a 404 response for a non-existent product', async () => {
        const productID = 2000
        const response = await request(server).get(`/api/products/${productID}`)

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Product not found')
    })

    it('Should check a valid ID in the URL', async () => {
        const response = await request(server).get(`/api/products/not-valid-url`)

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no valido')
    })

    it('get a JSON response for a single product', async () => {
        const response = await request(server).get(`/api/products/1`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
    })
})

describe('PUT /api/products/:id', () => {
    it('Should check a valid ID in the URL', async () => {
        const response = await request(server)
                                .put(`/api/products/not-valid-url`)
                                .send( {
                                    name: "Monitor nuevo - Actualizado",
                                    price: 200,
                                    availability: true
                                })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no valido')
    })

    it('Should display validation error message when updating a product', async () => {
        const response = await request(server).put(`/api/products/1`).send({})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(5)

        /* NO */
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
        expect(response.body.errors).not.toHaveLength(3)
    })

    it('Should validate that the price is greater than 0', async () => {
        const response = await request(server)
                                .put(`/api/products/1`)
                                .send(
                                    {
                                        name: "Monitor nuevo - Actualizado",
                                        price: 0,
                                        availability: true
                                    }
                                )


        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('precio no valido')

        /* NO */
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
        expect(response.body.errors).not.toHaveLength(3)
    })

    it('Should return a 404 response for a non-existent product', async () => {
        const productID = 2000
        const response = await request(server)
                                .put(`/api/products/${productID}`)
                                .send(
                                    {
                                        name: "Monitor nuevo - Actualizado",
                                        price: 300,
                                        availability: true
                                    }
                                )


        expect(response.status).toBe(404)
        expect(response.body.message).toBe('Product not found')

        /* NO */
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('Should update an existent product with valid data', async () => {
        const productID = 1
        const response = await request(server)
                                .put(`/api/products/${productID}`)
                                .send(
                                    {
                                        name: "Monitor nuevo - Actualizado",
                                        price: 300,
                                        availability: true
                                    }
                                )


        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

        /* NO */
        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('errors')
    })
})


describe('PATCH /apu/products/:id', () => {
    it('Should return a 404 response for a non-existent product', async () => {
        const productID = 2000
        const response = await request(server).patch(`/api/products/${productID}`)

        expect(response.status).toBe(404)
        expect(response.body.message).toBe('Product not found')

        /* NO */
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('Should update the product availability', async () => {
        const productID = 1
        const response = await request(server).patch(`/api/products/${productID}`)
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.availability).toBe(false)
        
        /* NO */
        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('errors')
    }) 
})

describe('DELETE /api/products/:id', () => {
    it('Should check a valid ID', async () => {
        const response = await request(server).delete(`/api/products/not-valid-url`)

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no valido')
    })

    it('Should return a 404 response for a non-existent product', async () => {
        const productID = 2000
        const response = await request(server).delete(`/api/products/${productID}`)

        expect(response.status).toBe(404)
        expect(response.body.message).toBe('Product not found')

        /* NO */
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('Should delete an existent product', async () => {
        const productID = 1
        const response = await request(server).delete(`/api/products/${productID}`)

        expect(response.status).toBe(200)
        expect(response.body.data).toBe('Product deleted successfully')
    })
})
