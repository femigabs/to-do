
export class CreateTaskDto {
    description: string;
    dueDate: Date;
};

export class UpdateTaskDto {
    description: string;
    dueDate: Date;
    status: string;
};
