import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ScientificPipe } from '../../pipes/scientific.pipe';

@Component({
  selector: 'app-pantalla',
  standalone: true,
  imports: [
    CommonModule,
    ScientificPipe
  ],
  templateUrl: './pantalla.component.html',
  styleUrl: './pantalla.component.css'
})
export class PantallaComponent {


@Input()
public resultado: string = '';
@Input()
public error: string = '';
@Input()
public operando: string = '';
@Input()
public history: string = '';
@Input()
public vHistory: boolean = false;
@Input()
public vOper: boolean = false;

 constructor() {

 }

}
