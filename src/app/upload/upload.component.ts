import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  NotificationRef,
  NotificationService,
} from '@progress/kendo-angular-notification';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  @ViewChild('inputFile') myInputVariable: ElementRef;
  selectedFileName: string = 'No files selected';
  fileUploadStatus: string = 'Choose File';

  constructor(
    private uploadService: UploadService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {}

  uploadFile(event) {
    if (event.target.files.length) {
      this.fileUploadStatus = 'Uploading...';
      this.selectedFileName = event.target.files[0].name;

      this.uploadService
        .seedData(event.target.files[0])
        .subscribe((res: any) => {
          //TODO : Handel error status
          if (res.status == 'success') {
            setTimeout(() => {
              this.resetFileUpload();
              this.showNotification();
            }, 500);
          }
        });
    } else {
      this.resetFileUpload();
    }
  }

  resetFileUpload() {
    this.selectedFileName = 'No files selected';
    this.fileUploadStatus = 'Choose File';
    this.myInputVariable.nativeElement.value = '';
  }

  showNotification() {
    this.notificationService.show({
      content: `File has been uploaded to the data. \n Please wait till data is been processed and update the records.`,
      cssClass: 'button-notification',
      width: 300,
      animation: { type: 'slide', duration: 800 },
      position: { horizontal: 'right', vertical: 'top' },
      type: { style: 'info', icon: true },
      hideAfter: 5000,
    });
  }
}
