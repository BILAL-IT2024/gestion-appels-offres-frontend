import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { SidebarComponent } from '../../layout/sidebar/sidebar';
import { DashboardService, DashboardStats } from '../../services/dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  stats?: DashboardStats;

  constructor(
    private dashboardService: DashboardService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.chargerStats();
    }, 100);
  }

  chargerStats(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        console.log('STATS DASHBOARD = ', data);
        this.stats = data;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.log('Erreur dashboard stats', err);
      }
    });
  }
}
