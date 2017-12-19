import { Component,ViewChild,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
declare let google: any;
/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  segment: "home"
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  constructor(private navCtrl: NavController, private navParams: NavParams) {
  
  }
  destination: string;
  locationErrorInfo: string = null;
  favouriteList: Array<Object> = [];

  findUserLocation<Promise>(){
    return new Promise<any>((resolve,reject) => {
      if(!!navigator.geolocation) {
        let self= this;
        navigator.geolocation.getCurrentPosition(function(position) {             
          let geolocation:any = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          self.navCtrl.push("MapPage",{"pin":geolocation});    
          resolve(geolocation);
        },function(error){  
            reject(error.message);
        },{ enableHighAccuracy: true, maximumAge: 100, timeout: 60000 }
      );      
      } else {
        reject("GPS not supported");
      }
    })
  }
  goToFavourite(pin){
    this.navCtrl.push("MapPage",{"pin":pin});    
  }

  populateFavouriteList(){
    this.favouriteList = [];
    for (var i = 0; i < localStorage.length; i++){
      if(localStorage.key(i).indexOf("ionic") == -1)
      this.favouriteList.push({"name":localStorage.key(i), "data":JSON.parse(localStorage.getItem(localStorage.key(i)))});
    }    
    if (this.favouriteList.length == 0){
        this.favouriteList.push({"name":"Your favourite area is empty :("});
    }
  }

  ionViewWillEnter() {      
      this.populateFavouriteList();
      this.destination = "";
  }

  suggest(event_obj){
    let selectedPin = null;
    let autocomplete = new google.maps.places.Autocomplete(event_obj.target, {});
    google.maps.event.addListener(autocomplete, 'place_changed', () => {      
      let place = autocomplete.getPlace();
      if(place.geometry){
        let latitude = place.geometry.location.lat();
        let longitude = place.geometry.location.lng();
        selectedPin = new google.maps.LatLng(latitude, longitude);
        this.navCtrl.push("MapPage",{"pin":selectedPin})    
      }     
    });
    if((event_obj.keyCode == 13) && (selectedPin == null)){
      //TODO: TOAST CONTROLLER
      console.log("Oops.. Couldn't find that location. Try another landmark !")
    }
      
  }

}
