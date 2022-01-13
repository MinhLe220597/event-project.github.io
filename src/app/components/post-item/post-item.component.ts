import { Component, OnInit } from '@angular/core';
import { PostItem, PostItemMulti } from 'src/app/model/postItem';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { MyValidators } from 'src/app/services/validators.services';
import { Services } from '../../services/services';
import { PostItemServices } from '../../services/api/postItem.service';
import { MesseageServices } from 'src/app/services/messeage.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CategoryServices } from 'src/app/services/api/category.service';
import { Category, CategoryMulti } from 'src/app/model/category';
import { GetDataServices } from 'src/app/services/api/getData.service';
import { UploadFile } from 'src/app/model/uploadFile';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent implements OnInit {

  //declare grid
  dataGridPostItem: PostItem[] = [];
  checked = false;
  loading = false;
  indeterminate = false;
  isShowFilter = false;
  setOfCheckedId = new Set<string | undefined>();
  isShowEdit = false;
  isShowDelete = false;
  isPostItemGridLoading = false;
  titleFilter = "";
  selectedCatFilter = { value: "", label: "" };

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
  listCategory: CategoryMulti[] = [];
  selectedCategory = { value: "", label: "" };
  imageUrl = '../../../assets/img/image_upload.png';
  fileToUpload: File | null = null;

  constructor(private fromBuilder: FormBuilder,
    private postItemService: PostItemServices,
    private categoryServices: CategoryServices,
    private getDataServices: GetDataServices,
    private services: Services,
    private messeage: MesseageServices,
    private modalService: NzModalService
  ) {
    const { required, maxLength } = MyValidators;

    this.validateFormAddOrEdit = this.fromBuilder.group({
      title: ['', [required, maxLength(200)]],
      categoryName: ['', [required]],
      content: ['']
    });
  }

  ngOnInit(): void {
    this.loadDataGrid();
    this.loadSourceControl();
  }

  loadDataGrid(): void {
    this.isPostItemGridLoading = true;
    var objSearch = {
      "title": this.titleFilter,
      "categoryID": this.selectedCatFilter && this.selectedCatFilter.value != '' ? this.selectedCatFilter.value : null,
    };
    this.postItemService.getPostItemGrid(objSearch).subscribe((data: PostItem[]) => {
      this.dataGridPostItem = data;
      this.isPostItemGridLoading = false;
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

  //xử lý lưới dữ liệu
  onAllChecked(checked: boolean): void {
    this.dataGridPostItem.forEach(({ id }) => this.updateCheckedSet(id, checked));
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
    const listOfEnabledData = this.dataGridPostItem;
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
    this.modalTitle = "Tạo mới bài viết";
    this.imageUrl = '../../../assets/img/image_upload.png';
    this.loadSourceControl();
  }

  showEdit(): void {
    this.isShowFormAdd = true;
    this.modalTitle = "Cập nhật bài viết";

    if (this.setOfCheckedId.size === 1) {
      this.setOfCheckedId.forEach(item => {
        this.idEdit = item + '';
      });
    } 

    if (this.idEdit !== '') {
      this.postItemService.getPostItem(this.idEdit).subscribe((data: PostItem) => {
        if (data) {
          this.validateFormAddOrEdit.controls['title'].setValue(data['title']);
          this.selectedCategory = { value: data['categoryID'] + "", label: data['categoryName'] + "" };
          this.validateFormAddOrEdit.controls['content'].setValue(data['content']);
          if (data['image'])
            this.imageUrl = this.services.urlApi + 'images/' + data['image'];
          else
            this.imageUrl = '../../../assets/img/image_upload.png';

          this.isShowFormAdd = true;
        }
      }, (error: any) => {
        this.messeage.messeageError("Có lỗi xảy ra!");
      });
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
      this.postItemService.createPostItem(dataSave).subscribe((data: PostItem) => {
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
      this.postItemService.updatePostItem(this.idEdit, dataSave).subscribe((data: PostItem) => {
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

          this.postItemService.deletePostItem(ids).subscribe((data: PostItem) => {
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
    this.imageUrl = '../../../assets/img/image_upload.png';
    this.idEdit = '';
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
}
