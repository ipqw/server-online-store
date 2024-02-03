const {Sequelize} = require('sequelize');
const pg = require('pg');

module.exports = new Sequelize("postgres://default:Mc6psw9BXmCv@ep-restless-thunder-a2p3oqrf.eu-central-1.postgres.vercel-storage.com:5432/verceldb?ssl=true",
    {
        dialect: 'postgres',
        dialectModule: pg,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
    }
)