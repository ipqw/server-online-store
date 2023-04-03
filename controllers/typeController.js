const { Type } = require('../models/models');
const ApiError = require('../error/ApiError')

class TypeController {
    async create(req, res){
        const { name } = req.body
        const type = await Type.create({name})
        return res.json(type)
    }

    async getAll(req, res){
        const types = await Type.findAll()
        return res.json(types)
    }
    async delete(req, res, next){
        const { id } = req.body
        const type = await Type.findOne({where:{id}})
        if(type){
            Type.destroy({where:{id}})
            return res.json('Type was deleted')
        }
        else{
            return res.json('Type was not found')
        }
    }
}

module.exports = new TypeController()