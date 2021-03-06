import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StudentService } from './services/student.service';
import { StudentComponent } from './student/student.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridModule } from '@progress/kendo-angular-grid';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { UploadComponent } from './upload/upload.component';
import { UploadModule } from '@progress/kendo-angular-upload';

import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { DefaultOptions, InMemoryCache } from '@apollo/client/core';
import { environment } from 'src/environments/environment';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { WebsocketService } from './services/websocket.service';

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
};

const config: SocketIoConfig = {
  url: environment.SOCKET_URL,
  options: { transports: ['websocket'] },
};

@NgModule({
  declarations: [AppComponent, StudentComponent, UploadComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    GridModule,
    ButtonsModule,
    UploadModule,
    NotificationModule,
    DialogModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [
    StudentService,
    WebsocketService,
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache: new InMemoryCache(),
          defaultOptions: defaultOptions,
          link: httpLink.create({
            uri: environment.GRAPHQL_URL,
          }),
        };
      },
      deps: [HttpLink],
    },
  ],
  exports: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
