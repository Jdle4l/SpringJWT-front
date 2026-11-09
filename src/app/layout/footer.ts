import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="bg-dark text-light py-3 mt-auto">
      <div
        class="container d-flex flex-column flex-sm-row justify-content-between align-items-center gap-1 small"
      >
        <span>Universidad El Bosque</span>
        <span>Autor: &#64;judalesa</span>
      </div>
    </footer>
  `,
})
export class Footer {}
