import { Component, Input } from '@angular/core';
import { Banner } from '../../../../../model/banner';
import { RouterLink } from '@angular/router';
import { Utils } from '../../../../../service/utils.service';

@Component({
  selector: 'app-big-banner',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './big.component.html',
  styleUrl: './big.component.scss'
})
export class BigBannerComponent {
  @Input({ required: true }) banner!: Banner | undefined | null;

  getImageUrl(path: string): string {
    return Utils.getImageUrl(path);
  }
}
