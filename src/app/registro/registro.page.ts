import { ThrowStmt } from '@angular/compiler';
import { Component } from '@angular/core';
import { Form, FormControl, FormGroup, NgForm, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import * as moment from 'moment';
import { Slots, SlotsService } from '../services/slots.service';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  slots: Slots[];
  dateTruncate: string;
  botonBorrar: boolean;
  botonModificar: boolean;

  idUserLogged = localStorage.getItem('idUserLogged');


  public locates: Array<any>;

  constructor(
    private service: SlotsService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private routerCtrl: Router
  ) {
    this.locates = new Array<any>(24).fill({ id: '', date: '', slot: '', selected: false });
    this.fillLocates();
  }

  ngOnInit() {

  }

  formSlot = new FormGroup({
    id: new FormControl(''),
    date: new FormControl('', [Validators.required]),
    slot: new FormControl('', [Validators.required]),
    typeSQL: new FormControl('')
  });

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
          slot: "" + ++index
        };
      }
    )
  }

  /**
   * 
   *
   */
  private fillBusyLocates(busyLocates: Array<any>) {
    this.locates = this.locates.map(locate => {
        return {
          ...locate,
          selected: false
        }
    });

    this.botonBorrar = false;
    this.botonModificar = false;

    let filledBusyLocate: any;

    busyLocates.map(
      busyLocate => {
        filledBusyLocate = this.locates.find(
          locate => locate.slot === busyLocate.slot
        )
        if (filledBusyLocate) {
          filledBusyLocate.selected = true;
          filledBusyLocate.id = busyLocate.id;
          filledBusyLocate.slot = busyLocate.slot;
          if (busyLocate.id == this.idUserLogged) {
            // this.searchNearest(filledBusyArrayIndex, this.locates);
            this.botonBorrar = true;
            this.botonModificar = true;
            console.log("botónBorrar: "+this.botonBorrar);
            //filledBusyLocate.name = "person-add-outline";
            //filledBusyLocate.color = "danger";
          }
        }
        return busyLocate;
      }
    );
  }

  async getSlotsforDate(date: string) {
    
    const loading = await this.loadingCtrl.create({ message: 'Cargando...' });
    await loading.present();
    //console.log(date)
    console.log('date', moment(date).format('YYYY-MM-DD'));
    this.dateTruncate = moment(date).format('YYYY-MM-DD');

    this.service.getSlotsforDate(this.dateTruncate).subscribe(
      async response => {
        console.log (response);

        this.fillBusyLocates(response);

        loading.dismiss();
        //const toast = await this.toastCtrl.create({ message: 'Puestos cargados', duration: 2000, color: 'dark' })
        //await toast.present();
        this.slots = response;
        console.log(response);
        this.formSlot.controls['slot'].reset();      
      },
      async response => {
        loading.dismiss();
        const alert = await this.alertCtrl.create({ message: 'Error al cargar los puestos', buttons: ['OK'] })
        await alert.present();
        console.log(response);
      }
    );
  }


  async createSlot() {
    console.log("Reserva: " + this.formSlot.get('slot').value);
    this.dateTruncate = moment(this.formSlot.get('date').value).format('YYYY-MM-DD');
    this.formSlot.controls['id'].setValue(this.idUserLogged);
    this.formSlot.controls['date'].setValue(this.dateTruncate);
    this.formSlot.controls['typeSQL'].setValue('INSERT');
    //this.formSlot.controls['slot'].setValue('P21');
    const slot = JSON.stringify(this.formSlot.value);
    console.log(slot);
    const loading = await this.loadingCtrl.create({ message: 'Cargando...' });
    await loading.present();

    this.service.createSlot(slot).subscribe(
      async response => {
        this.getSlotsforDate(this.formSlot.get('date').value);
        loading.dismiss();
        const toast = await this.toastCtrl.create({ message: 'Puesto reservado', duration: 2000, color: 'dark' })
        await toast.present();
        console.log(response);
      },
      async response => {
        loading.dismiss();
        const alert = await this.alertCtrl.create({ message: 'Error al reservar el puesto', buttons: ['OK'] })
        await alert.present();
        console.log(response);
      }
    );

  }

  async removeSlot() {
    console.log("Borra: " + this.formSlot.get('slot').value);
    this.dateTruncate = moment(this.formSlot.get('date').value).format('YYYY-MM-DD');
    this.formSlot.controls['id'].setValue(this.idUserLogged);
    this.formSlot.controls['date'].setValue(this.dateTruncate);
    this.formSlot.controls['typeSQL'].setValue('DELETE');
    const slot = JSON.stringify(this.formSlot.value);
    console.log(slot);
    const loading = await this.loadingCtrl.create({ message: 'Cargando...' });
    await loading.present();

    this.service.removeSlot(slot).subscribe(
      async response => {
        this.getSlotsforDate(this.formSlot.get('date').value);
        loading.dismiss();
        const toast = await this.toastCtrl.create({ message: 'Puesto liberado', duration: 2000, color: 'dark' })
        await toast.present();
        console.log(response);
      },
      async response => {
        loading.dismiss();
        const alert = await this.alertCtrl.create({ message: 'Error al liberar el puesto', buttons: ['OK'] })
        await alert.present();
        console.log(response);
      }
    );
  }

  async updateSlot() {
    console.log("Update: " + this.formSlot.get('slot').value);
    this.dateTruncate = moment(this.formSlot.get('date').value).format('YYYY-MM-DD');
    this.formSlot.controls['id'].setValue(this.idUserLogged);
    this.formSlot.controls['date'].setValue(this.dateTruncate);
    this.formSlot.controls['typeSQL'].setValue('UPDATE');
    const slot = JSON.stringify(this.formSlot.value);
    console.log(slot);
    const loading = await this.loadingCtrl.create({ message: 'Cargando...' });
    //await loading.present();

    this.service.updateSlot(slot).subscribe(
      async response => {
        this.getSlotsforDate(this.formSlot.get('date').value);
        //loading.dismiss();
        const toast = await this.toastCtrl.create({ message: 'Puesto actualizado', duration: 2000, color: 'dark' })
        await toast.present();
        console.log(response);
      },
      async response => {
        loading.dismiss();
        const alert = await this.alertCtrl.create({ message: 'Error al actualizar el puesto', buttons: ['OK'] })
        await alert.present();
        console.log(response);
      }
    );
  }


}
