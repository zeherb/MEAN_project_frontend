import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import {
  LocationStrategy,
  HashLocationStrategy,
  DatePipe,
} from "@angular/common";
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from "@angular-material-components/datetime-picker";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule, MAT_DATE_LOCALE } from "@angular/material/core";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
import { MatMenuModule } from "@angular/material/menu";
import { MatCardModule } from "@angular/material/card";
import { MatTabsModule } from "@angular/material/tabs";
import { MatExpansionModule } from "@angular/material/expansion";

// Import components
import { AppComponent } from "./app.component";
import { DefaultLayoutComponent } from "./containers";
import { P404Component } from "./views/error/404.component";
import { P500Component } from "./views/error/500.component";
import { MyRegisterComponent } from "./my-components/my-register/my-register.component";
import { MyLoginComponent } from "./my-components/my-login/my-login.component";
import { MyProfileComponent } from "./my-components/my-profile/my-profile.component";

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from "@coreui/angular";

// Import routing module
import { AppRoutingModule } from "./app-routing.module";

// Import 3rd party components
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TabsModule } from "ngx-bootstrap/tabs";
import { ChartsModule } from "ng2-charts";
import { ToasterModule, ToasterService } from "angular2-toaster";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TextMaskModule } from "angular2-text-mask";
import { HomeComponent } from "./my-components/home/home.component";
import { AddEventComponent } from "./my-components/add-event/add-event.component";
import { AddNewTagComponent } from "./my-components/add-event/dialogs/add-new-tag/add-new-tag.component";
import { AuthInterceptor } from "./services/auth.interceptor";
import { UpdateEventComponent } from "./my-components/my-profile/dialogs/update-event/update-event.component";
import { UpdateEventImageComponent } from "./my-components/my-profile/dialogs/update-event-image/update-event-image.component";
import { ConfirmDeleteEventComponent } from "./my-components/my-profile/dialogs/confirm-delete-event/confirm-delete-event.component";
import { EditProfileComponent } from "./my-components/my-profile/dialogs/edit-profile/edit-profile.component";
import { EditAvatarComponent } from "./my-components/my-profile/dialogs/edit-avatar/edit-avatar.component";
import { ResetPasswordComponent } from './my-components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './my-components/forgot-password/forgot-password.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    ToasterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    NgxMatNativeDateModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatMenuModule,
    MatCardModule,
    MatTabsModule,
    MatExpansionModule,
    HttpClientModule,
  ],
  entryComponents: [
    AddNewTagComponent,
    UpdateEventComponent,
    UpdateEventImageComponent,
    ConfirmDeleteEventComponent,
    EditProfileComponent,
    EditAvatarComponent,
  ],
  declarations: [
    AppComponent,
    DefaultLayoutComponent,
    P404Component,
    P500Component,

    MyRegisterComponent,
    MyLoginComponent,
    HomeComponent,
    AddEventComponent,
    AddNewTagComponent,
    MyProfileComponent,
    UpdateEventComponent,
    UpdateEventImageComponent,
    ConfirmDeleteEventComponent,
    EditProfileComponent,
    EditAvatarComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },

    ToasterService,
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
