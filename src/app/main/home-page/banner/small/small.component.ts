import { Component, Input } from '@angular/core';
import { Banner } from '../../../../../model/banner';
import { RouterLink } from '@angular/router';
import { Utils } from '../../../../../service/utils.service';

@Component({
  selector: 'app-small-banner',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './small.component.html',
  styleUrl: './small.component.scss'
})
export class SmallBannerComponent {
  @Input({required: true}) banner!: Banner | undefined;

  getImageUrl(path: string): string {
      return Utils.getImageUrl(path);
    }
}
