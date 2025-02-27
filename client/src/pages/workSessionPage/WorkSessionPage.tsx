import React, {useContext, useEffect, useState} from 'react';
import { observer } from 'mobx-react-lite';
import { format } from 'date-fns';
import {Context} from "../../index";

const WorkSessionsPage = observer(() => {
    const {workSessionStore, employeeStore} = useContext(Context)
    const [dateFilter, setDateFilter] = useState('');
    const [employeeFilter, setEmployeeFilter] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        workSessionStore.fetchSessions();
        employeeStore.getAll();
    }, []);

    const filteredSessions = workSessionStore.sessions.filter(session =>
        (dateFilter ? format(new Date(session.start_time), 'yyyy-MM-dd') === dateFilter : true) &&
        (employeeFilter ? session.employee_id === Number(employeeFilter) : true)
    );

    const formatEmployeeName = (employeeId: number) => {
        const employee = employeeStore.employeeList.find(e => e.id === employeeId);
        return employee ? `${employee.first_name} ${employee.last_name?.[0]}.` : `#${employeeId}`;
    };

    const handleStartSession = async () => {
        if (!selectedEmployee) return;
        setIsLoading(true);
        try {
            await workSessionStore.startSession(Number(selectedEmployee));
            await workSessionStore.fetchSessions();
        } finally {
            setIsLoading(false);
            setSelectedEmployee('');
        }
    };

    const handleEndSession = async (employeeId: number) => {
        setIsLoading(true);
        try {
            await workSessionStore.endSession(employeeId);
            await workSessionStore.fetchSessions();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen ml-64">
            <div className="mb-6 flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-lg shadow">
                <h1 className="text-2xl font-bold text-gray-800">Рабочие сессии</h1>

                <div className="flex flex-wrap gap-4 items-center flex-1">
                    {/* Кнопка начала сессии */}
                    <div className="flex gap-4 items-center">
                        <select
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            value={selectedEmployee}
                            onChange={e => setSelectedEmployee(e.target.value)}
                        >
                            <option value="">Выберите сотрудника</option>
                            {employeeStore.employeeList.map(employee => (
                                <option key={employee.id} value={employee.id}>
                                    {formatEmployeeName(employee.id)}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleStartSession}
                            disabled={!selectedEmployee || isLoading}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700
                                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Запуск...' : 'Начать сессию'}
                        </button>
                    </div>

                    {/* Фильтры */}
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
                    </div>
                </div>
            </div>

            {/* Таблица */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Сотрудник</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Начало</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Конец</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSessions.map(session => (
                        <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-sm text-gray-900">{session.id}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                                {formatEmployeeName(session.employee_id)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                                {format(new Date(session.start_time), 'yyyy-MM-dd HH:mm')}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                                {session.end_time
                                    ? format(new Date(session.end_time), 'yyyy-MM-dd HH:mm')
                                    : <span className="text-yellow-600">В процессе</span>}
                            </td>
                            <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-sm ${
                                        session.end_time
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {session.end_time ? 'Завершена' : 'Активна'}
                                    </span>
                            </td>
                            <td className="px-4 py-3">
                                {!session.end_time && (
                                    <button
                                        onClick={() => handleEndSession(session.employee_id)}
                                        disabled={isLoading}
                                        className="text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {filteredSessions.length === 0 && (
                <div className="mt-6 text-center py-8 bg-white rounded-lg shadow">
                    <p className="text-gray-500">Сессии не найдены</p>
                </div>
            )}
        </div>
    );
});

export default WorkSessionsPage;