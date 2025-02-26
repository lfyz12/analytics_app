export interface IEmployee {
    id: number
    first_name: string
    last_name: string
    email: string
    role: ERole
    position: string
    department: string
    hired_at: Date
    is_active: boolean
}

export const enum ERole {'ADMIN', 'EMPLOYEE'}