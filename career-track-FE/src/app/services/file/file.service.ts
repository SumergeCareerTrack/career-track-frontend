import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private baseUrl = 'http://localhost:8082/file';

  constructor(private httpClient: HttpClient) {}

  downloadFile(fileId: string) {
    const url = `${this.baseUrl}/download/${fileId}`;
    this.httpClient
      .get(url, { responseType: 'blob', observe: 'response' })
      .subscribe(
        (response) => {
          if (response.body) {
            // Check if response.body is not null
            const contentDisposition = response.headers.get(
              'Content-Disposition'
            );
            let filename = 'downloadedFile';

            if (contentDisposition) {
              const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
              const matches = filenameRegex.exec(contentDisposition);
              if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
              }
            }

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
}
