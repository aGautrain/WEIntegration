import {
    Component,
    OnInit
} from '@angular/core';
import {
    Router
} from '@angular/router';
import {
    AdminService
} from '../admin.service';
import {
    Claim,
    Challenge,
    Player,
    Team,
    Note
} from '../interfaces';

import {
    SelectTeamPipe,
    SelectClaimPipe,
    ReverseOrderPipe
} from '../pipes';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

    claims: Claim[] = [];
    teams: Team[] = [];
    players: Player[] = [];
    notes: { [key: string]: Note[] } = {};
    teamChosen: string = "*";
    limitChosen: number = 10;
    isLoading: boolean = true;
    
    isShowingNotes: boolean = false;
    entitySelected: any;

    constructor(private router: Router, private api: AdminService) {}

    ngOnInit() {
        this.fetchData();
    }

    verify(claim: Claim): void {
        this.api.setEdited(claim);
        this.router.navigate(['/detail']);
    }

    advantage(team: Team): void {

        let explanation: string = prompt('Raison du nouvel avantage ?');

        if (explanation != null && explanation != undefined && explanation != "") {
            let given: number = parseInt(prompt('Nouvel avantage de l\'équipe ' + team.name + ' ?'));
            if (given != null && given != undefined && given > -10000 && given < 10000) {
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

    advantagePlayer(player: Player): void {

        let explanation: string = prompt('Raison du nouvel avantage ?');

        if (explanation != null && explanation != undefined && explanation != "") {
            let given: number = parseInt(prompt('Nouvel avantage du joueur ' + player.firstName + ' ?'));
            if (given != null && given != undefined && given > -10000 && given < 10000) {
                this.api.advantagePlayer({
                    comment: explanation,
                    advantage: given,
                    team: player.team,
                    player: player.id
                }).then(
                    res => {
                        alert('Avantage changé !');
                        this.listPlayers();
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
    listClaims(): Promise<boolean> {
        return this.api.list().then(
            res => {
                this.claims = res;
                console.log('res', res);
                return true;
            },
            err => {
                this.claims = [];
                console.log('err', err);
                return false;
            }
        );
    }

    listTeams(): Promise<boolean> {
        return this.api.teams().then(
            res => {
                this.teams = res;
                console.log('res', res);
                return true;
            },
            err => {
                this.teams = [];
                console.log('err', err);
                return false;
            }
        );
    }

    listPlayers(): Promise<boolean> {
        return this.api.players().then(
            res => {
                this.players = res;
                console.log('res', res);
                return true;
            },
            err => {
                this.players = [];
                console.log('err', err);
                return false;
            }

        );
    }
    
    listNotes(): Promise<boolean> {
        return this.api.notes().then(
            res => {
                this.notes = res;
                console.log('res', res);
                return true;
            },
            err => {
                this.notes = {};
                console.log('err', err);
                return false;
            }

        );
    }

    waitingClaims(): Claim[] {
        let waiting: Claim[] = [];
        for (let i: number = 0; i < this.claims.length; i++) {
            if (this.claims[i].resolution === "waiting") {
                waiting.push(this.claims[i]);
            }
        }

        if (this.limitChosen !== -1 && this.limitChosen > 0 && this.limitChosen < waiting.length) {
            return waiting.slice(0, this.limitChosen);
        } else {
            return waiting;
        }

    }

    resolvedClaims(): Claim[] {
        let resolved: Claim[] = [];
        for (let i: number = 0; i < this.claims.length; i++) {
            if (this.claims[i].resolution != "waiting") {
                resolved.push(this.claims[i]);
            }
        }
        if (this.limitChosen !== -1 && this.limitChosen > 0 && this.limitChosen < resolved.length) {
            return resolved.slice(0, this.limitChosen);
        } else {
            return resolved;
        }

    }

    getNbResolvedClaims(): number {
        let resolved: Claim[] = [];
        for (let i: number = 0; i < this.claims.length; i++) {
            if (this.claims[i].resolution != "waiting") {
                resolved.push(this.claims[i]);
            }
        }

        return resolved.length;
    }

    getNbResolvedClaimsShown(): number {
        return this.resolvedClaims().length;
    }

    getNbWaitingClaims(): number {
        let waiting: Claim[] = [];
        for (let i: number = 0; i < this.claims.length; i++) {
            if (this.claims[i].resolution == "waiting") {
                waiting.push(this.claims[i]);
            }
        }

        return waiting.length;
    }

    getNbWaitingClaimsShown(): number {
        return this.waitingClaims().length;
    }

    isRefused(claim: Claim): boolean {
        return claim.resolution === "refused";
    }

    isAccepted(claim: Claim): boolean {
        return claim.resolution === "accepted";
    }

    fetchData(): void {
    
        this.isLoading = true;
        
        let call1: Promise<boolean> = this.listClaims();
        let call2: Promise<boolean> = this.listTeams();
        let call3: Promise<boolean> = this.listPlayers();
        let call4: Promise<boolean> = this.listNotes();
        
        Promise.all([call1,call2,call3,call4]).then(
            res => {
                this.isLoading = false;
            }    
        );
    }
    
    
    /* Action buttons related to players */
    
    actionNotes(entity: Player | Team) {
        this.isShowingNotes = true;
        this.entitySelected = entity;
    }
    
    closingNotes(): void {
        this.isShowingNotes = false;
    }
    
    getEntityDesignation(): string {
        
        if('firstName' in this.entitySelected){
            return 'player ' + this.entitySelected.firstName + " " + this.entitySelected.name;
        } else {
            return 'team ' + this.entitySelected.name;
        }
    }
    
    getEntityNotes(): Note[] {
        
        let key: string = "";
        
        if('firstName' in this.entitySelected){
            key = this.entitySelected.id;
        } else {
            key = this.entitySelected.name;
        }
        
        let values: Note[] = this.notes[key];
        if(values != undefined && values != null){
            return values;
        } else {
            return [];
        }
        
    }
    
    actionSettings(player: Player) {
        alert(JSON.stringify(player));
    }

}
