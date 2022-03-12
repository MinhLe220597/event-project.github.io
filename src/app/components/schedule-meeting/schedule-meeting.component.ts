import { Component, OnInit, ViewChild } from '@angular/core';
import { EventSettingsModel, DayService, WeekService, WorkWeekService, MonthService, AgendaService, Schedule, ActionEventArgs, NavigatingEventArgs, ScheduleComponent } from '@syncfusion/ej2-angular-schedule';
import { ScheduleEntity, ScheduleModel } from 'src/app/model/schedule';
import { GetDataServices } from 'src/app/services/api/getData.service';
import { Services } from 'src/app/services/services';

@Component({
  selector: 'schedule-meeting',
  templateUrl: './schedule-meeting.component.html',
  styleUrls: ['./schedule-meeting.component.scss'],
  providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService],
})
export class ScheduleMeetingComponent implements OnInit {
  @ViewChild("scheduleObj")
  public scheduleObj!: ScheduleComponent;
  public selectedDate: Date = new Date();
  public eventSettings: EventSettingsModel = {
    dataSource: [],
    allowAdding: false,
    allowEditing: false,
    allowDeleting: false
  };

  public showWeekNumber: boolean = false;
  constructor(public getDataServices: GetDataServices
    , private services: Services
    ) {

  }

  ngOnInit(): void {
    this.getSourceSchedule();
  }

  getSourceSchedule() {
    var objSearch = {
      "ProfileID": this.services.profileID,
      "WorkDate": this.selectedDate
    };
    this.getDataServices.getDataScheduleByProfileID(objSearch).subscribe((data: ScheduleModel[]) => {
      var source: ScheduleEntity[] = [];
      data.forEach(function (item) {
        var schedule = new ScheduleEntity;
        schedule.Id = item.id;
        schedule.Subject = item.subject;
        schedule.StartTime = item.startTime;
        schedule.EndTime = item.endTime;
        schedule.Location = item.location;
        schedule.Description = item.description;

        source.push(schedule);
      });

      this.scheduleObj.eventSettings.dataSource = source;
    });
  }

  public onNavigating(args: NavigatingEventArgs): void {
    if (args.name == 'navigating') {
      this.selectedDate = args.currentDate as Date;
      this.getSourceSchedule();
    }
  }

}