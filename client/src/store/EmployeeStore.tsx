import {makeAutoObservable} from "mobx";
import {IEmployee} from "../models/IEmployee/IEmployee";
import EmployeeService from "../service/EmployeeService";

export class EmployeeStore {
    is_auth: boolean = false
    employee = {} as IEmployee
    employeeList = [] as IEmployee[]
    constructor() {
        makeAutoObservable(this)
    }

    setIsAuth(bool: boolean) {
        this.is_auth = bool
    }

    setEmployee(employee: IEmployee) {
        this.employee = employee
    }

    setEmployeeList(list: IEmployee[]) {
        this.employeeList = list
    }

    async register(first_name: string, last_name: string, email: string, position: string, department: string, password: string) {
        try {
            const response = await EmployeeService.registration(first_name, last_name, email, position, department, password)
            localStorage.setItem('token', response.data.token.accessToken)
            this.setEmployee(response.data.employee)
            this.setIsAuth(true)
        } catch (e) {
            console.error("Ошибка входа:", e);
            throw e;
        }
    }

    async login(email: string, password: string) {
        try {
            const response = await EmployeeService.login(email, password)
            localStorage.setItem('token', response.data.token.accessToken)
            this.setEmployee(response.data.employee)
            this.setIsAuth(true)
        } catch (e) {
            console.error("Ошибка входа:", e);
            throw e;
        }
    }

    async logout() {
        try {
            const response = await EmployeeService.logout()
            localStorage.removeItem('token')
            this.setEmployee({} as IEmployee)
            this.setIsAuth(false)
        } catch (e) {
            console.error("Ошибка входа:", e);
            throw e;
        }
    }


    async checkAuth() {
        try {
            const response = await EmployeeService.checkAuth()
            localStorage.setItem('token', response.data.token.accessToken);
            this.setIsAuth(true)
            this.setEmployee(response.data.user)
        } catch (e) {
            console.error("Ошибка входа:", e);
            throw e;
        }
    }

    async getById(id: number) {
        try {
            const response = await EmployeeService.getById(id)
            this.setEmployee(response.data)
        } catch (e) {
            console.error("Ошибка входа:", e);
            throw e;
        }
    }

    async getAll() {
        try {
            const response = await EmployeeService.getAll()
            this.setEmployeeList(response.data)
        } catch (e) {
            console.error("Ошибка входа:", e);
            throw e;
        }
    }
}