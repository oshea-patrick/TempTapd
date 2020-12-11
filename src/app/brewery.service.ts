import { Injectable } from '@angular/core';
import { Brewery } from './brewery';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

enum ContentTypes {
  json = 'application/json',
  urlEncoded = 'application/x-www-form-urlencoded'
}

@Injectable({
  providedIn: 'root'
})


export class BreweryService {

  breweries : Brewery[];
  currentBrewery : Brewery;

  constructor(private http: HttpClient) {
    this.breweries = [];
  }


  // string occurenece replacemnet method
  replaceAll(param : string, sp : string): string{
    return param.split(sp).join("");
  }

  // gets a brewery object from a list of breweries by searching using a key (key=name)
  getBrewery(all: Brewery[], key:string) : Brewery{
    var brew : Brewery;

    var fixKey = this.replaceAll(this.replaceAll(key, String.fromCharCode(32)), String.fromCharCode(160));
    var fixName;

    for (brew of all) {
      fixName = this.replaceAll(this.replaceAll(brew.name, String.fromCharCode(32)), String.fromCharCode(160));
      if (fixKey === fixName) {
        return brew;
      }
      }
      return null;
  }

  // used for debugging to see most information about a brewery object
  toString(p : Brewery) : string {
    var out = "";
    if (p != null){
    out += "Name: " + p.name + "\nLocation: " + p.location + "\nPlaylist: " + p.playlist + "\nURL: " + p.url + "\nFacebook: " + p.facebook + "\nInstagram: " + p.instagram
    + "\nWebsite: " + p.website;
    }
    return out;
  }

  // queries the database for a list of all brewery objects
  async getAllBreweries(): Promise<Brewery[]> {
    this.breweries = [];

    const requestMetadata: RequestInit = {
        method: 'GET',
        headers: {
          'Content-Type': ContentTypes.json
        }
    };
    return fetch("https://tapdbackend.club/breweries", requestMetadata)
        .then((response: Response) => response.json())
        .then((result: any) => {
          for (var i = 0; i < result.length; i++) {
          this.breweries.push({beer: String(result[i]["beer"]),name : String(result[i]["name"]), location : String(result[i]["location"]), url : String(result[i]["url"]), playlist : String(result[i]["playlist"]), facebook : String(result[i]["facebook"]), instagram : String(result[i]["instagram"]), website : String(result[i]["website"]), approved: Boolean(result[i]["approved"])});
          }
          return result;
        })
        .catch((error: any) => console.log('error', error));
} 

// deletes a brewery from the database (key=name of brewery object passed)
async deleteBrewery(brewery : Brewery) {
  const body = {
    name:brewery.name,
    location:brewery.location,
    url:brewery.url,
    playlist:brewery.playlist,
    facebook:brewery.facebook,
    instagram:brewery.instagram,
    website:brewery.website,
    approved:brewery.approved,
};

const jsonBody = JSON.stringify(body);

  const requestMetadata: RequestInit = {
      method: 'DELETE',
      headers: {
        'Content-Type': ContentTypes.json
      },
      body: jsonBody
  };
   fetch("https://tapdbackend.club/breweries", requestMetadata)
      .then((response: Response) => response.json())
      .then()
      .catch((error: any) => console.log('error', error));
}

// only retruns breweries that have been approved by an admin
async getAllApprovedBreweries(): Promise<Brewery[]> {
  var all = await this.getAllBreweries();
  return all.filter(brewery => brewery.approved == true);
}

// creates a brewery in the databse based on a a brewery object
  async postBrewery(brewery : Brewery): Promise<Brewery[]> {
    const body = {
      name:brewery.name,
      location:brewery.location,
      url:brewery.url,
      playlist:brewery.playlist,
      facebook:brewery.facebook,
      instagram:brewery.instagram,
      website:brewery.website,
      approved:brewery.approved,
      beer: brewery.beer
  };

  const jsonBody = JSON.stringify(body);

    const requestMetadata: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': ContentTypes.json
        },
        body: jsonBody
    };
    return fetch("https://tapdbackend.club/breweries", requestMetadata)
        .then((response: Response) => response.json())
        .then()
        .catch((error: any) => console.log('error', error));
}

// updates a brewery in the database (key=name of brewery passed)
async updateBrewery(brewery : Brewery): Promise<Brewery[]> {
  const body = {
    name:brewery.name,
    location:brewery.location,
    url:brewery.url,
    playlist:brewery.playlist,
    facebook:brewery.facebook,
    instagram:brewery.instagram,
    website:brewery.website,
    approved:brewery.approved,
    beer: brewery.beer
};

const jsonBody = JSON.stringify(body);

  const requestMetadata: RequestInit = {
      method: 'PUT',
      headers: {
        'Content-Type': ContentTypes.json
      },
      body: jsonBody
  };
  return fetch("https://tapdbackend.club/breweries", requestMetadata)
      .then((response: Response) => response.json())
      .then()
      .catch((error: any) => console.log('error', error));
}

}
