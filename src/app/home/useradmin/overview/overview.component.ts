import {Component} from '@angular/core';
import {OverviewService} from './overview.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  providers: [OverviewService],
})
export class OverviewComponent {
  constructor() {
  }
}
