const uuid = require('uuid')
const path = require('path')
const { Device, DeviceInfo, Rating } = require('../models/models')
const ApiError = require('../error/ApiError')

class DeviceController {
    async create(req, res, next){
        try {
            let { name, price, brandId, typeId, info } = req.body
            const { img } = req.files
            let filename = uuid.v4() + '.jpg'
            img.mv(path.resolve(__dirname, '..', 'static', filename))

            const device = await Device.create({name, price, brandId, typeId, img: filename})

            if(info){
                info = JSON.parse(info)
                info.forEach(e => 
                    DeviceInfo.create({
                        title: e.title,
                        description: e.description,
                        deviceId: device.id,
                    })
                );
            }

            return res.json(device) 

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
        
    }

    async getAll(req, res){
        let { brandId, typeId } = req.query
        let devices
        if(!brandId && !typeId){
            devices = await Device.findAndCountAll()
        }
        if(brandId && !typeId){
            devices = await Device.findAndCountAll({where: {brandId}})
        }
        if(!brandId && typeId){
            devices = await Device.findAndCountAll({where: {typeId}})
        }
        if(brandId && typeId){
            devices = await Device.findAndCountAll({where: {brandId, typeId}})
        }

        return res.json(devices)
    }

    async getOne(req, res){
        try {
            const { id } = req.params
            const device = await Device.findOne({
                where: { id },
                include: [{model: DeviceInfo, as: 'info'}, {model: Rating, as: 'ratings'}] 
            })
            return res.json(device)
        } catch (error) {
            console.error(error)
        }
    }
    async delete(req, res){
        const { id } = req.body
        const device = await Device.findOne({where:{id}})
        if(device){
            Device.destroy({where:{id}})
            return res.json('Device was deleted')
        }
        else{
            return res.json('Device was not found')
        }
    }
}

module.exports = new DeviceController()