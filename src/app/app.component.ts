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
    this.hLetra = 2.8;
    this.sLetra = 2;

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

    if ( /^[+\-/*]/.test( this.operando[this.operando.length-1] ) && /^[+\-/*]/.test( num ) ) {
      this.operando = this.operando.replace(this.operando[this.operando.length-1], num);
      return;
    }

    console.log(num);

    if ( /^[+\/*]/.test( num ) &&  ( this.operando[this.operando.length-1] === '(' || this.operando[this.operando.length-1] === ')' ) ){
      num = '';
      return;
    }

    if ( this.operando === '' && num === '.' && num.length === 1 ){
      this.operando += '0.';
      this.vOper = true;
      this.resultado = '0';
      console.log(this.operando);

      return;
    }
    console.log(this.operando);

    if ( num === '(' && this.operando === '' ) {
      this.operando += '(';
      this.vOper = true;
      this.resultado = '0';
      return;
    } else if ( num === ')' && this.operando === '' ){
      return;
    } else if ( num === '(' ){
      this.operando += '(';
      return;
    }

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
        this.operando = this.resultado;
      }

    } else {

      if ( num === '+'){
        if  ( this.operando[this.operando.length-1] === '+' || this.operando[this.operando.length-1] === '-' ){
          this.operando = this.operando.replace(this.operando[this.operando.length-1], num);
          return;
        }

        if ( this.operando[this.operando.length-1] === '*' || this.operando[this.operando.length-1] === '/' ){
          num = '';
          return;
        }
      }

      if ( num === '-'){
        if  ( this.operando[this.operando.length-1] === '+' || this.operando[this.operando.length-1] === '-' ){
          this.operando = this.operando.replace(this.operando[this.operando.length-1], num);
          return;
        }

        if ( this.operando[this.operando.length-1] === '*'){
          num = '';
          return;
        }
      }

      if ( num === '-' && this.operando[this.operando.length-1] === '/' ) {
        this.operando += num;
        return;
      }

      if ( num === '*' || num === '/' ){
        if ( this.operando[this.operando.length-1] === '*' || this.operando[this.operando.length-1] === '/' ){
          this.operando = this.operando.replace(this.operando[this.operando.length-1], num);
          return;
        }

        if ( this.operando[this.operando.length-1] === '+' || this.operando[this.operando.length-1] === '-' ){
          num = '';
          return;
        }
      }

      this.operando += num;

      let ultimos = this.operando.slice(-2);
      console.log(ultimos);


      if ( ultimos === '()' ) {
        this.operando = this.operando.slice(0, -1);
        return;
      } else if ( ultimos === '(-' ){
        return;
      }

      console.log(this.operando);

      console.log(/^[+\/*]/.test( this.operando[this.operando.length-1] ));
      console.log(this.operando[this.operando.length-2] === ')');

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

}
