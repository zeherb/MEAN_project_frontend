import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { navItems } from "../../nav";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { MatChipInputEvent } from "@angular/material/chips";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { TagsService } from "../../services/tags.service";
import { ToasterService } from "angular2-toaster";
import { MatDialog } from "@angular/material/dialog";
import { AddNewTagComponent } from "./dialogs/add-new-tag/add-new-tag.component";
import { EventService } from "../../services/event.service";
import { Router } from "@angular/router";
import { UserService } from "../../services/user.service";
import { user } from "../../models/user";
import { environment } from "../../../environments/environment";
import jwtDecode from "jwt-decode";
import { navAdminItems } from "../../nav-admin";

@Component({
  selector: "app-add-event",
  templateUrl: "./add-event.component.html",
  styleUrls: ["./add-event.component.css"],
})
export class AddEventComponent implements OnInit {
  baseUrl = environment.baseUrl;
  eventForm: FormGroup;
  minStartDate: Date;
  maxStartDate: Date;
  minEndDate: Date;
  defaultHours: any;
  alltags: any[];
  alltagsNames: string[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredTags: Observable<string[]>;
  selectedTags: string[] = [];
  connectedUser: user;
  userId: any;

  @ViewChild("tagInput") tagInput: ElementRef<HTMLInputElement>;

  // default
  navItems: any;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;

  constructor(
    private router: Router,
    private userService: UserService,
    private eventService: EventService,
    private dialog: MatDialog,
    private toasterService: ToasterService,
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
    this.userService.getUserById(this.userId).subscribe(
      (res) => {
        this.connectedUser = res;
      },
      (err) => {
        console.log(err);
      },
      () => {
        if (this.connectedUser.role === "admin") {
          this.navItems = navAdminItems;
        } else {
          this.navItems = navItems;
        }
      }
    );

    this.tagService.getAllTags().subscribe(
      (res) => {
        this.alltags = res;
        res.forEach((element) => {
          this.alltagsNames.push(element.name.toLowerCase());
        });
      },
      (err) => {
        console.log(err);
      },
      () => {}
    );

    this.defaultHours = new Date().getHours() + 1;
    this.eventForm = new FormGroup({
      title: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required),
      price: new FormControl(
        "",
        Validators.pattern("^[0-9]+(\\.[0-9][0-9]?)?")
      ),
      startDateTime: new FormControl("", Validators.required),
      endDateTime: new FormControl("", Validators.required),
      location: new FormControl("", Validators.required),
      tags: new FormControl("", Validators.required),
      availableTicketNumber: new FormControl("", [
        Validators.required,
        Validators.pattern("^[0-9]*"),
      ]),
      eventType: new FormControl("", Validators.required),
      image: new FormControl("", Validators.required),
      fakeImage: new FormControl("", Validators.required),
      readOnlyInput: new FormControl("", [
        Validators.required,
        Validators.pattern("[^\\s]+(.*?)\\.(jpg|jpeg|png)$"),
      ]),
    });
    this.minStartDate = new Date();
    this.filteredTags = this.eventForm.controls.tags.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) =>
        tag ? this._filter(tag) : this.alltagsNames.slice()
      )
    );
  }

  changeDate() {
    if (this.eventForm.controls.startDateTime.value) {
      this.minEndDate = new Date(this.eventForm.controls.startDateTime.value);
    }
    if (this.eventForm.controls.endDateTime.value) {
      this.maxStartDate = new Date(this.eventForm.controls.endDateTime.value);
    }
  }
  submitForm(form) {
    this.eventForm.controls.tags.setValue(this.selectedTags[0]);
    if (form.status === "VALID") {
      let formData = new FormData();
      formData.append("title", form.get("title").value);
      formData.append("description", form.get("description").value);
      formData.append("price", form.get("price").value);
      formData.append("location", form.get("location").value);
      formData.append("tags", JSON.stringify(this.selectedTags));
      formData.append(
        "availableTicketNumber",
        form.get("availableTicketNumber").value
      );
      formData.append("startDateTime", form.get("startDateTime").value);
      formData.append("endDateTime", form.get("endDateTime").value);
      formData.append("eventType", form.get("eventType").value);
      formData.append("image", form.get("fakeImage").value);
      this.eventService.addNewEvent(this.userId, formData).subscribe(
        (res) => {
          console.log(res);
        },
        (err) => {
          console.log(err);
        },
        () => {
          this.showToaster("success", "Success", "Event created successfully");
          this.eventForm.reset();
          this.router.navigate(["/home"]);
        }
      );
    }
  }

  add(event: MatChipInputEvent): void {
    const value = event.value.trim();
    if (
      !this.alltagsNames.includes(value.toLocaleLowerCase()) &&
      value !== ""
    ) {
      this.showToaster(
        "error",
        "This tag does not exist!",
        "You can add it by clicking on the add button"
      );
      event.input.value = "";

      this.eventForm.controls.tags.setValue(null);
    }
  }

  remove(fruit: string): void {
    const index = this.selectedTags.indexOf(fruit);

    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (
      this.alltagsNames.includes(event.option.viewValue) &&
      !this.selectedTags.includes(event.option.viewValue)
    ) {
      this.selectedTags.push(event.option.viewValue);
    } else if (!this.alltagsNames.includes(event.option.viewValue)) {
      this.showToaster(
        "error",
        "This tag does not exist!",
        "You can add it by clicking on the add button"
      );
    } else {
      this.showToaster("warning", "warning", "This tag is already selected");
    }
    this.tagInput.nativeElement.value = "";
    this.eventForm.controls.tags.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.alltagsNames.filter((tag) =>
      tag.toLowerCase().includes(filterValue)
    );
  }

  showToaster(type, title, err) {
    this.toasterService.pop(type, title, err);
  }
  addTagDialog() {
    const dialogRef = this.dialog.open(AddNewTagComponent, {
      height: "fit-content",
      minWidth: "300px",
      width: "50%",
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.tagService.getAllTags().subscribe(
          (res) => {
            this.alltags = res;
            this.alltagsNames = [];
            res.forEach((element) => {
              this.alltagsNames.push(element.name.toLowerCase());
            });
          },
          (err) => {
            console.log(err);
          },
          () => {}
        );
      }
    });
  }
  eventTypeChange({ value }) {
    if (value === 0) {
      this.eventForm.get("price").setValue(0);
      this.eventForm.get("price").disable();
    } else {
      this.eventForm.get("price").enable();
    }
  }

  fileSelected(fi, roi, event) {
    if (fi.value !== null && fi.value !== "" && fi.value !== undefined) {
      roi.value = fi.files[0].name;
      this.eventForm.controls.readOnlyInput.setValue(roi.value);
      const file = (event.target as HTMLInputElement).files[0];
      this.eventForm.patchValue({
        fakeImage: file,
      });
      this.eventForm.get("image").updateValueAndValidity();
    } else {
      roi.value = "";
      this.eventForm.controls.readOnlyInput.setValue(roi.value);
    }
  }
  logOut() {
    localStorage.removeItem("loginToken");
    this.toasterService.pop("success", "Success", "Logged out successfully");
    this.router.navigate(["/login"]);
  }
}
