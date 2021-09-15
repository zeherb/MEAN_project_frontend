import { Component, Inject, OnInit } from "@angular/core";
import { DatePipe, DOCUMENT } from "@angular/common";
import { navItems } from "../../_nav";
import { EventService } from "../../services/event.service";
import { event } from "../../models/event";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  eventList: event[];

  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  constructor(
    private datePipe: DatePipe,
    private eventService: EventService,
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
    this.eventService.getAllEvents().subscribe(
      (res) => {
        this.eventList = res;
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.eventList.forEach((element) => {
          element.startDateTime = this.datePipe.transform(
            element.startDateTime,
            "dd-MMM-yyyy, HH:mm"
          );
          element.endDateTime = this.datePipe.transform(
            element.endDateTime,
            "dd-MMM-yyyy, HH:mm"
          );
        });
      }
    );
  }
}
