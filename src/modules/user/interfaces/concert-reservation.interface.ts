import { Concert } from "src/modules/concert/interfaces";

export interface ConcertReservation extends Concert {
    is_reserved: boolean;
    reserved_seats: number;
    reserved_at: Date | null;
}
