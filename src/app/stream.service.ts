import { Injectable } from '@angular/core';
import { Stream } from './stream';

enum ContentTypes {
  json = 'application/json',
  urlEncoded = 'application/x-www-form-urlencoded'
}

@Injectable({
  providedIn: 'root'
})
export class StreamService {

  public currentStream : Stream;

  constructor() { }

  // gets the current system time
  getNow() : number {
    var d = new Date();
    return d.getTime();
  }

  // gets a stream object from all streams (key=name)
  async getStream(name : string) : Promise<Stream>{
    var s;
    for (s of (await this.getStreams())){
      if (s.name === name) {
        if (!this.currentStream || (this.currentStream.name !== s.anme || this.currentStream.songs[0] != s.songs[0])) {
          this.currentStream = s;
        }
        return s;
      }
    }
    return null;
  }
// gets a stream object from all streams in a specific list of streams
  getStreamFromList(name : string, li: Stream[]) : Promise<Stream>{
    var s;
    for (s of li){
      if (s.name === name) {
        return s;
      }
    }
    return null;
  }

// gets all streams from database
  async getStreams() : Promise<Stream[]> {
    const requestMetadata: RequestInit = {
        method: 'GET',
        headers: {
          'Content-Type': ContentTypes.json
        }
    };
    return fetch("https://tapdbackend.club/streams", requestMetadata)
        .then((response: Response) => response.json())
        .then((result: any) => {
          return result;
        })
        .catch((error: any) => console.log('error', error));
  }

// creates a stream object in the databse from the stream object
  async createStream(param : Stream) : Promise<boolean> {
    const body = {
      name : param.name,
      streaming : param.streaming,
      songs : param.songs
  };

  const jsonBody = JSON.stringify(body);

    const requestMetadata: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': ContentTypes.json
        },
        body: jsonBody
    };
    return fetch("https://tapdbackend.club/streams", requestMetadata)
        .then((response: Response) => response.json())
        .then()
        .catch((error: any) => console.log('error', error));
  }

  // updates stream object in databse based on passed stream (key=name) 
  async updateStream(param : Stream) : Promise<boolean> {
    const body = {
      name : param.name,
      streaming : param.streaming,
      songs : param.songs
  };

  const jsonBody = JSON.stringify(body);

    const requestMetadata: RequestInit = {
        method: 'PUT',
        headers: {
          'Content-Type': ContentTypes.json
        },
        body: jsonBody
    };
    return fetch("https://tapdbackend.club/streams", requestMetadata)
        .then((response: Response) => response.json())
        .then()
        .catch((error: any) => console.log('error', error));
  }


}
