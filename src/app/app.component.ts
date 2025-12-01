import { Component, OnInit } from '@angular/core';
import { API_CONFIG } from './config/api.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'POS System';
  
  async ngOnInit(): Promise<void> {
    // Initialize API configuration from JSON file
    await API_CONFIG.initialize();
  }
}

