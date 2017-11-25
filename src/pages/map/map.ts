import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
declare let google:any;
/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  destination: string;
  constructor(private navCtrl: NavController, private navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    let place = this.navParams.get("place");
    if(place){
      this.destination = place;
    }
    this.showMap(this.navParams.get("pin"), this.navParams.get("zoom"));
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
        this.navCtrl.push("MapPage",{"pin":selectedPin,"zoom":15})    
      }     
    });
    if((event_obj.keyCode == 13) && (selectedPin == null)){
      //TODO: TOAST CONTROLLER
      console.log("Oops.. Couldn't find that location. Try another landmark !")
    }      
  }

  showMap(pin, zoomlevel){
    let options = {
      center: pin,
      zoom: zoomlevel,
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
