import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'scientific',
  standalone: true,
})
export class ScientificPipe implements PipeTransform {

  transform(value: number | string, decimals: number = 4): string {

    const numValue = Number(value);

    if (isNaN(numValue)) {
      return value.toString();
    }

    if (numValue.toString().length > 6) {
      return numValue.toExponential(decimals);
    } else {
      return numValue.toString(); 
    }
  }
}
