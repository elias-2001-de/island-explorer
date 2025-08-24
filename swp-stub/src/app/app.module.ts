import { NgModule, ErrorHandler,inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { MapComponent } from './pages/map/map.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UserInputComponent } from './components/user-input/user-input.component';
import { Router, RouterModule, Routes } from '@angular/router';
import { Observable, map, of } from 'rxjs';

import { EliasMaierComponent } from './components/elias-maier/elias-maier.component';
import { JonathanHaesslerComponent } from './components/jonathan-haessler/jonathan-haessler.component';
import { NicolasLuckertComponent } from './components/nicolas-luckert/nicolas-luckert.component';
import { PaulinaLeutloffComponent } from './components/paulina-leutloff/paulina-leutloff.component';
import { RobinErbComponent } from './components/robin-erb/robin-erb.component';
import { LuciaSchopperComponent } from './components/lucia-schopper/lucia-schopper.component';

import { SearchFieldComponent } from './components/search-field/search-field.component';
import { BackButtonComponent } from './components/back-button/back-button.component';

import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { RootComponent } from './pages/root/root.component';
import { AboutComponent } from './pages/about/about.component';

import { NameComponent } from './pages/profile/name/name.component';
import { AddressComponent } from './pages/profile/address/address.component';
import { PasswordComponent } from './pages/profile/password/password.component';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { LocationComponent } from './pages/location/location.component';
import { DetailMapComponent } from './components/detail-map/detail-map.component';

import { EventsComponent } from './pages/events/events/events.component';
import { PaymentComponent } from './pages/events/payment/payment.component';
import { BachelorcardComponent } from './pages/events/bachelorcard/bachelorcard.component';
import { HCIpalComponent } from './pages/events/hcipal/hcipal.component';
import { SWPsafeComponent } from './pages/events/swpsafe/swpsafe.component';
import { SuccessComponent } from './pages/events/success/success.component';
import { EventDetailComponent } from './pages/events/event-detail/event-detail.component';

import { LoginService } from './services/login.service';
import { AddEventComponent } from './pages/events/add-event/add-event.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { AdminrolesComponent } from './pages/adminroles/adminroles.component';
import { CreateadminComponent } from './pages/adminroles/createadmin/createadmin.component';
import { UserfaqComponent } from './pages/faq/userfaq/userfaq.component';
import { ChatsComponent } from './pages/chats/chats.component';
import { ChatComponent } from './pages/chats/chat/chat.component';
import { GardenerfaqComponent } from './pages/faq/gardenerfaq/gardenerfaq.component';
import { CreatefaqComponent } from './pages/faq/gardenerfaq/createfaq/createfaq.component';
import { EditfaqComponent } from './pages/faq/gardenerfaq/editfaq/editfaq.component';
import { UserquestionComponent } from './pages/faq/userfaq/userquestion/userquestion.component';
import { OpenchatsComponent } from './pages/chats/openchats/openchats.component';
import { UserTextareaComponent } from './components/user-textarea/user-textarea.component';
import { TicketPriceInfoComponent } from './components/ticket-price-info/ticket-price-info.component';
import { GlobalErrorHandler } from './services/error-handler.service';

const loginGuard = (): Observable<boolean> => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  if (loginService.authChecked) {
    return of(loginService.isLoggedIn());
  }

  return loginService.checkAuth().pipe(map(isAuthenticated => {
    if (!isAuthenticated) {
      router.navigate(['/login']);
      return false;
    }
    return true;
  }));
};

const loggedInGuard = (): Observable<boolean> => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  if (loginService.authChecked) {
    return of(!loginService.isLoggedIn());
  }

  return loginService.checkAuth().pipe(map(isAuthenticated => {
    if (isAuthenticated) {
      router.navigate(['/map']);
      return false;
    }
    return true;
  }));
};

const adminGuard = (): boolean => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  if (loginService.getRole() !== 'admin' && loginService.getRole() !== 'root') {
    router.navigate(['/map']);
    return false;
  }
  return true;
};
const gardenerGuard = (): boolean => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  if (loginService.getRole() !== 'gardener') {
    router.navigate(['/map']);
    return false;
  }
  return true;
};
const visitorGuard = (): boolean => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  if (loginService.getRole() !== 'visitor') {
    router.navigate(['/map']);
    return false;
  }
  return true;
};

