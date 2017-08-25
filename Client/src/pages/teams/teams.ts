import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { TeamDetailsModal } from './details';

import { TeamManagerService } from '../../api/manager.service';
import { TeamInterface } from '../../api/interfaces.service';

@Component({
  selector: 'page-teams',
  templateUrl: 'teams.html'
})
export class TeamsPage {

    teams: Array<TeamInterface> = [];
    
  constructor(private teamManager: TeamManagerService,
               public navCtrl: NavController,
               public modalCtrl: ModalController) { }
    
    ionViewWillEnter(): void {
        this.teamManager.fetchTeamsAndPlayers().then(
            res => {
                this.teams = res.teams;
            },
            err => {
                this.teams = [];
            }
        );
    }
    
    openTeamDetails(team){
        let modal = this.modalCtrl.create(TeamDetailsModal, team);
        modal.present();
    }

}
