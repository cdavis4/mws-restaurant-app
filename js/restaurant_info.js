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
  createReviewModal(restaurant); // create modal with review form
  
console.log(reviews);
  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  
  const ul = document.getElementById('reviews-list');
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

createForm = (restaurant=self.restaurant) => {

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

  //create review div
  const div_rating = document.createElement('div');
  const label_rating = document.createElement('label');
  label_rating.setAttribute("for","rating");
  label_rating.innerHTML="Rating:";
  const input_rating = document.createElement('input');
  input_rating.setAttribute("id","rating");
  input_rating.setAttribute("rating","rating");
  input_rating.setAttribute("type","text");
  div_rating.appendChild(label_rating);
  div_rating.appendChild(input_rating);
  //add to form
  const form = document.createElement('form');
  form.appendChild(div_name);
  form.appendChild(div_rating);
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