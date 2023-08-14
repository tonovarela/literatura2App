import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

//import { SocketIoModule } from 'ngx-socket-io';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment.development';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { registerLicense } from '@syncfusion/ej2-base';
registerLicense("ORg4AjUWIQA/Gnt2V1hiQlRPd11dXmJWd1p/THNYflR1fV9DaUwxOX1dQl9gSXZTcURqXH5ad3ZVRmU=")
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    GridModule, 
    BrowserModule,
    AppRoutingModule, 
    HttpClientModule,
    BrowserAnimationsModule,
   SocketIoModule.forRoot(environment.sockectConfig),
    ToastrModule.forRoot({}) 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

