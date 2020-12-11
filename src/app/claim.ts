import { Brewery } from "./brewery";


//claim object
export interface Claim {
    breweryName : string;
    requesterName: string;
    requesterSpotName: string;
    request : string;
}