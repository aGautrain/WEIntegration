import { Pipe, PipeTransform } from '@angular/core';


// TO BE APPLIED ON CLAIMS OR PLAYERS OR TEAMS
@Pipe({
    name: 'selectTeam',
    pure: false
})
export class SelectTeamPipe implements PipeTransform {
    transform(items: any[], team: string, category: string): any {
    
        if(category === 'team'){
            if(team !== '*'){
                return items.filter(item => item.name === team);
            } else {
                return items;
            }
        }
        
        if(category === 'player'){
            return items.filter(item => item.team === team);
        }
        
        if(category === 'claim'){
            if(team !== '*'){
                return items.filter(item => item.claimer.team === team);
            } else {
                return items;
            }
        }
    }
}

@Pipe({
    name: 'selectClaim',
    pure: false
})
export class SelectClaimPipe implements PipeTransform {
    transform(items: any[], status: string, limit: number): any {
        
        let claims: any[];
        
        if(status === 'waiting' || status === 'resolved'){
            if(status === 'waiting'){
                claims = items.filter(item => !item.resolved);
            } else {
                claims = items.filter(item => item.resolved);
            }
            
        } else {
            claims = items;
        }
        
        if(limit !== -1 && limit > 0 && limit < items.length){
            return claims.slice(0,limit);
        } else {
            return claims;
        }
        
    }
}


@Pipe({
  name: 'reverseOrder',
  pure: false
})
export class ReverseOrderPipe {
  transform (array) {
    array.sort((a: any, b: any) => {
      if (a.updatedAt < b.updatedAt) {
        return 1;
      } else if (a.updatedAt > b.updatedAt) {
        return -1;
      } else {
        return 0;
      }
    });
    return array;
  }
}