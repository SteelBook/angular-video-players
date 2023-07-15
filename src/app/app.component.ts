import { Component, OnDestroy, PLATFORM_ID, Inject, ViewChild, ElementRef } from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnDestroy{
  @ViewChild('video1', {static: true}) video1: ElementRef<HTMLVideoElement>;
  @ViewChild('video2', {static: true}) video2: ElementRef<HTMLVideoElement>;
  @ViewChild('video3', {static: true}) video3: ElementRef<HTMLVideoElement>;


  constructor(@Inject(PLATFORM_ID) private _platform: Object) {}

  onStart(){
    if (!navigator.mediaDevices?.enumerateDevices) {
      console.log("enumerateDevices() not supported.");
    } else {
      // List cameras and microphones.
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          devices.forEach((device) => {
            console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
          });
        })
        .catch((err) => {
          console.error(`${err.name}: ${err.message}`);
        });
    }

    if(isPlatformBrowser(this._platform) && 'mediaDevices' in navigator) {
      navigator.mediaDevices.getUserMedia({video: true}).then((ms: MediaStream) => {
        const _video1 = this.video1.nativeElement;
        _video1.srcObject = ms;
        _video1.play(); 

        const _video2 = this.video2.nativeElement;
        _video2.srcObject = ms;
        _video2.play(); 

        // this.video3.nativeElement.play();
      });
    }
  }

  onStop() {
    this.video1.nativeElement.pause();
    (this.video1.nativeElement.srcObject as MediaStream).getVideoTracks()[0].stop();
    this.video1.nativeElement.srcObject = null;

    this.video2.nativeElement.pause();
    (this.video2.nativeElement.srcObject as MediaStream).getVideoTracks()[0].stop();
    this.video2.nativeElement.srcObject = null;
  }

  ngOnDestroy() {
    (this.video1.nativeElement.srcObject as MediaStream).getVideoTracks()[0].stop();
    (this.video2.nativeElement.srcObject as MediaStream).getVideoTracks()[0].stop();
  }
}
