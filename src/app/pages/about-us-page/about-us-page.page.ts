import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Developer } from '../../models/developer';
import { FirestoreService } from '../../services/firestore/firestore.service';
import {DeveloperCardComponent} from "../../components/developer-card/developer-card.component";
import {MainHeaderComponent} from "../../components/main-header/main-header.component";

@Component({
  selector: 'app-about-us-page',
  standalone: true,
  imports: [
    DeveloperCardComponent,
    CommonModule,
    IonicModule,
    MainHeaderComponent
  ],
  templateUrl: './about-us-page.page.html',
  styleUrls: ['./about-us-page.page.scss']
})
export class AboutUsPage implements OnInit {
  private firestoreService = inject(FirestoreService);

  developers: Developer[] = [];

  ngOnInit(): void {
    this.firestoreService.getDevelopers().subscribe(devs => {
      if (devs) this.developers = devs;
    });
  }
}
