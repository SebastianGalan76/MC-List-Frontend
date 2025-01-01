import { Component } from '@angular/core';
import { OptionValue, SelectComponent } from "../../../../shared/input/select/select.component";
import { FormsModule } from '@angular/forms';
import { NotificationService, NotificationType } from '../../../../../service/notification.service';
import { ApiService } from '../../../../../service/api.service';
import { ServerComponent } from '../../server.component';
import { Response } from '../../../../../model/response/Response';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [SelectComponent, FormsModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ServerReportComponent {
  reportOptions: OptionValue[] = [];

  reportReason: string = "";
  submitSuccess: boolean = false;

  constructor(
    private parent: ServerComponent,
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {
    this.createOption("Fałszywe informacje");
    this.createOption("Zawyżona ilość graczy online");
    this.createOption("Zagraniczny serwer");
  }

  submit() {
    this.submitSuccess = true;
    var selectedReasons = this.reportOptions.filter(reason => reason.isSelected).map(reason => reason.item.name);

    if(selectedReasons.length==0){
      if(this.reportReason.length<20){
        this.notificationService.showNotification("Wybierz powód lub dokładniej opisz powód zgłaszania", NotificationType.ERROR);
        this.submitSuccess = false;
        return;
      }
    }

    var reason = selectedReasons.join(" ");
    reason += this.reportReason;

    this.apiService.post<Response>("/server/"+this.parent.server.id+"/report", reason, {withCredentials: true}).subscribe({
      next: (response) => {
        this.notificationService.showNotification(response.message);
      },
      error: (response) => {
        this.notificationService.showNotification(response.message, NotificationType.ERROR);
        this.submitSuccess = false;
      }
    })
  }

  createOption(value: string) {
    this.reportOptions.push({
      item: {
        id: this.reportOptions.length,
        name: value
      },
      isSelected: false,
      isVisibled: true
    })
  }
}
