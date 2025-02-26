import {AxiosResponse} from "axios";
import {$authHost, $host} from "../http";

export default class EmployeeService {
    static async registration(first_name: string, last_name: string, email: string, position: string, department: string, password: string):Promise<AxiosResponse> {
        return $host.post('/api/employee/registration', {first_name, last_name, email, position, department, password})
    }

    static async login(email: string, password: string):Promise<AxiosResponse> {
        return $host.post('/api/employee/login', {email, password})
    }

    static async logout():Promise<AxiosResponse> {
        return $authHost.post('/api/employee/logout', {})
    }

    static async checkAuth(): Promise<AxiosResponse> {
        return $host.get('/api/employee/refresh', { withCredentials: true })
    }

    static async getById(id: number): Promise<AxiosResponse> {
        return $authHost.post('/api/employee/getUserByUserID', {id})
    }

    static async getAll(): Promise<AxiosResponse> {
        return $authHost.post('/api/employee/getAll')
    }
}