import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'invertir',
  standalone: true,
})
export class InvertirPipe implements PipeTransform {

  transform(value: string): string {

    let operadores = ['+', '-', '/', '*'];

    let valorInvertido = value.split('').reverse().join('');

    operadores.forEach(operador =>
    {
      valorInvertido = valorInvertido.replace(operador, `${operador}`)
    });
    return valorInvertido;
  }
}
