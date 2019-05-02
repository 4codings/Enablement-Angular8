import { Pipe, PipeTransform } from '@angular/core';  
import {Item} from './itemList';
  
@Pipe({  
    name: 'myfilter',  
    pure: false  
})  
  
export class MyFilterPipe1 implements PipeTransform {  
    transform(items: any[], filter: Item): any {  
        if (!items || !filter) {  
            return items;  
        }  
        return items.filter(item => item.indexOf(filter) !== -1);  
    }  
}  


