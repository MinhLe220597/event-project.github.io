export class ScheduleEntity {
    Id?: string;
    Subject?: string;
    StartTime?: Date;
    EndTime?: Date;
    Location?: string;
    Description?: string;
}

export class ScheduleModel {
    id?: string;
    subject?: string;
    startTime?: Date;
    endTime?: Date;
    location?: string;
    description?: string;
}
