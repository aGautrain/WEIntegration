import { Component } from '@angular/core';
import { NavParams, Platform, ViewController } from 'ionic-angular';
import { TeamInterface } from '../../api/interfaces.service';

@Component({
  templateUrl: 'details.html',
  selector: 'team-details'
})
export class TeamDetailsModal {
    team: TeamInterface;

    constructor(public platform: Platform,
                public params: NavParams,
                public viewCtrl: ViewController) {
      
      
        this.team = this.params.get('teamDetails');

    }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}