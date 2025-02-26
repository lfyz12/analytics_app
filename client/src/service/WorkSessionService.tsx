import {AxiosResponse} from "axios";
import {$authHost} from "../http";

export default class WorkSessionService {
    static async startSession(employee_id: number): Promise<AxiosResponse> {
        return $authHost.post('/api/workSession/start', {employee_id})
    }

    static async endSession(employee_id: number): Promise<AxiosResponse> {
        return $authHost.post('/api/workSession/end', {employee_id})
    }

    static async getSessions(employee_id: number): Promise<AxiosResponse> {
        return $authHost.get('/api/workSession?employee_id=' + employee_id)
    }

    static async delSessions(id: number): Promise<AxiosResponse> {
        return $authHost.delete('/api/workSession/' + id)
    }
}