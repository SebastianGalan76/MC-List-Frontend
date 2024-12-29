import { Component, Input } from '@angular/core';
import { Banner, BannerStatus } from '../../../../../model/banner';
import { CommonModule } from '@angular/common';
import { PopupService } from '../../../../../service/popup.service';
import { EditBannerPopupComponent } from '../../../../shared/popup/manage/user/edit-banner/edit-banner.component';
import { BannersManageUserComponent } from '../banners.component';

@Component({
  selector: 'app-banner-manage-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss'
})
export class BannerManageUserComponent {
  @Input() banner!: Banner;

  constructor(
    private parent: BannersManageUserComponent,
    private popupService: PopupService
  ) {

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
}
