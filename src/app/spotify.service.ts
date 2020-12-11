import { Injectable } from '@angular/core';
import { ListenerService } from './listener.service';

enum ContentTypes {
  json = 'application/json',
  urlEncoded = 'application/x-www-form-urlencoded'
}

enum SpotifyEndpoints {
  accessToken = 'https://accounts.spotify.com/api/token',
  singlePlaylist = 'https://api.spotify.com/v1/playlists',
  play = 'https://api.spotify.com/v1/me/player/play',
  pause = 'https://api.spotify.com/v1/me/player/pause',
  devices = 'https://api.spotify.com/v1/me/player/devices',
  profile = 'https://api.spotify.com/v1/me',
  player = 'https://api.spotify.com/v1/me/player/'
}

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

    public token : string;
    public device: string;
    public devices: any[];
    public playlist: any = { items: [] };
    public currentSongItem : any;
    public playing = false;
    public profile: string;
    public id : string;
    public playbackPosition : number;
    public songEnd : number;
    public inStream :boolean= true;

  constructor(private listenerService : ListenerService) { }

  // updates currentSongItem of service
  setCurrentSongItem(a : any) : void {
    this.currentSongItem = a;
  }
 
  // updates current device of service
  setDevice(a : any) : void {
    this.device = a;
  }

  // seeks to specific time stamp for spotify song
  async seek(num : number) {
    const body = {
    };

    const jsonBody = JSON.stringify(body);
    const requestMetadata: RequestInit = {
        method: 'PUT',
        headers: {
            Authorization: 'Bearer ' + this.token,
            'Content-Type': ContentTypes.json
        },
        body: jsonBody
    };
    const token = fetch(
        'https://api.spotify.com/v1/me/player/seek' + '?position_ms=' + num,
        requestMetadata
    )
        .then((response: Response) => response.json())
        .then((result: any) => {
            return result;
        })
        .catch((error: any) => console.log('error', error));

    return token;
  }

  // plays a list of songs to spotify service where list of songs is of spotify uris
  async playSong(tracks: string[], position : number) {
    if (!this.device) {
        let device = await this.getDevices();
        this.device = device;
    }
    if (!this.device){
        return;
    }
    
    const body = {
        uris: tracks,
        position_ms : position
    };

    this.getTrackInfo(tracks[0].substring(14));

    const jsonBody = JSON.stringify(body);
    const requestMetadata: RequestInit = {
        method: 'PUT',
        headers: {
            Authorization: 'Bearer ' + this.token,
            'Content-Type': ContentTypes.json
        },
        body: jsonBody
    };
    const token = fetch(
        SpotifyEndpoints.play + '?device_id=' + this.device,
        requestMetadata
    )
        .then((response: Response) => response.json())
        .then((result: any) => {
            return result;
        })
        .catch((error: any) => console.log('error', error));

    return token;
}

// changes the volume on the spotify service
async volume(num : number) {
    const body = {
    };

    const jsonBody = JSON.stringify(body);
    const requestMetadata: RequestInit = {
        method: 'PUT',
        headers: {
            Authorization: 'Bearer ' + this.token,
            'Content-Type': ContentTypes.json
        },
        body: jsonBody
    };
    const token = fetch(
        'https://api.spotify.com/v1/me/player/volume' + '?volume_percent=' + num,
        requestMetadata
    )
        .then((response: Response) => response.json())
        .then((result: any) => {
            return result;
        })
        .catch((error: any) => console.log('error', error));

    return token;
}

// gets track info on a spotify song given the spotify uri
async getTrackInfo(uri : string) {
    
    const body = {
    };

    const jsonBody = JSON.stringify(body);
    const requestMetadata: RequestInit = {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + this.token,
            'Content-Type': ContentTypes.json
        }
    };
    const token = fetch(
        'https://api.spotify.com/v1/tracks/' + uri,
        requestMetadata
    )
        .then((response: Response) => response.json())
        .then((result: any) => {
            this.songEnd = result.duration_ms;
            return result;
        })
        .catch((error: any) => console.log('error', error));

    return token;
}

// gets the state of the player from spotify
async getPlayerState() {

    const body = {
    };

    const jsonBody = JSON.stringify(body);
    const requestMetadata: RequestInit = {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + this.token,
            'Content-Type': ContentTypes.json
        }
    };
    const token = fetch(
        SpotifyEndpoints.player + '?device_id=' + this.device,
        requestMetadata
    )
        .then((response: Response) => response.json())
        .then((result: any) => {
            this.playbackPosition = result["progress_ms"];
            if (result["item"]) {
                this.currentSongItem = ({"track": result["item"]});
                this.playing = result["is_playing"];
            }
            return result;
        })
        .catch((error: any) => console.log('error', error));

    return token;
}


