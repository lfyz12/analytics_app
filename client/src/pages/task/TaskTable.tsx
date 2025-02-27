import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from "../../index";
import {IEmployee} from "../../models/IEmployee/IEmployee";
import {ITask} from "../../models/ITask/ITask";

const TaskTable = observer(() => {
    const { taskStore, employeeStore } = useContext(Context);
    const [statusFilter, setStatusFilter] = useState('');
    const [employeeFilter, setEmployeeFilter] = useState('');
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        status: 'pending',
        employee_id: ''
    });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        taskStore.fetchTasks(statusFilter, employeeFilter ? +employeeFilter : 0);
    }, [statusFilter, employeeFilter]);

    useEffect(() => {
        employeeStore.getAll();
    }, []);

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        await taskStore.createTask(
            Number(newTask.employee_id),
            newTask.title,
            newTask.description,
            newTask.status
        );
        setShowModal(false);
        taskStore.fetchTasks(statusFilter, employeeFilter ? +employeeFilter : 0);
        setNewTask({ title: '', description: '', status: 'pending', employee_id: '' });
    };

    const handleStatusChange = async (taskId: number, newStatus: string) => {
        const task = taskStore.tasks.find(t => t.id === taskId);
        if (task) {
            await taskStore.updateTask(
                taskId,
                task.employee_id,
                task.title,
                task.description,
                newStatus
            );
            // Обновляем локальное состояние после успешного обновления
            taskStore.setTasks(taskStore.tasks.map(t =>
                t.id === taskId ? {...t, status: newStatus} : t
            ));
        }
    };

    const filteredTasks = taskStore.tasks.filter(task =>
        (statusFilter ? task.status === statusFilter : true) &&
        (employeeFilter ? task.employee_id === Number(employeeFilter) : true)
    ).sort((a: ITask, b:ITask ) => a.id - b.id);

    const statusStyles = {
        pending: 'bg-yellow-100 text-yellow-800',
        in_progress: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800'
    };

    const formatEmployeeName = (employee: IEmployee) =>
        `${employee.first_name} ${employee.last_name?.[0] || ''}.`;

    return (
        <div className="p-6 bg-gray-50 rounded-xl shadow-sm">
            {/* Фильтры */}
            <div className="mb-6 flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-lg shadow">
                <div className="flex flex-wrap gap-4 flex-1">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                        >
                            <option value="">Все статусы</option>
                            <option value="pending">Ожидание</option>
                            <option value="in_progress">В процессе</option>
                            <option value="completed">Завершено</option>
                        </select>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Исполнитель</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            value={employeeFilter}
                            onChange={e => setEmployeeFilter(e.target.value)}
                        >
                            <option value="">Все исполнители</option>
                            {employeeStore.employeeList.map(employee => (
                                <option key={employee.id} value={employee.id}>
                                    {formatEmployeeName(employee)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    onClick={() => setShowModal(true)}
                >
                    + Создать задачу
                </button>
            </div>

            {/* Модальное окно создания */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Новая задача</h2>
                        <form onSubmit={handleCreateTask}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Название</label>
                                    <input
                                        className="w-full px-3 py-2 border rounded-md"
                                        value={newTask.title}
                                        onChange={e => setNewTask({...newTask, title: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Описание</label>
                                    <textarea
                                        className="w-full px-3 py-2 border rounded-md"
                                        value={newTask.description}
                                        onChange={e => setNewTask({...newTask, description: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Исполнитель</label>
                                    <select
                                        value={newTask.employee_id}
                                        className="w-full px-3 py-2 border rounded-md"
                                        onChange={e => setNewTask({...newTask, employee_id: e.target.value})}
                                        required
                                    >
                                        <option value="">Выберите исполнителя</option>
                                        {employeeStore.employeeList.map(employee => (
                                            <option key={employee.id} value={employee.id}>
                                                {formatEmployeeName(employee)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                                    onClick={() => setShowModal(false)}
                                >
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Создать
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Таблица */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Описание</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Исполнитель</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTasks.map(task => {
                        const employee = employeeStore.employeeList.find(e => e.id === task.employee_id);
                        return (
                            <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 text-sm text-gray-900">{task.id}</td>
                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">{task.title}</td>
                                <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{task.description}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                    {employee ? formatEmployeeName(employee) : `#${task.employee_id}`}
                                </td>
                                <td className="px-4 py-3">
                                    <select
                                        className={`px-3 py-1 text-sm rounded-full border-transparent focus:ring-2 focus:ring-blue-500`}
                                        value={task.status}
                                        onChange={e => handleStatusChange(task.id, e.target.value)}
                                    >
                                        <option value="pending">Ожидание</option>
                                        <option value="in_progress">В процессе</option>
                                        <option value="completed">Завершено</option>
                                    </select>
                                </td>
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => taskStore.deleteTask(task.id)}
                                        className="text-red-600 hover:text-red-800 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>

            {filteredTasks.length === 0 && (
                <div className="mt-6 text-center py-8 bg-white rounded-lg">
                    <p className="text-gray-500">Задачи не найдены</p>
                </div>
            )}
        </div>
    );
});

export default TaskTable;