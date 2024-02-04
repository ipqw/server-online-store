const uuid = require('uuid')
const { Device, DeviceInfo, Rating } = require('../models/models')
const ApiError = require('../error/ApiError')
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const fs = require('fs')


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

class DeviceController {
    async create(req, res, next){
        try {
            const streamUpload = (req) => {
                const { img } = req.files
                return new Promise((resolve, reject) => {
                    let stream = cloudinary.uploader.upload_stream(
                      (error, result) => {
                        if (result) {
                          resolve(result);
                        } else {
                          reject(error);
                        }
                      }
                    );
                  streamifier.createReadStream(img.data).pipe(stream);
                });
            };
        
            async function upload(req) {
                let { name, price, brandId, typeId, info } = req.body
                
                let filename = uuid.v4() + '.jpg'
                let result = await streamUpload(req);
                console.log(result);
                const device = await Device.create({name, price, brandId, typeId, img: filename, url: result.url})
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
            }
            upload(req);
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