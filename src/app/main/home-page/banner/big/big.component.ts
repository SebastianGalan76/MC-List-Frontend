import { Component, Input } from '@angular/core';
import { Banner } from '../../../../../model/banner';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-big-banner',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './big.component.html',
  styleUrl: './big.component.scss'
})
export class BigBannerComponent {
  @Input({required: true}) banner!: Banner | undefined;
}
