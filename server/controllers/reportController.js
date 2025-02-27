const { Report, Employee, TaskTimeLog } = require('../models/models');
const ApiError = require('../error/ApiError');
const { Op } = require('sequelize');

class ReportController {
    // 🔹 Создание отчета за день
    async createReport(req, res, next) {
        try {
            console.log('PROVERKA!!!! 1')
            const { employee_id, report_date } = req.body;
            console.log('PROVERKA!!!! 2')
            if (!employee_id || !report_date) {
                return next(ApiError.badRequest("Не указан employee_id или report_date"));
            }
            console.log('PROVERKA!!!! 3')
            const employee = await Employee.findByPk(employee_id);
            if (!employee) {
                return next(ApiError.badRequest("Сотрудник не найден"));
            }
            console.log('PROVERKA!!!! 4')

            // Проверяем, есть ли уже отчет на эту дату
            const existingReport = await Report.findOne({
                where: { employee_id, report_date }
            });
            console.log('PROVERKA!!!! 5')

            if (existingReport) {
                return next(ApiError.badRequest("Отчет за этот день уже существует"));
            }
            console.log('PROVERKA!!!! 6')
            // Получаем рабочие сессии за этот день
            const startOfDay = new Date(report_date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(report_date);
            endOfDay.setHours(23, 59, 59, 999);

            const taskTimeLogs = await TaskTimeLog.findAll({
                where: {
                    employee_id,
                    start_time: { [Op.gte]: startOfDay },
                    end_time: { [Op.lte]: endOfDay }
                }
            });

            console.log('PROVERKA!!!! 7')

            const total_work_time = taskTimeLogs.reduce((acc, log) => {
                if (log.end_time) {
                    return acc + (new Date(log.end_time) - new Date(log.start_time)) / 60000; // В минутах
                }
                return acc;
            }, 0);
            console.log('PROVERKA!!!! 8')
            const total_tasks_completed = await TaskTimeLog.count({
                where: {
                    employee_id,
                    end_time: { [Op.ne]: null }
                }
            });
            console.log('PROVERKA!!!! 9')
            const report = await Report.create({
                employee_id,
                report_date,
                total_work_time: Math.round(total_work_time),
                total_tasks_completed
            });
            console.log('PROVERKA!!!! 10')
            return res.json(report);
        } catch (error) {
            return next(ApiError.badRequest("Ошибка создания отчета"));
        }
    }

    // 🔹 Получение всех отчетов
    async getAllReports(req, res, next) {
        try {
            const reports = await Report.findAll({ include: [Employee] });
            return res.json(reports);
        } catch (error) {
            return next(ApiError.badRequest("Ошибка получения отчетов"));
        }
    }

    // 🔹 Получение отчетов по сотруднику
    async getReportsByEmployee(req, res, next) {
        try {
            const { employee_id } = req.params;

            const reports = await Report.findAll({
                where: { employee_id },
                include: [Employee]
            });

            if (!reports.length) {
                return next(ApiError.badRequest("Нет отчетов для этого сотрудника"));
            }

            return res.json(reports);
        } catch (error) {
            return next(ApiError.badRequest("Ошибка получения отчетов сотрудника"));
        }
    }

    // 🔹 Получение отчета за конкретную дату
    async getReportByDate(req, res, next) {
        try {
            const { employee_id, report_date } = req.params;

            const report = await Report.findOne({
                where: { employee_id, report_date },
                include: [Employee]
            });

            if (!report) {
                return next(ApiError.badRequest("Отчет за указанную дату не найден"));
            }

            return res.json(report);
        } catch (error) {
            return next(ApiError.badRequest("Ошибка получения отчета за дату"));
        }
    }

    // 🔹 Удаление отчета
    async deleteReport(req, res, next) {
        try {
            const { id } = req.params;

            const report = await Report.findByPk(id);
            if (!report) {
                return next(ApiError.badRequest("Отчет не найден"));
            }

            await report.destroy();
            return res.json({ message: "Отчет удален" });
        } catch (error) {
            return next(ApiError.badRequest("Ошибка удаления отчета"));
        }
    }
}

module.exports = new ReportController();
