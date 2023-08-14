import {  AfterViewInit, Component, OnInit } from '@angular/core';
declare function iniciar_plugins() :any;
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit, AfterViewInit {

  constructor() { }
  
  ngAfterViewInit(): void {
    iniciar_plugins();    
  }

  ngOnInit(): void {
    
    
  }

}
