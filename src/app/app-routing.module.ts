import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Import Containers
import { AddEventComponent } from "./my-components/add-event/add-event.component";
import { AdminGuard } from "./my-components/admin.guard";
import { AnyOtherProfileComponent } from "./my-components/any-other-profile/any-other-profile.component";
import { AuthGuard } from "./my-components/auth.guard";
import { ConnectedGuard } from "./my-components/connected.guard";
import { EventsAdminComponent } from "./my-components/events-admin/events-admin.component";
import { ForgotPasswordComponent } from "./my-components/forgot-password/forgot-password.component";
import { HomeComponent } from "./my-components/home/home.component";
import { MyLoginComponent } from "./my-components/my-login/my-login.component";
import { MyProfileComponent } from "./my-components/my-profile/my-profile.component";
import { MyRegisterComponent } from "./my-components/my-register/my-register.component";
import { ResetPasswordComponent } from "./my-components/reset-password/reset-password.component";
import { SettingsComponent } from "./my-components/settings/settings.component";
import { TagsAdminComponent } from "./my-components/tags-admin/tags-admin.component";
import { TicketsAdminComponent } from "./my-components/tickets-admin/tickets-admin.component";
import { UsersAdminComponent } from "./my-components/users-admin/users-admin.component";
import { P404Component } from "./views/error/404.component";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "404",
    component: P404Component,
    data: {
      title: "Page 404",
    },
  },

  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
    canActivate: [ConnectedGuard],
  },
  {
    path: "reset-password/:token",
    component: ResetPasswordComponent,
    canActivate: [ConnectedGuard],
  },
  {
    path: "login",
    component: MyLoginComponent,
    data: {
      title: "Login Page",
    },
    canActivate: [ConnectedGuard],
  },
  {
    path: "profile",
    component: MyProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "register",
    component: MyRegisterComponent,
    data: {
      title: "Register Page",
    },
    canActivate: [ConnectedGuard],
  },
  {
    path: "add-event",
    component: AddEventComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "settings",
    component: SettingsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "admin-space-users",
    component: UsersAdminComponent,
    canActivate: [AdminGuard],
  },
  {
    path: "admin-space-events",
    component: EventsAdminComponent,
    canActivate: [AdminGuard],
  },
  {
    path: "admin-space-tags",
    component: TagsAdminComponent,
    canActivate: [AdminGuard],
  },
  {
    path: "admin-space-tickets",
    component: TicketsAdminComponent,
    canActivate: [AdminGuard],
  },
  {
    path: "user-profile",
    component: AnyOtherProfileComponent,
    canActivate: [AuthGuard],
  },

  { path: "**", component: P404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
