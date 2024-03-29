import { Component, AfterViewInit, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { LoginService } from 'app/core/login/login.service';
import { Account } from 'app/core/user/account.model';

@Component({
  selector: 'jhi-login-modal',
  templateUrl: './login.component.html'
})
export class LoginModalComponent implements AfterViewInit {
  @ViewChild('username', { static: false })
  username?: ElementRef;

  authenticationError = false;
  user: Account | null | undefined;

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false]
  });

  constructor(
    private loginService: LoginService,
    // private parameter: ParameterService,
    private renderer: Renderer,
    private router: Router,
    public activeModal: NgbActiveModal,
    private fb: FormBuilder
  ) {}

  ngAfterViewInit(): void {
    if (this.username) {
      this.renderer.invokeElementMethod(this.username.nativeElement, 'focus', []);
    }
  }

  cancel(): void {
    this.authenticationError = false;
    this.loginForm.patchValue({
      username: '',
      password: ''
    });
    this.activeModal.dismiss('cancel');
  }

  login(): void {
    this.loginService
      .login({
        username: this.loginForm.get('username')!.value,
        password: this.loginForm.get('password')!.value,
        rememberMe: this.loginForm.get('rememberMe')!.value
      })
      .subscribe(
        response => {
          this.authenticationError = false;
          this.activeModal.close();
          if (
            this.router.url === '/account/register' ||
            this.router.url.startsWith('/account/activate') ||
            this.router.url.startsWith('/account/reset/')
          ) {
            this.router.navigate(['']);
          }
          console.log(response);
          this.user = response;
          // this.parameter.setLogerUser(this.user);
          // console.log(this.parameter.getLogerUser());
        },
        () => (this.authenticationError = true)
      );
  }

  register(): void {
    this.activeModal.dismiss('to state register');
    this.router.navigate(['/account/register']);
  }

  requestResetPassword(): void {
    this.activeModal.dismiss('to state requestReset');
    this.router.navigate(['/account/reset', 'request']);
  }
}
