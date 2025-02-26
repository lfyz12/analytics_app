import { makeAutoObservable } from "mobx";
import TaskTimeLogService from "../service/TaskTimeLogService";
import { AxiosResponse } from "axios";
import {ITaskTimeLog} from "../models/ITaskTimeLog/ITaskTimeLog";



export class TaskTimeLogStore {
    logs: ITaskTimeLog[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    setLogs(logs: ITaskTimeLog[]) {
        this.logs = logs;
    }

    async startTimeLog(employee_id: number, task_id: number, start_time: Date): Promise<void> {
        try {
            await TaskTimeLogService.startTimeLog(employee_id, task_id, start_time);
        } catch (e) {
            console.error("Ошибка при старте логирования задачи:", e);
            throw e;
        }
    }

    async endTimeLog(id: number, end_time: Date): Promise<void> {
        try {
            await TaskTimeLogService.endTimeLog(id, end_time);
        } catch (e) {
            console.error("Ошибка при завершении логирования задачи:", e);
            throw e;
        }
    }

    async fetchLogs(): Promise<void> {
        try {
            const response: AxiosResponse<ITaskTimeLog[]> = await TaskTimeLogService.getAll();
            this.setLogs(response.data);
        } catch (e) {
            console.error("Ошибка при получении логов:", e);
            throw e;
        }
    }

    async fetchLogsByEmployee(employee_id: number): Promise<void> {
        try {
            const response: AxiosResponse<ITaskTimeLog[]> = await TaskTimeLogService.getByEmployee(employee_id);
            this.setLogs(response.data);
        } catch (e) {
            console.error("Ошибка при получении логов:", e);
            throw e;
        }
    }

    async fetchLogsByTask(task_id: number): Promise<void> {
        try {
            const response: AxiosResponse<ITaskTimeLog[]> = await TaskTimeLogService.getByTask(task_id);
            this.setLogs(response.data);
        } catch (e) {
            console.error("Ошибка при получении логов:", e);
            throw e;
        }
    }

    async deleteLog(id: number): Promise<void> {
        try {
            await TaskTimeLogService.delTaskTimeLog(id);
            this.setLogs(this.logs.filter(log => log.id !== id));
        } catch (e) {
            console.error("Ошибка при удалении лога:", e);
            throw e;
        }
    }
}
