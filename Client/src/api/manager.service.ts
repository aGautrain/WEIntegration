import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { TeamInterface, PlayerInterface } from './interfaces.service';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

const server: string = 'http://151.80.140.30/';


@Injectable()
export class TeamManagerService {
    
    teams: Array<TeamInterface> = [];
    players: Array<PlayerInterface> = [];
    
    constructor(private http: Http){ }
    
    getTeams() {
        return this.teams;
    }
    
    getPlayers() {
        return this.players;
    }
    
    fetchTeamsAndPlayers(): Promise<{teams: TeamInterface[], players: PlayerInterface[]}> {
        console.log('Fetching teams and players');
        return this.loadTeams().then(
            teams => {
                
                this.teams = [];
                this.players = [];
                
                // sorting desc teams
                this.teams = teams.sort(function(a,b){
                    return b.points - a.points;
                });

                // then sorting their members
                for(let i: number = 0; i < this.teams.length; i++){
                    this.players = this.players.concat(this.teams[i].members);
                    this.teams[i].members.sort(function(a,b){
                        return b.points - a.points;
                    });
                }
                
                // then sorting players individually
                this.players.sort(function(a,b){
                    return b.points - a.points;
                });
                
                return {
                    teams: this.teams,
                    players: this.players
                };
            },
            err => {
                console.log('error while fetching teams ', err);
            }
        );
    }
    
    loadTeams(): Promise<TeamInterface[]> {        
        return this.http.get(server + 'teams')
            .map(response => response.json())
            .toPromise();
    }
    
    claim(challengeId: string, playerId: string, givenComment: string, proofUrl: string): Promise<any> {
        
        
        let headers = new Headers({'Content-Type':'application/json'});
        let options = new RequestOptions({headers:headers});
        
        let data = {
            id: playerId,
            challenge: challengeId,
            comment: givenComment,
            proof: proofUrl
        };
        
        return this.http.post(server + 'claim', data, options)
            .map(response => response.json())
            .toPromise();
    }
    
    
}