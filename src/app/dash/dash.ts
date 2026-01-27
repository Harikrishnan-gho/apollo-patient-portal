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

    reviewerId = "";
    dataSource = new MatTableDataSource<any>();
    doctorInfo: any = [];
    statisticsData: any = {};
    performanceData: any = {};
    newCase: any[] = [];
    revenueGraphDetails: any[] = [];
    casesGraphDetails: any[] = [];
    dateRanges: any[] = [];
    selectedRange: string = '';
    percentage: number = 0;
    avgTime: number = 0;
    totalEarnings: number = 0;

    caselist() {
        this.router.navigate(["/cases"]);
    }
    selectedChartType: ChartType = "bar";


    public chartOptions: ChartOptions = {
        series: [
            {
                name: "My-series",
                data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
            }
        ],
        chart: {
            type: "bar",
            height: 350
        },
        title: { text: "My First Angular Chart" },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
        }
    };

    public areaChartOptions: ChartOptions = {
        series: [
            {
                name: "Revenue",
                data: [2000, 3000, 4000, 5000, 6000, 7000, 8000]
            }
        ],
        chart: { type: "area", height: 350 },
        dataLabels: { enabled: false },
        stroke: { curve: "smooth" },
        title: { text: "Performance Trend Over Time" },

        xaxis: {
            type: "category",
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]
        },
        yaxis: {
            min: 2000,
            max: 8000,
            tickAmount: 7,
            labels: {
                formatter: (val: number) => `$${val}`
            },
            title: { text: "Revenue" }
        },
        tooltip: {
            y: {
                formatter: (val: number) => `$${val}`
            }
        }
    };


    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild('chart', { static: false }) chart!: ChartComponent;
    constructor() { }

    ngOnInit(): void {
        this.reviewerId = this.service.getsession("id");
        if (this.reviewerId) {
            this.getDoctorDetails()
        }
        this.getDoctorPerformanceStatus()
        this.getDateRanges();
        this.getNewAssignedCases()
    }

    onRowClick(row: any) {
        this.router.navigate([`/dashboard/case/${row?.SaltKey}`])
    }


    updateRevenueChart(data: any[]) {
        const monthNames = [
            "", "Jan", "Feb", "Mar", "Apr", "May",
            "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        const categories = data.map(item => `${monthNames[item.Month]} ${item.Year}`);
        const seriesData = data.map(item => item.TotalAmount);
        this.areaChartOptions.series = [
            {
                name: "Revenue",
                data: seriesData
            }
        ];

        this.areaChartOptions.xaxis = {
            categories: categories
        };

    }

    getDateRanges() {
        this.tv = [];
        this.tv.push({ T: 'dk1', V: 'DATERANGE' });
        this.tv.push({ T: 'c10', V: '87' });
        this.srv.getdata('lists', this.tv).subscribe((r) => {
            this.res = r;
            if (r.Status === 1) {
                this.dateRanges = r.Data[0];
                if (this.dateRanges.length > 0) {
                    this.selectedRange = this.dateRanges[0].ID;
                    this.getDoctorStatistics(this.selectedRange);
                    this.getRevenueGraphDetails(this.selectedRange)
                    this.getCasesGraphDetails(this.selectedRange)
                }
            } else {
                this.srv.openDialog('Error', 'w', this.res.Info);
            }
        });
    }

    onRangeChange(id: string) {
        this.getDoctorStatistics(id);
        this.getRevenueGraphDetails(id)
        this.getCasesGraphDetails(id)
    }

    getDoctorDetails() {
        this.tv = [];
        this.tv.push({ T: "dk1", V: this.reviewerId });
        this.tv.push({ T: "c10", V: "7" });
        this.srv.getdata("reviewer", this.tv).pipe(
            catchError((err) => {
                this.srv.openDialog("Doctor Info", "e", "error while loading doctor info");
                throw err;
            })
        ).subscribe((r) => {
            if (r.Status === 1) {
                this.doctorInfo = r.Data[0][0];
            }
        });
    }

    getDoctorStatistics(id: string) {
        this.tv = [];
        this.tv.push({ T: "dk1", V: this.reviewerId });
        this.tv.push({ T: 'dk2', V: id });
        this.tv.push({ T: 'c10', V: '9' });

        this.srv.getdata('reviewer', this.tv).subscribe((r) => {
            this.res = r;
            if (r.Status === 1) {
                this.statisticsData = r.Data[0][0];
            } else {
                this.srv.openDialog('Error', 'w', this.res.Info);
            }
        });
    }

    getDoctorPerformanceStatus() {
        this.tv = [];
        this.tv.push({ T: "dk1", V: this.reviewerId });
        this.tv.push({ T: 'c10', V: '1' });
        this.srv.getdata('reviewercase', this.tv).subscribe((r) => {
            this.res = r;
            if (r.Status === 1) {
                this.performanceData = r.Data[2][0];
            } else {
                this.srv.openDialog('Error', 'w', this.res.Info);
            }
        });
    }

    getNewAssignedCases() {
        this.tv = [];
        this.tv.push({ T: "dk1", V: this.reviewerId });
        this.tv.push({ T: 'c10', V: '6' });
        this.srv.getdata('reviewercase', this.tv).subscribe((r) => {
            this.res = r;
            if (r.Status === 1) {
                this.newCase = r.Data[0];
            } else {
                this.srv.openDialog('Error', 'w', this.res.Info);
            }
        });
    }

    graphHeading = "Revenue Trend";
    graphSubHeading = "";

    updateHeadings(range: string) {
        this.graphHeading = "Revenue Trend";
        const map: any = {
            "7": "Revenue earned in the last 7 days",
            "14": "Revenue earned in the last 14 days",
            "30": "Revenue earned in the last 30 days",
            "60": "Revenue earned in the last 60 days",
            "90": "Revenue earned in the last 3 months",
            "180": "Revenue earned in the last 6 months",
            "365": "Revenue earned in the last 12 months"
        };
        this.graphSubHeading = map[range] || "Revenue Overview";
    }

    getRevenueGraphDetails(selectedDateRange: string) {
        this.updateHeadings(selectedDateRange);
        this.tv = [];
        this.tv.push({ T: "dk1", V: this.reviewerId });
        this.tv.push({ T: "c1", V: selectedDateRange });
        this.tv.push({ T: 'c10', V: '10' });
        this.srv.getdata('accountpayable', this.tv).subscribe((r) => {
            this.res = r;
            if (r.Status === 1) {
                this.revenueGraphDetails = r.Data[0];
                this.updateRevenueChart(this.revenueGraphDetails);
            } else {
                this.srv.openDialog('Error', 'w', this.res.Info);
            }
        });
    }

    casesHeading: string = "Cases Overview";
    casesSubHeading: string = "";
    updateCasesHeadings(range: string) {
        this.casesHeading = "Cases Overview";
        const map: any = {
            "7": "Cases received in the last 7 days",
            "14": "Cases received in the last 14 days",
            "30": "Cases received in the last 30 days",
            "60": "Cases received in the last 60 days",
            "90day": "Cases received in the last 3 months",
            "180": "Revenue earned in the last 6 months",
            "365": "Cases received in the last 12 months"
        };

        this.casesSubHeading = map[range] || "Cases summary";
    }


    getCasesGraphDetails(selectedDateRange: string) {
        this.updateCasesHeadings(selectedDateRange);
        this.updateHeadings(selectedDateRange);
        this.tv = [];
        this.tv.push({ T: "dk1", V: this.reviewerId });
        this.tv.push({ T: "c1", V: selectedDateRange });
        this.tv.push({ T: 'c10', V: '19' });
        this.srv.getdata('reviewercase', this.tv).subscribe((r) => {
            this.res = r;
            if (r.Status === 1) {
                this.casesGraphDetails = r.Data[0];
                this.updateCasesChart(this.casesGraphDetails);
            } else {
                this.srv.openDialog('Error', 'w', this.res.Info);
            }
        });
    }

    updateCasesChart(data: any[]) {
        const monthNames = [
            "", "Jan", "Feb", "Mar", "Apr", "May",
            "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        const categories = data.map(item => `${monthNames[item.Month]} ${item.Year}`);
        const seriesData = data.map(item => item.TotalCases);
        this.chartOptions.series = [
            {
                name: "Cases",
                data: seriesData
            }
        ];

        this.chartOptions.xaxis = {
            categories: categories
        };

    }


    naviagteToCase() {
        this.router.navigate([`/cases`]);
    }

    naviagteToPayments() {
        this.router.navigate([`/pay`]);
    }




}
