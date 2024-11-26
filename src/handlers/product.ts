import { body } from 'express-validator';
import { Request, Response } from 'express'
import Product from '../models/Product.model'


export const getProducts = async (req: Request, res: Response) => {
    const products = await Product.findAll({
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        },
        order: [
            ["id", "DESC"]
        ]
    })
    res.send({ data: products })
}

export const getProductsById = async (req: Request, res: Response) => {
    const { id } = req.params
    const product = await Product.findByPk(id, {
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        }
    })

    if (!product) {
        res.status(404).send({ message: 'Product not found' })
        return
    }

    res.send({ data: product });
}

export const createProduct = async (req: Request, res: Response) => {
    
    const product = await Product.create(req.body)
    res.status(201).send({ data: product })
}

export const updateProduct = async (req: Request, res: Response) => {
    /* Consultar si existe */
    const { id } = req.params
    const product = await Product.findByPk(id, {
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        }
    })

    if (!product) {
        res.status(404).send({ message: 'Product not found' })
        return
    }

    /* Actualizar */
    await product.update(req.body)
    await product.save()


    res.send({ data: product });
}

export const updateAvailability = async (req: Request, res: Response) => {
    /* Consultar si existe */
    const { id } = req.params
    const product = await Product.findByPk(id, {
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        }
    })

    if (!product) {
        res.status(404).send({ message: 'Product not found' })
        return
    }

    /* Actualizar */
    product.availability = !product.dataValues.availability
    await product.save()


    res.send({ data: product });
}

export const deleteProduct = async (req: Request, res: Response) => {
    /* Consultar si existe */
    const { id } = req.params
    const product = await Product.findByPk(id, {
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        }
    })

    if (!product) {
        res.status(404).send({ message: 'Product not found' })
        return
    }

    await product.destroy()
    res.send({ data: 'Product deleted successfully' });
}