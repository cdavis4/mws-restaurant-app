# Mobile Web Specialist Certification Course Project
---
#### _Three Stage Course Material Project - Restaurant Reviews_

Goal is to learn by converting static webpage to fully responsive, accessible mobile ready web application.

## Restaurants Reviews App: Stage 1

For the **Restaurant Reviews** projects, incrementally convert a static webpage to a mobile-ready web application. In **Stage One**, take a static design that lacks accessibility and convert the design to be responsive on different sized displays and accessible for screen reader use. Add a service worker to begin the process of creating a seamless offline experience for users.

### Requirements

**Make the provided site fully responsive** All of the page elements should be usable and visible in any viewport, including desktop, tablet, and mobile displays. Images shouldn't overlap, and page elements should wrap when the viewport is too small to display them side by side.

**Make the site accessible** 
Ensure that <kbd>alt</kbd> attributes are present and descriptive for images. Add screen-reader-only attributes when appropriate to add useful supplementary text. Use semantic markup where possible, and aria attributes when semantic markup is not feasible.

**Cache the static site for offline use.** Using Cache API and a ServiceWorker, cache the data for the website so that any page (including images) that has been visited is accessible offline.


## Restaurants Reviews App: Stage 2

In **Stage Two**, take the responsive, accessible design you built in **Stage One** and connect it to an external server. Use asynchronous JavaScript to request JSON data from the server. Store data received from the server in an offline database using IndexedDB, to create an app shell architecture. Finally, optimize site to meet performance benchmarks, tested using [Lighthouse](https://developers.google.com/web/tools/lighthouse/).

### Requirements

**Use server data instead of local memory** In the first version of the application, all of the data for the restaurants was stored in the local application. Change this behavior so that data comes from the server instead, and using the response data to generate the restaurant information on the main page and the detail page.

**Use IndexedDB to cache JSON responses** In order to maintain offline use with the development server update the service worker to store the JSON received by your requests using the IndexedDB API. As with Stage One, any page that has been visited by the user should be available offline, with data pulled from the shell database.

**Meet performance requirements** Once you have your app working with the server and working in offline mode, measure your site performance using [Lighthouse](https://developers.google.com/web/tools/lighthouse/).

Audits | Score
------------- | -------------
Progressive Web App | >= 90
Performance  | >= 70
Accessibility | >- 90

## Project Overview: Stage 3

For the **Restaurant Reviews** projects, you will incrementally convert a static webpage to a mobile-ready web application. In **Stage One**, you will take a static design that lacks accessibility and convert the design to be responsive on different sized displays and accessible for screen reader use. You will also add a service worker to begin the process of creating a seamless offline experience for your users.


[Lighthouse Score](https://googlechrome.github.io/lighthouse/viewer/?gist=67bb7c822fa2fd26ba5c1d78d05a34cf)


You have been provided the code for a restaurant reviews website. The code has a lot of issues. It’s barely usable on a desktop browser, much less a mobile device. It also doesn’t include any standard accessibility features, and it doesn’t work offline at all. Your job is to update the code to resolve these issues while still maintaining the included functionality. 

maintain use of ES6 in any additional JavaScript you write. 


