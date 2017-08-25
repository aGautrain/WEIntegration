import { Component, OnInit } from '@angular/core';
import { AccountHandlerService } from '../../../api/account.service';
import { StoryRecordInterface } from '../../../api/interfaces.service';

@Component({
  templateUrl: 'journal.html'
})
export class JournalPage implements OnInit {
    
    today : Array<StoryRecordInterface> = [];
    
    lastWeek: Array<StoryRecordInterface> = [];
    
    sinceStart: Array<StoryRecordInterface> = [];
    
    constructor(private accountApi: AccountHandlerService){ }
    
    ngOnInit(): void {
        this.accountApi.myStory().then(
            res => {
                console.log('Fetched story records ', res);
                this.today = res;
            },
            err => {
                console.log('Error while fetching story records ', err);
                this.today = [];
            }
        );
    }
    
}