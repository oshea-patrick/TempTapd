import { Injectable } from '@angular/core';
import { Claim } from './claim';

enum ContentTypes {
  json = 'application/json',
  urlEncoded = 'application/x-www-form-urlencoded'
}

@Injectable({
  providedIn: 'root'
})
export class ClaimService {

  constructor() { }

  // returns a list of claim objects from the databse
  async getClaims() : Promise<Claim[]> {
    const requestMetadata: RequestInit = {
        method: 'GET',
        headers: {
          'Content-Type': ContentTypes.json
        }
    };
    return fetch("https://tapdbackend.club/claims", requestMetadata)
        .then((response: Response) => response.json())
        .then((result: any) => {
          return result;
        })
        .catch((error: any) => console.log('error', error));
  }

  // creates a claim object in the database based on passed claim object
  async createClaim(param : Claim) : Promise<boolean> {
    const body = {
      breweryName : param.breweryName,
      requesterName : param.requesterName,
      request : param.request,
      requesterSpotName: param.requesterSpotName,
  };

  const jsonBody = JSON.stringify(body);

    const requestMetadata: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': ContentTypes.json
        },
        body: jsonBody
    };
    return fetch("https://tapdbackend.club/claims", requestMetadata)
        .then((response: Response) => response.json())
        .then()
        .catch((error: any) => console.log('error', error));
  }

  // deletes a claim object from the databse based on name of claim object passed
  async deleteClaim(param : Claim) : Promise<boolean> {
    const body = {
      breweryName : param.breweryName,
      requesterName : param.requesterName,
  };

  const jsonBody = JSON.stringify(body);

    const requestMetadata: RequestInit = {
        method: 'DELETE',
        headers: {
          'Content-Type': ContentTypes.json
        },
        body: jsonBody
    };
    return fetch("https://tapdbackend.club/claims", requestMetadata)
        .then((response: Response) => response.json())
        .then()
        .catch((error: any) => console.log('error', error));
  }

  // checks if somebody has already submitted a claim of the same user and brewery name
  async inClaims(name : string, breweryName : string) : Promise<boolean>{
    var claims = await this.getClaims();
    var claim;
    if (claims && claims.length) {
    for (claim of claims){
      if (claim.breweryName === breweryName && name === claim.requesterName) {
        return true;
      }
    }
  }
    return false;
  }

}
