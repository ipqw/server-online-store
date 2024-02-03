const {Sequelize} = require('sequelize');
const pg = require('pg');

module.exports = new Sequelize("postgres://default:VkJ2rajm8gQw@ep-tight-salad-a4ydeewk.us-east-1.postgres.vercel-storage.com:5432/verceldb?ssl=true",
    {
        dialect: 'postgres',
        dialectModule: pg,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
    }
)