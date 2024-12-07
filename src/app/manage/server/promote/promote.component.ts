import { Component } from '@angular/core';
import { ManageServerComponent } from '../manageServer.component';
import { ApiService } from '../../../../service/api.service';
import { NotificationService, NotificationType } from '../../../../service/notification.service';
import { PaymentDto } from '../../../../model/PaymentDto';
import { ObjectResponse } from '../../../../model/response/ObjectResponse';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-promote',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './promote.component.html',
  styleUrl: './promote.component.scss'
})
export class PromoteManageServerComponent {
  value: number = 7;
  price: number = 14;

  constructor(
    private parent: ManageServerComponent,
    private apiService: ApiService,
    private notificationService: NotificationService
  ) { }

  submit() {
    this.apiService.get<ObjectResponse<PaymentDto>>('/server/payment/' + this.parent.server.id + '/' + this.value, {}).subscribe({
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

  onValueChange(): void {
    if (this.value !== null) {
      this.price = this.value * 2;
    }
    else {
      this.price = 0;
    }
  }
}
