import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OverviewPage } from './overview/overview';
import { ChallengesPage } from './challenges/challenges';
import { JournalPage } from './journal/journal';

import { TeamManagerService } from '../../api/manager.service';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  constructor(public navCtrl: NavController, private teamManager: TeamManagerService) {

  }
    
  openJournal() {
      this.navCtrl.push(JournalPage);
  }
    
  openOverview() {
      this.navCtrl.push(OverviewPage);
  }
    
  openChallenges() {
      this.navCtrl.push(ChallengesPage);
  }

}
