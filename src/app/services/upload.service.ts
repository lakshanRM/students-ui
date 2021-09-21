import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(private http: HttpClient) {}

  seedData(file: File) {
    let fd = new FormData();
    fd.append('file', file, file.name);
    return this.http.post(environment.UPLOAD_URL, fd);
  }
}
