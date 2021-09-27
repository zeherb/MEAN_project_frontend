import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Import Containers
import { DefaultLayoutComponent } from "./containers";
import { AddEventComponent } from "./my-components/add-event/add-event.component";
import { AdminGuard } from "./my-components/admin.guard";
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
import { UsersAdminComponent } from "./my-components/users-admin/users-admin.component";
import { P404Component } from "./views/error/404.component";
import { P500Component } from "./views/error/500.component";

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
    path: "500",
    component: P500Component,
    data: {
      title: "Page 500",
    },
  },
  // ************
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
  // *************
  {
    path: "",
    component: DefaultLayoutComponent,
    data: {
      title: "Home",
    },
    children: [
      {
        path: "base",
        loadChildren: () =>
          import("./views/base/base.module").then((m) => m.BaseModule),
      },
      {
        path: "buttons",
        loadChildren: () =>
          import("./views/buttons/buttons.module").then((m) => m.ButtonsModule),
      },
      {
        path: "charts",
        loadChildren: () =>
          import("./views/chartjs/chartjs.module").then((m) => m.ChartJSModule),
      },
      {
        path: "dashboard",
        loadChildren: () =>
          import("./views/dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: "editors",
        loadChildren: () =>
          import("./views/editors/editors.module").then((m) => m.EditorsModule),
      },
      {
        path: "forms",
        loadChildren: () =>
          import("./views/forms/forms.module").then((m) => m.FormsModule),
      },
      {
        path: "google-maps",
        loadChildren: () =>
          import("./views/google-maps/google-maps.module").then(
            (m) => m.GoogleMapsModule
          ),
      },
      {
        path: "icons",
        loadChildren: () =>
          import("./views/icons/icons.module").then((m) => m.IconsModule),
      },
      {
        path: "notifications",
        loadChildren: () =>
          import("./views/notifications/notifications.module").then(
            (m) => m.NotificationsModule
          ),
      },
      {
        path: "plugins",
        loadChildren: () =>
          import("./views/plugins/plugins.module").then((m) => m.PluginsModule),
      },
      {
        path: "tables",
        loadChildren: () =>
          import("./views/tables/tables.module").then((m) => m.TablesModule),
      },
      {
        path: "theme",
        loadChildren: () =>
          import("./views/theme/theme.module").then((m) => m.ThemeModule),
      },
      {
        path: "apps",
        loadChildren: () =>
          import("./views/apps/apps.module").then((m) => m.AppsModule),
      },
      {
        path: "widgets",
        loadChildren: () =>
          import("./views/widgets/widgets.module").then((m) => m.WidgetsModule),
      },
    ],
  },
  { path: "**", component: P404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
