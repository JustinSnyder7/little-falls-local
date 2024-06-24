import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { OsDetectionService } from '../../../services/os-detection.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit, AfterViewInit {
  @ViewChild('footerContainer') footerContainer!: ElementRef;

  constructor(private osDetectionService: OsDetectionService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.setFooterHeight();
  }

  setFooterHeight(): void {
    const osType = this.osDetectionService.getMobileOperatingSystem();

    if (this.footerContainer) {
      if (osType === 'iOS') {
        this.footerContainer.nativeElement.style.height = '38px';
        // console.log('Set height to 38px for iOS');
      } else if (osType === 'Android') {
        this.footerContainer.nativeElement.style.height = '24px';
        // console.log('Set height to 24px for Android');
      } else {
        this.footerContainer.nativeElement.style.height = '38px';
        // console.log('Set height to default 38px');
      }
    } else {
      console.log('Footer container not found.');
    }
  }
}