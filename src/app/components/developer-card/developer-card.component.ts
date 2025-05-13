import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-developer-card',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './developer-card.component.html',
  styleUrls: ['./developer-card.component.scss']
})
export class DeveloperCardComponent {
  @Input() developerImage: string = "";
  @Input() developerName: string = "";
  @Input() developerMail: string = "";
  @Input() developerOccupation: string = "";
}
