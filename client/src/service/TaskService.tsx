import {TaskStatusEnum} from "../models/ITask/ITask";
import {AxiosResponse} from "axios";
import {$authHost} from "../http";

export default class TaskService {
    static async createTask(employee_id: number, title: string, description: string, status: TaskStatusEnum): Promise<AxiosResponse> {
        return $authHost.post('/api/task', {employee_id, title, description, status})
    }

    static async getTask(employee_id: number, status?: TaskStatusEnum): Promise<AxiosResponse> {
        return $authHost.get(`/api/task?employee_id=${employee_id}&status=${status}`)
    }

    static async getTasks(id: number): Promise<AxiosResponse> {
        return $authHost.get('/api/task/' + id)
    }

    static async updateTask(id:number, employee_id: number, title: string, description: string, status: TaskStatusEnum): Promise<AxiosResponse> {
        return $authHost.put('/api/task/' + id, {employee_id, title, description, status})
    }

    static async delTask(id: number): Promise<AxiosResponse> {
        return $authHost.delete('/api/task/' + id)
    }
}