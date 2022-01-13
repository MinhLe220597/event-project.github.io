import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/model/category';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { MyValidators } from 'src/app/services/validators.services';
import { Services } from '../../services/services';
import { CategoryServices } from '../../services/api/category.service';
import { MesseageServices } from 'src/app/services/messeage.service';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  //declare grid
  dataGridCategory: Category[] = [];
  checked = false;
  loading = false;
  indeterminate = false;
  isShowFilter = false;
  setOfCheckedId = new Set<string | undefined>();
  isShowEdit = false;
  isShowDelete = false;
  isCategoryGridLoading = false;
  codeFilter = "";
  categoryNameFilter = "";

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

  constructor(private fromBuilder: FormBuilder,
    private categoryService: CategoryServices,
    private services: Services,
    private messeage: MesseageServices,
    private modalService: NzModalService
  ) {
    const { required, maxLength } = MyValidators;

    this.validateFormAddOrEdit = this.fromBuilder.group({
      code: ['', [required, maxLength(30)]],
      categoryName: ['', [required, maxLength(100)]],
      note: ['', maxLength(400)],
    });
  }

  ngOnInit(): void {
    this.loadDataGrid();
  }

  loadDataGrid(): void {
    this.isCategoryGridLoading = true;
    var objSearch = {
      "Code": this.codeFilter,
      "CategoryName": this.categoryNameFilter
    };
    this.categoryService.getCategoryGrid(objSearch).subscribe((data: Category[]) => {
      this.dataGridCategory = data;
      this.isCategoryGridLoading = false;
    });
  }

  //xử lý lưới dữ liệu
  onAllChecked(checked: boolean): void {
    this.dataGridCategory.forEach(({ id }) => this.updateCheckedSet(id, checked));
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
    const listOfEnabledData = this.dataGridCategory;
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

      if (this.setOfCheckedId.size === 1){
        this.isShowEdit = true;
        this.setOfCheckedId.forEach(item => {
          this.idEdit = item + '';
        });
      }else{
        this.isShowEdit = false;
        this.idEdit = "";
      }
    } else {
      this.isShowDelete = false;
      this.isShowEdit = false;
      this.idEdit = "";
    }
  }

  filterGrid(){
    this.loadDataGrid();
  }

  closeFilter(){
    this.isShowFilter = false;
  }

  //xử lý form add/edit 
  showAdd(): void {
    this.isShowFormAdd = true;
    this.modalTitle = "Tạo mới danh mục";
  }

  showEdit(): void {
    this.isShowFormAdd = true;
    this.modalTitle = "Cập nhật danh mục";

    if (this.setOfCheckedId.size === 1) {
      this.setOfCheckedId.forEach(item => {
        this.idEdit = item + '';
      });
    } 

    if (this.idEdit !== ''){
      this.categoryService.getCategory(this.idEdit).subscribe((data: Category) => {
        if (data){
          this.validateFormAddOrEdit.controls['code'].setValue(data['code']);
          this.validateFormAddOrEdit.controls['categoryName'].setValue(data['categoryName']);
          this.validateFormAddOrEdit.controls['note'].setValue(data['note']);
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
    // xử lý tạo mới
    if (this.idEdit === '') {
      dataSave['userCreate'] = this.services.userlogin;
      this.categoryService.createCategory(dataSave).subscribe((data: Category) => {
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
      this.categoryService.updateCategory(this.idEdit, dataSave).subscribe((data: Category) => {
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
      
          this.categoryService.deleteCategory(ids).subscribe((data: Category) => {
            if (data){
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
}