const routes: Routes = [

  { path: 'login', component: LoginComponent, canActivate: [loggedInGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [loggedInGuard] },
  { path: 'about', component: AboutComponent },
  {
    path: 'map', canActivate: [loginGuard],
    children: [
      { path: '', component: MapComponent },
      //MIGHT NEED A GUARD!!! For disallowing navigating to it directly by url without clicking on a map marker
      { path: ':id', component: LocationComponent }
    ]
  },
  {
    path: 'events',
    canActivate: [loginGuard],
    children: [
      { path: '', component: EventsComponent },
      {
        path: ':id', children: [
          { path: '', component: EventDetailComponent },
          { path: 'edit', component: AddEventComponent, canActivate: [adminGuard] },
          {
            path: 'payment', canActivate: [visitorGuard], children: [
              { path: '', component: PaymentComponent },
              { path: 'bachelorcard', component: BachelorcardComponent },
              { path: 'hcipal', component: HCIpalComponent },
              { path: 'swpsafe', component: SWPsafeComponent },
              { path: 'success', component: SuccessComponent }
            ]
          },]
      }
    ]
  },
  { path: 'post-event', component: AddEventComponent, canActivate: [loginGuard, adminGuard] },
  { path: 'tickets', component: TicketsComponent, canActivate: [loginGuard, visitorGuard] },
  {
    path: 'adminroles',
    canActivate: [loginGuard, adminGuard],
    children: [
      { path: '', component: AdminrolesComponent },
      { path: 'createadmin', component: CreateadminComponent }

    ]
  },
  {
    path: 'gardenerfaq',
    canActivate: [loginGuard, gardenerGuard],
    children: [
      { path: '', component: GardenerfaqComponent },
      { path: 'createfaq', component: CreatefaqComponent },
      { path: 'editfaq/:id', component: EditfaqComponent },
    ]
  },
  {
    path: 'chats',
    canActivate: [loginGuard, gardenerGuard],
    children: [
      { path: '', component: ChatsComponent },
      { path: 'chat/:id', component: ChatComponent },
      {
        path: 'openchats',
        children: [
          { path: '', component: OpenchatsComponent },
          { path: 'chat/:id', component: ChatComponent },
        ]
      }
    ]
  },

  {
    path: 'userfaq',
    canActivate: [loginGuard, visitorGuard],
    children: [
      { path: '', component: UserfaqComponent },
      { path: 'userquestion', component: UserquestionComponent },
      {
        path: 'chats',
        children: [
          { path: '', component: ChatsComponent },
          { path: 'chat/:id', component: ChatComponent },
        ]
      },
    ]
  },
  {
    path: 'profile',
    canActivate: [loginGuard],
    children: [
      { path: '', component: ProfileComponent },
      { path: 'name', component: NameComponent },
      { path: 'adress', component: AddressComponent },
      { path: 'password', component: PasswordComponent },
      { path: 'about', component: AboutComponent },
    ]
  },
  { path: '**', redirectTo: '/map' }
];

@NgModule({
  declarations: [
    RootComponent,
    AboutComponent,
    NavigationBarComponent,
    MapComponent,
    ProfileComponent,
    UserInputComponent,
    EliasMaierComponent,
    LoginComponent,
    BackButtonComponent,
    JonathanHaesslerComponent,
    NicolasLuckertComponent,
    PaulinaLeutloffComponent,
    RobinErbComponent,
    LuciaSchopperComponent,
    RegisterComponent,
    NameComponent,
    AddressComponent,
    PasswordComponent,
    SearchFieldComponent,
    TicketsComponent,
    LocationComponent,
    DetailMapComponent,
    EventsComponent,
    PaymentComponent,
    BachelorcardComponent,
    HCIpalComponent,
    SWPsafeComponent,
    SuccessComponent,
    EventDetailComponent,
    AddEventComponent,
    DropdownComponent,
    AdminrolesComponent,
    CreateadminComponent,
    UserfaqComponent,
    ChatsComponent,
    ChatComponent,
    GardenerfaqComponent,
    CreatefaqComponent,
    EditfaqComponent,
    UserquestionComponent,
    OpenchatsComponent,
    UserTextareaComponent,
    TicketPriceInfoComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    LeafletModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    HttpClientModule,
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ],
  bootstrap: [RootComponent]
})

export class AppModule { }
