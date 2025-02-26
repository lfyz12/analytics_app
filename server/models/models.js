
const sequelize = require('../db')
const { DataTypes } = require('sequelize')
// Модель сотрудников
const Employee = sequelize.define('Employee', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    position: { type: DataTypes.STRING },
    department: { type: DataTypes.STRING },
    hired_at: { type: DataTypes.DATE, defaultValue: Date.now() },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    role: {type: DataTypes.STRING, defaultValue: 'EMLPLOYEE'},
}, { timestamps: false });

const Token = sequelize.define('token', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employeeId: { type: DataTypes.INTEGER, allowNull: false },
    refreshToken: { type: DataTypes.TEXT, allowNull: false }
})

Employee.hasOne(Token)
Token.belongsTo(Employee)

// Модель рабочих сессий
const WorkSession = sequelize.define('WorkSession', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employee_id: {type: DataTypes.INTEGER, allowNull: false},
    start_time: { type: DataTypes.DATE, allowNull: false },
    end_time: { type: DataTypes.DATE },
}, { timestamps: false });

WorkSession.belongsTo(Employee, { foreignKey: 'employee_id', onDelete: 'CASCADE' });
Employee.hasMany(WorkSession, { foreignKey: 'employee_id' });

// Модель задач
const Task = sequelize.define('Task', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employee_id: {type: DataTypes.INTEGER, allowNull: false},
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    status: { type: DataTypes.STRING, defaultValue: 'new' },
}, { timestamps: true });

Task.belongsTo(Employee, { foreignKey: 'assigned_to', onDelete: 'SET NULL' });
Employee.hasMany(Task, { foreignKey: 'assigned_to' });

// Модель логирования работы над задачами
const TaskTimeLog = sequelize.define('TaskTimeLog', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employee_id: {type: DataTypes.INTEGER, allowNull: false},
    task_id: {type: DataTypes.INTEGER, allowNull: false},
    start_time: { type: DataTypes.DATE, allowNull: false },
    end_time: { type: DataTypes.DATE },
}, { timestamps: false });

TaskTimeLog.belongsTo(Employee, { foreignKey: 'employee_id', onDelete: 'CASCADE' });
TaskTimeLog.belongsTo(Task, { foreignKey: 'task_id', onDelete: 'CASCADE' });
Employee.hasMany(TaskTimeLog, { foreignKey: 'employee_id' });
Task.hasMany(TaskTimeLog, { foreignKey: 'task_id' });

// Модель отчетов
const Report = sequelize.define('Report', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employee_id: {type: DataTypes.INTEGER, allowNull: false},
    report_date: { type: DataTypes.DATEONLY, allowNull: false },
    total_work_time: { type: DataTypes.INTEGER }, // В минутах
    total_tasks_completed: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { timestamps: true });

Report.belongsTo(Employee, { foreignKey: 'employee_id', onDelete: 'SET NULL' });
Employee.hasMany(Report, { foreignKey: 'employee_id' });
Report.belongsTo(Employee, { foreignKey: 'employee_id', onDelete: 'CASCADE' });
Employee.hasMany(Report, { foreignKey: 'employee_id' });

module.exports = { Employee, WorkSession, Task, TaskTimeLog, Report};
