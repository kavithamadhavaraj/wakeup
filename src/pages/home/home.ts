import { Component,ViewChild,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
declare var google;
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
  @ViewChild("map") mapRef: ElementRef;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.showMap()
  }

  showMap(){
    let pin = new google.maps.LatLng(51.507351,-0.127758);

    let options = {
      center: pin,
      zoom:10
    }

    let map = new google.maps.Map(this.mapRef.nativeElement,options);
  }
}
