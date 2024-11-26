import { Sequelize } from "sequelize-typescript";
import Dotenv from 'dotenv'

Dotenv.config()

const db = new Sequelize(process.env.DATABASE_URL, {
    models: [__dirname + "/../models/**/*"],
    logging: false
})

export default db

