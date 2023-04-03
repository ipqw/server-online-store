const path = require('path')
const { Rating } = require('../models/models')
const ApiError = require('../error/ApiError')

class DeviceController {
    async create(req, res, next){
        try {
            let { rate, deviceId, userId, author, text } = req.body
            const rating = await Rating.create({rate, userId, deviceId, author, text})
            return res.json(rating)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async update(req, res, next){
        try {
            const { id, rate, deviceId, userId, author, text } = req.body
            const rating = await Rating.findOne({
                where: {id}
            })
            rating.set({
                rate, deviceId, userId, author, text
            })
            await rating.save()
            return res.json(rating)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res){
        const ratings = await Rating.findAll()
        return res.json(ratings)
    }
    
    async getOne(req, res, next){
        try {
            const { deviceId } = req.params
            const rating = await Rating.findAll({
                where: { deviceId },
            })
            return res.json(rating)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res){
        const { id } = req.body
        const rating = await Rating.findOne({where:{id}})
        if(rating){
            Rating.destroy({where:{id}})
            return res.json('Rating was deleted')
        }
        else{
            return res.json('Rating was not found')
        }
    }
}

module.exports = new DeviceController()