import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable, Observer, retry } from 'rxjs';
import { MyValidators } from 'src/app/services/validators.services';
import { Services } from '../../services/services';
import { MesseageServices } from 'src/app/services/messeage.service';
import { Event } from 'src/app/model/event';
import { EventServices } from 'src/app/services/api/event.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ProfileServices } from 'src/app/services/api/profile.service';
import { Category, CategoryMulti } from 'src/app/model/category';
import { CategoryServices } from 'src/app/services/api/category.service';
import { GetDataServices } from 'src/app/services/api/getData.service';
import { UploadFile, ListFile } from 'src/app/model/uploadFile';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { EventDetail } from 'src/app/model/eventDetail';
import { EventDetailServices } from 'src/app/services/api/eventDetail.service';
import { DatePipe } from '@angular/common';
import { Profile, ProfileMulti } from 'src/app/model/profile';
import { OrgStructure, OrgStructureMulti } from 'src/app/model/org-structure';
import { OrgStructureServices } from 'src/app/services/api/orgStructure.service';
import { Notification, NotificationSave } from 'src/app/model/notification';
import { NotificationServices } from 'src/app/services/api/notification.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  /* #region Declare grid */
  dataGridEvent: Event[] = [];
  checked = false;
  loading = false;
  indeterminate = false;
  isShowFilter = false;
  setOfCheckedId = new Set<string | undefined>();
  isShowEdit = false;
  isShowDelete = false;
  isEventGridLoading = false;
  titleFilter = "";
  selectedCatFilter = { value: "", label: "" };
  dateForm?: Date;
  dateTo?: Date;
  /* #endregion */

  //declare form add/edit
  isShowFormAdd = false;
  isSaveLoading = false;
  modalTitle = "";
  idEdit = "";
  isEdit = false;
  validateFormAddOrEdit!: FormGroup;
  submitted = false;
  autoTips: Record<string, Record<string, string>> = {
    'vi': {
      required: 'Không được bỏ trống!'
    },
    en: {
      required: 'Không được bỏ trống!'
    }
  };

  //declare grid detail
  dataGridEventDetail: Event[] = [];
  checkedDetail = false;
  loadingDetail = false;
  indeterminateDetail = false;
  setOfCheckedIdDetail = new Set<string | undefined>();
  isShowEditDetail = false;
  isShowDeleteDetail = false;
  isEventGridLoadingDetail = false;

  validateFormDetail!: FormGroup;
  isShowFormDetail = false;
  isSaveLoadingDetail = false;
  modalTitleDetail = "";
  idEditDetail = "";
  isEditDetail = false;
  isShowDetail = false;
  submittedDetail = false;

  //declare control
  listCategory: CategoryMulti[] = [];
  selectedCategory = { value: "", label: "" };
  imageUrl = '../../../assets/img/image_upload.png';
  fileToUpload: File | null = null;
  fileList: ListFile[] = [];
  listProfile: ProfileMulti[] = [];
  selectedProfile = [];
  listOrg: OrgStructureMulti[] = [];
  selectedOrg = [];

  //declare form noti
  isShowFormNoti = false;
  isNotiLoading = false;
  modalNotiTitle = "";
  dataNotiGrid: Notification[] = [];
  isNotiGridLoading = false;
  checkedNoti = false;
  indeterminateNoti = false;
  setOfCheckedIdNoti = new Set<string | undefined>();
  isShowDeleteNoti = false;

  constructor(private fromBuilder: FormBuilder,
    private eventServices: EventServices,
    private profileServices: ProfileServices,
    private orgStructureServices: OrgStructureServices,
    private eventDetailServices: EventDetailServices,
    private notificationServices: NotificationServices,
    private services: Services,
    private messeage: MesseageServices,
    private modalService: NzModalService,
    private categoryServices: CategoryServices,
    private getDataServices: GetDataServices,
    public datepipe: DatePipe
  ) {
    const { required, minLength, maxLength } = MyValidators;

    this.validateFormAddOrEdit = this.fromBuilder.group({
      title: ['', [required, maxLength(200)]],
      dateStart: [null, [required]],
      dateEnd: [null, [required]],
      categoryName: ['', [required]],
      address: ['', maxLength(400)],
      note: ['', maxLength(400)],
    });

    this.validateFormDetail = this.fromBuilder.group({
      title: ['', [required, maxLength(200)]],
      dateStart: [null, [required]],
      dateEnd: [null, [required]],
      address: ['', maxLength(400)],
      note: ['', maxLength(400)],
    });
  }

  ngOnInit(): void {
    this.loadDataGrid();
    this.loadSourceControl();
  }

  loadDataGrid(): void {
    this.isEventGridLoading = true;
    var objSearch = {
      "title": this.titleFilter,
      "categoryID": this.selectedCatFilter && this.selectedCatFilter.value != '' ? this.selectedCatFilter.value : null,
      "dateStart": this.dateForm ?? null,
      "dateEnd": this.dateTo ?? null,
    };
    this.eventServices.getEventGrid(objSearch).subscribe((data: Event[]) => {
      this.dataGridEvent = data;
      this.isEventGridLoading = false;
    });
  }

  async loadSourceControl() {
    this.listCategory = [];
    await this.categoryServices.getCategorys().subscribe((data: Category[]) => {
      data.forEach((item => {
        var obj = new CategoryMulti();
        obj.value = item.id + "";
        obj.label = item.code + " - " + item.categoryName;
        this.listCategory.push(obj);
      }));
    });
  }

  async loadSourceControlNoti() {
    this.listProfile = [];
    await this.profileServices.getProfiles().subscribe((data: Profile[]) => {
      data.forEach((item => {
        var obj = new ProfileMulti();
        obj.value = item.id + "";
        obj.label = item.code + " - " + item.profileName;
        this.listProfile.push(obj);
      }));
    });

    this.listOrg = [];
    await this.orgStructureServices.getOrgStructures().subscribe((data: OrgStructure[]) => {
      data.forEach((item => {
        var obj = new OrgStructureMulti();
        obj.value = item.id + "";
        obj.label = item.code + " - " + item.orgStructureName;
        this.listOrg.push(obj);
      }));
    });
  }

  //xử lý lưới dữ liệu
  onAllChecked(checked: boolean): void {
    this.dataGridEvent.forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
    this.showBtnToolbar();
  }

  updateCheckedSet(id: string | undefined, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.dataGridEvent;
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  onItemChecked(id: string | undefined, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
    this.showBtnToolbar();
  }

  showBtnToolbar() {
    if (this.setOfCheckedId.size > 0) {
      this.isShowDelete = true;

      if (this.setOfCheckedId.size === 1) {
        this.isShowEdit = true;
        this.setOfCheckedId.forEach(item => {
          this.idEdit = item + '';
        });
      } else {
        this.isShowEdit = false;
        this.idEdit = "";
      }
    } else {
      this.isShowDelete = false;
      this.isShowEdit = false;
      this.idEdit = "";
    }
  }

  filterGrid() {
    this.loadDataGrid();
  }

  closeFilter() {
    this.isShowFilter = false;
  }

  //xử lý form add/edit 
  showAdd(): void {
    this.isShowFormAdd = true;
    this.isEdit = false;
    this.modalTitle = "Tạo mới diễn đàn sự kiện";
    this.loadSourceControl();
    this.imageUrl = '../../../assets/img/image_upload.png';
  }

  showEdit(): void {
    this.isShowFormAdd = true;
    this.isEdit = true;
    this.modalTitle = "Cập nhật diễn đàn sự kiện";
    this.loadSourceControl();
    this.isShowDetail = true;

    if (this.setOfCheckedId.size === 1) {
      this.setOfCheckedId.forEach(item => {
        this.idEdit = item + '';
      });
    }

    if (this.idEdit !== '') {
      this.eventServices.getEvent(this.idEdit).subscribe((data: Event) => {
        if (data) {
          this.validateFormAddOrEdit.controls['title'].setValue(data['title']);
          this.validateFormAddOrEdit.controls['dateStart'].setValue(data['dateStart']);
          this.validateFormAddOrEdit.controls['dateEnd'].setValue(data['dateEnd']);
          this.validateFormAddOrEdit.controls['address'].setValue(data['address']);
          this.validateFormAddOrEdit.controls['note'].setValue(data['note']);
          this.selectedCategory = { value: data['categoryID'] + "", label: "" };
          if (data['image'])
            this.imageUrl = this.services.urlApi + 'images/' + data['image'];
          else
            this.imageUrl = '../../../assets/img/image_upload.png';

          this.isShowFormAdd = true;
        }
      }, (error: any) => {
        this.messeage.messeageError("Có lỗi xảy ra!");
      });

      this.loadDataGridDetail();
    }
  }

  handleSubmit(): void {
    if (this.selectedCategory.value == '')
      this.validateFormAddOrEdit.controls['categoryName'].setValue('');

    if (!this.validateFormAddOrEdit.valid) {
      Object.values(this.validateFormAddOrEdit.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    if (this.validateFormAddOrEdit.value['dateStart'] > this.validateFormAddOrEdit.value['dateEnd']) {
      this.messeage.messeageWarning('Ngày bắt đầu > Ngày kết thúc!');
      return;
    }

    this.isSaveLoading = true;
    var dataSave = this.validateFormAddOrEdit.value;
    dataSave.categoryID = this.selectedCategory.value;
    dataSave['categoryName'] = null;

    //image
    if (this.imageUrl.indexOf('images/') > -1)
      dataSave['image'] = this.imageUrl.split('images/')[1];
    else
      dataSave['image'] = null;

    // xử lý tạo mới
    if (this.idEdit === '') {
      dataSave['userCreate'] = this.services.userlogin;
      this.eventServices.createEvent(dataSave).subscribe((data: Event) => {
        this.isSaveLoading = false;
        if (data) {
          if (data['messWarning'] == 'Succes') {
            this.messeage.messeageSuccess('Thành công!');
            // this.isShowFormAdd = false;
            this.loadDataGrid();
            // this.onReset();
            this.isShowDetail = true;
            this.idEdit = data['id'] + '';
          }
          else {
            this.messeage.messeageWarning(data['messWarning']);
          }
        }
      }, (error: any) => {
        this.isSaveLoading = false;
        this.messeage.messeageError("Có lỗi xảy ra!");
      });
    }
    // xử lý edit
    else {
      dataSave['userUpdate'] = this.services.userlogin;
      dataSave['id'] = this.idEdit;
      this.eventServices.updateEvent(this.idEdit, dataSave).subscribe((data: Event) => {
        this.isSaveLoading = false;
        if (data) {
          if (data['messWarning'] == 'Succes') {
            this.messeage.messeageSuccess('Thành công!');
            this.isShowFormAdd = false;
            this.idEdit = '';
            this.loadDataGrid();
            this.onReset();
            this.onAllChecked(false);
          }
          else {
            this.messeage.messeageWarning(data['messWarning']);
          }
        }
      }, (error: any) => {
        this.isSaveLoading = false;
        this.messeage.messeageError("Có lỗi xảy ra!");
      });
    }
  }

  handleCancel(): void {
    this.onReset();
    this.isShowFormAdd = false;
  }

  handleDelete(): void {
    this.modalService.confirm({
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn xác nhận xoá ' + this.setOfCheckedId.size + ' dòng dữ liệu?',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          let ids: string[] = [];
          this.setOfCheckedId.forEach(item => {
            ids.push(item + '');
          });

          this.eventServices.deleteEvent(ids).subscribe((data: Event) => {
            if (data) {
              this.messeage.messeageSuccess("Thành công!");
              this.loadDataGrid();
              this.onAllChecked(false);
            }
            setTimeout(true ? resolve : reject, 300);
          }, (error: any) => {
            setTimeout(true ? resolve : reject, 300);
            this.messeage.messeageError("Có lỗi xảy ra!");
          });
        }).catch(() => console.log('Oops errors!'))
    });
  }

  onReset() {
    this.submitted = false;
    this.validateFormAddOrEdit.reset();
    this.idEdit = '';
    this.isShowDetail = false;
    this.dataGridEventDetail = [];
  }

  //xử lý control: "combobox, multi select,..."
  compareCategory = (o1: any, o2: any): boolean => (o1 && o2 ? o1.value === o2.value : o1 === o2);

  eventChangeCat(value: { label: string; value: string; age: number }): void {

  }

  onSelectFile(event: any): void {
    if (event.target.files) {
      this.fileToUpload = event.target.files[0];
      this.uploadFileToActivity(event.target.files[0]);
    }
  }

  uploadFileToActivity(fileToUpload: File) {
    this.getDataServices.postImage(fileToUpload).subscribe((data: UploadFile) => {
      if (data)
        this.imageUrl = this.services.urlApi + 'images/' + data['image'];
    }, error => {
      console.log(error);
    });
  }

  //Detail
  onAllCheckedDetail(checked: boolean): void {
    this.dataGridEventDetail.forEach(({ id }) => this.updateCheckedSetDetail(id, checked));
    this.refreshCheckedStatusDetail();
    this.showBtnToolbarDetail();
  }

  updateCheckedSetDetail(id: string | undefined, checked: boolean): void {
    if (checked) {
      this.setOfCheckedIdDetail.add(id);
    } else {
      this.setOfCheckedIdDetail.delete(id);
    }
  }

  refreshCheckedStatusDetail(): void {
    const listOfEnabledData = this.dataGridEvent;
    this.checkedDetail = listOfEnabledData.every(({ id }) => this.setOfCheckedIdDetail.has(id));
    this.indeterminateDetail = listOfEnabledData.some(({ id }) => this.setOfCheckedIdDetail.has(id)) && !this.checkedDetail;
  }

  onItemCheckedDetail(id: string | undefined, checked: boolean): void {
    this.updateCheckedSetDetail(id, checked);
    this.refreshCheckedStatusDetail();
    this.showBtnToolbarDetail();
  }

  showBtnToolbarDetail() {
    if (this.setOfCheckedIdDetail.size > 0) {
      this.isShowDeleteDetail = true;

      if (this.setOfCheckedIdDetail.size === 1) {
        this.isShowEditDetail = true;
        this.setOfCheckedIdDetail.forEach(item => {
          this.idEditDetail = item + '';
        });
      } else {
        this.isShowEditDetail = false;
        this.idEditDetail = "";
      }
    } else {
      this.isShowDeleteDetail = false;
      this.isShowEditDetail = false;
      this.idEditDetail = "";
    }
  }

  loadDataGridDetail(): void {
    this.isEventGridLoadingDetail = true;
    var objSearch = {
      "eventID": this.idEdit
    };
    this.eventDetailServices.getEventDetailGrid(objSearch).subscribe((data: EventDetail[]) => {
      this.dataGridEventDetail = data;
      this.isEventGridLoadingDetail = false;
    });
  }

  showAddDetail(): void {
    this.isShowFormDetail = true;
    this.isEditDetail = false;
    this.modalTitleDetail = "Tạo mới phiên họp";
  }

  showEditDetail(): void {
    this.isShowFormDetail = true;
    this.isEditDetail = true;
    this.modalTitle = "Cập nhật phiên họp";

    if (this.setOfCheckedIdDetail.size === 1) {
      this.setOfCheckedIdDetail.forEach(item => {
        this.idEditDetail = item + '';
      });
    }

    if (this.idEditDetail !== '') {
      this.eventDetailServices.getEventDetail(this.idEditDetail).subscribe((data: EventDetail) => {
        if (data) {
          this.validateFormDetail.controls['title'].setValue(data['title']);
          this.validateFormDetail.controls['dateStart'].setValue(data['dateStart']);
          this.validateFormDetail.controls['dateEnd'].setValue(data['dateEnd']);
          this.validateFormDetail.controls['address'].setValue(data['address']);
          this.validateFormDetail.controls['note'].setValue(data['note']);
          if (data['file'] !== '') {
            var fileNames = data['file']?.split(',');
            fileNames?.forEach(item => {
              var file = new ListFile();
              file.fileName = item;
              file.url = this.services.urlApi + 'file/' + item;
              this.fileList.push(file);
            });
          }

          this.isShowFormDetail = true;
        }
      }, (error: any) => {
        this.messeage.messeageError("Có lỗi xảy ra!");
      });
    }
  }

  handleSubmitDetail(): void {
    if (!this.validateFormDetail.valid) {
      Object.values(this.validateFormDetail.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    if (this.validateFormDetail.value['dateStartDetail'] > this.validateFormDetail.value['dateEndDetail']) {
      this.messeage.messeageWarning('Thời gian bắt đầu > Thời gian kết thúc!');
      return;
    }

    this.isSaveLoadingDetail = true;
    var dataSave = this.validateFormDetail.value;

    //xu ly dateTime
    let _dateStart = this.validateFormDetail.value['dateStart'];
    if (!(_dateStart instanceof Date)) {
      _dateStart = new Date(_dateStart);
    }

    let _dateEnd = this.validateFormDetail.value['dateEnd'];
    if (!(_dateEnd instanceof Date)) {
      _dateEnd = new Date(_dateEnd);
    }

    _dateStart.setHours(_dateStart.getHours() + 7);
    _dateEnd.setHours(_dateEnd.getHours() + 7);
    dataSave['dateStart'] = _dateStart;
    dataSave['dateEnd'] = _dateEnd;

    // file attachment
    if (this.fileList.length > 0) {
      let fileName = this.fileList.map(function (a) { return a.fileName; });
      dataSave['file'] = fileName.join(',');
    }

    if (this.idEdit !== '')
      dataSave['eventID'] = this.idEdit;

    // xử lý tạo mới
    if (this.idEditDetail === '') {
      dataSave['userCreate'] = this.services.userlogin;
      this.eventDetailServices.createEventDetail(dataSave).subscribe((data: Event) => {
        this.isSaveLoadingDetail = false;
        if (data) {
          if (data['messWarning'] == 'Succes') {
            this.messeage.messeageSuccess('Thành công!');
            this.isShowFormDetail = false;
            this.loadDataGridDetail();
            this.onResetDetail();
          }
          else {
            this.messeage.messeageWarning(data['messWarning']);
          }
        }
      }, (error: any) => {
        this.isSaveLoadingDetail = false;
        this.messeage.messeageError("Có lỗi xảy ra!");
      });
    }
    // xử lý edit
    else {
      dataSave['userUpdate'] = this.services.userlogin;
      dataSave['id'] = this.idEditDetail;
      this.eventDetailServices.updateEventDetail(this.idEditDetail, dataSave).subscribe((data: Event) => {
        this.isSaveLoadingDetail = false;
        if (data) {
          if (data['messWarning'] == 'Succes') {
            this.messeage.messeageSuccess('Thành công!');
            this.isShowFormDetail = false;
            this.idEditDetail = '';
            this.loadDataGridDetail();
            this.onResetDetail();
            this.onAllCheckedDetail(false);
          }
          else {
            this.messeage.messeageWarning(data['messWarning']);
          }
        }
      }, (error: any) => {
        this.isSaveLoadingDetail = false;
        this.messeage.messeageError("Có lỗi xảy ra!");
      });
    }
  }

  handleCancelDetail(): void {
    this.onResetDetail();
    this.isShowFormDetail = false;
  }

  handleDeleteDetail(): void {
    this.modalService.confirm({
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn xác nhận xoá ' + this.setOfCheckedIdDetail.size + ' dòng dữ liệu?',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          let ids: string[] = [];
          this.setOfCheckedIdDetail.forEach(item => {
            ids.push(item + '');
          });

          this.eventDetailServices.deleteEventDetail(ids).subscribe((data: Event) => {
            if (data) {
              this.messeage.messeageSuccess("Thành công!");
              this.loadDataGridDetail();
              this.onAllCheckedDetail(false);
            }
            setTimeout(true ? resolve : reject, 300);
          }, (error: any) => {
            setTimeout(true ? resolve : reject, 300);
            this.messeage.messeageError("Có lỗi xảy ra!");
          });
        }).catch(() => console.log('Oops errors!'))
    });
  }

  onResetDetail() {
    this.submittedDetail = false;
    this.validateFormDetail.reset();
    this.idEditDetail = '';
    this.fileList = [];
  }

  onSelectFileDetail(event: any): void {
    if (event.target.files) {
      this.fileToUpload = event.target.files[0];
      this.uploadFileToActivityDetail(event.target.files[0]);
    }
  }

  uploadFileToActivityDetail(fileToUpload: File) {
    this.getDataServices.postFile(fileToUpload).subscribe((data: UploadFile) => {
      if (data) {
        var file = new ListFile();
        file.fileName = data['fileName'];
        file.url = this.services.urlApi + 'file/' + data['fileName'];
        this.fileList.push(file);
      }
    }, error => {
      console.log(error);
    });
  }

  removeFile(event: any): void {
    const index: number = this.fileList.findIndex(x => x.fileName === event);
    if (index !== -1) {
      this.fileList.splice(index, 1);
    }
  }

  //Notification
  showNoti(): void {
    this.isShowFormNoti = true;
    this.isEdit = true;
    this.modalNotiTitle = "Quản lý thông báo";
    this.loadSourceControlNoti();

    if (this.setOfCheckedId.size === 1) {
      this.setOfCheckedId.forEach(item => {
        this.idEdit = item + '';
      });
    }

    this.loadDataGridNoti();
  }

  handleCancelNoti(): void {
    this.onResetNoti();
    this.isShowFormNoti = false;
  }

  onResetNoti() {
    this.validateFormDetail.reset();
  }

  onAllCheckedNoti(checked: boolean): void {
    this.dataNotiGrid.forEach(({ id }) => this.updateCheckedSetNoti(id, checked));
    this.refreshCheckedStatusNoti();
    this.showBtnToolbarNoti();
  }

  updateCheckedSetNoti(id: string | undefined, checked: boolean): void {
    if (checked) {
      this.setOfCheckedIdNoti.add(id);
    } else {
      this.setOfCheckedIdNoti.delete(id);
    }
  }

  refreshCheckedStatusNoti(): void {
    const listOfEnabledData = this.dataNotiGrid;
    this.checkedNoti = listOfEnabledData.every(({ id }) => this.setOfCheckedIdNoti.has(id));
    this.indeterminateNoti = listOfEnabledData.some(({ id }) => this.setOfCheckedIdNoti.has(id)) && !this.checkedNoti;
  }

  showBtnToolbarNoti() {
    if (this.setOfCheckedIdNoti.size > 0) {
      this.isShowDeleteNoti = true;
    } else {
      this.isShowDeleteNoti = false;
    }
  }

  onItemCheckedNoti(id: string | undefined, checked: boolean): void {
    this.updateCheckedSetNoti(id, checked);
    this.refreshCheckedStatusNoti();
    this.showBtnToolbarNoti();
  }

  loadDataGridNoti(): void {
    this.isNotiGridLoading = true;
    var objSearch = {
      "eventID": this.idEdit
    };
    this.notificationServices.getNotificationGrid(objSearch).subscribe((data: Notification[]) => {
      data.forEach(item => {
        item.sendView = item['isSend'] == true ? 'Đã gửi' : 'Chờ xử lý';
        item.statusCSS = item['isSend'] == true ? 'success' : 'waiting';
      });

      this.dataNotiGrid = data;
      this.isNotiGridLoading = false;
    });
  }

  addSend(): void {
    if (this.selectedProfile.length == 0 && this.selectedOrg.length == 0) {
      this.messeage.messeageWarning('Phòng ban hoặc nhân viên không được để trống!');
      return;
    }
    var param: NotificationSave = {};
    param['eventID'] = this.idEdit;
    if (this.selectedProfile.length > 0) {
      let profile = this.selectedProfile.map(function (a: ProfileMulti) { return a.value; });
      param['profileIDs'] = profile.join(',');
    }

    if (this.selectedOrg.length > 0) {
      let org = this.selectedOrg.map(function (a: OrgStructureMulti) { return a.value; });
      param['orgStructureIDs'] = org.join(',');
    }
    param['userCreate'] = this.services.userlogin;

    this.isNotiLoading = true;
    this.notificationServices.createNotification(param).subscribe((data: Notification) => {
      this.isNotiLoading = false;
      if (data) {
        if (data['messWarning'] == 'Succes') {
          this.messeage.messeageSuccess('Thành công!');
          this.loadDataGridNoti();
        }
        else {
          this.messeage.messeageWarning(data['messWarning']);
        }
      }
    }, (error: any) => {
      this.isNotiLoading = false;
      this.messeage.messeageError("Có lỗi xảy ra!");
    });
  }

  addSendAll(): void {
    this.modalService.confirm({
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn xác nhận chọn hết dữ liệu nhân viên?',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          var param: NotificationSave = {};
          param['eventID'] = this.idEdit;
          param['userCreate'] = this.services.userlogin;
          param['isSaveAll'] = true;

          this.isNotiLoading = true;
          this.notificationServices.createNotification(param).subscribe((data: Notification) => {
            this.isNotiLoading = false;
            if (data) {
              if (data['messWarning'] == 'Succes') {
                this.messeage.messeageSuccess('Thành công!');
                this.loadDataGridNoti();
              }
              else {
                this.messeage.messeageWarning(data['messWarning']);
              }
            }

            setTimeout(true ? resolve : reject, 300);
          }, (error: any) => {
            this.isNotiLoading = false;
            this.messeage.messeageError("Có lỗi xảy ra!");
          });

        }).catch(() => console.log('Oops errors!'))
    });
  }

  sendNoti(): void {
    this.isNotiLoading = true;
    var param: NotificationSave = {};
    param['eventID'] = this.idEdit;

    if (this.setOfCheckedIdNoti.size > 0){
      let ids: string[] = [];
      this.setOfCheckedIdNoti.forEach(item => {
        ids.push(item + '');
      });

      param['recordIDs'] = ids.join(',');
    }



    this.notificationServices.sendNoti(param).subscribe((data: Notification) => {
      this.isNotiLoading = false;
      if (data) {
        if (data['messWarning'] == 'Succes') {
          this.messeage.messeageSuccess('Thành công!');
          this.loadDataGridNoti();
        }
        else {
          this.messeage.messeageWarning(data['messWarning']);
        }
      }

    }, (error: any) => {
      this.isNotiLoading = false;
      this.messeage.messeageError("Có lỗi xảy ra!");
    });
  }

  handleDeleteNoti(): void {
    this.modalService.confirm({
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn xác nhận xoá ' + this.setOfCheckedIdNoti.size + ' dòng dữ liệu?',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          let ids: string[] = [];
          this.setOfCheckedIdNoti.forEach(item => {
            ids.push(item + '');
          });

          this.notificationServices.deleteNotification(ids).subscribe((data: Notification) => {
            if (data) {
              this.messeage.messeageSuccess("Thành công!");
              this.loadDataGridNoti();
              this.onAllCheckedNoti(false);
            }
            setTimeout(true ? resolve : reject, 300);
          }, (error: any) => {
            setTimeout(true ? resolve : reject, 300);
            this.messeage.messeageError("Có lỗi xảy ra!");
          });
        }).catch(() => console.log('Oops errors!'))
    });
  }
}
