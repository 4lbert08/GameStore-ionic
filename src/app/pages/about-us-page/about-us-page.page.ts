import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-about-us-page',
  templateUrl: './about-us-page.page.html',
  styleUrls: ['./about-us-page.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AboutUsPagePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
