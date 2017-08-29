import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { ChallModal } from './challenge-modal';

import { AccountHandlerService } from '../../../api/account.service';

import { PlayerDetailsInterface, ChallengeInterface, ChallengeState } from '../../../api/interfaces.service';


@Component({
  templateUrl: "challenges.html"
})
export class ChallengesPage {
    
    player: PlayerDetailsInterface;
    challenges: Array<ChallengeInterface> = [];
    map: Map<string, Array<ChallengeInterface>> = new Map<string, Array<ChallengeInterface>>();
    
    constructor(public modalCtrl : ModalController,
                private accountHandler: AccountHandlerService) {
        
    }

    ionViewWillEnter(): void {
        this.loadChallenges();
    }

    loadChallenges(): void {
        this.initMap();
        
        this.accountHandler.me().then(
            res => {
                console.log(res);
                this.player = res;
                this.player.points = 35;
                this.challenges = this.filterChallenges(this.player);
                this.populateMap();
            },
            err => {
                console.error('error fetching current player');
            }
        );
    }

    initMap(): void {
        this.map.set("Vie de l'école", []);
        this.map.set("Social", []);
        this.map.set("En équipe", []);
        this.map.set("Hot", []);
        this.map.set("Beauf", []);
    }
    
    // fusion the different chall arrays contained in the arg "me"
    filterChallenges(me: PlayerDetailsInterface): Array<ChallengeInterface> {
        let challs: Array<ChallengeInterface> = [];
        
        for(let i: number = 0; i < me.challengesTodo.length; i++){
            let chall: ChallengeInterface = me.challengesTodo[i];
            chall.status = ChallengeState.available;
            challs.push(chall);
        }
        
        for(let i: number = 0; i < me.challengesDoing.length; i++){
            let chall: ChallengeInterface = me.challengesDoing[i];
            chall.status = ChallengeState.pending;
            challs.push(chall);
        }
        
        for(let i: number = 0; i < me.challengesDone.length; i++){
            let chall: ChallengeInterface = me.challengesDone[i];
            
            if(!chall.repeatable){
                chall.status = ChallengeState.obtained;
                challs.push(chall);
            }
        }
        
        return challs;
    }
    
    // modify this.map based on this.challenges
    populateMap(): void {
        for(let i: number = 0; i < this.challenges.length; i++){
            let chall: ChallengeInterface = this.challenges[i];
            let category: ChallengeInterface[] = this.map.get(chall.category);
            category.push(chall);
            this.map.set(chall.category, category);
        }
    }

    mapKeys(): Array<string> {
        return Array.from(this.map.keys());
    }
    
    mapChallenges(key: string): Array<ChallengeInterface> {
        return this.map.get(key);
    }

    openChall(chall: ChallengeInterface) {
        let modal = this.modalCtrl.create(ChallModal, {chall: chall});
        
        modal.onDidDismiss(() => {
           // requesting challenges
            this.loadChallenges();
        });
        modal.present();
    }
    
    
    
    // DISPLAY FUNCTIONS
    
    statutIcon(chall: ChallengeInterface) : string {
        
        let status: ChallengeState = chall.status;
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
    statutColor(chall: ChallengeInterface) : string {
        
        let status: ChallengeState = chall.status;
        let color: string = "waiting";
        
        
        if(status === ChallengeState.obtained){
            color = "success";
        }
        
        if(status === ChallengeState.available){
            color = "failure";
        }
        
        return color;
    }

    pendingOrAccepted(challenge: ChallengeInterface): boolean {
        return !(challenge.status === ChallengeState.available);
    }

    getRepetitions(challenge: ChallengeInterface) {
        return challenge.repeated || 0;
    }
    
    
}