import { Component, OnDestroy, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AuthenticationResult, EventMessage, EventType, InteractionStatus, InteractionType } from '@azure/msal-browser';
import { Subject, filter, takeUntil } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})


export class AppComponent implements OnInit, OnDestroy {
  title = 'msal-azureAD';
  active_User : string | undefined = "unknown user";
  isUser_Authenticated: boolean = false;
  unsubscribe = new Subject<void>();

  constructor(private _msalService: MsalService, private _msalBroadcastService: MsalBroadcastService) { }

  ngOnInit(): void {
    this._msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status == InteractionType.None),
        takeUntil(this.unsubscribe)
      ).subscribe(() => {
        this.setAuthenticationStatus();
      })

      this._msalBroadcastService.msalSubject$
      .pipe(
        filter((message: EventMessage) => message.eventType == EventType.LOGIN_SUCCESS),
        takeUntil(this.unsubscribe)
      ).subscribe((message: EventMessage) => {
        const authResult = message.payload as AuthenticationResult;

        this._msalService.instance.setActiveAccount(authResult.account);
      })
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(undefined);
    this.unsubscribe.complete();
  }

  login()
  {
    this._msalService.instance.loginRedirect({
      scopes: ["User.Read"],

    })
  }

  logout(){
    this._msalService.instance.logoutRedirect();
  }

  setAuthenticationStatus() {
    let activeAccount = this._msalService.instance.getActiveAccount();

    if (!activeAccount && this._msalService.instance.getAllAccounts().length > 0)
    {
      activeAccount = this._msalService.instance.getAllAccounts()[0];
      this._msalService.instance.setActiveAccount(activeAccount)
    }

    this.isUser_Authenticated = !!activeAccount;
    this.active_User = activeAccount?.username;
  }

}
