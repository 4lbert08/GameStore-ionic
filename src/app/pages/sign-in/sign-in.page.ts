import {Component, inject} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ FormsModule, CommonModule, IonicModule],
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss']
})
export class SignInPage{

  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  nickname: string = "";
  email: string = "";
  password: string = "";
  repeatPassword: string = "";
  region: string = "";
  birthday: Date = new Date();

  formErrors = {
    nickname: '',
    email: '',
    password: '',
    repeatPassword: '',
    birthday: '',
    region: ''
  };

  formSubmitted = false;

  constructor() {}

  private validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  private validatePassword(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  }

  private validateNickname(nickname: string): boolean {
    return nickname.length >= 3 && nickname.length <= 20;
  }

  private validateForm(): boolean {
    let isValid = true;
    this.formErrors = {
      nickname: '',
      email: '',
      password: '',
      repeatPassword: '',
      birthday: '',
      region: ''
    };

    if (!this.nickname.trim()) {
      this.formErrors.nickname = 'El nombre de usuario es obligatorio';
      isValid = false;
    } else if (!this.validateNickname(this.nickname)) {
      this.formErrors.nickname = 'El nombre de usuario debe tener entre 3 y 20 caracteres';
      isValid = false;
    }

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
    } else if (!this.validatePassword(this.password)) {
      this.formErrors.password = 'La contraseña debe tener al menos 8 caracteres, una letra minúscula, una mayúscula y un número';
      isValid = false;
    }

    if (!this.repeatPassword) {
      this.formErrors.repeatPassword = 'Debes confirmar la contraseña';
      isValid = false;
    } else if (this.password !== this.repeatPassword) {
      this.formErrors.repeatPassword = 'Las contraseñas no coinciden';
      isValid = false;
    }

    if (!this.birthday) {
      this.formErrors.birthday = 'La fecha de nacimiento es obligatoria';
      isValid = false;
    }

    if (!this.region) {
      this.formErrors.region = 'Debes seleccionar una región';
      isValid = false;
    }

    return isValid;
  }

  onSubmit() {
    this.formSubmitted = true;

    if (this.validateForm()) {
      this.authService.register(this.email, this.password, this.nickname, this.region, this.birthday);
      this.router.navigateByUrl('');
    } else {
      console.log('Formulario no válido', this.formErrors);
    }
  }

  togglePasswordVisibility(fieldId: string) {
    const passwordField = document.getElementById(fieldId) as HTMLInputElement;
    const togglerImg = document.getElementById(fieldId === 'PasswordField' ? 'privacyToggler' : 'privacyTogglerRepeat') as HTMLImageElement;

    if (passwordField.type === 'password') {
      passwordField.type = 'text';
      togglerImg.src = '/imgs/privacyDisabled.png';
    } else {
      passwordField.type = 'password';
      togglerImg.src = '/imgs/privacyEnabled.png';
    }
  }
}
