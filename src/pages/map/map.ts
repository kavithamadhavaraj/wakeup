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
  
  constructor(private navCtrl: NavController, private navParams: NavParams, private alertCtrl : AlertController) {
    this.geoCoder = new google.maps.Geocoder();
    
    
  }

  setSearchBarData(pin){
    let self = this;
    if(pin){
      this.doGeocode(pin).then((data) =>{ self.destination = data; });
    }
  }

  findUserLocation<Promise>(){
    return new Promise<any>((resolve,reject) => {
      if(!!navigator.geolocation) {
        let self= this;
        navigator.geolocation.getCurrentPosition(function(position) {             
          let geolocation:any = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
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

  // setHome(home){
  //   let marker = new google.maps.Marker({
  //     position: home,
  //     map: this.map,
  //     icon: "../../assets/icon/current_location.png"      
  //   });
  // }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    let pin = this.navParams.get("pin");  
    this.setSearchBarData(pin);  
    this.showMap(pin);
    //this.setHome(this.navParams.get("home"));
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
      gestureHandling : "cooperative",
      streetViewControl: false
    }
    console.log(document.getElementById("map"));
    this.map = new google.maps.Map(document.getElementById("map"), options);
    let marker = new google.maps.Marker({
      position: pin,
      map: this.map,
      draggable: true,
      clickable: true,
      icon: "../../assets/icon/locate.png"
    });
    marker.addListener('mouseup', function() {
      console.log(marker);
      self.destination = marker.getPlace();
      self.map.setCenter(marker.getPosition());
      self.fence.setMap(null);
      self.createFence(self.map);
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
    alarmModel.present();
    this.map.setCenter(pin);
  }

}
