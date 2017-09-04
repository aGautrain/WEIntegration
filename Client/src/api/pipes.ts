import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "dateDesc"
})
export class OrderByDatePipe implements PipeTransform {
  transform(array: Array<any>, args: string): Array<any> {
    array.sort((a: any, b: any) => {
      if (a['date'] < b['date']) {
        return 1;
      } else if (a['date'] > b['date']) {
        return -1;
      } else {
        return 0;
      }
    });
    return array;
  }
}

@Pipe({
    name: "filterDate"
})
export class FilterTodayPipe implements PipeTransform {
    transform(array: Array<any>, args: string): Array<any> {
        
        if(args === 'today'){
            
            let yesterday: Date = new Date(Date.now() - 86400000);
            let yesterdayTimestamp: number = yesterday.valueOf();

            return array.filter(record => (record.date.valueOf() >= yesterdayTimestamp));
            
        } else if(args === 'week'){
            
            let yesterday: Date = new Date(Date.now() - 86400000);
            let yesterdayTimestamp: number = yesterday.valueOf();
            
            let lastWeek: Date = new Date(Date.now() - (86400000 * 7));
            let lastWeekTimestamp: number = lastWeek.valueOf();

            return array.filter(record => ((record.date.valueOf() < yesterdayTimestamp) && (record.date.valueOf() >= lastWeekTimestamp)));
            
        } else if(args === 'before'){
            let lastWeek: Date = new Date(Date.now() - (86400000 * 7));
            let lastWeekTimestamp: number = lastWeek.valueOf();

            return array.filter(record => (record.date.valueOf() < lastWeekTimestamp));
            
        } else {
            
            return array;
        }
        
        
        
    }
    
}