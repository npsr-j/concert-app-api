import { ApiProperty } from '@nestjs/swagger';

export class CreateConcertDto {
    @ApiProperty({
        description: 'Name of the concert',
        example: 'Summer Music Festival 2025',
    })
    name: string;

    @ApiProperty({
        description: 'Description of the concert',
        example: 'An amazing outdoor music festival featuring top artists',
    })
    description: string;

    @ApiProperty({
        description: 'Total number of seats available',
        example: 5000,
    })
    totalSeat: number;
}
