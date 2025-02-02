import { Component, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { BannerManageUserComponent } from "./banner/banner.component";
import { BannerService } from '../../../../service/banner.service';
import { Banner } from '../../../../model/banner';
import { RouterLink } from '@angular/router';
import { EditBannerPopupComponent } from '../../../shared/popup/manage/user/edit-banner/edit-banner.component';
import { PopupService } from '../../../../service/popup.service';

export abstract class BannersManageComponent{
  abstract updateBanner(banner: Banner) : void;
  abstract removeBanner(banner: Banner) : void;
  abstract editBanner(banner: Banner) : void;
}

@Component({
  selector: 'app-banners',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './banners.component.html',
  styleUrl: './banners.component.scss',
  providers: [{provide: BannersManageComponent, useExisting: BannersManageUserComponent}]
})
export class BannersManageUserComponent extends BannersManageComponent implements OnInit {
  @ViewChild('bannerContainer', { read: ViewContainerRef, static: true })
  bannerContainer!: ViewContainerRef;

  bannerViews: ComponentRef<BannerManageUserComponent>[] = [];

  constructor(
    private bannerService: BannerService,
    private popupService: PopupService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.bannerService.getUserBanners().subscribe({
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
