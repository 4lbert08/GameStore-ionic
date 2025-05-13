import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    CommonModule,
    IonicModule
  ],
  templateUrl: './login-page.page.html',
  styleUrls: ['./login-page.page.scss']
})
export class LoginPage {

  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  email: string = '';
  password: string = '';

  formErrors = {
    email: '',
    password: '',
    general: ''
  };

  formSubmitted = false;
  isLoading = false;

  constructor() {}

  private validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  private validateForm(): boolean {
    let isValid = true;
    this.formErrors = {
      email: '',
      password: '',
      general: ''
    };

    if (!this.email.trim()) {
      this.formErrors.email = 'El email es obligatorio';
      isValid = false;
    } else if (!this.validateEmail(this.email)) {
      this.formErrors.email = 'Introduce un email válido';
      isValid = false;
    }

    if (!this.password) {
      this.formErrors.password = 'La contraseña es obligatoria';
      isValid = false;
    }
    return isValid;
  }

  onSubmit() {
    this.formSubmitted = true;

    if (this.validateForm()) {
      this.isLoading = true;

      this.authService.login(this.email, this.password)
        .then(() => {
          this.router.navigateByUrl('');
        })
        .catch(error => {
          this.handleLoginError(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }

  private handleLoginError(error: any) {
    console.error('Error de login:', error);
    switch(error?.code) {
      case 'auth/user-not-found':
        this.formErrors.email = 'No existe ninguna cuenta con este email';
        break;
      case 'auth/wrong-password':
        this.formErrors.password = 'Contraseña incorrecta';
        break;
      case 'auth/invalid-credential':
        this.formErrors.general = 'Credenciales inválidas. Verifica tu email y contraseña.';
        break;
      case 'auth/user-disabled':
        this.formErrors.general = 'Esta cuenta ha sido deshabilitada.';
        break;
      case 'auth/too-many-requests':
        this.formErrors.general = 'Demasiados intentos fallidos. Inténtalo más tarde.';
        break;
      default:
        this.formErrors.general = 'Error al iniciar sesión. Por favor, inténtalo de nuevo.';
        break;
    }
  }

  togglePasswordVisibility() {
    const passwordField = document.getElementById('PasswordField') as HTMLInputElement;
    const togglerImg = document.getElementById('privacyToggler') as HTMLImageElement;

    if (passwordField.type === 'password') {
      passwordField.type = 'text';
      togglerImg.src = '/assets/imgs/privacyDisabled.png';
    } else {
      passwordField.type = 'password';
      togglerImg.src = '/assets/imgs/privacyEnabled.png';
    }
  }
}
