import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserInfo, UserInfoLogin } from 'src/app/model/userInfo';
import { UserInfoServices } from 'src/app/services/api/userInfo.service';
import { LoginServices } from 'src/app/services/login.services';
import { Services } from 'src/app/services/services';
import { MesseageServices } from './../../services/messeage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isRequiredUserName = false;
  isRequiredPassword = false;
  loading = false;
  submitted = false;
  returnUrl = '';
  error = '';

  constructor(private formBuilder: FormBuilder
    , private messeage: MesseageServices
    , private loginServices: LoginServices
    , private router: Router
    , private userInfoServices: UserInfoServices
    , private services: Services
  ) {

   }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  get formLG(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  validateLogin(): void {
    if (this.formLG['userName'].value === '')
      this.isRequiredUserName = true;
    else
      this.isRequiredUserName = false;

    if (this.formLG['password'].value === '')
      this.isRequiredPassword = true;
    else
      this.isRequiredPassword = false;
  }

  onSubmit() {
    this.submitted = true;
    this.validateLogin();

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    var dataLogin = this.loginForm.value;
    var param = {
      "UserLogin": dataLogin['userName'],
      "Password": dataLogin['password']
    };

    this.userInfoServices.login(param).subscribe((data: UserInfoLogin) => {
      this.loading = false;
      if (data) {
        if (data['messWarning'] == 'Succes') {
          this.services.userlogin = data['userLogin']?.toString() ?? '';
          this.services.permission = data['permission']?.toString() ?? '';
          this.services.image = data['image']?.toString() ?? '';
          this.services.profileName = data['profileName']?.toString() ?? '';

          this.router.navigate(['/admin']);
        }
        else
          this.messeage.messeageWarning(data['messWarning']);
      }
    }, (error: any) => {
      this.loading = false;
      this.messeage.messeageError("Có lỗi xảy ra!");
    });
  }
}
