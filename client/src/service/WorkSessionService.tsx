import {AxiosResponse} from "axios";
import {$authHost} from "../http";

export default class WorkSessionService {
    static async startSession(employee_id: number): Promise<AxiosResponse> {
        return $authHost.post('/api/workSession/start', {employee_id})
    }

    static async endSession(employee_id: number): Promise<AxiosResponse> {
        return $authHost.post('/api/workSession/end', {employee_id})
    }

    static async getSessions(): Promise<AxiosResponse> {
        return $authHost.get('/api/workSession')
    }

    static async delSessions(id: number): Promise<AxiosResponse> {
        return $authHost.delete('/api/workSession/' + id)
    }
}