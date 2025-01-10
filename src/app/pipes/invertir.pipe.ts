import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Pipe({
  name: 'invertir',
  standalone: true,
})
export class InvertirPipe implements PipeTransform {

  transform(value: string): Observable<string> {

    const anchoDiv : number = 10;
    const anchoText = this.obtenerAnchoTxt(value);
    const renglonesNece = Math.ceil(anchoText / anchoDiv);
    let textFormat = '';
    for ( let i = 0; i < renglonesNece; i++){
      const inicio = i * anchoDiv;
      const fin = ( i+1 ) * anchoDiv;
      const renglon = value.substring(inicio, fin);
      textFormat += renglon + '\n';
    }

    return of (textFormat);

  }

  obtenerAnchoTxt ( texto: string ){
    const elementTem = document.createElement('span');
    elementTem.innerText = texto;
    document.body.appendChild(elementTem);
    const ancho = elementTem.offsetWidth;
    return ancho;

  }
}
