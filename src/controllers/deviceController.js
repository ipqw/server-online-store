const uuid = require('uuid')
const { Device, DeviceInfo, Rating } = require('../models/models')
const ApiError = require('../error/ApiError')
const cloudinary = require('cloudinary').v2

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class DeviceController {
    async create(req, res, next){
        try {
            let { name, price, brandId, typeId, info } = req.body
            const { img } = req.files
            let filename = uuid.v4() + '.jpg'
            const image = await cloudinary.uploader.upload(img.tempFilePath).then(result => result)
            const device = await Device.create({name, price, brandId, typeId, img: filename, url: image.url})

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

    async getOne(req, res, next){
        try {
            const { id } = req.params
            const device = await Device.findOne({
                where: { id },
                include: [{model: DeviceInfo, as: 'info'}, {model: Rating, as: 'ratings'}] 
            })
            return res.json(device)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async delete(req, res, next){
        try {
            const { id } = req.body
            const device = await Device.findOne({where:{id}})
            if(device){
                Device.destroy({where:{id}})
                return res.json('Device was deleted')
            }
            else{
                return res.json('Device was not found')
            }
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new DeviceController()