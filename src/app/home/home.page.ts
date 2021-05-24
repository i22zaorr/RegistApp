import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Users, UsersService } from '../services/users.service';
import { UserModalPage } from '../user-modal/user-modal.page';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  users: Users[];

  constructor(
    private service: UsersService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private routerCtrl: Router
    ) {}

  async loginUser(id: string, password: string) {
    const loading = await this.loadingCtrl.create({ message: 'Cargando...'});
    await loading.present();
/*
    this.service.getUser(id,password).subscribe(response => {
      console.log(response);
      this.users = response;
      loading.dismiss();
      this.routerCtrl.navigate(['./registro']);
    });
*/
    //Md5.hashStr(password);
    this.service.getUser(id,Md5.hashStr(password)).subscribe(
      async() => {
      loading.dismiss();
      const toast = await this.toastCtrl.create({message: 'Usuario logeado correctamente', duration: 2000, color: 'dark'})
      await toast.present();
      this.routerCtrl.navigate(['./registro']);
      localStorage.setItem('idUserLogged', id);
      }, 
      async() => {
      loading.dismiss();
      const alert = await this.alertCtrl.create({message: 'Error al hacer login, usuario o contraseñas incorrectas', buttons:['OK']})
      await alert.present();
      localStorage.clear();
      }
    );
  }

  crearUsuario(){
    this.modalCtrl.create({
      component: UserModalPage
    })
    .then(modal => {
      modal.present();
      return modal.onDidDismiss()
    }).then(({data,role}) => {
      if (role === 'created') {
        console.log(data);
      }
    });
  }

}

