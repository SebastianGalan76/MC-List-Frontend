import { Component, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { BannerService } from '../../../../service/banner.service';
import { BannerManageUserComponent } from '../../user/banners/banner/banner.component';
import { Banner } from '../../../../model/banner';
import { BannersManageComponent } from '../../user/banners/banners.component';
import { PopupService } from '../../../../service/popup.service';
import { EditBannerPopupComponent } from '../../../shared/popup/manage/admin/edit-banner/edit-banner.component';

@Component({
  selector: 'app-banners',
  standalone: true,
  imports: [],
  templateUrl: './banners.component.html',
  styleUrl: './banners.component.scss',
  providers: [{provide: BannersManageComponent, useExisting: BannersManageAdminComponent}]
})
export class BannersManageAdminComponent extends BannersManageComponent implements OnInit{
  @ViewChild('bannerContainer', { read: ViewContainerRef, static: true })
  bannerContainer!: ViewContainerRef;

  bannerViews: ComponentRef<BannerManageUserComponent>[] = [];

  constructor(
    private bannerService: BannerService,
    private popupService: PopupService
  ) {
    super();
  }

  ngOnInit(): void {
    this.bannerService.getAdminBanners().subscribe({
      next: (response) => {
        response.forEach(banner => {
          this.addBannerComponent(banner);
        })
      }
    })
  }

  addBannerComponent(banner: Banner) {
    const componentRef = this.bannerContainer.createComponent(BannerManageUserComponent);
    componentRef.instance.banner = banner;
    this.bannerViews.push(componentRef);
  }

  updateBanner(banner: Banner) {
    const index = this.bannerViews?.findIndex(b => b.instance.banner.id === banner.id);
    if (index !== undefined && index >= 0) {
      this.bannerViews[index].instance.banner = banner;
    }
  }

  removeBanner(banner: Banner){
    const index = this.bannerViews?.findIndex(b => b.instance.banner.id === banner.id);
    if (index !== undefined && index >= 0) {
      this.bannerViews[index].destroy();
    }
  }

  editBanner(banner: Banner) {
      this.popupService.showPopup(EditBannerPopupComponent, [
        { name: "banner", value: banner },
        { name: "bannersManageComponent", value: this }
      ])
    }
}
