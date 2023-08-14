import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WindowsService {

  resizeObservable$: Observable<Event>

  constructor() { }


  public ResizeHeight() {
    this.resizeObservable$ = fromEvent(window, 'resize')
    //Deteccion de dimension alto del spreadSheet
    return this.resizeObservable$;
  }
}
