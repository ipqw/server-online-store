const ApiError = require("../error/ApiError")
const { Brand } = require("../models/models")

class BrandController {
    async create(req, res,){
        const { name } = req.body
        const brand = await Brand.create({name})
        return res.json(brand)
    }
    async getAll(req, res){
        const brands = await Brand.findAll()
        return res.json(brands)
    }
    async delete(req, res, next){
        const { id } = req.body
        const brand = await Brand.findOne({where:{id}})
        if(brand){
            Brand.destroy({where:{id}})
            return res.json('Brand was deleted')
        }
        else{
            return res.json('Brand was not found')
        }
    }
}

module.exports = new BrandController()