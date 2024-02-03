const { BasketDevice } = require("../models/models")

class BasketDeviceController {
    async create(req, res, next){
        try {
            const { deviceId, basketId } = req.body
            const existingBasketDevice = await BasketDevice.findOne({where: {basketId, deviceId}})
            if(!existingBasketDevice){
                const basketDevice = await BasketDevice.create({deviceId, basketId})
                return res.json(basketDevice)
            }
            else{
                return res.json({message: 'Товар уже добавлен в корзину'})
            }
            
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async getAll(req, res){
        const devices = await BasketDevice.findAll()
        return res.json(devices)
    }
    async getOne(req, res, next){
        try {
            const { id } = req.params
            const device = await BasketDevice.findOne({
                where: { id },
            })
        return res.json(device)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
        
    }
    async delete(req, res, next){
        try{
            const { id } = req.body
            const device = await BasketDevice.findOne({where:{id}})
            if(device){
                BasketDevice.destroy({where:{id}})
                return res.json('Device was deleted')
            }
            else{
                return res.json('Device was not found')
            }
        }
        catch (e) {
            next(ApiError.badRequest(e.message))
        }
        
    }
}

module.exports = new BasketDeviceController()