import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface Claim {
    claimer: string;
    challenge: ChallengeInterface | any;
    resolved: boolean;
    claimerComment: string;
    solverComment: string;
    claimerProof: string;
    id: string;
}

interface ChallengeInterface {
    name: string;
    desc: string;
    collective: boolean;
    category: string;
    thumbnail?: string;
    reward: number;
    createdAt?: Date;
    updatedAt?: Date;
    
    status?: ChallengeState;
}

enum ChallengeState {
    pending,
    obtained,
    available
}

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
    
  claimExamined: Claim;

  constructor(private router: Router) { }

  ngOnInit() {
      
      this.claimExamined = {
          claimer: "Antoine",
          challenge: {
              name: "FACIIIILE",
              desc: "Un challenge bidon pour tester l'affichage",
              collective: false,
              category: "Hot",
              reward: 10,
              status: ChallengeState.pending
          },
          resolved: false,
          claimerComment: "Ce serait sympa d'accepter",
          solverComment: "",
          claimerProof: "Aucune.",
          id: "x79vaez1"
      };
  }
    
    deny(): void {
        if(confirm('Êtes-vous sur ? Le refus ne peut être annulé !')){
            this.router.navigate(['/']);
        }
        
    }
    
    validate(): void {
        if(confirm('Êtes-vous sûr ? La validation ne peut être annulée !')){
            this.router.navigate(['/']);
        }
    }
}
