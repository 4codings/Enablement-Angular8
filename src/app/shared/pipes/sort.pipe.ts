import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sort'
})
export class SortPipe implements PipeTransform {
    transform(array: any, field: string): any[] {
        if (!array) {
            return array;
        }
        array.sort((a: any, b: any) => {
            if ((a[field] || '').toLowerCase() < (b[field] || '').toLowerCase()) {
                return -1;
            } else if ((a[field] || '').toLowerCase() > (b[field] || '').toLowerCase()) {
                return 1;
            } else {
                return 0;
            }
        });
        return array;
    }
}