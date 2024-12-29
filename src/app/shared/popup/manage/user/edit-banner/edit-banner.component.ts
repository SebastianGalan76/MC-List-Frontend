import { Component, Input, OnInit } from '@angular/core';
import { Banner } from '../../../../../../model/banner';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Utils } from '../../../../../../service/utils.service';
import { NotificationService, NotificationType } from '../../../../../../service/notification.service';
import { PopupService } from '../../../../../../service/popup.service';
import { ApiService } from '../../../../../../service/api.service';
import { Response } from '../../../../../../model/response/Response';
import { ObjectResponse } from '../../../../../../model/response/ObjectResponse';
import { BannersManageUserComponent } from '../../../../../manage/user/banners/banners.component';

@Component({
  selector: 'app-edit-banner',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-banner.component.html',
  styleUrl: './edit-banner.component.scss'
})
export class EditBannerPopupComponent implements OnInit {
  @Input() banner!: Banner;
  @Input() bannerListComponent!: BannersManageUserComponent;

  fileName: string = "";
  selectedFile?: File;
  imageUrl?: string;

  bannerLink: string = "";

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private popupService: PopupService
  ) {

  }
  ngOnInit(): void {
    this.imageUrl = this.banner.filePath;
    this.bannerLink = this.banner.link;
  }

  submit() {
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

    if (this.isLinkValid(this.bannerLink)) {
      formData.append('url', this.bannerLink);
    }
    else {
      this.notificationService.showNotification("Wprowadź poprawny docelowy link!", NotificationType.ERROR);
      return;
    }

    if(!this.selectedFile && this.bannerLink == this.banner.link){
      this.closePopup();
      return;
    }

    this.apiService.put<ObjectResponse<Banner>>('/banner/' + this.banner.id, formData, { withCredentials: true }).subscribe({
      next: (response) => {
        this.notificationService.showNotification(response.message);

        this.bannerListComponent.updateBanner(response.object);
        this.closePopup();
      },
      error: (response) => {
        this.notificationService.showNotification(response.error.message, NotificationType.ERROR);
      }
    })
  }

  remove() {
    this.popupService.showConfirmPopup([
      { name: "message", value: "Czy na pewno chcesz usunąć ten baner?" }
    ]).subscribe({
      next: (data) => {
        if (data.event == 'confirm') {
          this.apiService.delete<Response>('/banner/'+this.banner.id, {withCredentials: true}).subscribe({
            next: (response) => {
              this.notificationService.showNotification(response.message);
              this.bannerListComponent.removeBanner(this.banner);
              this.closePopup();
            },
            error: (response) => {
              this.notificationService.showNotification(response.error.message, NotificationType.ERROR);
            }
          })
        }
      }
    })
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (this.selectedFile && input.files && input.files.length == 0) {
      return;
    }

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
  }

  createImagePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  closePopup() {
    this.popupService.closePopup();
  }

  isLinkValid(input: string) {
    if (!input) {
      return true;
    }

    var URL_REGEX = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return URL_REGEX.test(input);
  }
}
