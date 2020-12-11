import { Injectable } from '@angular/core';
import { Listener } from './listener';
import { Observable, of } from 'rxjs';

enum ContentTypes {
  json = 'application/json',
  urlEncoded = 'application/x-www-form-urlencoded'
}

@Injectable({
  providedIn: 'root'
})


export class ListenerService {

  public listener : Listener;
  public foundListener : boolean;
  public tempId : string;
  public profile : any;

  constructor() {
    this.listener = {id : undefined, name: undefined, favoriteBreweries : [], likedSongs : [], ownedBreweries : [], admin : false};
  }

  // returns a listener object from databse based on key (key=name)
  async getListener(key : string) : Promise<Listener> {
    const requestMetadata: RequestInit = {
        method: 'GET',
        headers: {
          'Content-Type': ContentTypes.json
        }
    };
    return fetch("https://tapdbackend.club/listeners", requestMetadata)
        .then((response: Response) => response.json())
        .then((result: any) => {
          for (var i = 0; i < result.length; i++) {
            if (String(result[i].id) === key) {
              this.listener = result[i];
              this.foundListener = true;
              return result[i];
            }
          }
          return null;
        })
        .catch((error: any) => console.log('error', error));
  }

  // creates a listener object in the databse based on listener object
  async createListener() : Promise<boolean> {
    const body = {
      id: this.listener.id,
      name: this.listener.name,
      favoriteBreweries : this.listener.favoriteBreweries,
      ownedBreweries : this.listener.ownedBreweries,
      likedSongs : this.listener.likedSongs,
      admin : this.listener.admin,
  };

  const jsonBody = JSON.stringify(body);

    const requestMetadata: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': ContentTypes.json
        },
        body: jsonBody
    };
    return fetch("https://tapdbackend.club/listeners", requestMetadata)
        .then((response: Response) => response.json())
        .then()
        .catch((error: any) => console.log('error', error));
  }

  //updates a listener object in the database based on param name (key=name)
  async updateListener(param : Listener) : Promise<boolean> {
    
    const body = {
      id: param.id,
      name : param.name,
      favoriteBreweries : param.favoriteBreweries,
      ownedBreweries : param.ownedBreweries,
      likedSongs : param.likedSongs,
      admin : param.admin,
  };

  const jsonBody = JSON.stringify(body);

    const requestMetadata: RequestInit = {
        method: 'PUT',
        headers: {
          'Content-Type': ContentTypes.json
        },
        body: jsonBody
    };
    return fetch("https://tapdbackend.club/listeners", requestMetadata)
        .then((response: Response) => response.json())
        .then()
        .catch((error: any) => console.log('error', error));
  }

  // checks if a listener has liked a specific song
  inSongs(param : string) : boolean {
    var song;
    for (song of this.listener.likedSongs) {
      if (song === param) {
        return true;
      }
    }
    return false;
  }
// checks if a brewery (key=name) is in a listener's favorites
  inFavorites(param : string) : boolean {
    var brew;
    for (brew of this.listener.favoriteBreweries) {
      if (brew === param) {
        return true;
      }
    }
    return false;
  }
// checks if a brewery is owned by a listener (key=brewery name)
  inOwned(param : string) : boolean {
    var brew;
    for (brew of this.listener.ownedBreweries) {
      if (brew === param) {
        return true;
      }
    }
    return false;
  }
// checks if the current listener is an admin
  isAdmin() : boolean{
    return this.listener.admin;
  }

}
