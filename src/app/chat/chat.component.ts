import { Component, Input, OnInit } from '@angular/core';
import { Brewery } from '../brewery';
import { BreweryService } from '../brewery.service';
import { ListenerService } from '../listener.service';
import { Message } from '../message';
import { MessageService } from '../message.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(public breweryService : BreweryService, public listenerService : ListenerService, public messageService : MessageService) { }

  display : boolean = false;
  messages = [];
  str : string;
  chatOpen : boolean = false;
  seenMessages : number = 0;
  allMessages : number = 0;
  hasNotifications : boolean = true;

  // gets data from databases/services
  ngOnInit(): void {
    if (this.messageService && this.breweryService) {
      this.getData();
      this.checkDataState();
    }
  }

  // seperates name from message
  getTextName(a : string) : string {
    var index = a.indexOf(":");
    return a.substring(0, index);
  }

  // sees if the texts in chat were sent by user
  isOwnText(a : string) : boolean {
    return this.getTextName(a) === this.listenerService.listener.name;
  }


  // sends a message to chat
  async sendMessage() {
    if (this.str.length > 0) {
    await this.getData();
    this.messages.push(this.listenerService.listener.name+": "+this.str);
    this.str = "";
    var temp : Message = {breweryName : this.breweryService.currentBrewery.name, texts : this.messages};
    await this.messageService.updateMessage(temp);
    }
  }

  // gets data
  async getData() {
    this.messages = (await this.messageService.getMessage(this.breweryService.currentBrewery.name)).texts;
    this.allMessages = this.messages.length;
    if (this.chatOpen){
      this.seenMessages = this.allMessages;
    }
    this.hasNotifications = !(this.allMessages == this.seenMessages);
  }

  // checks for chat update every second
  async checkDataState() {
    var sub = interval(1000).subscribe((val) => {this.getData(); });
}

// opens chat
   openForm() {
    this.display = true;
    this.chatOpen = true;
    this.seenMessages = this.messages.length;
  }
  
  // closes chat
   closeForm() {
    this.display = false;
    this.chatOpen = false;
  }

}
