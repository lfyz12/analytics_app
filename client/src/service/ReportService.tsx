import {AxiosResponse} from "axios";
import {$authHost} from "../http";

export default class ReportService {
    static async createReport(employee_id: number, report_date: Date): Promise<AxiosResponse> {
        return $authHost.post('/api/report', {employee_id, report_date})
    }

    static async getAll(): Promise<AxiosResponse> {
        return $authHost.get('/api/report')
    }

    static async getByEmployee(employee_id: number): Promise<AxiosResponse> {
        return $authHost.get('/api/report/employee/' + employee_id)
    }

    static async getByReportDate(employee_id: number, report_date: Date): Promise<AxiosResponse> {
        return $authHost.get(`/api/report/${employee_id}/${report_date}` )
    }

    static async delReport(id: number): Promise<AxiosResponse> {
        return $authHost.delete(`/api/report/${id}` )
    }
}