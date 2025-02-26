export interface ITask {
    id: number
    employee_id: number
    title: string
    description: string
    status: TaskStatusEnum
}

export const enum TaskStatusEnum {
    'Новая',
    'В работе',
    'Выполнена'
}