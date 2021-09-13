import { Component, Inject, OnInit } from "@angular/core";
import { DatePipe, DOCUMENT } from "@angular/common";
import { navItems } from "../../_nav";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-add-event",
  templateUrl: "./add-event.component.html",
  styleUrls: ["./add-event.component.css"],
})
export class AddEventComponent implements OnInit {
  eventForm: FormGroup;
  minStartDate: Date;
  minEndDate: Date;

  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;

  constructor(private customDate: DatePipe, @Inject(DOCUMENT) _document?: any) {
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
    this.eventForm = new FormGroup({
      title: new FormControl(""),
      description: new FormControl(""),
      price: new FormControl(""),
      startDateTilme: new FormControl(""),
      endDateTime: new FormControl(""),
      location: new FormControl(""),
      tags: new FormControl(""),
      availableTicketNumber: new FormControl(""),
      eventType: new FormControl(""),
    });
    this.minStartDate = new Date();
  }
  changeDate() {
    console.log(this.minEndDate);
    this.minEndDate = new Date(this.eventForm.controls.startDateTilme.value);
  }
  submitForm(form) {
    console.log(form.value);
  }
}
