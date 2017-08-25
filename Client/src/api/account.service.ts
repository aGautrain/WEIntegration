import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { AccountInterface, CredentialsInterface, PlayerDetailsInterface, StoryRecordInterface } from './interfaces.service';

const server: string = 'http://192.168.0.12:1337/';

@Injectable()
export class AccountHandlerService {
    
    id: number;
    
    constructor(private http: Http){
        
    }
    
    register(account: AccountInterface): Promise<any> {
        let headers = new Headers({'Content-Type':'application/json'});
        let options = new RequestOptions({headers:headers});
        
        return this.http.post(server + 'account/registerUser', account, options)
            .map(response => response.json())
            .toPromise();
    }
    
    login(credentials: CredentialsInterface): Promise<any> {
        
        let headers = new Headers({'Content-Type':'application/json'});
        let options = new RequestOptions({headers:headers});
        
        return this.http.post(server + 'player/login', credentials, options)
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
        
        console.log('requesting /player/me');
        
        // TODO : Remove the id= part once the app will be hosted online and not on localhost (cookie problem)
        return this.http.get(server + 'player/me?id=' + this.id)
            .map(response => response.json())
            .toPromise();
    }
    
    myStory(): Promise<StoryRecordInterface[]>{
        console.log('requesting /claim/story');
        
        // TODO : Remove the id= part once the app will be hosted online and not on localhost (cookie problem)
        return this.http.get(server + 'claim/story?id=' + this.id)
            .map(response => response.json())
            .toPromise();
    }

}