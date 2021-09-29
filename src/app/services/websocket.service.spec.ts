import { TestBed } from '@angular/core/testing';
import { Socket } from 'ngx-socket-io';
import { WebsocketService } from './websocket.service';

describe('WebsocketService', () => {
  let service: WebsocketService;

  beforeEach(() => {
    const socketStub = () => ({
      fromEvent: (string) => ({ pipe: () => ({}) }),
    });
    TestBed.configureTestingModule({
      providers: [
        WebsocketService,
        { provide: Socket, useFactory: socketStub },
      ],
    });
    service = TestBed.inject(WebsocketService);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

  describe('getMessage', () => {
    it('makes expected calls', () => {
      const socketStub: Socket = TestBed.inject(Socket);
      spyOn(socketStub, 'fromEvent').and.callThrough();
      service.getMessage();
      expect(socketStub.fromEvent).toHaveBeenCalled();
    });
  });
});
