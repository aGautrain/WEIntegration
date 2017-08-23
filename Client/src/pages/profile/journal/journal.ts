import { Component } from '@angular/core';

@Component({
  templateUrl: 'journal.html'
})
export class JournalPage {
    
    today : Array<any>;
    
    lastWeek: Array<any>;
    
    sinceStart: Array<any>;
    
    constructor(){
    
        this.sinceStart = [
            {date:'09/07 15:12', desc:'Demande effectuée pour le challenge Epine?!'},
            {date:'05/07 14:40', desc:'Demande effectuée pour le challenge Pyramide'}
        ];
        
        this.lastWeek = [
            {date:'Lundi 9:35', desc:'Nouveau challenge débloqué'},
            {date:'Samedi 19:08', desc:'Challenge Pyramide validé pour votre équipe'}
        ];
        
        this.today = [
            {date:'13:49', desc:'Challenge Epine?! validé'},
            {date:'11:27', desc:'Demande effectuée pour le challenge Isati\'butt'}
        ];
    }
    
}