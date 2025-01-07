import { Component } from '@angular/core';
import { PantallaComponent } from "./components/pantalla/pantalla.component";
import { TecladoComponent } from "./components/teclado/teclado.component";
import { Limpiador } from './models/limpiador.model';
import { CalculosService } from './services/calculos.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    // RouterOutlet,
    TecladoComponent,
    PantallaComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'calculadora';

  public resultado: string = '';
  public history: string = '';
  public vHistory: boolean = false;
  public vOper: boolean = false;
  public error: string = '';
  public operando: string = '';
  public hLetra: number = 2.8;
  public sLetra: number = 2;

  constructor(
    private calculosService: CalculosService
  ) { }

  public operadores ( num : string ) {
    console.log(num);

    if (this.operando === '' && num === '-' ){
      this.operando += '-';
      this.resultado += '0';
      console.log(this.operando);
      return;
    }

    if (num === '=' && this.operando === '' ){
      this.operando = '';
      this.resultado = '';
      this.hLetra = 2.8;
      this.sLetra = 2;
      return;
    }

    console.log(num);
    if ( num === 'par' ){
      let apertura = (this.operando.match(/\(/g) || []).length;
      console.log(apertura);

      let cierre = (this.operando.match(/\)/g) || []).length;
      console.log(cierre);

      if ( apertura > cierre ){
        this.operando += ')';
        num = '';
        return;
      } else if ( cierre > apertura ) {
        this.operando += '(';
        num = '';
      } else if ( cierre === apertura ){
        this.operando += '(';
        num = '';
        return;
      }
    }

    if ( this.operando === '' && num === '.' && num.length === 1 ) return;
    console.log(this.operando);

    if ( this.operando === '' ) {
      this.hLetra = 2.8;
      this.sLetra = 2;
    }

    if ( num === 'delete' || num === 'c'|| num === 'history' || num === '='){

      if ( num === 'delete' ){
        this.delete(this.operando);
      } else if ( num === 'c' ) {
        this.limpiar();
      } else if ( num === '=' ){
        this.hLetra = 1.5;
        this.sLetra = 2.6;
        this.operando = '';
      }

    } else {

      this.operando += num;

      console.log(this.operando);

      console.log(/^[+\/*]/.test( this.operando[this.operando.length-1] ));
      console.log(this.operando[this.operando.length-2] === ')');


      if ( /^[+\-/*]/.test( this.operando[this.operando.length-1] ) &&  this.operando[this.operando.length-2] === ')') return;

      if (/^[+\/*]/.test(this.operando[0]) ){
        this.operando = '';
        return;
      }
      this.vOper = true;
      console.log(this.operando);

      if ( this.resultado === '') this.resultado = this.operando;

      this.operacion( this.operando );
    }

  }

  // public numeros( num : string): void {
  //   this.operando += num;
  //   console.log('operando.....', this.operando);
  //   this.vOper = true;

  //   // if ( this.resultado === '' ) {

  //   if ( this.operador !== '' ) {
  //     // if ( this.resultado !== ''){

  //     // }
  //     this.operador = '';
  //     this.num2 += num;
  //     console.log('numero 2: ', this.num2);
  //     this.operacion( this.resultado, this.num2, this.operador);
  //   } else {
  //     this.resultado += num;
  //     console.log('numero 1: ', this.resultado);
  //   }

  //   // } else {
  //   //   this.num1 = this.resultado;
  //   //   this.operacion( this.num1, this.num2, this.operador);
  //   //   console.log('numero 2: ', this.num2, 'y numero resultado: ', this.num1);
  //   // }
  // }

  // public operadores( op : string): void {
  //   this.operador = op;
  //   console.log('operador: ', this.operador);
  //   if( ['+', '-', '*', '/'].includes(op.slice(-1)) ) {
  //     this.operando += op;
  //     console.log('operando.....', this.operando);

  //   } else if (op === 'c') {
  //     this.limpiar();

  //   } else if (op === '=') {
  //     this.operacion(this.num1, this.num2, this.operador);

  //   } else if (op === 'delete') {
  //     this.delete(this.num1, this.num2, this.operador);

  //   }
  // }

  // public recibidoDato(dato: string): void {
  //   // console.log('dato recibido: ', dato);

  //   console.log(this.operando);


  //   if ( this.resultado === '') {
  //     this.operando += dato;
  //     this.num2 += dato;
  //     console.log(this.num2);

  //       if( ['+', '-', '*', '/', 'history'].includes(dato.slice(-1))) {
  //         this.operador = dato;
  //         console.log(this.operador);



  //         if ( this.num1 === '' ){
  //           this.num1 = this.num2;
  //           console.log(this.num1);
  //           this.num2 = '';

  //         } else {
  //           this.operacion(this.num1, this.num2, this.operador);
  //           this.num2 = '';

  //         }

  //       } else if (dato === 'c') {
  //         this.limpiar();

  //       } else if (dato === '=') {
  //         this.operacion(this.num1, this.num2, this.operador);

  //       } else if (dato === 'delete') {
  //         this.delete(this.num1, this.num2, this.operador);

  //       }

  //   } else {
  //     this.operando = '';
  //     this.num2 = this.resultado;
  //     this.resultado = '';
  //     this.operando += this.num2;
  //     if( ['+', '-', '*', '/', 'history'].includes(dato.slice(-1))) {
  //       this.operador = dato;
  //       console.log(this.operador);
  //       this.num1 = this.num2;
  //       console.log(this.num1);
  //       this.num2 = '';

  //     } else if (dato === 'c') {
  //       this.limpiar();

  //     } else if (dato === '=') {
  //       this.operacion(this.num1, this.num2, this.operador);

  //     } else if (dato === 'delete') {
  //       this.delete(this.num1, this.num2, this.operador);

  //     }
  //   }

  //   // if (this.resultado === '') {
  //   //   if (['+', '-', '*', '/', 'history'].includes(datos.slice(-1))) {
  //   //     if (this.num1 !== '' && this.num2 === '') {
  //   //       this.operador = datos;
  //   //       console.log(this.operador);
  //   //       this.operando = this.num1 + ' ' + this.operador;
  //   //       console.log(this.operando);

  //   //     } else if (this.num1 !== '' && this.num2 !== '') {
  //   //       this.operacion(this.num1, this.num2, this.operador);
  //   //       this.num2 = '';

  //   //     }

  //   //   } else if (dato === 'c') {
  //   //     this.limpiar();

  //   //   } else if (dato === '=') {
  //   //     this.operacion(this.num1, this.num2, this.operador);

  //   //   } else if (dato === 'delete') {
  //   //     this.delete(this.num1, this.num2, this.operador);

  //   //   } else if (this.operador === '') {
  //   //     this.num1 += datos;
  //   //     console.log(this.num1);
  //   //   } else {
  //   //     this.num2 += datos;
  //   //     console.log(this.num2);
  //   //   }
  //   // } else if (this.resultado !== '') {
  //   //   if (['+', '-', '*', '/', 'history'].includes(datos.slice(-1))) {
  //   //     if (this.num2 === '') {
  //   //       this.operador = datos;
  //   //       console.log(this.operador);
  //   //       this.operando += this.resultado + ' ' + this.operador;
  //   //     } else if (this.num2 !== '') {
  //   //       this.operacion(this.resultado, this.num2, this.operador);
  //   //       console.log(this.operador);
  //   //       this.num2 = '';
  //   //       this.operando += this.resultado + ' ' + this.operador;
  //   //       console.log(this.operando);

  //   //     }

  //   //   } else if (dato === 'c') {
  //   //     this.limpiar();

  //   //   } else if (dato === '=') {
  //   //     this.operacion(this.resultado, this.num2, this.operador);

  //   //   } else if (dato === 'delete') {
  //   //     this.delete(this.resultado, this.num2, this.operador);

  //   //   } else if (this.operador === '') {
  //   //     this.resultado += datos;
  //   //     console.log(this.resultado);
  //   //   } else {
  //   //     this.num2 += datos;
  //   //     console.log(this.num2);
  //   //   }
  //   // }

  // }

  delete( operando : string ): void {
    this.calculosService.deleteDatos(operando ).subscribe({
      next: (result) => {
          this.operando = result;
          console.log(this.operando);

          if ( this.operando === '0') {
            this.vOper = false;
          }
            console.log(this.operando);
      },
      error: (err) => {
        this.error = err;
      }
    });

    if ( this.operando[this.operando.length-1] === '(' ) {
      return;
    }
    this.operacion( this.operando );
  }

  operacion( operacion: string ): void {

    console.log(operacion);

    this.calculosService.operacionDatos( operacion ).subscribe({

      next: (result) => {
          this.resultado = result;
          console.log(this.resultado);
      },
      error: (err) => {
        this.error = err.message;
      }
    });
  }

  limpiar(): void {
    this.calculosService.limpiarDatos().subscribe({
      next: (result: Limpiador) => {
        this.operando = result.operador;
        this.resultado = result.resul;
        this.error = result.resul;
        console.log('Datos limpiados');
      },
      error: (err) => {
        this.error = err;
      }
    });
  }

  // multiplicar( num1 : string, num2 : string) : void {
  //   this.calculosService.multiplicarDatos(num1, num2).subscribe({
  //     next: (result) => {
  //       this.resultado = result;
  //     },
  //     error: (err) => {
  //       this.error = err;
  //     }
  //   });
  // }

  // dividir( num1 : string, num2 : string) : void {
  //   this.calculosService.dividirDatos(num1, num2).subscribe({
  //     next: (result) => {
  //       this.resultado = result;
  //     },
  //     error: (err) => {
  //       this.error = err;
  //     }
  //   });
  // }

  // sumar( num1 : string, num2 : string ) : void {
  //   this.calculosService.sumarDatos(num1, num2).subscribe({
  //     next: (result) => {
  //       this.resultado = result;
  //     },
  //     error: (err) => {
  //       this.error = err;
  //     }
  //   });
  // }

  // restar( num1 : string, num2 : string) : void {
  //   this.calculosService.restarDatos(num1, num2).subscribe({
  //     next: (result) => {
  //       this.resultado = result;
  //     },
  //     error: (err) => {
  //       this.error = err;
  //     }
  //   });
  // }

}
