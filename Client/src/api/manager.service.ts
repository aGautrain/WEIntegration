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
    
    constructor(private http: Http){
        
        this.load().subscribe(
            
            teams => {
                // sorting desc teams
                this.teams = (teams.json()).sort(function(a,b){
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
            },
            err => {
                console.log(err);
            }
        );
        
    }
    
    getTeams() {
        return this.teams;
    }
    
    getPlayers() {
        return this.players;
    }
    
    load() {        
        return this.http.get(server + 'team/getTeams');
    }
    
    claim(challengeId: string, playerId: number): Promise<any> {
        // TODO : Remove the id= part once the app will be hosted online and not on localhost (cookie problem)
        return this.http.get(server + 'claim/claim?id=' + playerId + '&challenge=' + challengeId)
            .map(response => response.json())
            .toPromise();
    }
    
    
}