import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalBroadcastService, MsalGuardAuthRequest, MsalGuardConfiguration, MsalInterceptor, MsalInterceptorConfiguration, MsalRedirectComponent, MsalService } from '@azure/msal-angular';
import { IPublicClientApplication, InteractionType, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

function MsalInstanceFactory(): IPublicClientApplication {

  return new PublicClientApplication({
    auth: {
      clientId: '',
      authority: 'https://login.microsoftonline.com/tenetId',
      redirectUri: '/auth',
    },
    system: {
      loggerOptions: {
        loggerCallback: (lvl, msg, containsPii) => {
          console.log("msg");
        },
        logLevel: LogLevel.Verbose
      }
    }
  });
}

function MsalGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ['user.read']
    }
  }
} 

function MsalInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['user.read']);
  return {
    interactionType: InteractionType.Popup,
    protectedResourceMap: protectedResourceMap
  }
}

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [{
    provide: MSAL_INSTANCE,
    useFactory: MsalInstanceFactory
  },
  {
    provide: MSAL_GUARD_CONFIG,
    useFactory: MsalGuardConfigFactory
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: MsalInterceptor,
    multi: true
  },
  {
    provide: MSAL_INTERCEPTOR_CONFIG,
    useFactory: MsalInterceptorConfigFactory
  },
  MsalService,
  MsalBroadcastService
],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
