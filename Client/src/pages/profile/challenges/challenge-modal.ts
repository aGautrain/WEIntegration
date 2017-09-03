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
    submited: boolean = false;

    constructor(public platform: Platform,
                public params: NavParams,
                public viewCtrl: ViewController,
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
    
    claim(): void {
          
        if(this.isAvailable()){
            this.submited = true;
            
            var prompt = this.alertCtrl.create({
                title: 'Commentaire',
                message: 'Laisse nous un commentaire si tu le souhaites !',
                inputs: [
                    {
                        name: 'comment',
                        placeholder: ''
                    }
                ],
                buttons: [
                    {
                        text: 'Pas besoin',
                        role: 'cancel',
                        handler: data => {
                            this.finalize("");
                        }
                    },
                    {
                        text: 'Envoyer',
                        handler: data => {
                            this.finalize(data.comment);
                        }
                    }
                ]
            });
            
            prompt.present();
            
        }
    }
    
    finalize(comment: string): void {
        this.manager.claim(this.challenge.name, this.account.getId(), comment).then(
                res => { 
                    let success = this.alertCtrl.create({
                        title: 'Succès',
                        subTitle: 'Challenge réclamé avec succès',
                        buttons: ['OK']
                    });
                    success.present();
                    
                    this.dismiss(); 
                    this.submited = false;
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
                    this.submited = false;
                }
        );
    }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}