import React, {FC, useContext, useState} from 'react';
import {NavLink, useNavigate} from "react-router-dom";
import {DASHBOARDROUTER, LOGINROUTER, REGISTROUTER} from "../../utils/consts";
import {Context} from "../../index";

interface AuthFormProps {
    isLogin: boolean
}

const AuthForm: FC<AuthFormProps> = ({isLogin}: AuthFormProps) => {
    const {employeeStore} = useContext(Context)
    const navigation = useNavigate()


    const [email, setEmail] = useState<string>()
    const [password, setPassword] = useState<string>()
    const [firstName, setFirstName] = useState<string>()
    const [lastName, setLastName] = useState<string>()
    const [position, setPosition] = useState<string>()
    const [department, setDepartment] = useState<string>()

    const login = async () => {
        if (email && password) await employeeStore.login(email, password)
    }

    const register = async () => {
        if (firstName && lastName && email && password && position && department) {
            await employeeStore.register(firstName, lastName, email, position, department, password)
        }
    }

    const click = async () => {
        if (isLogin) {
            await login()
        } else {
            await register()
        }
        navigation('/dashboard')
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <form className="w-full max-w-md bg-gray-800 rounded-2xl p-8 shadow-xl space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-500">
                        {isLogin ? 'Добро пожаловать!' : 'Создайте аккаунт'}
                    </h1>
                    <p className="mt-2 text-gray-400">
                        {isLogin ? 'Войдите в свой аккаунт' : 'Начните работу с платформой'}
                    </p>
                </div>

                <div className="space-y-6">
                    {!isLogin && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Имя
                                </label>
                                <input
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                                    placeholder="Введите имя"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Фамилия
                                </label>
                                <input
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                                    placeholder="Введите фамилию"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 pl-11 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                                placeholder="example@mail.com"
                            />
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Пароль
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 pl-11 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                                placeholder="••••••••"
                            />
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                            </svg>
                        </div>
                    </div>

                    {!isLogin && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Должность
                                </label>
                                <input
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                                    placeholder="Ваша должность"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Отдел
                                </label>
                                <input
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                                    placeholder="Ваш отдел"
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={click}
                        className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-medium rounded-lg transition-all duration-300"
                    >
                        {isLogin ? 'Войти' : 'Зарегистрироваться'}
                    </button>
                </div>

                <p className="text-center text-gray-400">
                    {isLogin ? 'Ещё нет аккаунта? ' : 'Уже есть аккаунт? '}
                    <NavLink
                        to={isLogin ? REGISTROUTER : LOGINROUTER}
                        className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        {isLogin ? 'Зарегистрироваться' : 'Войти'}
                    </NavLink>
                </p>
            </form>
        </div>
    );
};

export default AuthForm;