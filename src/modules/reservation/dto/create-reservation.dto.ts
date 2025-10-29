import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
    @ApiProperty({
        description: 'ID of the user making the reservation',
        example: 1,
    })
    userId: number;

    @ApiProperty({
        description: 'ID of the concert to reserve',
        example: 1,
    })
    concertId: number;
}
