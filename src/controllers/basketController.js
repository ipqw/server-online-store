const { Basket, BasketDevice } = require("../models/models")

class BasketController {
    async getAll(req, res){
        const baskets = await Basket.findAll()
        return res.json(baskets)
    }
    async getOne(req, res){
        try{
            const { id } = req.params
            const baskets = await Basket.findOne({
                where: { userId: id },
                include: [{model: BasketDevice, as: 'basket_devices'}] 
            })
            return res.json(baskets)
        }
        catch(err){
            console.error(err)
        }
        
    }
}

module.exports = new BasketController()