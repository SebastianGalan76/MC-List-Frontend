import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { PopupService } from '../../../../../../service/popup.service';
import { NotificationService, NotificationType } from '../../../../../../service/notification.service';
import { Utils } from '../../../../../../service/utils.service';
import { SubServerManageServerComponent } from '../../../../../manage/server/sub-server/sub-server.component';
import { ServerMode, ServerModeService } from '../../../../../../service/serverMode.service';
import { ServerVersion, ServerVersionService } from '../../../../../../service/serverVersion.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OptionValue, SelectComponent } from '../../../../input/select/select.component';

@Component({
  selector: 'app-sub-server-creator',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectComponent],
  templateUrl: './sub-server-creator.component.html',
  styleUrl: './sub-server-creator.component.scss'
})
export class SubServerCreatorPopupComponent implements OnInit {
  @Input() editMode: boolean = false;

  @Input() name: string = "";
  @Input() color: string = "#ffffff";

  @Input() mode?: ServerMode;
  @Input() versions: ServerVersion[] = [];

  @Input() component!: SubServerManageServerComponent;

  versionOptions: OptionValue[] = [];
  modeOptions: OptionValue[] = [];

  constructor(
    private popupService: PopupService,
    private notificationService: NotificationService,
    private serverVersionService: ServerVersionService,
    private serverModeService: ServerModeService,
  ) {

  }
  ngOnInit(): void {
    this.serverVersionService.getVersionList().subscribe(list => {
      const selectedVersionIds = this.versions.map(version => version.id);

      list.forEach(item => {
        this.versionOptions.push({
          item: item,
          isSelected: selectedVersionIds.find(id => id == item.id) != null ? true : false,
          isVisibled: true,
        })
      })
    });

    this.serverModeService.getVersionList().subscribe(list => {
      list.forEach(item => {
        this.modeOptions.push({
          item: item,
          isSelected: item.id == this.mode?.id,
          isVisibled: true,
        })
      })
    })
  }

  closePopup() {
    this.popupService.closePopup();
  }

  performAction() {
    this.name = this.name.trim();

    if (this.name.length == 0) {
      this.notificationService.showNotification("Wprowadź nazwę trybu!", NotificationType.ERROR);
      return;
    }

    const selectedMode = this.modeOptions.find(option => option.isSelected)?.item;
    const selectedVersions = this.versionOptions.filter(option => option.isSelected).map(option => option.item);
    if (selectedMode) {
      if (this.editMode) {
        this.component.editSubServer(this.name, this.color, selectedMode, selectedVersions);
      }
      else {
        this.component.createSubServer(this.name, this.color, selectedMode, selectedVersions);
      }
    }
    else {
      this.notificationService.showNotification("Musisz wybrać tryb z listy!", NotificationType.ERROR);
    }
  }
}
