const { BasketDevice, Basket } = require("../models/models")

class BasketDeviceController {
    async create(req, res){
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
            
        } catch (error) {
            console.error(error)
        }
    }
    async getAll(req, res){
        const devices = await BasketDevice.findAll()
        return res.json(devices)
    }
    async getOne(req, res){
        try {
            const { id } = req.params
            const device = await BasketDevice.findOne({
                where: { id },
            })
        return res.json(device)
        } catch (error) {
            console.error(error)
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
        catch(error){
            console.error(error)
        }
        
    }
}

module.exports = new BasketDeviceController()