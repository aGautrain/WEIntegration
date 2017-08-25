import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TeamManagerService } from '../../api/manager.service';
import { TeamInterface } from '../../api/interfaces.service';

@Component({
  selector: 'page-ranking',
  templateUrl: 'ranking.html'
})
export class RankingPage {

    people: Array<any> = [];
    teams: Array<TeamInterface> = [];
    category: string = 'people';
    
    constructor(public navCtrl: NavController, private teamManager: TeamManagerService) {     
      
    }
    
    ionViewWillEnter(): void {
        this.teamManager.fetchTeamsAndPlayers().then(
            res => {
                this.people = res.players;
                this.teams = res.teams;
            },
            err => { }
        );
    }

}
