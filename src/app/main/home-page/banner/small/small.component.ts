import { Component, Input } from '@angular/core';
import { Banner } from '../../../../../model/banner';

@Component({
  selector: 'app-small-banner',
  standalone: true,
  imports: [],
  templateUrl: './small.component.html',
  styleUrl: './small.component.scss'
})
export class SmallBannerComponent {
  @Input({required: true}) banner!: Banner | undefined;
}
