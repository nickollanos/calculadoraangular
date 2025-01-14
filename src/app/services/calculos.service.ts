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

    operando = operando.trim();

    if ( !/^[0-9+\-*/().\s]*$/.test(operando) ){
      return throwError(() => new Error('Expresion matematica invalida'));
    }

    if ( /[+\-*/]$/.test(operando)) {
      operando = operando.slice(0, -1);
    }

    if ( /\/0(?![\d\.])/.test(operando)) {
      return throwError(() => new Error('No se puede dividir por cero'));
    }

    operando = operando.replace(/(\d)\.\(/g, '$1.0*(');

    let apertura = (operando.match(/\(/g) || []).length;
    let cierre = (operando.match(/\)/g) || []).length;

    if ( apertura > cierre ){
      operando = operando.replace(/(\d)(\()/g, '$1*(');
      let diferencia = apertura - cierre;
      operando += ')'.repeat(diferencia);
    } else if ( cierre > apertura || cierre === apertura ) {
      operando = operando.replace(/(\d)(\()/g, '$1*(');
    }

    operando = operando.replace(/(?<=[0-9\(])\)(?=\d|\.\d|\))/g, ')*')
    .replace(/(?<=\))(?=\d|\.\d|\))/g, ')*')
    .replace(/\)(?=$)/g, ')');
    console.log(operando);

    let datitos = operando.substring(0, 2);
    let firts = operando.substring(0, 1);

    if ( firts === '0' && (/0(?![+\-/*\.])/.test(datitos)) && operando.length >= 2 ){
      operando = operando.replace(/^0+/, '');
      if ( operando === '' ){
        operando = '0';
      }
    }

    try {
      let resultado = Function(`"use strict"; return (${operando})`)();
      resultado = parseFloat(resultado);

      return of(resultado % 1 === 0 ? resultado.toFixed(0) : resultado.toFixed(2));
      
    } catch (error) {
      return throwError( () => new Error('Error al realizar la operacion'));
    }
  }
}
