import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Claim, Player, Challenge } from './interfaces';

const server: string = 'http://192.168.0.12:1337/';

@Injectable()
export class AdminService {
    
    claims: Claim[] = [];
    claimEdited: Claim;

  constructor(private http: Http) { }
    
    list(): Promise<Claim[]> {
        console.log('requesting /claim/list');
        
        return this.http.get(server + 'claim/list')
            .map(response => response.json())
            .toPromise();
    }
    
    accept(): Promise<any> {
        console.log('requesting /claim/accept');
        
        return this.http.get(server + 'claim/accept?id=' + this.claimEdited.claimer.id + '&claim=' + this.claimEdited.id)
            .map(response => response.json())
            .toPromise();
    }
    
    refuse(): Promise<any> {
        console.log('requesting /claim/refuse');
        
        return this.http.get(server + 'claim/refuse?id=' + this.claimEdited.claimer.id + '&claim=' + this.claimEdited.id)
            .map(response => response.json())
            .toPromise();
    }
    
    setEdited(claim: Claim): void {
        this.claimEdited = claim;
    }
    
    getEdited(): Claim {
        return this.claimEdited;
    }
    


}