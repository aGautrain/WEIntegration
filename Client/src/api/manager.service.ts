import { Injectable } from '@angular/core';
import { Http }from '@angular/http';
import { TeamInterface, PlayerInterface } from './interfaces.service';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

const server: string = 'http://192.168.0.12:1337/';


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
        return this.http.get(server + 'team/getTeams')
            .map(response => response.json())
            .toPromise();
    }
    
    claim(challengeId: string, playerId: number, comment: string): Promise<any> {
        // TODO : Remove the id= part once the app will be hosted online and not on localhost (cookie problem)
        return this.http.get(server + 'claim/claim?id=' + playerId + '&challenge=' + challengeId + '&comment=' + comment)
            .map(response => response.json())
            .toPromise();
    }
    
    
}