import { OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
export declare class AppService implements OnModuleInit {
    private dataSource;
    constructor(dataSource: DataSource);
    onModuleInit(): Promise<void>;
    getHello(): string;
}
