import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-action',
  standalone: true,
  imports: [],
  templateUrl: './confirm-action.component.html',
  styleUrl: './confirm-action.component.scss'
})
export class ConfirmActionPopupComponent {
  @Input({ required: true }) message!: string;
  @Input() confirmText: string = 'TAK';
  @Input() cancelText: string = 'NIE';

  @Output() onConfirm = new EventEmitter();
  @Output() onCancel = new EventEmitter();

  confirm(){
    this.onConfirm.emit();
  }

  cancel(){
    this.onCancel.emit();
  }
}
