import { event } from "./event";
export interface user {
  firstName: String;
  lastName: String;
  email: String;
  events: event[];
  role: String;
  birthDate: String;
  phone: String;
  address: String;
  avatar: String;
}
