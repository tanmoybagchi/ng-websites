import { Component } from '@angular/core';

@Component({
  selector: 'rr-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent /* implements OnInit */ {
  subreddit = 'all';
}
