import { makeAutoObservable } from "mobx";
import ReportService from "../service/ReportService";
import { AxiosResponse } from "axios";
import {IReport} from "../models/IReport/IReport";


export class ReportStore {
    reports: IReport[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    setReports(reports: IReport[]) {
        this.reports = reports;
    }

    async createReport(employee_id: number, report_date: Date): Promise<void> {
        try {
            await ReportService.createReport(employee_id, report_date);
        } catch (e) {
            console.error("Ошибка при создании отчета:", e);
            throw e;
        }
    }

    async fetchReports(): Promise<void> {
        try {
            const response: AxiosResponse<IReport[]> = await ReportService.getAll();
            this.setReports(response.data);
        } catch (e) {
            console.error("Ошибка при получении отчетов:", e);
            throw e;
        }
    }

    async fetchReportsByEmployee(employee_id: number): Promise<void> {
        try {
            const response: AxiosResponse<IReport[]> = await ReportService.getByEmployee(employee_id);
            this.setReports(response.data);
        } catch (e) {
            console.error("Ошибка при получении отчетов сотрудника:", e);
            throw e;
        }
    }

    async fetchReportsByReportDate(employee_id: number, report_date: Date): Promise<void> {
        try {
            const response: AxiosResponse<IReport[]> = await ReportService.getByReportDate(employee_id, report_date);
            this.setReports(response.data);
        } catch (e) {
            console.error("Ошибка при получении отчетов сотрудника:", e);
            throw e;
        }
    }

    async deleteReport(id: number): Promise<void> {
        try {
            await ReportService.delReport(id);
            this.setReports(this.reports.filter(report => report.id !== id));
        } catch (e) {
            console.error("Ошибка при удалении отчета:", e);
            throw e;
        }
    }
}
