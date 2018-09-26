//if (typeof getLocalReview() === "undefined") {
//  self.importScripts('../sw.js');
//}
window.addEventListener('online', (event)=>{
  console.log('Browser is online again');
  let keys = Object.keys(localStorage);
  i = keys.length;
  for(var i=0; i < localStorage.length; i++)
 { 
 let obj = JSON.parse(localStorage.getItem(localStorage.key(i)));
 let review_body = {
  "restaurant_id": obj.restaurant_id,
  "name": obj.name,
  "rating": obj.rating,
  "comments": obj.comments
  };
 fetch(DBHelper.REVIEWS_URL, {
  method: "POST", // *GET, POST, PUT, DELETE, etc.
  mode: "cors", // no-cors, cors, *same-origin
  cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  credentials: "same-origin", // include, same-origin, *omit
  headers: {
      "Content-Type": "application/json; charset=utf-8",
     // "Content-Type": "application/x-www-form-urlencoded",
  },
  redirect: "follow", // manual, *follow, error
  referrer: "no-referrer", // no-referrer, *client
  body: JSON.stringify(review_body), // body data type must match "Content-Type" header
}).then(response => response.json()); // parses response to JSO
console.log(myPost);
let modal = document.getElementById("myModal");
modal.style.display = "none";
  }
  localStorage.clear();
});
/**
 * set up variables
 */
let restaurant;
var newMap;

/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {  
  initMap();
});

/**
 * Initialize leaflet map
 */
initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {      
      self.newMap = L.map('map', {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
        scrollWheelZoom: false
      });
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
        mapboxToken: 'pk.eyJ1IjoiY2RhdmlzNCIsImEiOiJjamxpOHVvNnIwYjJnM3ByMjFwcW9jdjk5In0.WrX96W6zbl7Vo3Y8A2Vvfw',
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'    
      }).addTo(newMap);
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    }
  });
}  

/* window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
} */

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

/**
 * activate the add review button
 */


/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;


  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img';

 
 // added alt attribute and srcset

image.alt = "photo from restaurant " + restaurant.name;

image.srcset = "/img/"+ restaurant.id + "-300_1x.jpg 400w, /img/" 
+restaurant.id + "-600_1x.jpg 1000w, /img/" + restaurant.id  + "-600_2x.jpg 4000w";
 
  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  DBHelper.fetchReviewsById(restaurant.id,fillReviewsHTML);
}
  //DBHelper.fetchReviewsById(restaurant.id, (error, reviews) => {
 // self.restaurant.reviews = reviews;
  //console.log(reviews);
  // if (!reviews) {
  //    console.error(error);
  //    return;
   // }
   //fillReviewsHTML();
 // callback(null, reviews);
// });
//}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
const fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */


fillReviewsHTML = (error,reviews) => {
  self.restaurant.reviews = reviews;
  if (error) {
    console.log('Error retrieving reviews', error);
  }
 
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h3');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  //add Add Review Button
  const reviewButton = document.createElement('button');
  reviewButton.innerHTML = 'Add Review';
  container.appendChild(reviewButton);
  reviewButton.setAttribute("id", "reviewBtn");
  reviewButton.setAttribute("role", "button");
  reviewButton.setAttribute("aria-label", "add review");
  //get reviews for restaurant
  //reviewButton .addEventListener ("click", function() {
  //const form_url = '/form.html';
  //window.location.replace(form_url);
  //});

  //This listens if online
  createReviewModal(restaurant); // create modal with review form
  
//console.log(reviews);
  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  const li = document.createElement('li');
 
  if(localStorage.length > 0){
    let id = getParameterByName('id');
    console.log(id, "HI THIS IS ID For restaurant");
    createOfflineHTML(id);
    }
  
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement('p');
  var date_local = new Date(review.createdAt);
  //date_local.setUTCSeconds(review.createdAt); 
  date.innerHTML = date_local.toLocaleDateString();
  li.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.setAttribute("class", "comments");
  comments.innerHTML = review.comments;
  li.appendChild(comments);
  return li;
}
/**
 * Offline review HTML add to webpage.
 */
