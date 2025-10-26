import { Concert } from "src/modules/admin/interfaces";

export interface ConcertReservation extends Concert {
    is_reserved: boolean;
    reserved_seats: number;
    reserved_at: Date | null;
}
