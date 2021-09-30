import { Component, OnInit, ViewEncapsulation, OnDestroy } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { ToasterConfig } from "angular2-toaster";
// import * as io from "socket.io-client";
import { io } from "socket.io-client";
import { environment } from "../environments/environment";
import jwtDecode from "jwt-decode";
import { SocketService } from "./services/socket.service";
import { AuthentificationService } from "./services/authentification.service";
@Component({
  selector: "body",
  styleUrls: ["../scss/vendors/toastr/toastr.scss"],
  templateUrl: "./app.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  public toasterconfig: ToasterConfig = new ToasterConfig({
    tapToDismiss: true,
    timeout: 5000,
  });
  socket: any;
  data: any;
  userId: any;
  constructor(
    private router: Router,
    private socketService: SocketService,
    private authService: AuthentificationService
  ) {
    this.socket = io(environment.baseUrl, { transports: ["websocket"] });
  }

  ngOnInit() {
    const token = localStorage.getItem("loginToken");
    if (token) {
      const loggedIn = this.authService.checkLoggedIn();
      if (loggedIn) {
        this.userId = jwtDecode<any>(
          JSON.parse(localStorage.getItem("loginToken")).token
        ).userId;
        this.socket.on("connected", () => {
          this.socketService.saveId(this.userId).subscribe(
            (res) => {},
            (err) => {},
            () => {}
          );
        });
      }
    }

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
