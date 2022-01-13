import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { MyValidators } from 'src/app/services/validators.services';
import { Services } from '../../services/services';
import { MesseageServices } from 'src/app/services/messeage.service';
import { UserInfo } from 'src/app/model/userInfo';
import { UserInfoServices } from 'src/app/services/api/userInfo.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Profile, ProfileMulti } from 'src/app/model/profile';
import { ProfileServices } from 'src/app/services/api/profile.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  //declare grid
  dataGridUserInfo: UserInfo[] = [];
  checked = false;
  loading = false;
  indeterminate = false;
  isShowFilter = false;
  setOfCheckedId = new Set<string | undefined>();
  isShowEdit = false;
  isShowDelete = false;
  isUserInfoGridLoading = false;
  codeFilter = "";
  profileNameFilter = "";
  userLoginFilter = "";

  //declare form add/edit
  isShowFormAdd = false;
  isSaveLoading = false;
  modalTitle = "";
  idEdit = "";
  isEdit = false;
  passwordVisible = false;
  password?: string;
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

  //declare control
  listProfile: ProfileMulti[] = [];
  selectedProfile = { value: "", label: "" };

  listPermission = [
    {
      value: "admin",
      label: "Quản trị"
    },
    {
      value: "person",
      label: "Người dùng"
    },
  ];
  selectedPermission = { value: "", label: "" };

  constructor(private fromBuilder: FormBuilder,
    private userInfoServices: UserInfoServices,
    private services: Services,
    private messeage: MesseageServices,
    private modalService: NzModalService,
    private profileService: ProfileServices
  ) {
    const { required, minLength, maxLength } = MyValidators;

    this.validateFormAddOrEdit = this.fromBuilder.group({
      profileName: ['', [required]],
      userLogin: ['', [required, minLength(3), maxLength(20)]],
      password: ['', [required, minLength(3), maxLength(30)]],
      permisson: ['', [required]],
      note: ['', maxLength(400)],
      isActive: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.loadDataGrid();
    this.loadSourceControl();
  }

  loadDataGrid(): void {
    this.isUserInfoGridLoading = true;
    var objSearch = {
      "Code": this.codeFilter,
      "ProfileName": this.profileNameFilter,
      "UserLogin": this.userLoginFilter
    };
    this.userInfoServices.getUserInfoGrid(objSearch).subscribe((data: UserInfo[]) => {
      data.forEach(item => {
        item.permission = item['permission'] == 'admin' ? 'Quản trị' : 'Người dùng';
        item.isActiveView = item['isActive'] == true ? 'Kích hoạt' : 'Chưa kích hoạt';
      });

      this.dataGridUserInfo = data;
      this.isUserInfoGridLoading = false;
    });
  }

  async loadSourceControl() {
    this.listProfile = [];
    await this.profileService.getProfiles().subscribe((data: Profile[]) => {
      data.forEach((item => {
        var obj = new ProfileMulti();
        obj.value = item.id + "";
        obj.label = item.code + " - " + item.profileName;
        this.listProfile.push(obj);
      }));
    });
  }

  //xử lý lưới dữ liệu
  onAllChecked(checked: boolean): void {
    this.dataGridUserInfo.forEach(({ id }) => this.updateCheckedSet(id, checked));
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
    const listOfEnabledData = this.dataGridUserInfo;
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
    this.modalTitle = "Tạo mới tài khoản người dùng";
    this.loadSourceControl();
    this.validateFormAddOrEdit.controls['userLogin'].enable();
    this.validateFormAddOrEdit.controls['password'].enable();
  }

  showEdit(): void {
    this.isShowFormAdd = true;
    this.isEdit = true;
    this.modalTitle = "Cập nhật tài khoản người dùng";
    this.loadSourceControl();

    if (this.setOfCheckedId.size === 1) {
      this.setOfCheckedId.forEach(item => {
        this.idEdit = item + '';
      });
    } 

    if (this.idEdit !== '') {
      this.userInfoServices.getUserInfo(this.idEdit).subscribe((data: UserInfo) => {
        if (data) {
          this.validateFormAddOrEdit.controls['userLogin'].setValue(data['userLogin']);
          this.validateFormAddOrEdit.controls['password'].setValue(data['password']);
          this.validateFormAddOrEdit.controls['note'].setValue(data['note']);
          this.validateFormAddOrEdit.controls['isActive'].setValue(data['isActive']);
          this.selectedProfile = { value: data['profileID'] + "", label: data['profileName'] + "" };
          this.selectedPermission = { value: data['permission'] + "", label: "" };
          this.validateFormAddOrEdit.controls['userLogin'].disable();
          this.validateFormAddOrEdit.controls['password'].disable();
          this.isShowFormAdd = true;
        }
      }, (error: any) => {
        this.messeage.messeageError("Có lỗi xảy ra!");
      });
    }
  }

  handleSubmit(): void {
    if (this.selectedProfile.value == '')
      this.validateFormAddOrEdit.controls['profileName'].setValue('');
    if (this.selectedPermission.value == '')
      this.validateFormAddOrEdit.controls['permisson'].setValue('');

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
    dataSave.profileID = this.selectedProfile.value;
    dataSave.permission = this.selectedPermission.value;
    dataSave.profileName = null;
    // xử lý tạo mới
    if (this.idEdit === '') {
      dataSave['userCreate'] = this.services.userlogin;
      this.userInfoServices.createUserInfo(dataSave).subscribe((data: UserInfo) => {
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
        this.isSaveLoading = false;
        this.messeage.messeageError("Có lỗi xảy ra!");
      });
    }
    // xử lý edit
    else {
      dataSave['userUpdate'] = this.services.userlogin;
      dataSave['id'] = this.idEdit;
      this.userInfoServices.updateUserInfo(this.idEdit, dataSave).subscribe((data: UserInfo) => {
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

          this.userInfoServices.deleteUserInfo(ids).subscribe((data: UserInfo) => {
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
  }

  //xử lý control: "combobox, multi select,..."
  compareProfile = (o1: any, o2: any): boolean => (o1 && o2 ? o1.value === o2.value : o1 === o2);

  changeProfile(value: { label: string; value: string; age: number }): void {
    // console.log(value);
  }

  comparePermission = (o1: any, o2: any): boolean => (o1 && o2 ? o1.value === o2.value : o1 === o2);

  changePermission(value: { label: string; value: string; age: number }): void {
  }
}
