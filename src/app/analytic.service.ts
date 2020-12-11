import { Injectable } from '@angular/core';
import { Analytic } from './analytic';

enum ContentTypes {
  json = 'application/json',
  urlEncoded = 'application/x-www-form-urlencoded'
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticService {

  constructor() { }

  // returns a list of all analytics (analytic objects) from the databse
  async getAnalytics() : Promise<Analytic[]> {
    const requestMetadata: RequestInit = {
        method: 'GET',
        headers: {
          'Content-Type': ContentTypes.json
        }
    };
    return fetch("https://tapdbackend.club/analytics", requestMetadata)
        .then((response: Response) => response.json())
        .then((result: any) => {
          return result;
        })
        .catch((error: any) => console.log('error', error));
  }

  // calls getAnalytics then searches through results for an Analytic object and returns it if found (key=name) otherwse rseturns null
  async getAnalytic(param : string) : Promise<Analytic>{
    var all = await this.getAnalytics();
    var a;
    for (a of all){
      if (a.name === param) {
        return a;
      }
    }
    return null;
  }

  // given an analytic object, creates it in the database
  async createAnalytic(param : Analytic) : Promise<boolean> {
    const body = {
      name: param.name,
     sessions : param.sessions,
     redirects: param.redirects,
     likedSongs: param.likedSongs,
     skippedSongs: param.skippedSongs,
     likes : param.likes,
  };

  const jsonBody = JSON.stringify(body);

    const requestMetadata: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': ContentTypes.json
        },
        body: jsonBody
    };
    return fetch("https://tapdbackend.club/analytics", requestMetadata)
        .then((response: Response) => response.json())
        .then()
        .catch((error: any) => console.log('error', error));
  }

  // given an analytic object, updates it based on a key in the database (key=name)
  async updateAnalytic(param : Analytic) : Promise<boolean> {
    const body = {
      name: param.name,
     sessions : param.sessions,
     redirects: param.redirects,
     likedSongs: param.likedSongs,
     skippedSongs: param.skippedSongs,
     likes : param.likes,
  };

  const jsonBody = JSON.stringify(body);

    const requestMetadata: RequestInit = {
        method: 'PUT',
        headers: {
          'Content-Type': ContentTypes.json
        },
        body: jsonBody
    };
    return fetch("https://tapdbackend.club/analytics", requestMetadata)
        .then((response: Response) => response.json())
        .then()
        .catch((error: any) => console.log('error', error));
  }

  // updates the number of redirects in an analytic given an analytic and a name
  async incrementRedirect(a : Analytic, s : string) {
    if (!(s in a.redirects)){
      a.redirects[s] = 1;
    }
    else {
      var temp = a.redirects;
      temp[s] +=1;
      a.redirects = temp;
    }
    await this.updateAnalytic(a);
  }

}
