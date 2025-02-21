import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [NgbDropdownModule]
})
export class HeaderComponent implements OnInit {

  @Output() newEventEmitter = new EventEmitter<number>();
  fontSize: number = 0;

  ngOnInit(): void {
  }

  getFontSize() {
    this.newEventEmitter.emit(this.fontSize);
    return this.fontSize;
  }

}
