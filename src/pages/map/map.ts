import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
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
  radius: number;
  fence : any;
  geoCoder : any;
  map : any;
  autocomplete: any;
  currentLocationMarker : any;
  watchId: any;
  startWatch : boolean =  false;
  
  constructor(private navCtrl: NavController, private navParams: NavParams, private alertCtrl : AlertController) {
    this.geoCoder = new google.maps.Geocoder();
    this.currentLocationMarker = new google.maps.Marker({
      position: null,
      map: null,
      icon: "../../assets/icon/user_location.png"      
    });
    
  }

  startOrStopWatching(){
    this.startWatch = !this.startWatch;  
    if(!this.startWatch)
      this.stopWatching();
    else
      this.findUserLocation(); 
     
  }

  stopWatching(){
    this.watchId = navigator.geolocation.clearWatch(this.watchId);
    this.currentLocationMarker.setPosition(null);
    this.map.setCenter(this.navParams.get("pin"));
  }

  setSearchBarData(pin){
    let self = this;
    if(pin){
      this.doGeocode(pin).then((data) =>{ self.destination = data; });
    }
  }

  findUserLocation(){
    if(this.watchId === undefined){
      if(!!navigator.geolocation) {
        let self= this;
        this.watchId = navigator.geolocation.watchPosition(function(position) {             
          self.showCurrentUserLocation(position);
        },function(error){  
            console.log("error in watch position");
        },{ enableHighAccuracy: true, maximumAge: 100, timeout: 60000 }
      );
      } else {
        console.log("GPS not supported");
      }
    }
  }

  showCurrentUserLocation(position){
    let geolocation:any = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);   
    this.map.setCenter(geolocation);
    console.log("Watching position...");
    console.log(geolocation);
    this.currentLocationMarker.setMap(this.map);
    this.currentLocationMarker.setPosition(geolocation);
    if (google.maps.geometry.spherical.computeDistanceBetween(geolocation, this.fence.getCenter()) <= this.fence.getRadius()) {
      alert("You have entered the region.. Wakeup..");
      //TODO: VIBRATION AND NOTIFICATION
    }
    else{
      console.log("Outside");
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    let pin = this.navParams.get("pin");  
    this.setSearchBarData(pin);  
    this.showMap(pin);
  }

  doGeocode(pin){
    return new Promise<string>((resolve, reject) =>{
      this.geoCoder.geocode({"location":pin}, function(results, status){
        if (status === 'OK') {
          resolve(results[0].formatted_address);
        }
        else
          reject("Error");
      })
    })
  }

  suggest(event_obj){
    let selectedPin = null;
    this.autocomplete = new google.maps.places.Autocomplete(event_obj.target, {});
    google.maps.event.addListener(this.autocomplete, 'place_changed', () => {      
      let place = this.autocomplete.getPlace();
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

  createFence(map){
    this.fence = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map,
      center: map.center,
      radius: this.radius * 1,
      clickable: false   
    });
  }

  showMap(pin){
    let self = this;
    let options = {
      center: pin,
      zoom: 15,
      streetViewControl: false
    }
    this.map = new google.maps.Map(document.getElementById("map"), options);
    let marker = new google.maps.Marker({
      position: pin,
      map: this.map,
      draggable: true,
      clickable: true,
      icon: "../../assets/icon/locate.png"
    });
    marker.addListener('mouseup', function() {
      self.destination = marker.getPlace();
      self.map.setCenter(marker.getPosition());
      self.fence.setMap(null);
      self.createFence(self.map);
      self.stopWatching();
      self.setSearchBarData(marker.getPosition());
    });

    let alarmModel = this.alertCtrl.create({
      title: "Create an alarm",
      enableBackdropDismiss:false,
      message:"Enter radius (mts) to activate",
      inputs: [
        {
          name: "radius",
          placeholder: "500",
          type: 'number',
          value:"500"
        }
      ],
      buttons: [
        {
          text: 'Save',
          handler: data => {
            this.radius = data.radius;
            this.createFence(this.map);
          }
        }
      ]
    });
    
    this.map.setCenter(pin);
    alarmModel.present();
  }

}
