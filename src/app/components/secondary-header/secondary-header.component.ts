import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-secondary-header',
  imports: [
    RouterLink,
    FormsModule,
    IonicModule
  ],
  templateUrl: './secondary-header.component.html',
  styleUrl: './secondary-header.component.scss'
})
export class SecondaryHeaderComponent {
  selectedLanguage: string = "en";
}
