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
  public result: string = '';
  public history: string[] = [];
  public vHistory: boolean = false;
  public vOper: boolean = false;
  public vConver: boolean = true;
  public error: string = '';
  public operando: string = '';
  public hLetra: number = 2.8;
  public sLetra: number = 2;

  constructor(
    private calculosService: CalculosService
  ) {
    this.cargarLocalStorage();
  }

  public historialUnico ( hist : string) : void {
    this.vHistory = false;
    this.vConver = true;
    this.operadores(hist);
  }

  public operadores ( num : string ) : void {
    console.log(num);
    if (num !== 'history' && this.vHistory === true && this.vConver === false ){
      this.vHistory = false;
      this.vConver = true;
    }

    let apertura = (this.operando.match(/\(/g) || []).length;
    let cierre = (this.operando.match(/\)/g) || []).length;

    if ( !this.operando.includes('(') && num === ')' || apertura === cierre && num === ')' ) return;

    this.hLetra = 2.8;
    this.sLetra = 2;
    console.log(this.operando);
    console.log(this.resultado);

    if ( this.operando !== '' && this.resultado === '' && /\d/.test(num) ){
      this.operando = '';
      this.operando += num;
      num = '';
    }

    if ( this.operando === '' && num === '-' ){
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

    let ultimocis = this.operando[this.operando.length-1];
    console.log(ultimocis);


    if ( /^[+\-/*]/.test( ultimocis ) && /^[+\-/*)]/.test( num ) ) {
      this.operando = this.operando.slice(0, -1);
      this.operando += num;
      console.log(this.operando);
      num = '';
      return;
    }

    console.log(num);

    if ( ultimocis === '/' && num === '0' ){
      this.operando += num;
      num = '';
      return;
    }

    let numeros = this.operando.split(/[+\-/*()]/);
    let fraccion = numeros[numeros.length - 1];

    if ( fraccion.includes('.') && num === '.' ){
      num = '';
      return;
    }

    if ( /^[+\/*]/.test( num ) &&   this.operando[this.operando.length-1] === '('){
      num = '';
      return;
    }

    if ( this.operando === '' && num === '.' && num.length === 1 ){
      this.operando += '0.';
      this.vOper = true;
      this.resultado = '0';
      console.log(this.operando);

      return;
    } else if ( this.operando !== '' && num === '.' ) {
      this.operando += '.';
      num = '';
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
        this.historico( this.operando, this.resultado );
        this.hLetra = 1.5;
        this.sLetra = 2.6;
        this.operando = this.resultado;
        this.result = this.resultado;
        this.resultado = '';
      } else if ( num === 'history' ){
        console.log(num);

        num = '';
        if ( this.vHistory === false && this.vConver === true ) {
          this.vHistory = true;
          this.vConver = false;
          return;
        } else if ( this.vHistory === true && this.vConver === false ) {
          this.vHistory = false;
          this.vConver = true;
        }

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

      if ( /^[0-9+\-/*().]+$/.test(this.operando) ) {
        this.operando = this.operando.replace(/\b0+(\d)/g, '$1');
      }

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

  public delete( operando : string ): void {
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
    let ultimocis = this.operando[this.operando.length-1];
    let ultimos = this.operando.substring(this.operando.length-2);
    console.log(ultimos);

    if ( ultimocis === '.') {
      return;
    } else if ( ultimos === '/0' ) {
      return;
    }
    this.operacion( this.operando );
  }

  public operacion( operacion: string ): void {

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

  public limpiar(): void {
    this.calculosService.limpiarDatos().subscribe({
      next: (result: Limpiador) => {
        this.operando = result.resul;
        this.resultado = result.resul;
        this.error = result.resul;
        this.result = result.resul;
        console.log('Datos limpiados' + this.resultado);
      },
      error: (err) => {
        this.error = err;
      }
    });
  }

  public historico( operando : string, resultado: string ): void {
    console.log(operando);
    console.log(resultado);
    let historial = operando + '=' + resultado;
    console.log(historial);

    // this.history.push(historial);
    this.organizadorHistorico( historial );

  }

  public organizadorHistorico ( historial : string ): void {
    console.log(historial);

    if ( this.history.includes(historial)){
      this.eliminarHistorico(historial);
    } else {
    this.history.unshift( historial );
    }

    this.history = this.history.splice(0 , 20);
    this.guardarLocalStorage();

  }

  public eliminarHistorico ( historial: string): void {
    console.log(historial);

    if (this.history.includes(historial)) {
      this.history = this.history.filter((oldHistorial) => oldHistorial !== historial);
    }
  }

  public guardarLocalStorage(): void {
    localStorage.setItem('historial', JSON.stringify( this.history ));
  }

  public cargarLocalStorage(): void {
    if ( !localStorage.getItem('historial')) return;

    this.history = JSON.parse(localStorage.getItem('historial')!);

    if ( this.history.length === 0) return;
  }

}
