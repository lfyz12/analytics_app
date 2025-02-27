import React, {useContext, useEffect, useState} from 'react';
import { observer } from 'mobx-react-lite';
import { format } from 'date-fns';
import {Context} from "../../index";

const ReportsPage = observer(() => {
    const {reportStore, employeeStore} = useContext(Context)
    const [dateFilter, setDateFilter] = useState('');
    const [employeeFilter, setEmployeeFilter] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        reportStore.fetchReports();
        employeeStore.getAll();
    }, []);

    const formatEmployeeName = (employeeId: number) => {
        const employee = employeeStore.employeeList.find(e => e.id === employeeId);
        return employee ? `${employee.first_name} ${employee.last_name?.[0]}.` : `#${employeeId}`;
    };

    const handleCreateReport = async () => {
        if (!selectedEmployee) {
            alert('Выберите сотрудника для создания отчета');
            return;
        }
        setIsLoading(true);
        try {
            await reportStore.createReport(Number(selectedEmployee), new Date());
            await reportStore.fetchReports();
        } finally {
            setIsLoading(false);
            setSelectedEmployee('');
        }
    };

    const filteredReports = reportStore.reports.filter(report =>
        (dateFilter ? format(new Date(report.report_date), 'yyyy-MM-dd') === dateFilter : true) &&
        (employeeFilter ? report.employee_id === Number(employeeFilter) : true)
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen ml-64">
            <div className="mb-6 flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-lg shadow">
                <h1 className="text-2xl font-bold text-gray-800">Отчеты</h1>

                <div className="flex flex-wrap gap-4 items-center flex-1">
                    {/* Кнопка создания отчета */}
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
                            onClick={handleCreateReport}
                            disabled={!selectedEmployee || isLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700
                                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Создание...' : 'Создать отчет'}
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
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Время работы</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Задач выполнено</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredReports.map(report => (
                        <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-sm text-gray-900">{report.id}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                                {formatEmployeeName(report.employee_id)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                                {format(new Date(report.report_date), 'yyyy-MM-dd')}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                        {report.total_work_time} ч
                                    </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                        {report.total_tasks_completed}
                                    </span>
                            </td>
                            <td className="px-4 py-3">
                                <button
                                    onClick={() => reportStore.deleteReport(report.id)}
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

            {filteredReports.length === 0 && (
                <div className="mt-6 text-center py-8 bg-white rounded-lg shadow">
                    <p className="text-gray-500">Отчеты не найдены</p>
                </div>
            )}
        </div>
    );
});

export default ReportsPage;