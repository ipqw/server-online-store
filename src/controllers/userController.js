const ApiError = require("../error/ApiError")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {User, Basket, Rating} = require('../models/models')

const generateJWT = (id, email, role) => {
    return jwt.sign({id, email, role}, process.env.SECRET_KEY, {expiresIn: '12h'})
}
    
class UserController {
    async registration(req, res, next){
        try {
            const { email, password, role } = req.body
            if(!email || !password){
                return next(ApiError.badRequest('Некорректный email или пароль'))
            }
            const candidate = await User.findOne({where: {email}})
            if(candidate){
                return next(ApiError.badRequest('Пользователь с таким email уже существует'))
            }
            const hashPassword = await bcrypt.hash(password, 6)
            const user = await User.create({email, role, password: hashPassword})
            const basket = await Basket.create({userId: user.id})
            const token = generateJWT(user.id, user.email, user.role)
            return res.json({token, userId: user.id})
        } catch (error) {
            console.error(error)
        }
        
    }

    async login(req, res, next){
        try {
            const { email, password } = req.body
            const user = await User.findOne({where: {email}})
            if(!user){
                return next(ApiError.internal('Пользователь не найден'))
            }
            let comparePassword = bcrypt.compareSync(password, user.password)
            if(!comparePassword){
                return next(ApiError.internal('Указан неверный пароль'))
            }
            const token = generateJWT(user.id, user.email, user.role)
            return res.json({token, userId: user.id})
        } catch (error) {
            console.error(error)
        }
    }

    async check(req, res, next){
        try {
            const token = generateJWT(req.user.id, req.user.email, req.user.role)
            return res.json({token})
        } catch (error) {
            console.error(error)
        }
        
    }

    async delete(req, res){
        try {
            const { id } = req.body
            const user = await User.findOne({where:{id}})
            if(user){
                User.destroy({where:{id}})
                return res.json('User was deleted')
            }
            else{
                return res.json('User was not found')
            }
        } catch (error) {
            console.error(error)
        }
    }
    async getAll(req, res){
        let { page, limit } = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        const users = await User.findAndCountAll({limit, offset})
        return res.json(users)
    }
    async getOne(req, res){
        try {
            const { id } = req.params
            const user = await User.findOne({
                where: { id },
                include: [{model: Rating, as: 'ratings'}, {model: Basket, as: 'basket'}] 
            })
            return res.json(user)

        } catch (error) {
            console.error(error)
        }
        
    }
}

module.exports = new UserController()