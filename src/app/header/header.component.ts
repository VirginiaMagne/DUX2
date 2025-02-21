import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [NgbDropdownModule, CommonModule]
})
export class HeaderComponent implements OnInit {

  @Output() newEventEmitter = new EventEmitter<number>();
  fontSize: number = 0;
  helpFontSize: number = 16;
  bigFontSize: boolean = false;

  ngOnInit(): void {
  }

  // Cambio del tamaño de la fuente
  getFontSize() {
    this.bigFontSize = !this.bigFontSize;
    this.helpFontSize = this.bigFontSize ? 36 : 16;
    this.newEventEmitter.emit(this.fontSize);
    return this.fontSize;
  }

}
