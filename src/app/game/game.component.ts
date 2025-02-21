import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Alert } from 'src/app/model/alert';
import { Category } from 'src/app/model/category';
import { Result } from 'src/app/model/result';
import { GarbageObject } from '../model/garbage-object';
import { timer } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  imports: [CommonModule, FormsModule, HeaderComponent]
})
export class GameComponent implements OnInit, OnChanges {

  @Input() fontSize!: '';
  @Input() playerName?: string;

  faTrash = faTrash;
  orangeTrash = 'assets/trash-img/orange-trash.PNG';
  yellowTrash = 'assets/trash-img/yellow-trash.PNG';
  greenTrash = 'assets/trash-img/green-trash.PNG';
  blueTrash = 'assets/trash-img/blue-trash.png';
  purpleTrash = 'assets/trash-img/purple-trash.PNG';
  apple = 'assets/img/apple.png';

  randomElement = new GarbageObject();
  length = 0;
  cant = 0;
  fontSizeFlag = false;
  titleFontSize: number = 50;
  subTitleFontSize: number = 30;
  counterFontSize: number = 20;
  simpleTextFontSize: number = 16;

  selectedItemCategory = new Category();


  showDanger = false;
  showSuccess = false;
  startGame = false;
  gameFinished = false;
  positionTableVisible = false;

  timeLeft: number = 0.0;
  interval: any;
  subscribeTimer: any;
  gameFinishedTime: number = 0;

  garbageObjects: GarbageObject[] = [];
  categories: Category[] = [];

  results: Result[] = [];


  closeResult = '';

  alerts: Alert[] = [
    {
      type: 'success',
      message: 'Correcto!',
    },
    {
      type: 'danger',
      message: 'Incorrecto, probá de nuevo.',
    }
  ];



  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnChanges(changes: SimpleChanges): void {


  }
  ngOnInit(): void {

    //Creo instancias de cada categoría.
    let organicos = new Category();
    organicos.id = 0;
    organicos.name = 'Orgánicos';
    this.categories.push(organicos);

    let latasYPlasticos = new Category();
    latasYPlasticos.id = 1;
    latasYPlasticos.name = 'Latas y Plásticos';
    this.categories.push(latasYPlasticos);

    let vidrio = new Category();
    vidrio.id = 2;
    vidrio.name = 'Vidrio';
    this.categories.push(vidrio);

    let papelYCarton = new Category();
    papelYCarton.id = 3;
    papelYCarton.name = 'Papel y Cartón';
    this.categories.push(papelYCarton);

    let bateriasYAerosoles = new Category();
    bateriasYAerosoles.id = 4;
    bateriasYAerosoles.name = 'Baterías y Aerosoles';
    this.categories.push(bateriasYAerosoles);

    //Creo instancias de cada recurso a tirar al tacho, y los voy agregando a una arreglo.
    let aerosol: GarbageObject = {
      id: 0,
      name: 'Aerosol',
      category: bateriasYAerosoles,
      imgPath: 'assets/img/aerosol.png'
    };
    this.garbageObjects.push(aerosol);

    let banana: GarbageObject = {
      id: 1,
      name: 'Banana',
      category: organicos,
      imgPath: 'assets/img/banana.png'
    };
    this.garbageObjects.push(banana);

    let botellaVidrioRota: GarbageObject = {
      id: 2,
      name: 'Botella de Vidrio rota',
      category: vidrio,
      imgPath: 'assets/img/botella-vidrio-rota.png'
    };
    this.garbageObjects.push(botellaVidrioRota);

    let botellaPlastico: GarbageObject = {
      id: 3,
      name: 'Botella de Plástico',
      category: latasYPlasticos,
      imgPath: 'assets/img/botella-plastico.png'
    };
    this.garbageObjects.push(botellaPlastico);

    let diario: GarbageObject = {
      id: 4,
      name: 'Diario',
      category: papelYCarton,
      imgPath: 'assets/img/diario.png'
    };
    this.garbageObjects.push(diario);

    let hojasSecas: GarbageObject = {
      id: 5,
      name: 'Hojas secas',
      category: organicos,
      imgPath: 'assets/img/hojas.png'
    };
    this.garbageObjects.push(hojasSecas);

    let botellaVidrio: GarbageObject = {
      id: 6,
      name: 'Botella de Vidrio',
      category: vidrio,
      imgPath: 'assets/img/botella-coca-cola.png'
    };
    this.garbageObjects.push(botellaVidrio);

    let carton: GarbageObject = {
      id: 7,
      name: 'Cartón',
      category: papelYCarton,
      imgPath: 'assets/img/caja-carton.png'
    };
    this.garbageObjects.push(carton);

    let lata: GarbageObject = {
      id: 8,
      name: 'Lata',
      category: latasYPlasticos,
      imgPath: 'assets/img/lata2.png'
    };
    this.garbageObjects.push(lata);

    let pila: GarbageObject = {
      id: 9,
      name: 'Pila',
      category: bateriasYAerosoles,
      imgPath: 'assets/img/pila.png'
    };
    this.garbageObjects.push(pila);

    this.length = this.garbageObjects.length;
    this.setElement();
  }

