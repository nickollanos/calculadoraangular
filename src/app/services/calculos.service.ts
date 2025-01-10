import { Injectable } from '@angular/core';
import { Datos } from '../app.types';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Limpiador } from '../models/limpiador.model';

@Injectable({ providedIn: 'root' })

export class CalculosService {


  constructor() {

   }

  deleteDatos ( operando : string ) : Observable<string> {
    return new Observable<string>(observer => {
      try {
          operando = operando.slice(0, -1);
          if ( operando === '' ){
            let operando = '0';
            observer.next(operando);
            observer.complete();
          }
          console.log(operando);
          observer.next(operando);
          observer.complete();

      } catch (error) {
        observer.error(error);
      }
    }).pipe(
      catchError(error => {
        console.error('Error al elimminar', error.message);
        return of('Error al elimminar');
      })
    );
  }

  limpiarDatos() : Observable<Limpiador> {
    return new Observable<Limpiador>(observer => {
      try {
        const limpiador = {
          num1 : '',
          num2 : '',
          operador : '',
          resul : '',
        };

        observer.next(limpiador);
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  operacionDatos ( operando : string ) : Observable<string> {
    console.log(operando);

    operando = operando.trim();

    let formato = /^[0-9+\-*/().\s]*$/;
    let apertura = (operando.match(/\(/g) || []).length;
    console.log(apertura);

    let cierre = (operando.match(/\)/g) || []).length;
    console.log(cierre);


    if ( !formato.test(operando) ){
      return throwError(() => new Error('Expresion matematica invalida'));
    }

    if ( /[+\-*/]$/.test(operando)) {
      operando = operando.slice(0, -1);
    }

    if ( /\/0(?![\d\.])/.test(operando)) {
      return throwError(() => new Error('No se puede dividir por cero'));
    }

    operando = operando.replace(/(\d)\.\(/g, '$1.0*(');

    if ( apertura > cierre ){
      operando = operando.replace(/(\d)(\()/g, '$1*(');
      let diferencia = apertura - cierre;
      operando += ')'.repeat(diferencia);
    } else if ( cierre > apertura || cierre === apertura ) {
      operando = operando.replace(/(\d)(\()/g, '$1*(');
    }
    console.log(operando);
    // operando = operando.replace(/(?<=[1-9\(])\)(?=\S)/g, ')*').replace(/\)(?=$)/g, ')');
    operando = operando  .replace(/(?<=[1-9\(])\)(?=\d|\.\d|\))/g, ')*')
    .replace(/(?<=\))(?=\d|\.\d|\))/g, ')*')
    .replace(/\)(?=$)/g, ')');
    console.log(operando);

    try {
      let datitos = operando.substring(0, 2);
      let firts = operando.substring(0, 1);
      console.log(datitos);

      if ( datitos !== '0.' && firts === '0' && operando.length >= 2 ){
        operando = operando.replace(/^0+/, '');

        if ( operando === '' ){
          operando = '0';
        }
      }

      console.log(operando);
      console.log('evaluando........');
      let resultado = eval(operando);
      console.log(resultado);

      resultado = parseFloat(resultado);

      if ( resultado %1 === 0 ){
        let result = resultado.toFixed(0);
        console.log(result);
        return of(result.toString());
      } else {
        let result = resultado.toFixed(2);
        console.log(result);
        return of(result.toString());
      }

    } catch (error) {
      return throwError( () => new Error('Error al realizar la operacion'));
    }
  }
}
