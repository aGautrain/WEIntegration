import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { AccountInterface, CredentialsInterface, PlayerDetailsInterface, StoryRecordInterface } from './interfaces.service';

const server: string = 'http://151.80.140.30/';

@Injectable()
export class AccountHandlerService {
    
    id: number;
    
    constructor(private http: Http){
        
    }
    
    register(account: AccountInterface): Promise<any> {
        let headers = new Headers({'Content-Type':'application/json'});
        let options = new RequestOptions({headers:headers});
        
        return this.http.post(server + 'register', account, options)
            .map(response => response.json())
            .toPromise();
    }
    
    login(credentials: CredentialsInterface): Promise<any> {
        
        let headers = new Headers({'Content-Type':'application/json'});
        let options = new RequestOptions({headers:headers});
        
        return this.http.post(server + 'login', credentials, options)
            .map(response => response.json())
            .toPromise();
        
    }
    
    getId(): number {
        return this.id;
    }
    
    setId(id: number): void {
        console.log('current player id is now : ' + id);
        this.id = id;
    }
    
    me(): Promise<PlayerDetailsInterface>{
        
        console.log('requesting /me');
        
        // TODO : Remove the id= part once the app will be hosted online and not on localhost (cookie problem)
        return this.http.get(server + 'me?id=' + this.id)
            .map(response => response.json())
            .toPromise();
    }
    
    myStory(): Promise<StoryRecordInterface[]>{
        console.log('requesting /journal');
        
        // TODO : Remove the id= part once the app will be hosted online and not on localhost (cookie problem)
        return this.http.get(server + 'journal?id=' + this.id)
            .map(response => response.json())
            .toPromise();
    }

}