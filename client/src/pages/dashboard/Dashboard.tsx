import React, { useEffect, useState } from "react";
import { Bar, Line, Pie, BarChart, LineChart, PieChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "../../index";

const Dashboard: React.FC = observer(() => {
    const { workSessionStore, taskStore, taskTimeLogStore } = useContext(Context);

    const [data, setData] = useState({
        totalWorkTime: 0,
        activeSessions: 0,
        completedTasks: 0,
        avgTaskTime: 0,
        employeeStatus: [] as any,
        workTimeBySession: [] as any,
    });

    useEffect(() => {
        workSessionStore.fetchSessions();
        taskStore.fetchTasks("completed");
        taskTimeLogStore.fetchLogs();
    }, []);

    useEffect(() => {
        const totalWorkTime = workSessionStore.sessions.reduce((acc, session) => acc + (new Date(session.end_time!).getTime() - new Date(session.start_time).getTime()), 0) / 3600000;
        const activeSessions = workSessionStore.sessions.filter(session => !session.end_time).length;
        const completedTasks = taskStore.tasks.length;
        const validLogs = taskTimeLogStore.logs.filter(log => log.end_time && log.start_time && new Date(log.end_time).getTime() > new Date(log.start_time).getTime());
        const avgTaskTime = validLogs.length > 0 ? (validLogs.reduce((acc, log) => acc + (new Date(log.end_time!).getTime() - new Date(log.start_time).getTime()), 0) / validLogs.length) / 60000 : 0;

        const workTimeBySession = workSessionStore.sessions.map((session, index) => ({
            name: `Сессия ${index + 1}`,
            time: (new Date(session.end_time!).getTime() - new Date(session.start_time).getTime()) / 3600000,
        }));

        setData({
            totalWorkTime: +totalWorkTime.toFixed(2),
            activeSessions,
            completedTasks,
            avgTaskTime: +avgTaskTime.toFixed(2),
            employeeStatus: [
                { name: "Работает", value: activeSessions },
                { name: "Не работает", value: workSessionStore.sessions.length - activeSessions },
            ],
            workTimeBySession,
        });
    }, [workSessionStore.sessions, taskStore.tasks, taskTimeLogStore.logs]);

    return (
        <div className="p-6 bg-gray-50 min-h-screen ml-64">
            <div className="mb-6 bg-white p-6 rounded-xl shadow">
                <h1 className="text-2xl font-bold text-gray-800">Аналитическая панель</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { title: "Общее рабочее время", value: `${data.totalWorkTime} часов`, color: "bg-blue-100 text-blue-800" },
                    { title: "Активные сессии", value: data.activeSessions, color: "bg-green-100 text-green-800" },
                    { title: "Выполненные задачи", value: data.completedTasks, color: "bg-purple-100 text-purple-800" },
                    { title: "Среднее время задачи", value: `${data.avgTaskTime} мин`, color: "bg-orange-100 text-orange-800" },
                ].map((metric, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                        <div className={`${metric.color} p-3 rounded-lg inline-block mb-2`}>
                            <h2 className="text-sm font-semibold">{metric.title}</h2>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">График рабочего времени</h2>
                    <div className="w-full overflow-x-auto">
                        <LineChart width={600} height={300} data={data.workTimeBySession} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="time"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                            />
                        </LineChart>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Статус сотрудников</h2>
                    <div className="flex justify-center">
                        <PieChart width={400} height={300}>
                            <Pie
                                data={data.employeeStatus}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#10b981"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                        </PieChart>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow lg:col-span-2">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Продуктивность задач</h2>
                    <div className="w-full overflow-x-auto">
                        <BarChart
                            width={800}
                            height={300}
                            data={[{ name: "Выполненные задачи", value: data.completedTasks }]}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Legend />
                            <Bar
                                dataKey="value"
                                fill="#8b5cf6"
                                radius={[4, 4, 0, 0]}
                                barSize={60}
                            />
                        </BarChart>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Dashboard;