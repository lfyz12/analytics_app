const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const { Employee} = require('../models/models')
const tokenController = require('./tokenController')
const EmployeeDto = require('../dtos/employeeDto')

class EmployeeController {

    async registration(req, res, next) {
        try {
            const { first_name, last_name, email, position, department, password } = req.body

            if (!first_name || !last_name || !email || !position || !department || !password) {
                return next(ApiError.badRequest('Заполнтье все поля'))
            }

            const candidate = await Employee.findOne({ where: { email: email } })

            if (candidate) {
                return next(ApiError.badRequest('Сотрудник с такой почтой уже существует'))
            }

            const hashPassword = await bcrypt.hash(password, 5)
            const employee = await Employee.create({ first_name, last_name, email, position, department, password: hashPassword, hired_at: new Date,is_active: true, role: 'EMPLOYEE'})

            const employeeDto = new EmployeeDto(employee)
            const tokens = tokenController.generateTokens({ ...employeeDto })
            await tokenController.saveToken(employeeDto.id, tokens.refreshToken)

            res.cookie('refreshToken', tokens.refreshToken, { maxAge: 10 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json({...tokens, employee: {...employeeDto}})
            // res.cookie('accessToken', tokens.accessToken, {maxAge: 60 * 60 * 1000, httpOnly: true})
            // return res.json({ user: { ...userDto } })

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body
            const employee = await Employee.findOne({ where: { email: email } })
            if (!employee) {
                throw ApiError.badRequest('Неверная почта или пароль')
            }
            const isPassEquals = bcrypt.compareSync(password, employee.password)
            if (!isPassEquals) {
                throw ApiError.badRequest('Неверная почта или пароль')
            }
            const employeeDto = new EmployeeDto(employee)
            const tokens = tokenController.generateTokens({ ...employeeDto })
            await tokenController.saveToken(employeeDto.id, tokens.refreshToken)


            res.cookie('refreshToken', tokens.refreshToken, { maxAge: 10 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json({...tokens, employee: {...employeeDto}})
            // res.cookie('accessToken', tokens.accessToken, {maxAge: 60 * 60 * 1000, httpOnly: true})
            // return res.json({ user: { ...userDto } })

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            const deletedToken = await tokenController.removeToken(refreshToken)
            res.clearCookie('refreshToken')
            //res.clearCookie('accessToken')
            return res.json(deletedToken)

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async refresh(req, res, next) {
        try {
            console.log('PROVERKA!!!! 0')
            const { refreshToken } = req.query
            console.log('PROVERKA!!!! 1')
            if (!refreshToken) {
                console.log('PROVERKA!!!! 2')
                throw ApiError.badRequest('Не авторизован')
            }
            console.log('PROVERKA!!!! 3')
            const userData = tokenController.validateRefreshToken(refreshToken)
            const tokenFromDb = tokenController.findToken(refreshToken)
            if (!userData || !tokenFromDb) {
                throw ApiError.badRequest('Не авторизован')
            }
            const user = await Employee.findOne({ where: { id: userData.id } })
            const employeeDto = new EmployeeDto(user)
            const tokens = tokenController.generateTokens({ ...employeeDto })

            await tokenController.saveToken(employeeDto.id, tokens.refreshToken)

            res.cookie('refreshToken', tokens.refreshToken, { maxAge: 10 * 24 * 60 * 60 * 1000, httpOnly: true })
            //res.cookie('accessToken', tokens.accessToken, {maxAge: 60 * 60 * 1000, httpOnly: true})

            //return res.json({ user: userDto })
            return res.json({...tokens, user: {...employeeDto}})
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAllEmployees(req, res, next) {
        try {
            return res.json(await Employee.findAll())
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }


    }


    async getUserByEmployeeID(req, res, next) {
        try {
            const { id } = req.body
            const user = await Employee.findOne({ where: { id: id } })
            const employeeDto = new EmployeeDto(user)
            return res.json({...employeeDto})

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }






    //Для тестов и личного пользования, не в продакшн
    async createUser(req, res, next) {
        try {
            const { name, number, password } = req.body
            const hashPassword = await bcrypt.hash(password, 5)
            const user = await User.create({ name, number, password: hashPassword })
            await Basket.create({ userId: user['id'], aproxSum: 0 })
            return res.json(user)

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }


    async getUserByNumber(req, res, next) {
        try {
            const { number } = req.body
            const user = await User.findOne({ where: { number: number } })
            return res.json({ "id": user.id, "name": user.name, "number": user.number, "defaultAddress": user.defaultAddress })

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }



    async changeDefaultAddressByNumber(req, res, next) {
        try {
            const { number, defaultAddress } = req.body
            const updated = await User.update({ defaultAddress: defaultAddress }, { where: { number: number } })
            return res.json(updated)

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async changeNumberByNumber(req, res, next) {
        try {
            const { oldNumber, newNumber } = req.body
            const updated = await User.update({ number: newNumber }, { where: { number: oldNumber } })
            return res.json(updated)

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async changeNameByNumber(req, res, next) {
        try {
            const { number, name } = req.body
            const user = await User.update({ name: name }, { where: { number: number } })
            return res.json(user)

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async changeDefaultAddressById(req, res, next) {
        try {
            const { defaultAddress, id } = req.body
            const user = await User.update({ defaultAddress: defaultAddress }, { where: { id: id } })
            return res.json(user)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async changeNumberById(req, res, next) {
        try {
            const { number, id } = req.body
            const user = await User.update({ number: number }, { where: { id: id } })
            return res.json(user)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async changeNameById(req, res, next) {
        try {
            const { name, id } = req.body
            const user = await User.update({ name: name }, { where: { id: id } })
            return res.json(user)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async changeNumberAndNameById(req, res, next) {
        try {
            const { number, name, id } = req.body
            const user = await User.update({ number: number, name: name }, { where: { id: id } })
            return res.json(user)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async changeAllById(req, res, next) {
        try {
            const { defaultAddress, number, name, id } = req.body
            const user = await User.update({ defaultAddress: defaultAddress, number: number, name: name }, { where: { id: id } })
            return res.json(user)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async changeRoleByNumber(req, res, next) {
        try {
            const { number, role } = req.body
            const user = await User.update({ role: role }, { where: { number: number } })
            return res.json(user)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async changePasswordbyNumber(req, res, next) {
        try {
            const { number, password } = req.body
            const hashPassword = await bcrypt.hash(password, 5)
            const user = await User.update({ password: hashPassword }, { where: { number: number } })
            return res.json(user)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

}


// Изменяем имя пользователя с `userId = 2`
// await User.update(
//     {
//       firstName: 'John',
//     },
//     {
//       where: {
//         userId: 2,
//       },
//     }
//   )


// try {

// } catch (e){

// }
module.exports = new EmployeeController()