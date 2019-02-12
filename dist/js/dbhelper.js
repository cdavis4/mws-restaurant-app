
/**
 * Common database helper functions.
 */
class DBHelper {
   /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
  
    return `https://restaurantsserver.herokuapp.com/restaurants`;
  }
  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get REVIEWS_URL() {
 
    return `https://restaurantsserver.herokuapp.com/reviews`;
  }
/**
   * Fetch all reviews.
   */
  static fetchReviews(callback) {
    //fetch(DBHelper.REVIEWS_URL)
    fetch(DBHelper.REVIEWS_URL + `/?restaurant_id=${id}`)
     .then(response => {
       if(!response.ok){
         throw Error(`Request failed. Returned status of ${response.statusText}`);
       }
       const reviews = response.json();
       return reviews;
       
     })
     .then(reviews => callback(null, reviews))
   
     .catch(error => {
       callback(error,null);
     });
   }
 
  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    fetch(DBHelper.DATABASE_URL)
     .then(response => {
       if(!response.ok){
         throw Error(`Request failed. Returned status of ${response.statusText}`);
       }
       const restaurants = response.json();
       return restaurants;
     })
     .then(restaurants => callback(null, restaurants))
   
     .catch(error => {
       callback(error,null);
     });
   }
   /**
    * Fetch star code credit https://james-priest.github.io
    */

   static markFavorite(id) {
    fetch(DBHelper.DATABASE_URL + '/' + id + '/?is_favorite=true', {
      method: 'PUT'
    });
  }
  
  static unMarkFavorite(id) {
    fetch(DBHelper.DATABASE_URL + '/' + id + '/?is_favorite=false', {
      method: 'PUT'
    });
  }

  //delete review
  static deleteReview(id) {
    fetch(DBHelper.REVIEWS_URL + '/' + id, {
      method: 'DELETE'
    });
  }
  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {

        const restaurant = restaurants.find(r => r.id == id);
        console.log(restaurants);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch a review by its ID.
   */
static fetchReviewsById(id, callback) {
    // fetch all restaurants with proper error handling.
    fetch(DBHelper.REVIEWS_URL + `/?restaurant_id=${id}`)
    .then(response => response.json())
    .then(data => callback(null, data))
    .catch(error => callback(error, null));
}


  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }
  /**
   * Reviews page URL.
   */
  static urlForReviews(id) {
    return(DBHelper.REVIEWS_URL + `/reviews/?restaurant_id=${id}`);
  }

  //postData = () => {
  static postData(){
    // Default options are marked with *
    //created from example from mozillia dev pages
    // credit offline, offline code and form submit idea from Project 3 Live Webinar MWS Stage 3 | Elisa & Lorenzo
    event.preventDefault();
    
    let restaurant_id = getParameterByName('id');  
    let reviewer_name = document.getElementById('name').value;
    let rating = document.querySelector('#rating option:checked').value;
    let comment_text = document.getElementById('comments').value;
    
    let review_body = {
      "restaurant_id": restaurant_id,
      "name": reviewer_name,
      "rating": rating,
      "comments": comment_text
      };
      if(!navigator.onLine)
      {
        console.log("Request is offline");
        let request = JSON.stringify(review_body);
        let modal = document.getElementById("myModal");
        modal.style.display = "none";
        //idbReviewLocal(request); 
      //  idbOfflineKeyVal.set('id', request);
      localStorage.setItem(restaurant_id,request);
      alert("Review will be stored offline");
      }
   
      const myPost = fetch(DBHelper.REVIEWS_URL, {
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
     return myPost;
    }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
  return (`/img/${restaurant.photograph}-600_1x.jpg`);
  //return (`/img/${restaurant.photograph}-300_2x.jpg`);
  }
  /**
   * Map marker for a restaurant.
   */
   static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker  
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {title: restaurant.name,
      alt: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant)
      })
      marker.addTo(newMap);
    return marker;
  } 


}

