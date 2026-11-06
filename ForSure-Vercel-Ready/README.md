# ForSure Courts

Pickleball court rental prototype (sample data, simulated SMS).

```
index.html         
css/
  tokens.css        colors, radii, light/dark themes
  base.css          reset, typography, layout utilities
  layout.css        header, nav, footer
  components.css    buttons, badges, cards, forms, stepper, modal, toast
  pages.css         hero, court cards, slot grid, tables, SMS phone mock
  admin.css         admin shell, KPIs, charts
  responsive.css    all breakpoints (1024 / 900 / 600 / 400)
js/                 load order matters (see index.html)
  utils.js          date, currency and escape helpers
  data.js           sample courts, bookings, availability logic
  sms.js            simulated SMS templates
  components.js     court SVG, phone mock, slot grid, date strip
  shell.js          header and footer
  pages-customer.js customer pages
  pages-admin.js    admin pages and modal
  app.js            render loop, events, validation, submit
```


## Open Play feature (added)

- Open Play is available in the customer navigation and the Admin sidebar.
- Admins can create a session by selecting an open court, date, time, duration, player capacity, and per-player fee. The form checks for overlapping existing court reservations and Open Play sessions.
- Published sessions appear on the customer Open Play page. Players can register by name and cancel a registration; remaining slots and the FULL status are recalculated automatically.
- Admins can review registered players and cancel a session.
- Open Play sessions and registrations are persisted in this browser using `localStorage` (`forsure_openplay_v1`). Clearing browser site data removes this prototype data.

### Important database limitation
This repository contains only static HTML, CSS, and JavaScript. It does not include a server, API, authentication system, or database schema/connection. Therefore this implementation is a functional single-browser prototype, not a production multi-user booking system. Data created in one browser is not visible to other devices or users. To support shared live bookings, add a backend API and connect it to the project's actual database; no existing database could be reused because none was supplied. Player cancellation controls are also prototype-level and need authenticated ownership checks on the server before deployment.

### Run
Open `index.html` in a browser (or serve the `forsure-courts` folder with a local static web server). Switch to **Admin → Open Play** to create a session, then switch to **Customer → Open Play** to view and book it in the same browser.
