export declare class AttendanceRecordDto {
    studentId: string;
    isPresent?: boolean;
    present?: boolean;
}
export declare class CreateAttendanceDto {
    classId: string;
    date: string;
    records: AttendanceRecordDto[];
    presentStudents: string[];
}
