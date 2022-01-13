import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { MyValidators } from 'src/app/services/validators.services';
import { Services } from '../../services/services';
import { MesseageServices } from 'src/app/services/messeage.service';
import { OrgStructure } from 'src/app/model/org-structure';
import { OrgStructureServices } from 'src/app/services/api/orgStructure.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Profile, ProfileMulti } from 'src/app/model/profile';
import { ProfileServices } from 'src/app/services/api/profile.service';

@Component({
  selector: 'app-org-structure',
  templateUrl: './org-structure.component.html',
  styleUrls: ['./org-structure.component.scss']
})
export class OrgStructureComponent implements OnInit {
  //declare grid
  dataGridOrgStructure: OrgStructure[] = [];
  checked = false;
  loading = false;
  indeterminate = false;
  isShowFilter = false;
  setOfCheckedId = new Set<string | undefined>();
  isShowEdit = false;
  isShowDelete = false;
  isOrgStructureGridLoading = false;
  codeFilter = "";
  orgStructureNameFilter = "";

  //declare form add/edit
  isShowFormAdd = false;
  isSaveLoading = false;
  modalTitle = "";
  idEdit = "";
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
  selectedHeadOrg = { value: "", label: "" };

  constructor(private fromBuilder: FormBuilder,
    private orgStructureServices: OrgStructureServices,
    private services: Services,
    private messeage: MesseageServices,
    private modalService: NzModalService,
    private profileService: ProfileServices
  ) {
    const { required, maxLength } = MyValidators;

    this.validateFormAddOrEdit = this.fromBuilder.group({
      code: ['', [required, maxLength(30)]],
      orgStructureName: ['', [required, maxLength(100)]],
      headOrgStructureName: [''],
      note: ['', maxLength(400)],
    });
  }

  ngOnInit(): void {
    this.loadDataGrid();
    this.loadSourceControl();
  }

  loadDataGrid(): void {
    this.isOrgStructureGridLoading = true;
    var objSearch = {
      "Code": this.codeFilter,
      "OrgStructureName": this.orgStructureNameFilter
    };
    this.orgStructureServices.getOrgStructureGrid(objSearch).subscribe((data: OrgStructure[]) => {
      this.dataGridOrgStructure = data;
      this.isOrgStructureGridLoading = false;
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
    this.dataGridOrgStructure.forEach(({ id }) => this.updateCheckedSet(id, checked));
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
    const listOfEnabledData = this.dataGridOrgStructure;
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
    this.modalTitle = "Tạo mới phòng ban";
    this.loadSourceControl();
  }

  showEdit(): void {
    this.isShowFormAdd = true;
    this.modalTitle = "Cập nhật phòng ban";
    this.loadSourceControl();

    if (this.setOfCheckedId.size === 1) {
      this.setOfCheckedId.forEach(item => {
        this.idEdit = item + '';
      });
    } 

    if (this.idEdit !== '') {
      this.orgStructureServices.getOrgStructure(this.idEdit).subscribe((data: OrgStructure) => {
        if (data) {
          this.validateFormAddOrEdit.controls['code'].setValue(data['code']);
          this.validateFormAddOrEdit.controls['orgStructureName'].setValue(data['orgStructureName']);
          this.validateFormAddOrEdit.controls['note'].setValue(data['note']);
          this.selectedHeadOrg = { value: data['headOrgStructureID'] + "", label: data['headOrgStructureName'] + "" };
          this.isShowFormAdd = true;
        }
      }, (error: any) => {
        this.messeage.messeageError("Có lỗi xảy ra!");
      });
    }
  }

  handleSubmit(): void {
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
    dataSave.headOrgStructureID = this.selectedHeadOrg.value;
    dataSave['headOrgStructureName'] = null;

    // xử lý tạo mới
    if (this.idEdit === '') {
      dataSave['userCreate'] = this.services.userlogin;
      this.orgStructureServices.createOrgStructure(dataSave).subscribe((data: OrgStructure) => {
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
      this.orgStructureServices.updateOrgStructure(this.idEdit, dataSave).subscribe((data: OrgStructure) => {
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
      
          this.orgStructureServices.deleteOrgStructure(ids).subscribe((data: OrgStructure) => {
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
  compareHeadOrg = (o1: any, o2: any): boolean => (o1 && o2 ? o1.value === o2.value : o1 === o2);

  eventChangeHeadOrg(value: { label: string; value: string; age: number }): void {
    // console.log(value);
  }
}
