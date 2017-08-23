import { Component } from '@angular/core';

import { TeamsPage } from '../teams/teams';
import { RankingPage } from '../ranking/ranking';
import { HelpPage } from '../help/help';
import { ProfilePage } from '../profile/profile';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ProfilePage;
  tab2Root = TeamsPage;
  tab3Root = RankingPage;
  tab4Root = HelpPage;

  constructor() {

  }
}
