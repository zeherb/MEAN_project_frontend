import { DatePipe, DOCUMENT } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToasterService } from "angular2-toaster";
import jwtDecode from "jwt-decode";
import { element } from "protractor";
import { environment } from "../../../environments/environment";
import { EventService } from "../../services/event.service";
import { TagsService } from "../../services/tags.service";
import { UserService } from "../../services/user.service";
import { navItems } from "../../_nav";
import { ConfirmationComponent } from "../users-admin/dialogs/confirmation/confirmation.component";
import { UpdateTagComponent } from "./dialogs/update-tag/update-tag.component";

@Component({
  selector: "app-tags-admin",
  templateUrl: "./tags-admin.component.html",
  styleUrls: ["./tags-admin.component.css"],
})
export class TagsAdminComponent implements OnInit {
  userId: any;
  connectedUser: any;
  baseUrl = environment.baseUrl;
  allTags: any[];
  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  constructor(
    private userservice: UserService,
    private toaster: ToasterService,
    private router: Router,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private tagService: TagsService,
    @Inject(DOCUMENT) _document?: any
  ) {
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized =
        _document.body.classList.contains("sidebar-minimized");
    });
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  ngOnInit(): void {
    this.userId = jwtDecode<any>(
      JSON.parse(localStorage.getItem("loginToken")).token
    ).userId;
    this.userservice.getUserById(this.userId).subscribe(
      (res) => {
        this.connectedUser = res;
      },
      (err) => {},
      () => {}
    );
    this.tagService.getAllTags().subscribe(
      (res) => {
        this.allTags = res;
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.allTags.forEach((element) => {
          element.createdAt = this.datePipe.transform(
            element.createdAt,
            "dd/MM/yyyy, HH:mm"
          );
          element.updatedAt = this.datePipe.transform(
            element.updatedAt,
            "dd/MM/yyyy, HH:mm"
          );
        });
      }
    );
  }
  logOut() {
    localStorage.removeItem("loginToken");
    this.toaster.pop("success", "Success", "Logged out successfully");
    this.router.navigate(["/login"]);
  }

  updateTag(tag) {
    const dialogRef = this.dialog.open(UpdateTagComponent, {
      height: "fit-content",
      minWidth: "300px",
      width: "70%",
      data: tag,
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.tagService.getAllTags().subscribe(
          (res) => {
            this.allTags = res;
          },
          (err) => {
            console.log(err);
          },
          () => {
            this.allTags.forEach((element) => {
              element.createdAt = this.datePipe.transform(
                element.createdAt,
                "dd/MM/yyyy, HH:mm"
              );
              element.updatedAt = this.datePipe.transform(
                element.updatedAt,
                "dd/MM/yyyy, HH:mm"
              );
            });
          }
        );
      }
    });
  }
  deleteTag(tag) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      height: "fit-content",
      minWidth: "280px",
      width: "50%",
      data: {
        title: "Delete Tag",
        userFirstName: tag.name,
        userLastName: "",
        message: "Are you sure you want to delete this tag : ",
      },
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.tagService.deleteTag(tag._id).subscribe(
          (res) => {},
          (err) => {
            console.log(err);
            this.toaster.pop("error", "Error", err.error.message);
          },
          () => {
            this.toaster.pop("success", "Success", "Tag deleted successfully");
            this.tagService.getAllTags().subscribe(
              (res) => {
                this.allTags = res;
              },
              (err) => {
                console.log(err);
              },
              () => {
                this.allTags.forEach((element) => {
                  element.createdAt = this.datePipe.transform(
                    element.createdAt,
                    "dd/MM/yyyy, HH:mm"
                  );
                  element.updatedAt = this.datePipe.transform(
                    element.updatedAt,
                    "dd/MM/yyyy, HH:mm"
                  );
                });
              }
            );
          }
        );
      }
    });
  }
  AtoZ() {
    this.allTags.sort(this.dynamicSort("name"));
  }
  ZtoA() {
    this.allTags.sort(this.dynamicSort("-name"));
  }
  creationUp() {
    this.tagService.getAllTags().subscribe(
      (res) => {
        this.allTags = res;
      },
      (err) => {
        console.log(err);
        this.toaster.pop("error", "Error", err.error.message);
      },
      () => {
        this.allTags.forEach((element) => {
          element.createdAt = new Date(element.createdAt).getTime();
        });
        this.allTags.sort(this.dynamicSort("createdAt"));
        this.allTags.forEach((element) => {
          element.createdAt = this.datePipe.transform(
            element.createdAt,
            "dd/MM/yyyy, HH,mm"
          );
          element.updatedAt = this.datePipe.transform(
            element.updatedAt,
            "dd/MM/yyyy, HH,mm"
          );
        });
      }
    );
  }
  creationDown() {
    this.tagService.getAllTags().subscribe(
      (res) => {
        this.allTags = res;
      },
      (err) => {
        console.log(err);
        this.toaster.pop("error", "Error", err.error.message);
      },
      () => {
        this.allTags.forEach((element) => {
          element.createdAt = new Date(element.createdAt).getTime();
        });
        this.allTags.sort(this.dynamicSort("-createdAt"));
        this.allTags.forEach((element) => {
          element.createdAt = this.datePipe.transform(
            element.createdAt,
            "dd/MM/yyyy, HH,mm"
          );
          element.updatedAt = this.datePipe.transform(
            element.updatedAt,
            "dd/MM/yyyy, HH,mm"
          );
        });
      }
    );
  }
  updateUp() {
    this.tagService.getAllTags().subscribe(
      (res) => {
        this.allTags = res;
      },
      (err) => {
        console.log(err);
        this.toaster.pop("error", "Error", err.error.message);
      },
      () => {
        this.allTags.forEach((element) => {
          element.updatedAt = new Date(element.updatedAt).getTime();
        });
        this.allTags.sort(this.dynamicSort("updatedAt"));
        this.allTags.forEach((element) => {
          element.createdAt = this.datePipe.transform(
            element.createdAt,
            "dd/MM/yyyy, HH,mm"
          );
          element.updatedAt = this.datePipe.transform(
            element.updatedAt,
            "dd/MM/yyyy, HH,mm"
          );
        });
      }
    );
  }
  updateDown() {
    this.tagService.getAllTags().subscribe(
      (res) => {
        this.allTags = res;
      },
      (err) => {
        console.log(err);
        this.toaster.pop("error", "Error", err.error.message);
      },
      () => {
        this.allTags.forEach((element) => {
          element.updatedAt = new Date(element.updatedAt).getTime();
        });
        this.allTags.sort(this.dynamicSort("-updatedAt"));
        this.allTags.forEach((element) => {
          element.createdAt = this.datePipe.transform(
            element.createdAt,
            "dd/MM/yyyy, HH,mm"
          );
          element.updatedAt = this.datePipe.transform(
            element.updatedAt,
            "dd/MM/yyyy, HH,mm"
          );
        });
      }
    );
  }
  dynamicSort(property) {
    let sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      let result =
        a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
      return result * sortOrder;
    };
  }
}
