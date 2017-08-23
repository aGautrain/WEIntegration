import { Component } from '@angular/core';

import { AccountHandlerService } from '../../../api/account.service';

import { PlayerDetailsInterface } from '../../../api/interfaces.service';

@Component({
  selector:'profile-overview',
  templateUrl: 'overview.html'
})
export class OverviewPage {
    
    player: PlayerDetailsInterface;
    
    constructor(private accountHandler: AccountHandlerService) {
        this.accountHandler.me().then(
            res => {
                console.log(res);
                this.player = res;
                this.player.points = 35;
            },
            err => {
                console.error('error fetching current player');
            }
        );
    }
    
}