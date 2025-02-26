const { WorkSession, Employee } = require('../models/models'); // Импортируем модели
const { Op } = require('sequelize'); // Операторы для фильтрации
const ApiError = require('../error/ApiError')
class WorkSessionController {
    // 🔹 1. Начать новую рабочую сессию
    async startSession(req, res, next) {
        try {
            const { employee_id } = req.body;

            // Проверяем, существует ли сотрудник
            const employee = await Employee.findByPk(employee_id);
            if (!employee) {
                return res.status(404).json({ message: 'Сотрудник не найден' });
            }

            // Проверяем, нет ли уже активной сессии
            const activeSession = await WorkSession.findOne({
                where: { employee_id, end_time: null }
            });

            if (activeSession) {
                return next(ApiError.badRequest('У сотрудника уже есть активная рабочая сессия' ))
            }

            // Создаем новую сессию
            const session = await WorkSession.create({ employee_id, start_time: new Date() });
            return res.status(201).json(session);
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    // 🔹 2. Завершить рабочую сессию
    async endSession(req, res, next) {
        try {
            const { employee_id } = req.body;

            // Ищем активную сессию
            const session = await WorkSession.findOne({
                where: { employee_id, end_time: null }
            });

            if (!session) {
                return next(ApiError.badRequest( 'Активная рабочая сессия не найдена' ));
            }

            // Завершаем сессию
            session.end_time = new Date();
            await session.save();

            return res.json(session);
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }
    // 🔹 3. Получить список всех сессий (можно фильтровать по сотруднику и датам)
    async getSessions(req, res) {
        try {
            const { employee_id, start_date, end_date } = req.query;

            let whereClause = {};
            if (employee_id) whereClause.employee_id = employee_id;
            if (start_date && end_date) {
                whereClause.start_time = {
                    [Op.between]: [new Date(start_date), new Date(end_date)]
                };
            }

            const sessions = await WorkSession.findAll({ where: whereClause, include: Employee });
            return res.json(sessions);
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    // 🔹 4. Удаление рабочей сессии (если нужно)
    async deleteSession(req, res) {
        try {
            const { id } = req.params;
            const session = await WorkSession.findByPk(id);

            if (!session) {
                return res.status(404).json({ message: 'Рабочая сессия не найдена' });
            }

            await session.destroy();
            return res.json({ message: 'Сессия удалена' });
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }
}

module.exports = new WorkSessionController();
