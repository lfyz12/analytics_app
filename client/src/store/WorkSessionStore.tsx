import { makeAutoObservable } from "mobx";
import WorkSessionService from "../service/WorkSessionService";
import { AxiosResponse } from "axios";
import {IWorkSession} from "../models/IWorkSession/IWorkSession";



export class WorkSessionStore {
    sessions: IWorkSession[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    setSessions(sessions: IWorkSession[]) {
        this.sessions = sessions;
    }

    async startSession(employee_id: number): Promise<void> {
        try {
            await WorkSessionService.startSession(employee_id);
        } catch (e) {
            console.error("Ошибка при старте сессии:", e);
            throw e;
        }
    }

    async endSession(employee_id: number): Promise<void> {
        try {
            await WorkSessionService.endSession(employee_id);
        } catch (e) {
            console.error("Ошибка при завершении сессии:", e);
            throw e;
        }
    }

    async fetchSessions(): Promise<void> {
        try {
            const response: AxiosResponse<IWorkSession[]> = await WorkSessionService.getSessions();
            this.setSessions(response.data);
        } catch (e) {
            console.error("Ошибка при получении сессий:", e);
            throw e;
        }
    }

    async deleteSession(id: number): Promise<void> {
        try {
            await WorkSessionService.delSessions(id);
            this.setSessions(this.sessions.filter(session => session.id !== id));
        } catch (e) {
            console.error("Ошибка при удалении сессии:", e);
            throw e;
        }
    }
}
