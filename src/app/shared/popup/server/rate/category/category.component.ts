import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-rate-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class RateCategoryComponent {
  @Input({ required: true }) header!: string;
  @Input({ required: true }) description!: string;
  @Input({ required: true }) currentRate: number = -1;

  @Output() currentRateChange = new EventEmitter<number>();

  activedStars: boolean[] = new Array(5).fill(false);

  onMouseOver(index: number) {
    for (var i = 0; i <= index; i++) {
      this.activedStars[i] = true;
    }
    for (var i = index + 1; i < 5; i++) {
      this.activedStars[i] = false;
    }
  }

  select(index: number) {
    this.currentRate = index;
    this.currentRateChange.emit(this.currentRate);
  }

  onMouseLeave() {
    for (var i = 0; i <= this.currentRate; i++) {
      this.activedStars[i] = true;
    }
    for (var i = this.currentRate + 1; i < 5; i++) {
      this.activedStars[i] = false;
    }
  }
}
