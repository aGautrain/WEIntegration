import { Component, OnInit } from '@angular/core';
import { AccountHandlerService } from '../../../api/account.service';
import { StoryRecordInterface } from '../../../api/interfaces.service';
import { OrderByDatePipe, FilterTodayPipe } from '../../../api/pipes';

@Component({
  templateUrl: 'journal.html'
})
export class JournalPage implements OnInit {
    
    records: Array<StoryRecordInterface> = [];
    
    constructor(private accountApi: AccountHandlerService){ }
    
    ngOnInit(): void {
        this.accountApi.myStory().then(
            res => {
                console.log('Fetched story records ', res);
                res.map(element => { element.date = new Date(element.date); } );
                this.records = res;
                
            },
            err => {
                console.log('Error while fetching story records ', err);
                this.records = [];
            }
        );
    }
    
}