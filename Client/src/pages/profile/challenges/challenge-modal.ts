import { Component } from '@angular/core';
import { NavParams, Platform, ViewController, AlertController } from 'ionic-angular';
import { ChallengeInterface, ChallengeState } from '../../../api/interfaces.service';
import { TeamManagerService } from '../../../api/manager.service';
import { AccountHandlerService } from '../../../api/account.service';

@Component({
  templateUrl: 'challenge-modal.html'
})
export class ChallModal {

    challenge: ChallengeInterface;

    constructor(public platform: Platform,
                public params: NavParams,
                public viewCtrl: ViewController,
                public alertCtrl: AlertController,
                private manager: TeamManagerService,
                private account: AccountHandlerService) {
      
        this.challenge = this.params.get('chall');
        
        console.log(this.challenge);
    }
    
    statutIcon() : string {
        
        let status: ChallengeState = this.challenge.status;
        let icon: string = "help";
        
        
        if(status === ChallengeState.obtained){
            icon = "checkmark";
        }
        
        if(status === ChallengeState.available){
            icon = "close";
        }
        
        return icon;
    }
    
    // Noir / Vert / Rouge
    statutColor() : string {
        
        let status: ChallengeState = this.challenge.status;
        let color: string = "waiting";
        
        
        if(status === ChallengeState.obtained){
            color = "success";
        }
        
        if(status === ChallengeState.available){
            color = "failure";
        }
        
        return color;
    }
    
    statutText(): string {
        let status: ChallengeState = this.challenge.status;
        let text: string = "En attente";
        
        
        if(status === ChallengeState.obtained){
            text = "Validé";
        }
        
        if(status === ChallengeState.available){
            text = "Disponible";
        }
        
        return text;
    }
    
    isObtained(): boolean {
        return this.challenge.status === ChallengeState.obtained;
    }
    
    isAvailable(): boolean {
        return this.challenge.status === ChallengeState.available;
    }
    
    claim(): void {
        
        
        
        
        
        if(this.isAvailable()){
            this.manager.claim(this.challenge.name, this.account.getId()).then(
                res => { 
                    let success = this.alertCtrl.create({
                        title: 'Succès',
                        subTitle: 'Bien reçu capitaine !',
                        buttons: ['OK']
                    });
                    success.present();
                    this.dismiss(); 
                },
                err => {
                    let failure = this.alertCtrl.create({
                        title: 'Echec',
                        subTitle: err._body,
                        buttons: ['Compris']
                    });
                    console.log('ERR', err);
                    failure.present();
                }
            );
        }
    }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}