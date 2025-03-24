import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [ReactiveFormsModule]
})
export class LoginComponent {
  isLogin: boolean = true;
  userForm: FormGroup;

  constructor(
    private authGuard: AuthGuard,
    private router: Router,
    private route: ActivatedRoute,
    private fb: NonNullableFormBuilder // Initialize fb before using it
  ) {
    // Initialize userForm inside the constructor
    this.userForm = this.fb.group({
      username: new FormControl(''),
      password: new FormControl(''),
    });
  }

  toggleMode(): void {
    this.isLogin = !this.isLogin;
  }

  submit(): void {
    const { username, password } = this.userForm.value;

    if (this.isLogin) {
      this.authGuard.login(username, password);
    } else {
      this.authGuard.signUp(username, password);
    }

    const callbackUrl = this.route.snapshot?.queryParams?.['callback'] || '/';
    this.router.navigateByUrl(callbackUrl);
  }
}