createOfflineHTML = (id)=> {
  li.setAttribute("class","offline");
  let li = document.getElementsByClassName("offline");
  let id =  '1';
  let obj = localStorage.getItem(id);
  if(obj.restaurant_id === id)
  {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = json.name;
  li.appendChild(name);

  const date = document.createElement('p');
  var date_local = new Date(json.createdAt);
  //date_local.setUTCSeconds(review.createdAt); 
  date.innerHTML = date_local.toLocaleDateString();
  li.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${json.rating}`;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.setAttribute("class", "comments");
  comments.innerHTML = json.comments;
  li.appendChild(comments);
  const ul = document.getElementById('reviews-list');
  ul.appendChild(li);
  }
}

/**
 * Create review modal HTML and add it to the webpage.
*/ 
createReviewModal = (restaurant) =>{
  const main = document.getElementById('maincontent');
  const div = document.createElement('div');
  div.setAttribute("id", "myModal");
  div.setAttribute("class", "modal");
  main.appendChild(div);
  const divContent = document.createElement('div');
  divContent.setAttribute("class", "modal-content");
  div.appendChild(divContent);
  const span = document.createElement('span');
  span.setAttribute("class", "close");
  span.innerHTML = "&times";
  divContent.appendChild(span);
  
  divContent.appendChild(createForm(restaurant));


  // add submit for form
  //const form = document.getElementById('review_form');
  //form.addEventListener ("submit", event => {
  //  event.preventDefault();
  //})
  //  form.addEventListener('click', function(clickEvent){
  //  const domEvent = document.createEvent('Event')
  //  domEvent.initEvent('submit',false, true)
  //  clickEvent.target.closest('form').dispatchEvent(domEvent);
  //  console.log("HI this was clicked");
  //  postData();
   //.catch(error => console.error(error));
  // });

  // Get the modal button, close button and modal
  const modal = document.getElementById("myModal");
  const closeBtn = document.getElementsByClassName("close")[0];
  const btn = document.getElementById('reviewBtn');
  btn.addEventListener ("click", function() {
    modal.style.display = "block";
    modal.querySelector('input').focus();
  });

  closeBtn.addEventListener("click",function() {
    modal.style.display = "none";
  });
  window.addEventListener("click",function(){
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
}

//keep form from default opening dataurl submit page
//document.querySelector(".submit_button").addEventListener('onsubmit',function(event){
 // event.preventDefault()
//});
//const submit = document.getElementsByClassName("submit_button");
//submit.addEventListener('submit',function(event){
//  event.preventDefault()
//});
//document.getElementsByClassName("submit_button").addEventListener("click", function(event){
 // event.preventDefault()
//});


createForm = (restaurant=self.restaurant) => {
  const form = document.createElement('form');
  form.setAttribute("id","review_form");

 const h3 = document.createElement('h3');
 h3.innerHTML = "Add Review";

 //create restaurant id
 const restaurantID = document.createElement("input");
 restaurantID.setAttribute("type", "hidden");
 restaurantID.setAttribute("id", "restaurant_id");
 restaurantID.setAttribute("name", "restaurant_id");
 restaurantID.setAttribute("value", restaurant.id);
  //create name div
  const div_name = document.createElement('div');
  const label_name = document.createElement('label');
  label_name.setAttribute("for","name");
  label_name.innerHTML="Name:";
  const input_name = document.createElement('input');
  input_name.setAttribute("id","name");
  input_name.setAttribute("name","name");
  input_name.setAttribute("type","text");
  div_name.appendChild(label_name);
  div_name.appendChild(input_name);

  //create rating div

  const div_rating = document.createElement('div');
  const select_rating = document.createElement('select');
  select_rating.setAttribute('id', "rating");
  const label_rating = document.createElement('label');
  label_rating.setAttribute("for","rating");
  label_rating.innerHTML="Rating:";
  select_rating.setAttribute("name","rating");
  const option1 = document.createElement('option');
  option1.setAttribute("value","1");
  option1.innerHTML="1";
  const option2 = document.createElement('option');
  option2.setAttribute("value","2");
  option2.innerHTML="2";
  const option3 = document.createElement('option');
  option3.setAttribute("value","3");
  option3.innerHTML="3";
  const option4 = document.createElement('option');
  option4.setAttribute("value","4");
  option4.innerHTML="4";
  const option5 = document.createElement('option');
  option5.setAttribute("value","5");
  option5.innerHTML="5";
  select_rating.setAttribute("id","rating");
  select_rating.appendChild(option1);
  select_rating.appendChild(option2);
  select_rating.appendChild(option3);
  select_rating.appendChild(option4);
  select_rating.appendChild(option5);
  div_rating.appendChild(label_rating);
  div_rating.appendChild(select_rating);

  const div_comments = document.createElement('div');
  const label_comments = document.createElement('label');
  label_comments.setAttribute("for","comments");
  label_comments.innerHTML="Review:";
  const text_comments = document.createElement('textarea');
  text_comments.setAttribute("name","comments");
  text_comments.setAttribute("id","comments");
  text_comments.setAttribute("form", "review_form");
  div_comments.appendChild(label_comments);
  div_comments.appendChild(text_comments);

  const input_button = document.createElement('button');
  input_button.setAttribute("onclick","DBHelper.postData()")
  input_button.setAttribute("id","submit_button");
  input_button.innerHTML ="Submit Review";
  //add to form

  form.appendChild(restaurantID);
  form.appendChild(div_name);
  form.appendChild(div_rating);
  form.appendChild(div_comments);
  form.appendChild(input_button);
  form.setAttribute("action",DBHelper.REVIEWS_URL);
  form.setAttribute("method", "post");
  return form;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}



 // cache review if offline
// event.waitUntil(
//  caches.open('static-v1').then(cache => cache.add('/cat.svg'))
//);
//});
// Example POST method implementation:

 //* Add restaurant name to the breadcrumb navigation menu




 