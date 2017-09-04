import { Component } from '@angular/core';
import { NavParams, Platform, ViewController, AlertController, ModalController } from 'ionic-angular';
import { ChallengeInterface, ChallengeState } from '../../../api/interfaces.service';
import { TeamManagerService } from '../../../api/manager.service';
import { AccountHandlerService } from '../../../api/account.service';

import { ClaimModal } from './claim-modal';

@Component({
  templateUrl: 'challenge-modal.html'
})
export class ChallModal {

    challenge: ChallengeInterface;
    submited: boolean = false;

    constructor(public platform: Platform,
                public params: NavParams,
                public viewCtrl: ViewController,
                public modalCtrl: ModalController,
                public alertCtrl: AlertController,
                private manager: TeamManagerService,
                private account: AccountHandlerService) {
        
        this.challenge = this.params.get('chall');
        
        console.log(this.challenge);
        
    }
    
    ionViewWillEnter(): void {
        
        
        this.submited = false;
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
        return this.challenge.status === ChallengeState.available && !this.submited;
    }
    
    isRepeatable(): boolean {
        return this.challenge.repeatable;
    }
    
    getRepetitions() {
        return this.challenge.repeated || 0;
    }
    
    openClaim() {
        let modal = this.modalCtrl.create(ClaimModal, {chall: this.challenge});
        
        modal.onDidDismiss(data => {
           if(data['submited'] && data['success']){
               this.dismiss();
           }
        });
        modal.present();
    }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}