import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';
import {
    Claim,
    Player,
    Challenge
} from '../interfaces';


@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

    claimExamined: Claim = null;
    comment: string = "";

    constructor(private router: Router, private api: AdminService) {}

    ngOnInit(): void {
        // todo: read parameters
        if (this.api.getEdited() === undefined || this.api.getEdited() === null) {
            this.router.navigate(['/']);
        }
        this.claimExamined = this.api.getEdited();
        this.comment = "";
    }

    deny(): void {
        if (confirm('Êtes-vous sur ? Le refus ne peut être annulé !')) {
            this.api.refuse(this.comment).then(
                res => {
                    console.log('Well refused');
                    this.router.navigate(['/']);
                },
                err => {
                    console.log('Error while refusing');
                    alert(err);
                }
            );
        }

    }

    validate(): void {
        if (confirm('Êtes-vous sûr ? La validation ne peut être annulée !')) {
            this.api.accept(this.comment).then(
                res => {
                    console.log('Well accepted');
                    this.router.navigate(['/']);
                },
                err => {
                    console.log('Error while accepting');
                    alert(err);
                }
            ); 
        }
    }
    
    back(): void {
        this.router.navigate(['/']);
    }
    
    playerLeftComment(): boolean {
        return this.claimExamined.claimerComment != "";
    }
}
