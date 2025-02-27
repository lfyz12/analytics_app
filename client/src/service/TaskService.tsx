import {AxiosResponse} from "axios";
import {$authHost} from "../http";

export default class TaskService {
    static async createTask(employee_id: number, title: string, description: string, status: string): Promise<AxiosResponse> {
        return $authHost.post('/api/task', {employee_id, title, description, status})
    }

    static async getTask(employee_id: number, status?: string): Promise<AxiosResponse> {
        return $authHost.get(`/api/task?employee_id=${employee_id}&status=${status}`)
    }

    static async getTasks(status?: string, employeeId?: number): Promise<AxiosResponse> {
        return $authHost.get(`/api/task?status=${status}&employee_id=${employeeId}`)
    }

    static async updateTask(id:number, employee_id: number, title: string, description: string, status: string): Promise<AxiosResponse> {
        return $authHost.put('/api/task/' + id, {employee_id, title, description, status})
    }

    static async delTask(id: number): Promise<AxiosResponse> {
        return $authHost.delete('/api/task/' + id)
    }
}