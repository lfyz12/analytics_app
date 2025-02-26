const { TaskTimeLog, Employee, Task } = require('../models/models');
const ApiError = require('../error/ApiError');

class TaskTimeLogController {
    // 🔹 Начать учет времени работы над задачей
    async startTaskTimeLog(req, res, next) {
        try {
            const { employee_id, task_id, start_time } = req.body;

            if (!employee_id || !task_id) {
                return next(ApiError.badRequest("Не указан employee_id или task_id"));
            }

            const employee = await Employee.findByPk(employee_id);
            if (!employee) {
                return next(ApiError.badRequest("Сотрудник не найден"));
            }

            const task = await Task.findByPk(task_id);
            if (!task) {
                return next(ApiError.badRequest("Задача не найдена"));
            }

            const taskTimeLog = await TaskTimeLog.create({
                employee_id,
                task_id,
                start_time: start_time || new Date()
            });

            return res.json(taskTimeLog);
        } catch (error) {
            return next(ApiError.badRequest("Ошибка создания записи TaskTimeLog"));
        }
    }

    // 🔹 Завершить запись времени работы
    async endTaskTimeLog(req, res, next) {
        try {
            const { id } = req.params;
            const { end_time } = req.body;

            const taskTimeLog = await TaskTimeLog.findByPk(id);
            if (!taskTimeLog) {
                return next(ApiError.badRequest("Запись TaskTimeLog не найдена"));
            }

            if (taskTimeLog.end_time) {
                return next(ApiError.badRequest("Эта запись уже завершена"));
            }

            taskTimeLog.end_time = end_time || new Date();
            await taskTimeLog.save();

            return res.json(taskTimeLog);
        } catch (error) {
            return next(ApiError.badRequest("Ошибка завершения TaskTimeLog"));
        }
    }

    // 🔹 Получить все записи TaskTimeLog
    async getAllTaskTimeLogs(req, res, next) {
        try {
            const taskTimeLogs = await TaskTimeLog.findAll({ include: [Employee, Task] });
            return res.json(taskTimeLogs);
        } catch (error) {
            return next(ApiError.badRequest("Ошибка получения записей TaskTimeLog"));
        }
    }

    // 🔹 Получить записи по конкретному сотруднику
    async getTaskTimeLogsByEmployee(req, res, next) {
        try {
            const { employee_id } = req.params;

            const taskTimeLogs = await TaskTimeLog.findAll({
                where: { employee_id },
                include: [Task]
            });

            if (!taskTimeLogs.length) {
                return next(ApiError.badRequest("Нет записей TaskTimeLog для этого сотрудника"));
            }

            return res.json(taskTimeLogs);
        } catch (error) {
            return next(ApiError.badRequest("Ошибка получения записей TaskTimeLog по сотруднику"));
        }
    }

    // 🔹 Получить записи по конкретной задаче
    async getTaskTimeLogsByTask(req, res, next) {
        try {
            const { task_id } = req.params;

            const taskTimeLogs = await TaskTimeLog.findAll({
                where: { task_id },
                include: [Employee]
            });

            if (!taskTimeLogs.length) {
                return next(ApiError.badRequest("Нет записей TaskTimeLog для этой задачи"));
            }

            return res.json(taskTimeLogs);
        } catch (error) {
            return next(ApiError.badRequest("Ошибка получения записей TaskTimeLog по задаче"));
        }
    }

    // 🔹 Удалить запись TaskTimeLog
    async deleteTaskTimeLog(req, res, next) {
        try {
            const { id } = req.params;

            const taskTimeLog = await TaskTimeLog.findByPk(id);
            if (!taskTimeLog) {
                return next(ApiError.badRequest("Запись TaskTimeLog не найдена"));
            }

            await taskTimeLog.destroy();
            return res.json({ message: "Запись TaskTimeLog удалена" });
        } catch (error) {
            return next(ApiError.badRequest("Ошибка удаления TaskTimeLog"));
        }
    }
}

module.exports = new TaskTimeLogController();
