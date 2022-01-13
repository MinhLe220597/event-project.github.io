import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { MyValidators } from 'src/app/services/validators.services';
import { Services } from '../../services/services';
import { MesseageServices } from 'src/app/services/messeage.service';
import { ProfileServices } from 'src/app/services/api/profile.service';
import { Profile } from 'src/app/model/profile';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { OrgStructureServices } from 'src/app/services/api/orgStructure.service';
import { OrgStructure, OrgStructureMulti } from 'src/app/model/org-structure';
import { NzModalService } from 'ng-zorro-antd/modal';
import { GetDataServices } from 'src/app/services/api/getData.service';
import { UploadFile } from 'src/app/model/uploadFile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  //declare grid
  dataGridProfile: Profile[] = [];
  checked = false;
  loading = false;
  indeterminate = false;
  isShowFilter = false;
  setOfCheckedId = new Set<string | undefined>();
  isShowEdit = false;
  isShowDelete = false;
  isProfileGridLoading = false;
  codeFilter = "";
  profileNameFilter = "";
  birthdayForm?: Date;
  birthdayTo?: Date;
  selectedOrgFilter = { value: "", label: "" };
  jobTitleFilter = "";
  positionFilter = "";

  //declare form add/edit
  sexValue = '0';
  isCheckSex = false;
  isShowFormAdd = false;
  isSaveLoading = false;
  modalTitle = "";
  idEdit = "";
  validateFormAddOrEdit!: FormGroup;
  submitted = false;
  avatarUrl = '../../../assets/img/tim_80x80.png';
  autoTips: Record<string, Record<string, string>> = {
    'vi': {
      required: 'Không được bỏ trống!'
    },
    en: {
      required: 'Không được bỏ trống!'
    }
  };
  fileToUpload: File | null = null;

  //declare control
  listOrg: OrgStructureMulti[] = [];
  selectedOrg = { value: "", label: "" };

  constructor(private fromBuilder: FormBuilder,
    private profileServices: ProfileServices,
    private getDataServices: GetDataServices,
    private services: Services,
    private messeage: MesseageServices,
    private orgStructureServices: OrgStructureServices,
    private modalService: NzModalService
  ) {
    const { required, maxLength, minLength } = MyValidators;

    this.validateFormAddOrEdit = this.fromBuilder.group({
      code: ['', [required, maxLength(30), minLength(3)]],
      profileName: ['', [required, maxLength(100)]],
      orgStructureName: ['', [required]],
      birthday: [null, [required]],
      cardID: ['', [required]],
      email: ['', [required]],
      jobTitle: ['', [required]],
      position: ['', [required]],
      sex: [''],
      note: ['', maxLength(400)],
      phoneNumber: [''],
      address: [''],
    });
  }

  ngOnInit(): void {
    this.loadDataGrid();
    this.loadSourceControl();
  }

  loadDataGrid(): void {
    this.isProfileGridLoading = true;
    var objSearch = {
      "Code": this.codeFilter,
      "ProfileName": this.profileNameFilter,
      "BirthdayFrom": this.birthdayForm ?? null,
      "BirthdayTo": this.birthdayTo ?? null,
      "OrgStructureID": this.selectedOrgFilter && this.selectedOrgFilter.value != '' ? this.selectedOrgFilter.value : null,
      "JobTitle": this.jobTitleFilter,
      "Position": this.positionFilter,
    };
    this.profileServices.getProfileGrid(objSearch).subscribe((data: Profile[]) => {
      data.forEach(function (item) {
        if (item['sex'] == false)
          item['sexView'] = "Nam";
        else
          item['sexView'] = "Nữ";
      });

      this.dataGridProfile = data;
      this.isProfileGridLoading = false;
    });
  }

  async loadSourceControl() {
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
    this.dataGridProfile.forEach(({ id }) => this.updateCheckedSet(id, checked));
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
    const listOfEnabledData = this.dataGridProfile;
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
    this.modalTitle = "Tạo mới nhân viên";
    this.loadSourceControl();
    this.sexValue = '0';
    this.avatarUrl = '../../../assets/img/new_logo.png';
  }

  showEdit(): void {
    this.isShowFormAdd = true;
    this.modalTitle = "Cập nhật thông tin nhân viên";
    this.loadSourceControl();

    if (this.setOfCheckedId.size === 1) {
      this.setOfCheckedId.forEach(item => {
        this.idEdit = item + '';
      });
    } 

    if (this.idEdit !== '') {
      this.profileServices.getProfile(this.idEdit).subscribe((data: Profile) => {
        if (data) {
          this.validateFormAddOrEdit.controls['code'].setValue(data['code']);
          this.validateFormAddOrEdit.controls['profileName'].setValue(data['profileName']);
          this.validateFormAddOrEdit.controls['birthday'].setValue(data['birthday']);
          this.validateFormAddOrEdit.controls['cardID'].setValue(data['cardID']);
          this.validateFormAddOrEdit.controls['email'].setValue(data['email']);
          // this.validateFormAddOrEdit.controls['phoneNumber'].setValue(data['phoneNumber']);
          this.validateFormAddOrEdit.controls['address'].setValue(data['address']);
          this.validateFormAddOrEdit.controls['jobTitle'].setValue(data['jobTitle']);
          this.validateFormAddOrEdit.controls['position'].setValue(data['position']);
          this.validateFormAddOrEdit.controls['note'].setValue(data['note']);
          this.selectedOrg = { value: data['orgStructureID'] + "", label: data['orgStructureName'] + "" };
          this.sexValue = data['sex'] == false ? '0' : '1';
          this.isCheckSex = data['sex'] ?? false;
          if (data['image'])
            this.avatarUrl = this.services.urlApi + 'images/' +  data['image'];
          else
          this.avatarUrl = '../../../assets/img/new_logo.png';

          this.isShowFormAdd = true;
        }
      }, (error: any) => {
        this.messeage.messeageError("Có lỗi xảy ra!");
      });
    }
  }

  handleSubmit(): void {
    if (this.selectedOrg.value == '')
      this.validateFormAddOrEdit.controls['orgStructureName'].setValue('');

    if (!this.validateFormAddOrEdit.valid) {
      Object.values(this.validateFormAddOrEdit.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    this.isSaveLoading = true;
    var dataSave = this.validateFormAddOrEdit.value;
    dataSave.orgStructureID = this.selectedOrg.value;
    dataSave['orgStructureName'] = null;
    dataSave['sex'] = this.sexValue == '0' ? false : true;
    //image
    if (this.avatarUrl.indexOf('images/') > -1)
      dataSave['image'] = this.avatarUrl.split('images/')[1];
    else
    dataSave['image'] = null;
    
    // xử lý tạo mới
    if (this.idEdit === '') {
      dataSave['userCreate'] = this.services.userlogin;
      this.profileServices.createProfile(dataSave).subscribe((data: Profile) => {
        this.isSaveLoading = false;
        if (data) {
          if (data['messWarning'] == 'Succes') {
            this.messeage.messeageSuccess('Thành công!');
            this.isShowFormAdd = false;
            this.loadDataGrid();
            this.onReset();
          }
          else {
            this.messeage.messeageWarning(data['messWarning']);
          }
        }
      }, (error: any) => {
        this.messeage.messeageError("Có lỗi xảy ra!");
        this.isSaveLoading = false;
      });
    }
    // xử lý edit
    else {
      dataSave['userUpdate'] = this.services.userlogin;
      dataSave['id'] = this.idEdit;
      this.profileServices.updateProfile(this.idEdit, dataSave).subscribe((data: Profile) => {
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
        this.messeage.messeageError("Có lỗi xảy ra!");
        this.isSaveLoading = false;
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

          this.profileServices.deleteProfile(ids).subscribe((data: Profile) => {
            if (data) {
              this.messeage.messeageSuccess("Thành công!");
              this.loadDataGrid();
              this.onAllChecked(false);
            }
            setTimeout(true ? resolve : reject, 300);
          }, (error: any) => {
            setTimeout(false ? resolve : reject, 300);
            this.messeage.messeageError("Có lỗi xảy ra!");
          });

        }).catch(() => console.log('Oops errors!'))
    });
  }

  onReset() {
    this.submitted = false;
    this.validateFormAddOrEdit.reset();
    this.avatarUrl = '../../../assets/img/tim_80x80.png';
    this.idEdit = '';
  }

  //xử lý control: "combobox, multi select,..."
  compareOrg = (o1: any, o2: any): boolean => (o1 && o2 ? o1.value === o2.value : o1 === o2);

  eventChangeOrg(value: { label: string; value: string; age: number }): void {

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
          this.avatarUrl = this.services.urlApi + 'images/' + data['image'];
      }, error => {
        console.log(error);
      });
  }

  setValueSex(value: any) {
    this.sexValue = value.value;
  }
}
