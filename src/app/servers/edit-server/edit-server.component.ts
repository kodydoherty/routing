import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ServersService } from '../servers.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-edit-server',
  templateUrl: './edit-server.component.html',
  styleUrls: ['./edit-server.component.css']
})
export class EditServerComponent implements OnInit {
  server: {id: number, name: string, status: string};
  serverName = '';
  serverStatus = '';
  allowEdit = false;
  changesSaved = false;

  constructor(private serversService: ServersService,
              private route: ActivatedRoute,
              private router: Router  ) { }

  ngOnInit() {
    console.log(this.route.snapshot.queryParams);
    console.log(this.route.snapshot.fragment); // not updated if there is a change to it within the component

    this.route.queryParams.subscribe(
      (queryParams: Params) => {
          this.allowEdit = queryParams['allowEdit'] === '1' ? true : false;
      }
    );  // you can use observables to subscribe to the params as an alternative to above
    this.route.fragment.subscribe();

    this.server = this.serversService.getServer(1);
    this.serverName = this.server.name;
    this.serverStatus = this.server.status;
  }

  onUpdateServer() {
    this.serversService.updateServer(this.server.id, {name: this.serverName, status: this.serverStatus});
    this.changesSaved = true;
    this.router.navigate(['../'], {relativeTo: this.route });
  }

  canDeactivate():  Observable<boolean> | Promise<boolean> | boolean {
    if (!this.allowEdit) {
      return true;
    }
    if ((this.serverName !== this.server.name || this.serverStatus !== this.server.status ) && !this.changesSaved) {
      return confirm('Do you want to discard the changes?')
    } else {
      return true;
    }
  }

}
