import { Component, EventEmitter, Output } from '@angular/core'


@Component({
  selector: 'app-teclado',
  standalone: true,
  imports: [],
  templateUrl: './teclado.component.html',
  styleUrl: './teclado.component.css'
})
export class TecladoComponent {

  @Output()
  public teclas = new EventEmitter<string>();
  @Output()
  public operador = new EventEmitter<string>();

  constructor() {

  }

  teclado( event : KeyboardEvent ): void {
    const key = event.key;
    console.log(key);

    if ('0123456789'.includes(key)) {
      this.operador.emit(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
      this.operador.emit(key);
    } else if (key === 'Enter' || key === '=') {
      this.operador.emit('=');
    } else if (key === 'Backspace' || key === 'Delete') {
      this.operador.emit('delete');
    } else if (key === '.') {
      this.operador.emit('.');
    } else if (key === 'c') {
      this.operador.emit('c');
    } else if (key === '(') {
      this.operador.emit('(');
    }else if (key === ')') {
      this.operador.emit(')');
    }


  }

  opera( op : string ) {
    this.operador.emit( op );
  }

}
