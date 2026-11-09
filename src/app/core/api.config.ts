import { isDevMode } from '@angular/core';

/**
 * URL base del back.
 * - Desarrollo (`ng serve`): `/api`, que `proxy.conf.json` redirige a http://localhost:8080.
 * - Producción (Netlify): el WAR desplegado en Tomcat.
 */
export const API_URL = isDevMode() ? '/api' : 'https://gpcueb.org/juanleal';
