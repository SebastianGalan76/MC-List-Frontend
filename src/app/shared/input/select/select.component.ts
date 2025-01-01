import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface Item {
  id: number;
  name: string;
}
export interface OptionValue {
  item: Item;
  isSelected: boolean;
  isVisibled: boolean;
}

@Component({
  selector: 'app-input-select',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss'
})
export class SelectComponent {
  @Input({ required: true }) placeholder = "";
  @Input() options: OptionValue[] = [];
  @Input() maxChoice = -1;

  @Output() onChange = new EventEmitter<void>();

  protected searchInput: string = "";
  protected focused: boolean = false;

  selected: number = 0;

  constructor(
    private elementRef: ElementRef
  ) {
    
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent){
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.focused = false;
    }
  }

  search() {
    this.options.forEach(option => {
      if (option.item.name.toLowerCase().startsWith(this.searchInput.toLowerCase())) {
        option.isVisibled = true;
      }
      else {
        option.isVisibled = false;
      }
    })
  }

  select(option: OptionValue, event: Event) {
    if (!option.isSelected && this.maxChoice != -1) {
      this.selected = this.options.filter(option => option.isSelected).length;
      if (this.selected >= this.maxChoice) {
        if (this.maxChoice == 1) {
          var selectedOption = this.options.find(option => option.isSelected);
          if (selectedOption) {
            this.remove(selectedOption);
            this.selected--;
            this.onChange.emit();
          }
        }
        else {
          const checkbox = event.target as HTMLInputElement;
          checkbox.checked = false;

          return;
        }
      }
    }

    option.isSelected = !option.isSelected;
    this.onChange.emit();
    if(option.isSelected){
      this.selected++;
    }
    else{
      this.selected--;
    }
  }

  remove(option: OptionValue) {
    option.isSelected = false;
    this.selected--;

    this.onChange.emit();
  }
}
