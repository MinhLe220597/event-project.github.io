import { Component, Input, OnInit } from '@angular/core';
import { Services } from 'src/app/services/services';
import { Store } from '@ngrx/store';
import * as UserActions from 'src/app/store/user/actions';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MesseageServices } from 'src/app/services/messeage.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MyValidators } from 'src/app/services/validators.services';
import { UserInfoServices } from 'src/app/services/api/userInfo.service';
import { UserInfoLogin } from 'src/app/model/userInfo';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() pageTitle = "";
  avatar = '';
  userLogin = '';
  isShowMenu = false;

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

  passwordVisible = false;


  constructor(private services: Services
    , private store: Store<any>
    , private router: Router
    , private messeage: MesseageServices
    , private modalService: NzModalService
    , private fromBuilder: FormBuilder
    , private userInfoServices: UserInfoServices) { 

      const { required, maxLength, minLength } = MyValidators;

      this.validateFormAddOrEdit = this.fromBuilder.group({
        passOld: ['', [required, maxLength(30), minLength(3)]],
        passNew: ['', [required, maxLength(30), minLength(3)]],
        rePassNew: ['', [required, maxLength(30), minLength(3)]],
      });
    }

  ngOnInit(): void {
    this.userLogin = this.services.userlogin;
    this.avatar = this.services.urlApi + 'images/' + this.services.image;
  }

  clickMenu() {
    this.isShowMenu = !this.isShowMenu;
  }

  logout() {
    // this.store.dispatch(new UserActions.Logout());
    this.router.navigate(['/login']);
  }

  //xử lý form add/edit 
  showAdd(): void {
    this.isShowFormAdd = true;
    this.modalTitle = "Đổi mật khẩu";
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

    var dataSave = this.validateFormAddOrEdit.value;
    if (dataSave['passNew'] !== dataSave['rePassNew']){
        this.messeage.messeageWarning('Mật khẩu mới và xác nhận mật khẩu không giống nhau!');
    }

    this.isSaveLoading = true;
    let objChangePass = {
      UserLogin: this.services.userlogin,
      PasswordOld: dataSave['passOld'],
      PasswordNew: dataSave['passNew'],
      RePasswordNew: dataSave['rePassNew'],
    };

    // xử lý update password
    this.userInfoServices.changePassword(objChangePass).subscribe((data: UserInfoLogin) => {
      this.isSaveLoading = false;
      if (data) {
        if (data['messWarning'] == 'Succes') {
          this.messeage.messeageSuccess('Thành công!');
          this.isShowFormAdd = false;
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

  handleCancel(): void {
    this.onReset();
    this.isShowFormAdd = false;
  }

  onReset() {
    this.submitted = false;
    this.validateFormAddOrEdit.reset();
  }

  
}
