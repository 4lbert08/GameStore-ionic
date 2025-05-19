import { Component, inject, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MainHeaderComponent } from '../../components/main-header/main-header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { UserNavBarComponent } from '../../components/user-nav-bar/user-nav-bar.component';
import { AuthService } from '../../services/auth/auth.service';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { User } from 'firebase/auth';
import { UserData } from '../../models/user';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { getDownloadURL, ref, uploadBytes, Storage } from '@angular/fire/storage';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [
    IonicModule,
    MainHeaderComponent,
    FooterComponent,
    UserNavBarComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './user-settings.page.html',
  styleUrls: ['./user-settings.page.scss']
})
export class UserSettingsComponent implements OnInit {
  authService: AuthService = inject(AuthService);
  firestoreService: FirestoreService = inject(FirestoreService);
  router: Router = inject(Router);
  storage: Storage = inject(Storage);
  user: User | null = null;
  userData: UserData | null = null;
  userDataEdit: Partial<UserData> = {};
  isUploading = false;
  selectedFile: File | null = null;
  formSubmitted = false;

  formErrors = {
    nickname: '',
    birthday: '',
    region: '',
    language: '',
    profilePicture: ''
  };

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (this.user) {
        this.firestoreService.loadUser(this.user.uid).subscribe(userData => {
          this.userData = userData;
          if (this.userData) {
            this.userDataEdit = { ...this.userData };
          }
        });
      }
    });
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['']);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      if (this.selectedFile) {
        if (!this.selectedFile.type.startsWith('image/')) {
          this.formErrors.profilePicture = 'El archivo debe ser una imagen';
          this.selectedFile = null;
          input.value = '';
        } else if (this.selectedFile.size > 5 * 1024 * 1024) {
          this.formErrors.profilePicture = 'La imagen no debe superar los 5MB';
          this.selectedFile = null;
          input.value = '';
        } else {
          this.formErrors.profilePicture = '';
        }
      }
    }
  }

  private validateNickname(nickname: string): boolean {
    return nickname.length >= 3 && nickname.length <= 20;
  }

  private validateForm(): boolean {
    let isValid = true;
    this.formErrors = {
      nickname: '',
      birthday: '',
      region: '',
      language: '',
      profilePicture: ''
    };

    if (!this.userDataEdit.nickname?.trim()) {
      this.formErrors.nickname = 'El nombre de usuario es obligatorio';
      isValid = false;
    } else if (!this.validateNickname(this.userDataEdit.nickname)) {
      this.formErrors.nickname = 'El nombre de usuario debe tener entre 3 y 20 caracteres';
      isValid = false;
    }

    if (!this.userDataEdit.birthday) {
      this.formErrors.birthday = 'La fecha de nacimiento es obligatoria';
      isValid = false;
    }

    if (!this.userDataEdit.region) {
      this.formErrors.region = 'Debes seleccionar una región';
      isValid = false;
    }

    if (!this.userDataEdit.language) {
      this.formErrors.language = 'Debes seleccionar un idioma';
      isValid = false;
    }

    return isValid;
  }

  async uploadProfilePicture(): Promise<string | undefined> {
    if (!this.selectedFile || !this.user) {
      return undefined;
    }

    this.isUploading = true;
    try {
      const filePath = `profilePictures/${this.user.uid}/${Date.now()}_${this.selectedFile.name}`;
      const fileRef = ref(this.storage, filePath);
      const uploadTask = await uploadBytes(fileRef, this.selectedFile);
      const downloadURL = await getDownloadURL(uploadTask.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      return undefined;
    } finally {
      this.isUploading = false;
    }
  }

  async onSubmit() {
    this.formSubmitted = true;
    if (!this.validateForm()) {
      console.log('Formulario no válido', this.formErrors);
      return;
    }

    if (this.selectedFile && this.user) {
      const avatarUrl = await this.uploadProfilePicture();
      if (avatarUrl) {
        this.userDataEdit.avatar = avatarUrl;
      }
    }

    if (this.user?.uid) {
      await this.firestoreService.updateUser(this.user.uid, this.userDataEdit);
      location.reload();
    }
  }
}
