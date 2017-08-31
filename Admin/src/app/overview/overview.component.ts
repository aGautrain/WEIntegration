import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';
import { Claim, Challenge, Player, Team } from '../interfaces';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

    claims: Claim[] = [];
    teams: Team[] = [];
    
  constructor(private router: Router, private api: AdminService) { }

  ngOnInit() {
      this.listClaims();
      this.listTeams();
  }
    
    verify(claim: Claim): void {
        this.api.setEdited(claim);
        this.router.navigate(['/detail']);
    }
    
    advantage(team: Team): void {
        
        let explanation: string = prompt('Raison du nouvel avantage ?');
        
        if(explanation != null && explanation != undefined && explanation != ""){
            let given: number = parseInt(prompt('Nouvel avantage de l\'équipe ' + team.name + ' ?'));
            if(given != null && given != undefined && given > -10000 && given < 10000){
                this.api.advantage({
                    comment: explanation,
                    advantage: given,
                    team: team.name
                }).then(
                    res => {
                        alert('Avantage changé !');
                        this.listTeams();
                    },
                    err => {
                        alert('Une erreur a eu lieu..');
                    }
                );
            } else {
                alert('L\'avantage doit être un nombre situé entre -9999 et 9999 !');
            }
        } else {
            alert('Vous devez justifier le nouvel avantage !');
        }
    }
    
    // function consuming the promise
    listClaims(): void {
        this.api.list().then(
            res => {
                this.claims = res;
                console.log('res', res);
            },
            err => {
                this.claims = [];
                console.log('err', err);
            }
        );
    }
    
    listTeams(): void {
        this.api.teams().then(
            res => {
                this.teams = res;
                console.log('res', res);
            },
            err => {
                this.teams = [];
                console.log('err', err);
            }
        );
    }
    
    waitingClaims(): Claim[] {
        let waiting: Claim[] = [];
        for(let i:number = 0; i < this.claims.length; i++){
            if(this.claims[i].resolution === "waiting"){
                waiting.push(this.claims[i]);
            }
        }
        return waiting;
    }
    
    resolvedClaims(): Claim[] {
        let resolved: Claim[] = [];
        for(let i:number = 0; i < this.claims.length; i++){
            if(this.claims[i].resolution != "waiting"){
                resolved.push(this.claims[i]);
            }
        }
        return resolved;
    }
    
    isRefused(claim: Claim): boolean {
        return claim.resolution === "refused";
    }
    
    isAccepted(claim: Claim): boolean {
        return claim.resolution === "accepted";
    }

}
