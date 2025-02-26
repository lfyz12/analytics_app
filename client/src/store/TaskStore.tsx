import { makeAutoObservable } from "mobx";
import TaskService from "../service/TaskService";
import {ITask, TaskStatusEnum} from "../models/ITask/ITask";
import { AxiosResponse } from "axios";


export class TaskStore {
    tasks: ITask[] = []
    task = {} as ITask
    constructor() {
        makeAutoObservable(this);
    }

    setTasks(tasks: ITask[]) {
        this.tasks = tasks;
    }

    setTask(task: ITask) {
        this.task = task
    }

    async createTask(employee_id: number, title: string, description: string, status: TaskStatusEnum): Promise<void> {
        try {
            await TaskService.createTask(employee_id, title, description, status);
        } catch (e) {
            console.error("Ошибка при создании задачи:", e);
            throw e;
        }
    }

    async getTaskById(employee_id: number, status?: TaskStatusEnum) {
        try {
            const response = await TaskService.getTask(employee_id, status)
            this.setTask(response.data)
        } catch (e) {
            console.error("Ошибка при получении задач:", e);
            throw e;
        }
    }

    async fetchTasks(id: number): Promise<void> {
        try {
            const response: AxiosResponse<ITask[]> = await TaskService.getTasks(id);
            this.setTasks(response.data);
        } catch (e) {
            console.error("Ошибка при получении задач:", e);
            throw e;
        }
    }

    async updateTask(id: number, employee_id: number, title: string, description: string, status: TaskStatusEnum): Promise<void> {
        try {
            await TaskService.updateTask(id, employee_id, title, description, status);
        } catch (e) {
            console.error("Ошибка при обновлении задачи:", e);
            throw e;
        }
    }

    async deleteTask(id: number): Promise<void> {
        try {
            await TaskService.delTask(id);
            this.setTasks(this.tasks.filter(task => task.id !== id));
        } catch (e) {
            console.error("Ошибка при удалении задачи:", e);
            throw e;
        }
    }
}
