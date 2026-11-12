import { AfterContentInit, Component, ContentChild, ElementRef } from '@angular/core';
import { StatCardHover } from '../../directives/stat-card-hover';
import { StatCardTitle } from '../../directives/stat-card-title';

@Component({
  selector: 'app-dashboard-stat-card',
  standalone: true,
  imports: [StatCardHover],
  styleUrl: './dashboard-stat-card.scss',
  templateUrl: './dashboard-stat-card.html',
})
// export class DashboardStatCard {}
export class DashboardStatCard implements AfterContentInit {
  @ContentChild(StatCardTitle, {read:ElementRef})
  titleELement!:ElementRef<HTMLElement>;

  ngAfterContentInit(): void {
    console.log('Card title:',this.titleELement?.nativeElement?.textContent)
  }
}
