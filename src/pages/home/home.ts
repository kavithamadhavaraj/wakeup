import { Component,ViewChild,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
declare let google: any;
/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  
  }
  destination: String;
  locationErrorInfo: string = null;

  findUserLocation<Promise>(){
    return new Promise<any>((resolve,reject) => {
      if(!!navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {             
          let geolocation:any = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          resolve(geolocation);
        },function(error){  
            reject(error.message);
        });      
      } else {
        reject("GPS not supported");
      }
    })
  }


  ionViewDidLoad() {
      this.findUserLocation().then((pin)=>{
        this.showMap(pin);
      }).catch((error)=>{
        this.locationErrorInfo = error;
      });  
  }

  suggest(event_obj){
    let selectedPin = null;
    let autocomplete = new google.maps.places.Autocomplete(event_obj.target, {types: ['geocode']});
    google.maps.event.addListener(autocomplete, 'place_changed', () => {      
      let place = autocomplete.getPlace();
      if(place.geometry){
        let latitude = place.geometry.location.lat();
        let longitude = place.geometry.location.lng();
        selectedPin = new google.maps.LatLng(latitude, longitude);
        this.showMap(selectedPin);        
      }     
    });
    if((event_obj.keyCode == 13) && (selectedPin == null)){
      //TODO: TOAST CONTROLLER
      console.log("Oops.. Couldn't find that location. Try another landmark !")
    }
      
  }

  showMap(pin){
    let options = {
      center: pin,
      zoom:15,
      gestureHandling : "cooperative",
      streetViewControl: false
    }
    let map = new google.maps.Map(document.getElementById("map"), options);
    let marker = new google.maps.Marker({
      position: pin,
      map: map
    });         
    map.setCenter(pin);
  }
}
