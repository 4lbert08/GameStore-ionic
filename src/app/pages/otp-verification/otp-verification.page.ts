import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-otpverification',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    IonicModule
  ],
  templateUrl: './otp-verification.page.html',
  styleUrls: ['./otp-verification.page.scss']
})
export class OtpVerificationPage {

  router = inject(Router);

  onSubmit() {
    this.router.navigate(['/resetPassword']).then(r => scroll(0,0));
  }
}
