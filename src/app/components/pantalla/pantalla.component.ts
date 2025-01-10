import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ScientificPipe } from '../../pipes/scientific.pipe';
import { InvertirPipe } from "../../pipes/invertir.pipe";

@Component({
  selector: 'app-pantalla',
  standalone: true,
  imports: [
    CommonModule,
    ScientificPipe,
],
  templateUrl: './pantalla.component.html',
  styleUrl: './pantalla.component.css'
})
export class PantallaComponent implements AfterViewInit{
@Output()
historialEliminado: EventEmitter<string> = new EventEmitter<string>();
@Output()
historialUnico: EventEmitter<string> = new EventEmitter<string>();

@ViewChild
('oper')operationsDiv!: ElementRef;

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

public historial: string = '';


constructor() {

}

ngAfterViewInit(): void {
  if (this.operationsDiv) {
    this.scrollToBottom();
  }
}

scrollToBottom(): void {
  if (this.operationsDiv && this.operationsDiv.nativeElement) {
    const element = this.operationsDiv.nativeElement;
    element.scrollTop = element.scrollHeight;
  }
}

public eliminarHistoricos(historial: string): void {
  console.log(historial);
  this.historialEliminado.emit(historial);

}

public mostrarDato( historial: string ) {
  historial = historial.split('=')[0];
  console.log(historial);
  this.historialUnico.emit(historial);
}

}
