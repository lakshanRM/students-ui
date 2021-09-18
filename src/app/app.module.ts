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
  ],
  providers: [StudentService],
  exports: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
