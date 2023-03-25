import { Timestamp } from "rxjs";
import { Aircraft } from "./Aircraft";
import { Airport } from "./Airport";

export class Log {
    userEmail? : string;
    logBookId? : number;
    userId? : string;
    aircraftModelId? : number;
    aircraftModel? : Aircraft;
    airportDepartureId? : number;
    airportDeparture? : Airport;
    airportArrivalId? : number;
    airportArrival? : Airport;

    logBookDate? : Date;
    logBookAircraftRegistration? : string;
    logBookDepartureTime? : any;
    logBookArrivalTime? : any;
    logBookTotalFlightTime?: number;
    logBookIFR? : boolean;
    logBookNight? :boolean;
    logBookPIC? : boolean;
    logBookCoPilot? : boolean;
    logBookDual? :boolean;
    logBookLanding? :number;
    logBookDescription? : string;
}