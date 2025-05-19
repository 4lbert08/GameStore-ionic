import {bootstrapApplication} from '@angular/platform-browser';
import {RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules} from '@angular/router';
import {IonicRouteStrategy, provideIonicAngular} from '@ionic/angular/standalone';

import {routes} from './app/app.routes';
import {AppComponent} from './app/app.component';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {getDatabase, provideDatabase} from '@angular/fire/database';
import {getStorage, provideStorage} from '@angular/fire/storage';

bootstrapApplication(AppComponent, {
  providers: [
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)), provideFirebaseApp(() => initializeApp({
      projectId: "gamestore-cc423",
      appId: "1:418332427271:web:46614e401e6b9d3c0916a2",
      storageBucket: "gamestore-cc423.firebasestorage.app",
      apiKey: "AIzaSyBSlLlZMA_I8VLNXpOCJZUBqypcGJbUsIg",
      authDomain: "gamestore-cc423.firebaseapp.com",
      messagingSenderId: "418332427271"
    })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()), provideStorage(() => getStorage()),
  ],
});
