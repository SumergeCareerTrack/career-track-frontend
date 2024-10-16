import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs';
import { CareerPackageTemplateRequestDTO } from '../../interfaces/backend-requests';
import { CareerPackageTemplate } from '../../interfaces/front-end-interfaces';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private baseUrl = 'http://localhost:8083/file';

  constructor(private httpClient: HttpClient) {}

  downloadFile(fileId: string) {
    const url = `${this.baseUrl}/download/${fileId}`;
    this.httpClient
      .get(url, { responseType: 'blob', observe: 'response' })
      .subscribe(
        (response) => {
          if (response.body) {
            const contentDisposition = response.headers.get(
              'Content-Disposition'
            );
            const filename = this.getFilenameFromHeader(contentDisposition);
            saveAs(response.body, filename);
          } else {
            console.error('Download failed: File content is null');
          }
        },
        (error: string) => {
          console.error('Download error:', error);
        }
      );
  }

  uploadNewCareerPackage(file: File, titleId: string,fileName:string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('titleId', titleId);
    formData.append('name', fileName);
    return this.httpClient.post(
      'http://localhost:8083/career-packages',
      formData,
      {
        headers: new HttpHeaders({
          Accept: 'application/json',
        }),
        responseType: 'json',
      }
    );
  }

  updateCareerPackageTemplate(file: File, titleId: string,fileName:string,data:CareerPackageTemplate): Observable<any> {
    let request={
      file: file,
      titleId: titleId==''?data.titleId:titleId,
      name: fileName==''?data.name:fileName
    }
    return this.httpClient.put(
      'http://localhost:8083/career-packages/'+data.id,
      request,
      {
        headers: new HttpHeaders({
          Accept: 'application/json',
        }),
        responseType: 'json',
      }
    );
  }

  uploadNewUserSubmission(
    file: File,
    userId: string,
    name: string,
    managerId: string
  ) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('employeeId', userId);
    formData.append('name', name);

    return this.httpClient.post(
      'http://localhost:8083/employee-packages/' + managerId,
      formData,
      {
        headers: new HttpHeaders({
          Accept: 'application/json',
        }),
        responseType: 'json',
      }
    );
  }

  private getFilenameFromHeader(contentDisposition: string | null): string {
    let filename = 'downloaded-file'; // Default filename if not found in header
    if (contentDisposition) {
      const result = contentDisposition
        .split(';')
        .find((part) => part.trim().startsWith('filename='));
      if (result) {
        filename = result.split('=')[1].trim().replace(/"/g, ''); // Extract the filename and remove quotes
      }
    }

    return filename;
  }
}
