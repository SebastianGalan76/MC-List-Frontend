import { Component, Input } from '@angular/core';
import { Banner, BannerStatus } from '../../../../../model/banner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-banner-manage-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss'
})
export class BannerManageUserComponent {
  @Input() banner!: Banner;

  edit() {

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
}
