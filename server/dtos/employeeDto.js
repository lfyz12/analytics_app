module.exports = class EmployeeDto {
    id;
    email;
    first_name;
    last_name;
    position;
    department;
    hired_at;
    is_active;
    role;
    constructor(model) {
        this.id = model.id
        this.first_name = model.first_name
        this.last_name = model.last_name
        this.email = model.email
        this.position = model.position
        this.department = model.department
        this.hired_at = model.hired_at
        this.is_active = model.is_active
        this.role = model.role
    }
}