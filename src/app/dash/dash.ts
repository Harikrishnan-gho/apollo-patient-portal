import { FullPageLoader } from '../features/fullpage-loader/fullpage-loader';
import { GHOService } from '../services/ghosrvs';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import {
    ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle, ApexNonAxisChartSeries,
    ChartType, NgApexchartsModule
} from "ng-apexcharts";
import { Router, RouterLink } from "@angular/router";
import { ghoresult, tags } from '../model/ghomodel';
import { catchError } from 'rxjs';
import { MatList, MatListItem } from "@angular/material/list";
import { MatDividerModule } from '@angular/material/divider';

export type ChartOptions = {
    series: ApexAxisChartSeries | ApexNonAxisChartSeries;
    chart: ApexChart; xaxis: ApexXAxis; yaxis?: ApexYAxis; title: ApexTitleSubtitle; stroke?: ApexStroke;
    dataLabels?: ApexDataLabels; tooltip?: ApexTooltip;
};


@Component({
    selector: 'rev-dashboard',
    templateUrl: './dash.html',
    styleUrl: './dash.css',
    imports: [CommonModule, MatTableModule, MatButtonModule, MatPaginatorModule,
        MatFormFieldModule, MatIconModule, MatSelectModule, NgApexchartsModule,
        FormsModule, MatList, MatListItem, MatDividerModule],
})
export class RevDash implements OnInit {
    srv = inject(GHOService);
    userid: string = "";
    pw: string = "";
    tv: tags[] = [];
    res: ghoresult = new ghoresult();

    private service = inject(GHOService);
    fullpageLoader = inject(FullPageLoader);

    router = inject(Router)
   ngOnInit(): void {
  setInterval(() => {
    this.next();
  }, 3000);
}



  images = [
    'dashboard/advertisement.png',
    'dashboard/ad2.jpg',
    'dashboard/ad3.jpg'
  ];

  currentIndex = 0;

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
  }
}


