import { Component, Injectable, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, LoadingController, ToastController, AlertController } from '@ionic/angular';
import * as moment from 'moment';
import { UsersService } from '../services/users.service';
import { Md5 } from 'ts-md5/dist/md5';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.page.html',
  styleUrls: ['./user-modal.page.scss']
})

@Injectable({
  providedIn: 'root'
})

export class UserModalPage implements OnInit {
    dateTruncate: string;

  constructor(
      private modalCrtl: ModalController,
      private service: UsersService,
      private loadingCtrl: LoadingController,
      private toastCtrl: ToastController,
      private alertCtrl: AlertController,
      private routerCtrl: Router

  ) {}

    ngOnInit() {}

    closeModal(){
        this.modalCrtl.dismiss(null, 'closed');
    }

    formUser = new FormGroup({
        id: new FormControl('', [Validators.maxLength(10), Validators.pattern('[0-9]*'), Validators.required]),
        name: new FormControl('', [Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*'), Validators.required]),
        surname: new FormControl('', [Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required]),
        userCreatedDate: new FormControl(''),
        status: new FormControl(''),
        email: new FormControl('', [Validators.minLength(4), Validators.maxLength(30), Validators.email, Validators.required]),
        pass: new FormControl('', [Validators.minLength(4), Validators.maxLength(32), Validators.required]),
        passVerified: new FormControl('', [Validators.maxLength(32), Validators.required]),
        typeSQL: new FormControl('')
      });
      
      get errorControl() {
        return this.formUser.controls;
      }
      
    async createUser(){
        
        this.formUser.controls['pass'].setValue(Md5.hashStr(this.formUser.get('pass').value));
        this.formUser.controls['passVerified'].setValue(Md5.hashStr(this.formUser.get('passVerified').value));
        this.formUser.controls['status'].setValue('0');
        this.formUser.controls['userCreatedDate'].setValue(moment().format('YYYY-MM-DD'));
        this.formUser.controls['typeSQL'].setValue('INSERT');

        const user = JSON.stringify(this.formUser.value);
        console.log(user);

        const loading = await this.loadingCtrl.create({ message: 'Creando usuario...'});
        await loading.present();

        this.service.createUser(user).subscribe(
            async() => {
            loading.dismiss();
            const toast = await this.toastCtrl.create({message: 'Usuario creado', duration: 2000, color: 'dark'})
            await toast.present();
            this.modalCrtl.dismiss();
            localStorage.setItem('idUserLogged', this.formUser.get('id').value);
            this.formUser.reset();

            this.routerCtrl.navigate(['./registro']);

            }, 
            async() => {
            loading.dismiss();
            const alert = await this.alertCtrl.create({message: 'Error en la creacion, el ID de usuario ya Existe', buttons:['OK']})
            await alert.present();
            //this.modalCrtl.dismiss();    
            }
        );
    }

    actualizarUsuario(form: NgForm){
        const user = JSON.stringify(form.value);
        this.service.updateUser(user).subscribe(response => console.log(response));
    }
}

