import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';
import { Claim, Challenge, Player } from '../interfaces';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

    claims: Claim[] = [];
    
  constructor(private router: Router, private api: AdminService) { }

  ngOnInit() {
      this.listClaims();
  }
    
    verify(claim: Claim): void {
        this.api.setEdited(claim);
        this.router.navigate(['/detail']);
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
