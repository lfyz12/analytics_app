import {AxiosResponse} from "axios";
import {$authHost} from "../http";

export default class TaskTimeLogService {
    static async startTimeLog(employee_id: number, task_id: number, start_time: Date): Promise<AxiosResponse> {
        return $authHost.post('/api/taskTimeLog', {employee_id, task_id, start_time})
    }

    static async endTimeLog(id: number, end_time: Date): Promise<AxiosResponse> {
        return $authHost.put('/api/taskTimeLog/' + id, {end_time})
    }

    static async getAll(): Promise<AxiosResponse> {
        return $authHost.get('/api/taskTimeLog')
    }

    static async getByEmployee(employee_id: number): Promise<AxiosResponse> {
        return $authHost.get('/api/taskTimeLog/employee/' + employee_id)
    }

    static async getByTask(task_id: number): Promise<AxiosResponse> {
        return $authHost.get('/api/taskTimeLog/task/' + task_id)
    }

    static async delTaskTimeLog(id: number): Promise<AxiosResponse> {
        return $authHost.delete('/api/taskTimeLog/' + id)
    }
}