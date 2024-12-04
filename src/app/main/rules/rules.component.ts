import { Component, OnInit } from '@angular/core';
import { Utils } from '../../../service/utils.service';

@Component({
  selector: 'app-rules',
  standalone: true,
  imports: [],
  templateUrl: './rules.component.html',
  styleUrl: './rules.component.scss'
})
export class RulesComponent implements OnInit {
  ngOnInit(): void {
    Utils.scrollToTop();
  }
}
