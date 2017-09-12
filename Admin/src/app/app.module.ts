import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { OverviewComponent } from './overview/overview.component';
import { DetailComponent } from './detail/detail.component';

import { AdminService } from './admin.service';

import {SelectTeamPipe, SelectClaimPipe, ReverseOrderPipe } from './pipes';

const appRoutes: Routes = [
    {
        path: 'detail', component: DetailComponent
    },
    {
        path: '', component: OverviewComponent
    },
    {
        path: '**', redirectTo: '/'
    }
];

@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    DetailComponent,
    SelectTeamPipe,
    SelectClaimPipe,
    ReverseOrderPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AdminService],
  bootstrap: [AppComponent]
})
export class AppModule { }
