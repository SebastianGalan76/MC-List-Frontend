import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../service/api.service';
import { ServerService } from '../../../../service/server/serverService';
import { Server } from '../../../../model/server/server';
import { ActivatedRoute } from '@angular/router';
import { NotificationService, NotificationType } from '../../../../service/notification.service';
import { Response } from '../../../../model/response/Response';
import { Utils } from '../../../../service/utils.service';

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

  server!: Server;

  constructor(
    private apiService: ApiService,
    private serverService: ServerService,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) {
    var ip = this.route.parent?.snapshot.paramMap.get('ip') || '';

    serverService.getServer(ip).subscribe(server => {
      this.server = server!;

      if (this.server.banner) {
        if (Utils.isLinkValid(this.server.banner)) {
          this.imageUrl = this.url;
          this.url = this.server.banner;
        }
        else {
          this.imageUrl = this.apiService.domain + this.server.banner;
        }
      }
    });
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

    this.apiService.post<Response>('/server/' + this.server.id + '/manage/banner', formData, { withCredentials: true }).subscribe({
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
