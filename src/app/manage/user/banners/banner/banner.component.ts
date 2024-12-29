import { Component, Input } from '@angular/core';
import { Banner } from '../../../../../model/banner';
import { CommonModule, DatePipe } from '@angular/common';
import { PopupService } from '../../../../../service/popup.service';
import { EditBannerPopupComponent } from '../../../../shared/popup/manage/user/edit-banner/edit-banner.component';
import { BannersManageUserComponent } from '../banners.component';
import { ApiService } from '../../../../../service/api.service';
import { ObjectResponse } from '../../../../../model/response/ObjectResponse';
import { PaymentDto } from '../../../../../model/PaymentDto';
import { NotificationService, NotificationType } from '../../../../../service/notification.service';

@Component({
  selector: 'app-banner-manage-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss',
  providers: [DatePipe],
})
export class BannerManageUserComponent {
  @Input() banner!: Banner;

  constructor(
    private parent: BannersManageUserComponent,
    private apiService: ApiService,
    private popupService: PopupService,
    private notificationService: NotificationService,
    private datePipe: DatePipe
  ) {

  }

  buy() {
    this.apiService.get<ObjectResponse<PaymentDto>>('/banner/payment/' + this.banner.id, {}).subscribe({
      next: (response) => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://platnosc.hotpay.pl/';
        form.style.display = 'none';

        this.addHiddenField(form, 'SEKRET', response.object.secret);
        this.addHiddenField(form, 'KWOTA', response.object.amount);
        this.addHiddenField(form, 'NAZWA_USLUGI', response.object.serviceName);
        this.addHiddenField(form, 'ADRES_WWW', response.object.websiteAddress);
        this.addHiddenField(form, 'ID_ZAMOWIENIA', response.object.orderId);
        this.addHiddenField(form, 'EMAIL', response.object.email);
        this.addHiddenField(form, 'DANE_OSOBOWE', response.object.personalData);
        this.addHiddenField(form, 'HASH', response.object.hash);

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      error: (response) => {
        if (response.error) {
          this.notificationService.showNotification(response.error.message, NotificationType.ERROR);
        }
      }
    })
  }

  addHiddenField(form: HTMLFormElement, name: string, value: string) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  edit() {
    this.popupService.showPopup(EditBannerPopupComponent, [
      { name: "banner", value: this.banner },
      { name: "bannerListComponent", value: this.parent }
    ])
  }

  getStatus(): string {
    switch (this.banner.status.toString()) {
      case 'ACCEPTED':
        return 'Zaakceptowany'
      case 'NOT_VERIFIED':
        return 'Niezweryfikowany'
      case 'PUBLISHED':
        return 'Opublikowany'
      case 'REJECTED':
        return 'Odrzucony'
    }

    return 'NULL'
  }

  getPrice(): string {
    switch (this.banner.size.toString()) {
      case 'BIG': return '100';
      case 'NORMAL': return '50';
      case 'SMALL': return '30';
    }
    return '0';
  }

  convertLocalDateTime(date: Date | null): string | null {
    if (date) {
      return this.datePipe.transform(date, 'dd.MM.yyyy HH:mm');
    }
    return null;
  }
}
