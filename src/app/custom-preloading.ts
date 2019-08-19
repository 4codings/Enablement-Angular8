import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, timer, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';

export class CustomPreloadingStrategy implements PreloadingStrategy {
    preload(route: Route, load: Function): Observable<any> {
        console.log('Preload Path: ' + route.path + ', delay:' + route.data['delay']);
        const loadRoute = (delay) => delay
            ? timer(1000).pipe(flatMap(_ => load()))
            : load();
        if (route.data && route.data.view) {
            return route.data && route.data.preload
                ? loadRoute(route.data.delay)
                : of(null);
        } else {
            return route.data && route.data.preload
                ? loadRoute(route.data.delay)
                : of(null);
        }

    }
}