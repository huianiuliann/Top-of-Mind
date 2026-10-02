import { IconCalendarEvent, IconFileInvoice, IconShoppingCart } from "@tabler/icons-react";
import { L } from "../i18n";

// The three ways people buy. Pages spread one and add their own copy; the visuals stay with the pages that draw them.
export const QUOTE = {
  id: "quote",
  name: L("The quote", "Oferta"),
  icon: IconFileInvoice,
  report: L("Qualified quote requests", "Cereri de ofertă calificate"),
};
export const CART = {
  id: "cart",
  name: L("The cart", "Coșul"),
  icon: IconShoppingCart,
  report: L("Profitable orders", "Comenzi profitabile"),
};
export const CALENDAR = {
  id: "calendar",
  name: L("The calendar", "Calendarul"),
  icon: IconCalendarEvent,
  report: L("Direct bookings, dead days filled", "Rezervări directe și zile goale umplute"),
};
export const BUYING_MODES = [QUOTE, CART, CALENDAR];
