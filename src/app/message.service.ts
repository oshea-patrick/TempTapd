import { Injectable } from '@angular/core';
import { Message } from './message';

enum ContentTypes {
  json = 'application/json',
  urlEncoded = 'application/x-www-form-urlencoded'
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }

  // gets a list of message objects from the database
  async getMessages() : Promise<Message[]> {
    const requestMetadata: RequestInit = {
        method: 'GET',
        headers: {
          'Content-Type': ContentTypes.json
        }
    };
    return fetch("https://tapdbackend.club/Chats", requestMetadata)
        .then((response: Response) => response.json())
        .then((result: any) => {
          return result;
        })
        .catch((error: any) => console.log('error', error));
  }

  // gets a message object from the list in the service (key=name)
  async getMessage(key : string) {
    var m : Message;
    var messages = await this.getMessages();
    for (m of messages) {
      if (m.breweryName === key)
        return m;
    }
    return null;
  }
 // updates a message object from the databse (key=name of message)
  async updateMessage(m : Message) {
    const body = {
      breweryName: m.breweryName,
      texts : m.texts
  };
  
  const jsonBody = JSON.stringify(body);
  
    const requestMetadata: RequestInit = {
        method: 'PUT',
        headers: {
          'Content-Type': ContentTypes.json
        },
        body: jsonBody
    };
    return fetch("https://tapdbackend.club/Chats", requestMetadata)
        .then((response: Response) => response.json())
        .then()
        .catch((error: any) => console.log('error', error));
  }
 
  // creates message object in the databse from object passed
  async createMessage(m : Message) {
    const body = {
      breweryName: m.breweryName,
      texts : m.texts
  };
  
  const jsonBody = JSON.stringify(body);
  
    const requestMetadata: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': ContentTypes.json
        },
        body: jsonBody
    };
    return fetch("https://tapdbackend.club/Chats", requestMetadata)
        .then((response: Response) => response.json())
        .then()
        .catch((error: any) => console.log('error', error));
  }

}