// pauses the player on spotify
pauseSong(track: string) {
    const body = {
        uris: ['spotify:track:' + track]
    };

    const jsonBody = JSON.stringify(body);
    const requestMetadata: RequestInit = {
        method: 'PUT',
        headers: {
            Authorization: 'Bearer ' + this.token,
            'Content-Type': ContentTypes.json
        },
        body: jsonBody
    };
    const token = fetch(
        SpotifyEndpoints.pause + '?device_id=' + this.device,
        requestMetadata
    )
        .then((response: Response) => response.json())
        .then((result: any) => {
            return result;
        })
        .catch((error: any) => console.log('error', error));

    return token;
}

// gets the info of a spotify profile based on who is logged in 
async getProfile() :Promise<any>{
  const requestMetadata: RequestInit = {
      method: 'GET',
      headers: {
          Authorization: 'Bearer ' + this.token,
          'Content-Type': ContentTypes.json
      }
  };
  return fetch(SpotifyEndpoints.profile, requestMetadata)
      .then((response: Response) => response.json())
      .then((result: any) => {
          this.profile = result.display_name;
          this.id = result.id;
          this.listenerService.tempId = result.id;
          this.listenerService.getListener(result.id).then(()=> {
              if (!this.listenerService.foundListener) {
                  this.listenerService.listener.id = this.id;
                  this.listenerService.listener.admin = false;
                  this.listenerService.listener.name = result.display_name;
                  this.listenerService.createListener();
              }
          });
          this.listenerService.profile = result;
          return result;
      })
      .catch((error: any) => console.log('error', error));
}

// skips to next spotify song on queue
async skipSong(param : any) {
  const requestMetadata: RequestInit = {
      method: 'POST',
      headers: {
          Authorization: 'Bearer ' + this.token,
          'Content-Type': ContentTypes.json
      }
  };
  const token = fetch(
      SpotifyEndpoints.player + 'next',
      requestMetadata
  )
      .then((response: Response) => response.json())
      .then((result: any) => {
          return result;
      })
      .catch((error: any) => console.log('error', error)).then(() => {
          this.getPlayerState();
      }).then(() => {
          this.playing = true;
      }
      );


  return token;
}
 
// skips to previous spotify song
async prev(param : any) {
    const requestMetadata: RequestInit = {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + this.token,
            'Content-Type': ContentTypes.json
        }
    };
    const token = fetch(
        SpotifyEndpoints.player + 'previous',
        requestMetadata
    )
        .then((response: Response) => response.json())
        .then((result: any) => {
            return result;
        })
        .catch((error: any) => console.log('error', error)).then(() => {
            this.getPlayerState();
        }).then(() => {
            this.playing = true;
        }
        );
  
  
    return token;
  }

// gets a playlist object from spotify
async getPlaylist(playlistId: string) : Promise<any> {
  const requestMetadata: RequestInit = {
      method: 'GET',
      headers: {
          Authorization: 'Bearer ' + this.token,
          'Content-Type': ContentTypes.json
      }
  };
  const playlist = fetch(
      SpotifyEndpoints.singlePlaylist + '/' + playlistId.substring(('spotify:playlist:').length, playlistId.length) + '/tracks',
      requestMetadata
  )
      .then((response: Response) => response.json())
      .then((result: any) => {
          this.playlist = result;
          return result;
      })
      .catch((error: any) => console.log('error', error));
      return playlist;
}

// reusmes a paused song on spotify
async resumeSong() {
  const body = {
  };
  const jsonBody = JSON.stringify(body);
  const requestMetadata: RequestInit = {
      method: 'PUT',
      headers: {
          Authorization: 'Bearer ' + this.token,
          'Content-Type': ContentTypes.json
      },
      body: jsonBody
  };
  const token = fetch(
      SpotifyEndpoints.play + '?device_id=' + this.device,
      requestMetadata
  )
      .then((response: Response) => response.json())
      .then((result: any) => {
          return result;
      })
      .catch((error: any) => console.log('error', error));

  return token;
}
// gets list of availaible devices on spotify
async getDevices(): Promise<string> {
  const requestMetadata: RequestInit = {
      method: 'GET',
      headers: {
          Authorization: 'Bearer ' + this.token,
          'Content-Type': ContentTypes.json
      }
  };
  return fetch(SpotifyEndpoints.devices, requestMetadata)
      .then((response: Response) => response.json())
      .then((result: any) => {
          this.devices = result.devices;
          for (let device of result.devices) {
              if (!this.device && device.name === "tapd") {
                  this.device = device.id;
              }
              return device.id;
          }
          return undefined;
      })
      .catch((error: any) => console.log('error', error));
}




}
