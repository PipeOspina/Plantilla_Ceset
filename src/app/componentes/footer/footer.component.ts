import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private el: ElementRef) { }

  @ViewChild('card') private cardElement: ElementRef;

  ngAfterViewInit() {
    console.log(this.cardElement.nativeElement);
  }

  ngOnInit() {
  }

}
