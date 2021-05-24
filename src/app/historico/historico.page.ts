import { Component } from '@angular/core';
import { Form, FormControl, FormGroup, NgForm, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import * as moment from 'moment';
import { Slots, SlotsService } from '../services/slots.service';


@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
})
export class HistoricoPage {
  slots: Slots[];
  dateTruncate: string;

  idUserLogged = localStorage.getItem('idUserLogged');
  slotUserLogged: any;
  public locates: Array<Slots>;

  constructor(
    private service: SlotsService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private routerCtrl: Router
  ) {
    this.locates = new Array<any>(24).fill({ id: '', date: '', slot: '', selected: false, color: '',  name: 'close',email: '' });
    this.fillLocates();
  }

  currentDate(date: string){
    return moment(date).format('YYYY-MM-DD');
  }

  /**
   * Rellena el array previo
   */
  private fillLocates() {
    this.locates = this.locates.map(
      (locate, index) => {
        return {
          ...locate,
          id: "",
          date: "",
          slot: "" + ++index,
          selected: false,
          email: '',
          color: '',
          name: 'close'
        };
      }
    )
  }

  /**
   * 
   *
   */
  private fillBusyLocates(busyLocates: Array<Slots>) {
    this.locates = this.locates.map(locate => {
      return {
        ...locate,
        selected: false,
        color: '',
        name: 'close'
      }
    });

    let filledBusyLocate: any;
    let filledBusyArrayIndex: any;

    busyLocates.map(
      (busyLocate) => {
        filledBusyLocate = this.locates.find(
          (locate, index) => {
            if (locate.slot === busyLocate.slot) {
              filledBusyArrayIndex = index;
              return locate;
            }
          }
        )
        if (filledBusyLocate) {
          filledBusyLocate.selected = true;
          filledBusyLocate.id = busyLocate.id;
          filledBusyLocate.slot = busyLocate.slot;
          filledBusyLocate.email = busyLocate.email;
          filledBusyLocate.name = "person-circle-outline";
          filledBusyLocate.color = "warning";
          if (busyLocate.id == this.idUserLogged) {
            // this.searchNearest(filledBusyArrayIndex, this.locates);
            this.slotUserLogged = parseInt(busyLocate.slot);
            filledBusyLocate.name = "person-add-outline";
            filledBusyLocate.color = "danger";
          }
        }
        return busyLocate;
      }
    );
    this.searchNearest(this.slotUserLogged-1, this.locates);
  }

  private searchNearest(iPerson: number, allLocates: Array<Slots>) {
    let determineColumn = ++iPerson % 3;
    switch (determineColumn) {
      case 0:
        this.paintNearestRightColumn(iPerson, allLocates);
        break;
      case 1:
        this.paintNearestLeftColumn(iPerson, allLocates);
        break;
      case 2:
        this.paintNearestCenterColumn(iPerson, allLocates);
        break;
    }
  }


  private paintNearestLeftColumn(iPerson: number, allLocates: Array<Slots>) {
    return this.getNearestIndex([iPerson+1, iPerson+3, iPerson-3], allLocates);
  }

  private paintNearestCenterColumn(iPerson: number, allLocates: Array<Slots>) {
     return this.getNearestIndex([iPerson+1, iPerson-1, iPerson+3, iPerson-3], allLocates);
  }
  
  private paintNearestRightColumn(iPerson: number, allLocates: Array<Slots>) {
    return this.getNearestIndex([iPerson-1, iPerson+3, iPerson-3], allLocates);
  }

  private getNearestIndex(nearestIndex: Array<number>, allLocates: Array<Slots>){
    return allLocates.map(
        (locate, locateIndex) => {
          nearestIndex
            .map(
              (nearLocate) => {
                // console.log((locateIndex+1),nearLocate, locate.id, locate.slot);
                if (locateIndex+1 === nearLocate && locate.id!='') {
                  // console.log((locateIndex+1),nearLocate, locate.id, locate.slot);
                  locate.name = 'person-circle-outline';
                  locate.color = 'danger';
                }
              }
            );
            return locate;
        }
      );
  }

  async getSlotsforDate(date: string) {

    const loading = await this.loadingCtrl.create({ message: 'Cargando...' });
    await loading.present();
    this.fillLocates();
    //console.log(date)
    console.log('date', moment(date).format('YYYY-MM-DD'));
    this.dateTruncate = moment(date).format('YYYY-MM-DD');

    this.service.getSlotsforDate(this.dateTruncate).subscribe(
      async response => {
        console.log(response);

        this.fillBusyLocates(response);

        console.log(this.locates);

        loading.dismiss();
        //const toast = await this.toastCtrl.create({ message: 'Puestos cargados', duration: 2000, color: 'dark' })
        //await toast.present();
        this.slots = response;
        console.log(response);
      },
      async response => {
        loading.dismiss();
        const alert = await this.alertCtrl.create({ message: 'Error al cargar los puestos', buttons: ['OK'] })
        await alert.present();
        console.log(response);
      }
    );
  }

  async getContactData(id: string){
    console.log(this.locates[id]);
    //this.formSlot.get('slot').value;
    //this.locates[id].email;
    const alert = await this.alertCtrl.create({
      header: 'Contacto estrecho',
      subHeader: 'ID: ' + this.locates[id].id,
      message: 
        'Email: ' + this.locates[id].email
    , buttons: ['OK'] })
        await alert.present();
  }
}