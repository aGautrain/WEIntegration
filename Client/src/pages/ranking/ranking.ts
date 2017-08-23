import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TeamManagerService } from '../../api/manager.service';
import { TeamInterface } from '../../api/interfaces.service';

@Component({
  selector: 'page-ranking',
  templateUrl: 'ranking.html'
})
export class RankingPage {

    people: Array<any>;
    teams: Array<TeamInterface>;
    category: string = 'people';
    
    constructor(public navCtrl: NavController, private teamManager: TeamManagerService) {
        
        if(this.teamManager.getTeams().toString() == ''){
            this.teamManager.load().subscribe( reached => {
                this.teams = this.teamManager.getTeams();
            });
        } else {
            this.teams = this.teamManager.getTeams();
        }
        
        if(this.teamManager.getPlayers().toString() == ''){
            this.teamManager.load().subscribe( reached => {
                this.people = this.teamManager.getPlayers();
            });
        } else {
            this.people = this.teamManager.getPlayers();
        }
        
     
      
    }

}
