import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {IonFooter} from "@ionic/angular/standalone";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    RouterLink,
    IonFooter
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

}
