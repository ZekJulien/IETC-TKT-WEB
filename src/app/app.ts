import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalLoadingBar } from './components/global-loading-bar/global-loading-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GlobalLoadingBar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
