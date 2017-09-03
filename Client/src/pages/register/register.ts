import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, NavParams } from 'ionic-angular';
import { AccountHandlerService } from '../../api/account.service';


@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
    
    email: string;
    password: string;
    name: string;
    firstName: string;
    team: string;
    thumbnail: string = "http://www.isati.org/integration/imgs/unknown.jpg";

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams,
              private accountHandler: AccountHandlerService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }
    
    // start the registering process
    register(){
        
        // On revérifie que l'utilisateur n'a pas bidouillé le code
        if(this.formNotCompleted()){
            
            let cant = this.alertCtrl.create({
                title: 'Impossible',
                subTitle: 'Tu as oublié de remplir certains champs',
                buttons: ['Ok']
            });
            
            cant.present();
            
        } else {
        
            let loading = this.loadingCtrl.create({
                content: 'Inscription en cours...'
            });

            let success = this.alertCtrl.create({
                title: 'Succès',
                subTitle: 'Bienvenue parmi nous !',
                buttons: ['Merci']
            });
            
            let failure = this.alertCtrl.create({
                title: 'Echec',
                subTitle: 'Le serveur a refusé l\'inscription',
                buttons: ['Dommage']
            });
            
            let server = this.alertCtrl.create({
                title: 'Echec',
                subTitle: 'Impossible de joindre le serveur',
                buttons: ['Dommage']
            });

            loading.present();
            
            // On attend la réponse et on agit en fonction (réussite/échec)
            this.accountHandler.register({
                email: this.email,
                password: this.password,
                name: this.name,
                firstName: this.firstName,
                team: this.team,
                thumbnail: this.thumbnail
            }).then(
                result => {
                    console.log('Account registered successfully !');
                    console.log(result);
                    loading.dismiss();
                    this.navCtrl.pop();
                    success.present();
                },
                error => {
                    console.log('Error occurred during register process');
                    console.log(error);
                    loading.dismiss();
                    if(error.status === 0){
                        server.present();
                    } else {
                        failure.present();
                    }
                    
                }
            );
        }
    }
    
    choseAvatar(event): void {
    
        let loading = this.loadingCtrl.create({
            content: 'Téléchargement en cours..'
        });
        
        loading.present();
        
        let fileList: FileList = event.target.files;
        let file: File = fileList[0];
        
        this.accountHandler.upload(file).then(
            res => { 
                loading.dismiss();
                console.log(res); 
                
                if(res['success']){
                    let success = this.alertCtrl.create({
                        title: 'Succès',
                        subTitle: res['message'],
                        buttons: ['OK']
                    });
                    
                    success.present();
                    this.thumbnail = "http://www.isati.org/integration/imgs/" + res['url'];
                } else {
                    let failure = this.alertCtrl.create({
                        title: 'Echec',
                        subTitle: res['message'],
                        buttons: ['OK']
                    });
                    
                    failure.present();
                }
                
                
            },
            err => { 
                alert(err);
            }
        );
    }
    
    formNotCompleted(): boolean {
        return (!this.email || !this.password || !this.name || !this.firstName || !this.team || !this.thumbnail);
    }

}
