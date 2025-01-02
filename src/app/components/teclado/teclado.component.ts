import { Component, EventEmitter, Output } from '@angular/core';
import { Datos } from '../../app.types';


@Component({
  selector: 'app-teclado',
  standalone: true,
  imports: [],
  templateUrl: './teclado.component.html',
  styleUrl: './teclado.component.css'
})
export class TecladoComponent {

  @Output()
  public numeros = new EventEmitter<string>();
  @Output()
  public operador = new EventEmitter<string>();

  constructor() {

  }

  numero( num : string ) {
    this.numeros.emit( num );
    // console.log( dato );

  }

  opera( op : string ) {
    this.operador.emit( op );
  }

}
