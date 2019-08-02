import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'myfilter',
    pure: false
})

export class MyFilterPipe implements PipeTransform {
    transform(items: any[], filter: Item): any {
        if (!items || !filter) {
            return items;
        }
        return items.filter(item => item.indexOf(filter) !== -1);
    }
}

@Pipe({
    name: 'removeWt',
    pure: false
})
export class SplitLastPipe implements PipeTransform {
    transform(value: string): string {
        return value.split("_").join(" ");
    }
}
export class Item {
    item: any;
}