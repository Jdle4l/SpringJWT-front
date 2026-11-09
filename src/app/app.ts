import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './layout/footer';
import { Navbar } from './layout/navbar';

@Component({
  imports: [RouterOutlet, Navbar, Footer],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {}
