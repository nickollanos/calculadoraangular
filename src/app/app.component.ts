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

    //VARIABLES
    let penultimos = this.operando.slice(-2);

    //LOS LOG
    // console.log(num);
    // console.log(this.operando);
    // console.log(this.resultado);

    //VALIDA SI SE DIVIDE POR CERO
    if ( penultimos === '/0' && (/^[^1-9.]*$/.test(num)) ){
      this.operacion( this.operando);
    }

    //VALIDACIONES PARA RETORNAR EXCEPCIONES
    if (this.validarReturn(num)) return;

    //RETORNA LAS PANTALLAS DE OPERACION Y RESULTADO CON TAMAÑO DE LAS FUENTES
    this.pantallas(num);

    //VALIDA SI TIENE COMO TAL ALGUNA ACCION ESPECIAL DE RESULTADO
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

      if ( penultimos === '()' ) {
        this.operando = this.operando.slice(0, -1);
        return;
      } else if ( penultimos === '(-' ){
        return;
      }

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
          if ( result === 'NaN' ) {
            result = '0';
          }
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

  private pantallas ( num: string ) : void {
    this.hLetra = 2.8;
    this.sLetra = 2;

    if (num !== 'history' && this.vHistory === true && this.vConver === false ){
      this.vHistory = false;
      this.vConver = true;
    }
  }

  private validarReturn ( num : string ): boolean {
    //VARIABLES
    let aperturaParentesis = (this.operando.match(/\(/g) || []).length;
    let cierreParentesis = (this.operando.match(/\)/g) || []).length;
    let ultimocis = this.operando[this.operando.length-1];
    let numeros = this.operando.split(/[+\-/*()]/);
    let fraccion = numeros[numeros.length - 1];
    let penultimos = this.operando.slice(-2);

    //VALIDA PARA PONER PARENTESIS DE CIERRE
    if ( !this.operando.includes('(') && num === ')' || aperturaParentesis === cierreParentesis && num === ')'){
      return true;
    }
    //VALIDA SI DESPUES DEL RESULTADO SE OPRIME DE NUEVO IGUAL NO HACE NADA
    else if ( this.operando !== '' && this.resultado === '' && num === '=' ) {
      return true;
    }
    //VALIDA SI NO HAY NADA Y EL PRIMER DIGITO ES MENOS LO AÑADE AL OPERANDO Y RETORNA
    else if ( (this.operando === '' || ( this.operando.length === 1 && ( /^[+\-/*)]/.test( this.operando ) ) || /0/.test(this.operando) ) ) && /^[+\-/*)]/.test( num ) ){
      if ( num === '-' && ( /^[+\-/*)]/.test( this.operando ) || this.operando === '' || /0/.test(this.operando) ) ){
        this.operando = '';
        this.operando += '-';
        this.resultado += '0';
      }
      this.operando += '';
      this.resultado += '';
      return true;
    }
    //VALIDA SI NO HAY NADA Y SI SE ENVIA IGUAL NO HACE NADA
    else if (num === '=' && this.operando === '' ){
      this.operando = '';
      this.resultado = '';
      return true;
    }
    //VALIDA SI EL ULTIMO DIGITO ERA OPERADOR Y EL NUEVO TAMBIEN Y LO REEMPLAZA POR EL ULTIMO
    else if ( /^[+\-/*]/.test( ultimocis ) && /^[+\-/*)]/.test( num ) ) {
      this.operando = this.operando.slice(0, -1);
      this.operando += num;
      num = '';
      return true;
    }
    //VALIDA SI EL ULTIMO ES DIVIDIR Y EL DIGITO INGRESADO ES CERO
    else if ( ultimocis === '/' && num === '0' ){
      this.operando += num;
      num = '';
      return true;
    }
    //VALIDA SI YA HAY UN PUNTO EN EL ULTIMO CONJUNTO DE NUMEROS Y NO PERMITE PONER UNO NUEVO
    //TAMBIEN VALIDA SI HAY UN PARENTESIS DE APERTURA Y NO PERITE QUE HAYA UN OPERADOR DESPUES DE MAS O POR
    else if ( (fraccion.includes('.') && num === '.') || ( /^[+\/*]/.test( num ) && this.operando[this.operando.length-1] === '(' ) ){
      num = '';
      return true;
    }
    //VALIDA SI EL OPERANDO ESTA VACIO Y LE AÑADE CERO Y PUNTO
    else if ( this.operando === '' && num === '.' ){
      this.operando += '0.';
      this.vOper = true;
      this.resultado = '0';
      return true;
    }
    //VALIDA SI EL OPERANDO NO ESTA VACIO Y LE AÑADE UN PUNTO
    else if ( this.operando !== '' && num === '.' ) {
      this.operando += '.';
      num = '';
      return true;
    }
    //VALIDA SI NO TIENE NADA Y SE ENVIA UN PARENTESIS DE APERTURA
    else if ( num === '(' ) {
      if ( this.operando === '' ){
        this.resultado = '0';
      }
      this.operando += '(';
      this.vOper = true;
      return true;
    }
    //VALIDA SI TODO ESTA VACIO Y SE ENVIA DE PRIMERO UN PARENTESIS DE CIERRE Y NO LO DEJA PONER
    else if ( num === ')' && this.operando === '' ){
      return true;
    }
    //VALIDA SI OPERANDO TIENE ALGO, EL RESULTADO ESTA VACIO Y SE ENVIA UN NUMERO SE LE ASIGNA A OPERANDO
    else if ( this.operando !== '' && this.resultado === '' && /\d/.test(num) ){
      this.operando = '';
      this.operando += num;
      this.resultado += num;
      this.pantallas(num);
      num = ''
      return true;
    }

    return false;

  }

}
