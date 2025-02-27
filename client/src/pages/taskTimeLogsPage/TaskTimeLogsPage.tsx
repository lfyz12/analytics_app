import React, {useContext, useEffect, useState} from 'react';
import { observer } from 'mobx-react-lite';
import {Context} from "../../index";
import { format } from 'date-fns';

const TaskTimeLogsPage = observer(() => {
    const {taskTimeLogStore, employeeStore, taskStore} = useContext(Context)
    const [dateFilter, setDateFilter] = useState('');
    const [employeeFilter, setEmployeeFilter] = useState('');
    const [taskFilter, setTaskFilter] = useState('');

    useEffect(() => {
        taskTimeLogStore.fetchLogs();
        employeeStore.getAll();
        taskStore.fetchTasks('',  0);
    }, []);

    const filteredLogs = taskTimeLogStore.logs.filter(log =>
        (dateFilter ? format(new Date(log.start_time), 'yyyy-MM-dd') === dateFilter : true) &&
        (employeeFilter ? log.employee_id === Number(employeeFilter) : true) &&
        (taskFilter ? log.task_id === Number(taskFilter) : true)
    );

    const formatEmployeeName = (employeeId: number) => {
        const employee = employeeStore.employeeList.find(e => e.id === employeeId);
        return employee ? `${employee.first_name} ${employee.last_name?.[0]}.` : `#${employeeId}`;
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen ml-64">
            <div className="mb-6 flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-lg shadow">
                <h1 className="text-2xl font-bold text-gray-800">Логи рабочего времени</h1>
                <div className="flex flex-wrap gap-4 flex-1">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Дата</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            onChange={e => setDateFilter(e.target.value)}
                        />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Сотрудник</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            onChange={e => setEmployeeFilter(e.target.value)}
                        >
                            <option value="">Все сотрудники</option>
                            {employeeStore.employeeList.map(employee => (
                                <option key={employee.id} value={employee.id}>
                                    {formatEmployeeName(employee.id)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Задача</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            onChange={e => setTaskFilter(e.target.value)}
                        >
                            <option value="">Все задачи</option>
                            {taskStore.tasks.map(task => (
                                <option key={task.id} value={task.id}>
                                    {task.title}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Сотрудник</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Задача</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Начало</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Конец</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLogs.map(log => (
                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-sm text-gray-900">{log.id}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{formatEmployeeName(log.employee_id)}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">#{log.task_id}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                                {format(new Date(log.start_time), 'yyyy-MM-dd HH:mm')}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                                {log.end_time
                                    ? format(new Date(log.end_time), 'yyyy-MM-dd HH:mm')
                                    : <span className="text-yellow-600">В процессе</span>}
                            </td>
                            <td className="px-4 py-3">
                                <button
                                    onClick={() => taskTimeLogStore.deleteLog(log.id)}
                                    className="text-red-600 hover:text-red-800 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {filteredLogs.length === 0 && (
                <div className="mt-6 text-center py-8 bg-white rounded-lg shadow">
                    <p className="text-gray-500">Записи не найдены</p>
                </div>
            )}
        </div>
    );
});

export default TaskTimeLogsPage;