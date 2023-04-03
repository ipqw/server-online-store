const { BasketDevice, Basket } = require("../models/models")

class BasketDeviceController {
    async create(req, res){
        try {
            const { deviceId, basketId } = req.body
            const basketDevice = await BasketDevice.create({deviceId, basketId})
            return res.json(basketDevice)
        } catch (error) {
            console.error(error)
        }
        
    }
    async getAll(req, res){
        const devices = await BasketDevice.findAll()
        return res.json(devices)
    }
    async getOne(req, res){
        const { id } = req.params
        const device = await BasketDevice.findOne({
            where: { id },
        })
        return res.json(device)
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