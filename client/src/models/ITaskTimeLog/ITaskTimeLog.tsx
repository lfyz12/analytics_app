export interface ITaskTimeLog {
    id: number
    employee_id: number
    task_id: number
    start_time: Date
    end_time?: Date
}