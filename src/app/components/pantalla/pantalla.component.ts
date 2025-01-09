import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ScientificPipe } from '../../pipes/scientific.pipe';
import { InvertirPipe } from "../../pipes/invertir.pipe";

@Component({
  selector: 'app-pantalla',
  standalone: true,
  imports: [
    CommonModule,
    ScientificPipe,
    InvertirPipe
],
  templateUrl: './pantalla.component.html',
  styleUrl: './pantalla.component.css'
})
export class PantallaComponent {

@Input()
public resultado: string = '';
@Input()
public result: string = '';
@Input()
public error: string = '';
@Input()
public operando: string = '';
@Input()
public history: string[] = [];
@Input()
public vHistory: boolean = false;
@Input()
public vConver: boolean = true;
@Input()
public vOper: boolean = false;
@Input()
public hLetra: number = 0;
@Input()
public sLetra: number = 0;

 constructor() {

 }

}
