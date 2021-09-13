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
import { MatNativeDateModule } from "@angular/material/core";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";

// Import components
import { AppComponent } from "./app.component";
import { DefaultLayoutComponent } from "./containers";
import { P404Component } from "./views/error/404.component";
import { P500Component } from "./views/error/500.component";
import { MyRegisterComponent } from "./my-components/my-register/my-register.component";
import { MyLoginComponent } from "./my-components/my-login/my-login.component";

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
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TextMaskModule } from "angular2-text-mask";
import { HomeComponent } from "./my-components/home/home.component";
import { AddEventComponent } from "./my-components/add-event/add-event.component";

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
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },

    ToasterService,
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
