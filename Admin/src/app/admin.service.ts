import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Claim, Player, Challenge, Team } from './interfaces';

const server: string = 'http://151.80.140.30/';

@Injectable()
export class AdminService {
    
    claims: Claim[] = [];
    claimEdited: Claim;

  constructor(private http: Http) { }
    
    list(): Promise<Claim[]> {
        console.log('requesting /admin/list');
        
        return this.http.get(server + 'admin/list')
            .map(response => response.json())
            .toPromise();
    }
    
    accept(comment: string): Promise<any> {
        console.log('requesting /admin/accept');
        
        return this.http.get(server + 'admin/accept?id=' + this.claimEdited.claimer.id + '&claim=' + this.claimEdited.id + '&comment=' + comment)
            .map(response => response.json())
            .toPromise();
    }
    
    refuse(comment: string): Promise<any> {
        console.log('requesting /admin/refuse');
        
        return this.http.get(server + 'admin/refuse?id=' + this.claimEdited.claimer.id + '&claim=' + this.claimEdited.id + '&comment=' + comment)
            .map(response => response.json())
            .toPromise();
    }
    
    teams(): Promise<Team[]> {
        console.log('requesting /admin/teams');
        return this.http.get(server + 'admin/teams')
            .map(response => response.json())
            .toPromise();
    }
    
    advantage(content): Promise<any> {
        console.log('posting /admin/advantage');
        let headers = new Headers({'Content-Type':'application/json'});
        let options = new RequestOptions({headers:headers});
        
        return this.http.post(server + 'admin/advantage', content, options)
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