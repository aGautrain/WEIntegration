import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { RegisterPage } from '../pages/register/register';
import { LoginPage } from '../pages/login/login';

import { TeamsPage } from '../pages/teams/teams';
import { TeamDetailsModal } from '../pages/teams/details';

import { RankingPage } from '../pages/ranking/ranking';
import { HelpPage } from '../pages/help/help';

import { ProfilePage } from '../pages/profile/profile';
import { OverviewPage } from '../pages/profile/overview/overview';
import { ChallengesPage } from '../pages/profile/challenges/challenges';
import { ChallModal } from '../pages/profile/challenges/challenge-modal';
import { ClaimModal } from '../pages/profile/challenges/claim-modal';
import { JournalPage } from '../pages/profile/journal/journal';

import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HttpModule } from '@angular/http';
import { AccountHandlerService } from '../api/account.service';
import { TeamManagerService } from '../api/manager.service';

import { OrderByDatePipe, FilterTodayPipe } from '../api/pipes';

@NgModule({
  declarations: [
    MyApp,
    RegisterPage,
    LoginPage,
    TeamsPage,
    TeamDetailsModal,
    RankingPage,
    HelpPage,
    ProfilePage,
    OverviewPage,
    ChallengesPage,
    ChallModal,
    ClaimModal,
    JournalPage,
    TabsPage,
    OrderByDatePipe,
    FilterTodayPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RegisterPage,
    LoginPage,
    TeamsPage,
    TeamDetailsModal,
    RankingPage,
    HelpPage,
    ProfilePage,
    OverviewPage,
    ChallengesPage,
    ChallModal,
    ClaimModal,
    JournalPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    TeamManagerService,
    AccountHandlerService
  ]
})
export class AppModule {}
