import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../service/api.service';
import { ServerService } from '../../../../service/server/serverService';
import { ActivatedRoute } from '@angular/router';
import { NotificationService, NotificationType } from '../../../../service/notification.service';
import { Response } from '../../../../model/response/Response';
import { Utils } from '../../../../service/utils.service';
import { ManageServerComponent } from '../manageServer.component';
import { defer, of, take } from 'rxjs';

@Component({
  selector: 'app-banner-manage-server',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss'
})
export class BannerManageServerComponent {
  url?: string;

  fileName: string = "Nie wybrano pliku";
  selectedFile?: File;
  imageUrl?: string;

  constructor(
    public parent: ManageServerComponent,
    private apiService: ApiService,
    private notificationService: NotificationService,
  ) {
    defer(() => this.parent.server ? of(null) : this.parent.serverInitialized).pipe(take(1)).subscribe(() => {
      if (this.parent.server.banner) {
        if (Utils.isLinkValid(this.parent.server.banner)) {
          this.url = this.parent.server.banner;
          this.imageUrl = this.url;
        }
        else {
          this.imageUrl = Utils.backendDomain + this.parent.server.banner;
        }
      }
    })
  }

  save() {
    const formData = new FormData();

    if (this.selectedFile) {
      switch (Utils.checkBannerFile(this.selectedFile)) {
        case 1:
          this.notificationService.showNotification("Akceptujemy jedynie rozszerzenia jpeg, png, gif i webp", NotificationType.ERROR);
          return;
        case 2:
          this.notificationService.showNotification("Rozmiar pliku jest za duży", NotificationType.ERROR);
          return;
      }

      formData.append('file', this.selectedFile);
    }

    if (this.url) {
      formData.append('url', this.url);
    }

    this.apiService.post<Response>('/server/' + this.parent.server.id + '/manage/banner', formData, { withCredentials: true }).subscribe({
      next: (response) => {
        this.notificationService.showNotification(response.message);
      },
      error: (response) => {
        if (response.error) {
          this.notificationService.showNotification(response.error.message, NotificationType.ERROR);
        }
      }
    })
  }

  onUrlChange() {
    if (Utils.isLinkValid(this.url ?? "")) {
      this.imageUrl = this.url;

      this.fileName = "Nie wybrano pliku";
      this.selectedFile = undefined;
    }
    else {
      this.notificationService.showNotification("Link nie jest prawidłowy", NotificationType.ERROR);
      this.url = undefined;
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      if (this.selectedFile) {
        switch (Utils.checkBannerFile(this.selectedFile)) {
          case 1:
            this.notificationService.showNotification("Akceptujemy jedynie rozszerzenia jpeg, png, gif i webp", NotificationType.ERROR);
            return;
          case 2:
            this.notificationService.showNotification("Rozmiar pliku jest za duży", NotificationType.ERROR);
            return;
        }

        this.fileName = this.selectedFile.name;
        this.createImagePreview(this.selectedFile);
      }
    } else {
      this.fileName = 'Nie wybrano pliku';
      this.selectedFile = undefined;
      this.imageUrl = undefined;
    }

    this.url = undefined;
  }

  createImagePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
