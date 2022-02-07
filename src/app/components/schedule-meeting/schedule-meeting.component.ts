import { Component, OnInit } from '@angular/core';
import { NzCalendarMode } from 'ng-zorro-antd/calendar';

@Component({
  selector: 'schedule-meeting',
  templateUrl: './schedule-meeting.component.html',
  styleUrls: ['./schedule-meeting.component.scss']
})
export class ScheduleMeetingComponent implements OnInit {
  date = new Date();
  mode: NzCalendarMode = 'month';

  constructor() { }

  ngOnInit(): void {
  }

  panelChange(change: { date: Date; mode: string }): void {
    console.log(change.date, change.mode);
  }
}
