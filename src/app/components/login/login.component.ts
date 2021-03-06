import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserInfoServices } from 'src/app/services/api/userInfo.service';
import { LoginServices } from 'src/app/services/login.services';
import { Services } from 'src/app/services/services';
import { MesseageServices } from './../../services/messeage.service';
import * as UserActions from 'src/app/store/user/actions';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UserInfoLogin } from 'src/app/model/userInfo';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isRequiredUserName = false;
  isRequiredPassword = false;
  loading = false;
  submitted = false;
  returnUrl = '';
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<any>,
    private modalService: NzModalService,
    private messeage: MesseageServices,
    private userInfoServices: UserInfoServices,
  ) // , private store: Store
  { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  get formLG(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  validateLogin(): void {
    if (this.formLG['userName'].value === '') this.isRequiredUserName = true;
    else this.isRequiredUserName = false;

    if (this.formLG['password'].value === '') this.isRequiredPassword = true;
    else this.isRequiredPassword = false;
  }

  onSubmit() {
    this.submitted = true;
    this.validateLogin();

    if (this.loginForm.invalid) {
      return;
    }

    // this.loading = true;
    var dataLogin = this.loginForm.value;
    var param = {
      UserLogin: dataLogin['userName'],
      Password: dataLogin['password'],
    };
    this.store.dispatch(new UserActions.Login(param));
  }

  resetPassword() {
    debugger;
    var dataLogin = this.loginForm.value;
    if (dataLogin && dataLogin['userName'] == ''){
      this.messeage.messeageWarning('Vui l??ng nh???p t??n ????ng nh???p');
      return;
    }

    this.modalService.confirm({
      nzTitle: 'X??c nh???n',
      nzContent: 'B???n x??c nh???n ?????t l???i m???t kh???u cho t??i kho???n: ' + dataLogin['userName'] +'?',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          let objChangePass = {
            UserLogin: dataLogin['userName'],
          };

          this.userInfoServices.resetPassword(objChangePass).subscribe((data: UserInfoLogin) => {
            if (data) {
              if (data['messWarning'] == 'Succes') {
                this.messeage.messeageSuccess('Th??nh c??ng! H??? th???ng ???? g???i t???i mail c???a b???n th??ng tin ????ng nh???p.');
              }
              else {
                this.messeage.messeageWarning(data['messWarning']);
              }
            }
            setTimeout(true ? resolve : reject, 300);
          }, (error: any) => {
            setTimeout(true ? resolve : reject, 300);
            this.messeage.messeageError("C?? l???i x???y ra!");
          });
        }).catch(() => console.log('Oops errors!'))
    });
  }
}
