import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { TagsService } from "../../../../services/tags.service";
import { map, startWith } from "rxjs/operators";
import { ToasterService } from "angular2-toaster";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { AddNewTagComponent } from "../../../add-event/dialogs/add-new-tag/add-new-tag.component";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { EventService } from "../../../../services/event.service";
import { UpdateEventImageComponent } from "../update-event-image/update-event-image.component";
import { Router } from "@angular/router";

@Component({
  selector: "app-update-event",
  templateUrl: "./update-event.component.html",
  styleUrls: ["./update-event.component.css"],
})
export class UpdateEventComponent implements OnInit {
  eventForm: FormGroup;
  alltags: any;
  alltagsNames: any;
  filteredTags: Observable<string[]>;
  selectedTags: string[] = [];
  @ViewChild("tagInput") tagInput: ElementRef<HTMLInputElement>;
  minStartDate: Date;
  maxStartDate: Date;
  minEndDate: Date;
  eventTypeSelected: number;
  defaultHours: any;
  defaultStartDate: any;
  defaultEndDate: any;

  constructor(
    private dialogRef: MatDialogRef<UpdateEventComponent>,
    private tagService: TagsService,
    private toasterService: ToasterService,
    private dialog: MatDialog,
    private eventService: EventService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public selectedEvent: any
  ) {}

  ngOnInit(): void {
    this.selectedTags = [];
    this.selectedEvent.tags.forEach((element) => {
      this.selectedTags.push(element.name);
    });
    if (this.selectedEvent.eventType == "Free") {
      this.eventTypeSelected = 0;
    } else {
      this.eventTypeSelected = 1;
    }
    this.eventForm = new FormGroup({
      title: new FormControl(this.selectedEvent.title, Validators.required),
      description: new FormControl(
        this.selectedEvent.description,
        Validators.required
      ),
      price: new FormControl(
        this.selectedEvent.price,
        Validators.pattern("^[0-9]+(\\.[0-9][0-9]?)?")
      ),
      startDateTime: new FormControl(
        this.selectedEvent.startDateTime,
        Validators.required
      ),
      endDateTime: new FormControl("", Validators.required),
      location: new FormControl(
        this.selectedEvent.location,
        Validators.required
      ),
      tags: new FormControl("", Validators.required),
      availableTicketNumber: new FormControl(
        this.selectedEvent.availableTicketNumber,
        [Validators.required, Validators.pattern("^[0-9]*")]
      ),
      eventType: new FormControl(this.eventTypeSelected, Validators.required),
    });
    this.eventService.getEventById(this.selectedEvent._id).subscribe(
      (res) => {
        this.selectedEvent = res;
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.eventForm.controls.startDateTime.setValue(
          this.selectedEvent.startDateTime
        );
        this.eventForm.controls.endDateTime.setValue(
          this.selectedEvent.endDateTime
        );
      }
    );
    if (this.eventTypeSelected == 0) {
      this.eventForm.get("price").disable();
    }
    this.defaultHours = new Date().getHours() + 1;

    this.minStartDate = new Date();
    this.alltagsNames = [];
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

    this.filteredTags = this.eventForm.controls.tags.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) =>
        tag ? this._filter(tag) : this.alltagsNames.slice()
      )
    );
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
  remove(fruit: string): void {
    const index = this.selectedTags.indexOf(fruit);

    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
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
  changeDate() {
    if (this.eventForm.controls.startDateTime.value) {
      this.minEndDate = new Date(this.eventForm.controls.startDateTime.value);
    }
    if (this.eventForm.controls.endDateTime.value) {
      this.maxStartDate = new Date(this.eventForm.controls.endDateTime.value);
    }
  }
  eventTypeChange({ value }) {
    if (value === 0) {
      this.eventForm.get("price").setValue(0);
      this.eventForm.get("price").disable();
    } else {
      this.eventForm.get("price").enable();
    }
  }
  submitForm(form) {
    form.controls.tags.setValue(this.selectedTags[0]);
    if (form.status == "VALID") {
      const eventData = {
        title: form.value.title,
        description: form.value.description,
        price: form.value.price,
        location: form.value.location,
        tags: this.selectedTags,
        availableTicketNumber: form.value.availableTicketNumber,
        startDateTime: form.value.startDateTime,
        endDateTime: form.value.endDateTime,
        eventType: form.value.eventType,
      };
      this.eventService
        .updateEvent(this.selectedEvent._id, eventData)
        .subscribe(
          (res) => {
            console.log(res);
          },
          (err) => {
            console.log(err);
            let errorMessage = err.error
              .split("<pre>")
              .pop()
              .split("<br>")
              .shift();
            this.showToaster("error", "Error", errorMessage);
          },
          () => {
            this.showToaster(
              "success",
              "Success",
              "Event updated successfully"
            );
            this.eventForm.reset();
            this.dialogRef.close(true);
          }
        );
    } else {
      this.showToaster("error", "Error", "Invalid field");
    }
  }
  openChangeImageDialog() {
    const dialogRef = this.dialog.open(UpdateEventImageComponent, {
      height: "fit-content",
      minWidth: "300px",
      width: "50%",
      data: this.selectedEvent._id,
    });
  }
  logout() {
    localStorage.removeItem("loginToken");
    this.router.navigate(["/login"]);
  }
}
