import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  constructor(private socket: Socket) {}
  getMessage() {
    return this.socket.fromEvent('message').pipe(map((data: any) => data));
  }
}
