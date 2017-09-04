import { Component } from '@angular/core';
import { NavParams, Platform, ViewController, AlertController, LoadingController } from 'ionic-angular';
import { ChallengeInterface } from '../../../api/interfaces.service';
import { TeamManagerService } from '../../../api/manager.service';
import { AccountHandlerService } from '../../../api/account.service';

@Component({
  templateUrl: 'claim-modal.html'
})
export class ClaimModal {

    challenge: ChallengeInterface;
    comment: string = "";
    proof: string = "";

    constructor(public platform: Platform,
                public params: NavParams,
                public viewCtrl: ViewController,
                public alertCtrl: AlertController,
                public loadingCtrl: LoadingController,
                private manager: TeamManagerService,
                private account: AccountHandlerService) {
        
        this.challenge = this.params.get('chall');
        
        console.log(this.challenge);
        
    }
    
    finalize(): void {
        this.manager.claim(this.challenge.name, this.account.getId(), this.comment, this.proof).then(
                res => { 
                    let success = this.alertCtrl.create({
                        title: 'Succès',
                        subTitle: 'Challenge réclamé avec succès',
                        buttons: ['OK']
                    });
                    success.present();
                    
                    this.viewCtrl.dismiss({
                        'submited': true,
                        'success': true
                    });
                },
                err => {
                    
                    let msg = err['_body'];
                    if(msg == ""){
                        msg = "Le serveur n'a pas spécifié la cause de l'erreur..";
                    }
                    
                    let failure = this.alertCtrl.create({
                        title: 'Echec',
                        subTitle: msg,
                        buttons: ['Compris']
                    });
                    console.log('ERR', err);
                    
                    failure.present();
                    
                    this.viewCtrl.dismiss({
                        'submited': true,
                        'success': false
                    });
                }
        );
    }
    
    uploadProof(event): void {
    
        let loading = this.loadingCtrl.create({
            content: 'Téléchargement en cours..'
        });
        
        loading.present();
        
        let fileList: FileList = event.target.files;
        let file: File = fileList[0];
        
        this.account.upload(file).then(
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
                    this.proof = "http://www.isati.org/integration/imgs/" + res['url'];
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

  dismiss() {
    this.viewCtrl.dismiss({
        'submited': false
    });
  }
}