  // Configuracion del timer
  oberserableTimer() {
    const source = timer(1000, 2000);
    const abc = source.subscribe(val => {
      this.subscribeTimer = this.timeLeft - val;
    });
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft < 999) {
        this.timeLeft++;
      } else {
        this.pauseTimer();
      }
    }, 1000)
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  //Habilito la vista del juego cuando presionan Comenzar, y escondo el botón
  setStartGame() {
    this.startGame = true;
    this.cant = 0;
    this.setElement();
    this.startTimer();
  }

  // Volver a la pantalla inicial
  goBack() {
    this.pauseTimer();
    this.modalService.dismissAll();
    this.timeLeft = 0;
    this.startGame = false;
  }

  //modal
  open(content: any) {
    this.modalService.open(content);
  }

  //Seteo un elemento para jugar 
  setElement() {

    this.randomElement = this.garbageObjects[this.cant];
    this.showDanger = false;
    this.showSuccess = false;
    this.modalService.dismissAll();
  }

  //Limpio el estado del juego para empezarlo de cero.
  playAgain() {
    let res: Result = {
      name: this.playerName,
      time: this.gameFinishedTime
    };
    this.results.push(res);
    this.results.sort((a, b) => a.time - b.time);

    this.positionTableVisible = true;
    this.gameFinished = false;
    this.goBack();
  }


  // Evaluacion de si la respuesta es correcta
  trashClick(selectedId: Number, content: any) {

    this.selectedItemCategory = this.categories.find(({ id }) => id === selectedId)!;
    if (this.cant < this.length - 1) {
      if (selectedId == this.randomElement.category.id) {
        this.showSuccess = true;
        this.showDanger = false;
        this.modalService.open(content);
        this.cant++;
      } else {
        this.showDanger = true;
        this.showSuccess = false;
        this.modalService.open(content);
      }
    } else if ((this.cant == this.length - 1) && (selectedId == this.randomElement.category.id)) {
      this.showSuccess = true;
      this.showDanger = false;
      this.modalService.open(content);
      this.cant++;
      this.gameFinishedTime = this.timeLeft;
      this.gameFinished = true;
      this.pauseTimer();
    }
  }

  close(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

  // Cambio del tamaño de la fuente
  recieveEvent(size: any) {
    this.fontSizeFlag = !this.fontSizeFlag;
    this.fontSizeFlag ? this.increaseFontSize() : this.decreaseFontSize();
  }

  increaseFontSize() {
    this.titleFontSize += 20;
    this.subTitleFontSize += 20;
    this.counterFontSize += 20;
    this.simpleTextFontSize += 20;
  }

  decreaseFontSize() {
    this.titleFontSize -= 20;
    this.subTitleFontSize -= 20;
    this.counterFontSize -= 20;
    this.simpleTextFontSize -= 20;
  }


  onSubmit() { }

}


