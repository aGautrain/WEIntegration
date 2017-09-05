import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController, NavParams } from 'ionic-angular';
import { AccountHandlerService } from '../../api/account.service';

import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

    email: string;
    password: string;
    
  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams,
              private accountHandler: AccountHandlerService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
    
    // login method
    login(){
        
        if(this.formNotCompleted()){
            
            let cant = this.alertCtrl.create({
                title: 'Impossible',
                subTitle: 'Tu as oublié de remplir certains champs',
                buttons: ['Ok']
            });
            
            cant.present();
            
        } else {
        
            let loading = this.loadingCtrl.create({
                content: 'Connexion en cours...'
            });

            let success = this.alertCtrl.create({
                title: 'Succès',
                subTitle: 'Reprends l\'aventure qui s\'offre à toi !',
                buttons: ['Ok']
            });
            
            

            loading.present();
            
            // On entame la connexion avec une promesse
            this.accountHandler.login({
                email: this.email,
                password: this.password
            }).then(
                result => {
                    console.log('Connected!');
                    console.log(result);
                    this.accountHandler.setId(result.id);
                    loading.dismiss();
                    this.navCtrl.push(TabsPage);
                    success.present();
                },
                error => {
                    console.log('Error occurred during connection process');
                    
                    let msg = error['_body'] || 'Le serveur a refusé la connexion sans préciser l\'erreur.';
                    
                    let failure = this.alertCtrl.create({
                        title: 'Echec',
                        subTitle: msg,
                        buttons: ['Réessayer']
                    });
                    
                    console.log(error);
                    
                    loading.dismiss();
                    failure.present();
                    
                }
            );
        }
    }
    
    goRegister(): void {
        this.navCtrl.push(RegisterPage);
    }
    
    
    formNotCompleted(): boolean {
        return (!this.email || !this.password);
    }

}
