import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'invertir',
  standalone: true,
})
export class InvertirPipe implements PipeTransform {

  transform(value: string, intervalo: number = 10): string {

    let textoMostrado = '';

    if (value) {
      let index = 0;
      const interval = setInterval(() => {
        textoMostrado += value.charAt(index);
        index++;
        if (index === value.length) {
          clearInterval(interval);
        }
      }, intervalo);
    }

    return textoMostrado;
  }
}
