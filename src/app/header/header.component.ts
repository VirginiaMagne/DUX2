import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {


  @Output() newEventEmitter = new EventEmitter<number>();
  fontSize:number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  getFontSize(){
    this.newEventEmitter.emit(this.fontSize);
    return this.fontSize;
  }

}
