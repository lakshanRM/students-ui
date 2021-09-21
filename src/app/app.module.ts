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
import { InMemoryCache } from '@apollo/client/core';
import { environment } from 'src/environments/environment';
import { NotificationModule } from '@progress/kendo-angular-notification';


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
  ],
  providers: [
    StudentService,
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache: new InMemoryCache(),
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
