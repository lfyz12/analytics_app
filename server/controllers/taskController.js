const { Task, Employee } = require('../models/models');
const ApiError = require('../error/ApiError'); // Используем кастомные ошибки

class TaskController {
    // 🔹 1. Создать новую задачу
    async createTask(req, res, next) {
        try {
            const { title, description, employee_id, status } = req.body;

            if (!title) {
                return next(ApiError.badRequest('Название задачи обязательно'));
            }

            // Проверяем, существует ли сотрудник
            if (employee_id) {
                const employee = await Employee.findByPk(employee_id);
                if (!employee) {
                    return next(ApiError.badRequest('Сотрудник не найден'));
                }
            }

            // Создаем задачу
            const task = await Task.create({ title, description, employee_id, status });

            return res.status(201).json(task);
        } catch (error) {
            return next(ApiError.badRequest(error.message));
        }
    }

    // 🔹 2. Получить список всех задач (фильтрация по статусу и исполнителю)
    async getTasks(req, res, next) {
        try {
            const { status, employee_id } = req.query;
            // let whereClause = {};
            //
            // if (status !== '') whereClause.status = status;
            // if (employee_id !== 0) whereClause.employee_id = employee_id;

            const tasks = await Task.findAll({
                // include: { model: Employee, attributes: ['id', 'first_name', 'last_name'] }
            });

            return res.json(tasks);
        } catch (error) {
            return next(ApiError.badRequest(error.message));
        }
    }

    // 🔹 3. Получить одну задачу по ID
    async getTaskById(req, res, next) {
        try {
            const { id } = req.params;

            const task = await Task.findByPk(id, {
                include: { model: Employee, attributes: ['id', 'first_name', 'last_name'] }
            });

            if (!task) {
                return next(ApiError.badRequest('Задача не найдена'));
            }

            return res.json(task);
        } catch (error) {
            return next(ApiError.badRequest(error.message));
        }
    }

    // 🔹 4. Обновить задачу (изменить статус, описание и т. д.)
    async updateTask(req, res, next) {
        try {
            const { id } = req.params;
            const { title, description, employee_id, status } = req.body;

            const task = await Task.findByPk(id);
            if (!task) {
                return next(ApiError.badRequest('Задача не найдена'));
            }

            // Проверяем, существует ли сотрудник, если он указан
            if (employee_id) {
                const employee = await Employee.findByPk(employee_id);
                if (!employee) {
                    return next(ApiError.badRequest('Сотрудник не найден'));
                }
            }

            // Обновляем данные
            if (title) task.title = title;
            if (description) task.description = description;
            if (status) task.status = status;
            if (employee_id) task.employee_id = employee_id;

            await task.save();
            return res.json(task);
        } catch (error) {
            return next(ApiError.badRequest(error.message));
        }
    }

    // 🔹 5. Удалить задачу
    async deleteTask(req, res, next) {
        try {
            const { id } = req.params;

            const task = await Task.findByPk(id);
            if (!task) {
                return next(ApiError.badRequest('Задача не найдена'));
            }

            await task.destroy();
            return res.json({ message: 'Задача удалена' });
        } catch (error) {
            return next(ApiError.badRequest(error.message));
        }
    }
}

module.exports = new TaskController();
