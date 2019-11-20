import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { timer, Subscription } from 'rxjs';

import { DataService } from "../data.service";
import { Task } from '../models/task.interface';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.page.html',
  styleUrls: ['./tracker.page.scss'],
})
export class TrackerPage implements OnInit {
  taskForm:FormGroup;
  started:Boolean = false;
  startTime:number;
  stopTime:number;

  timerSub:Subscription;
  time:number;

  constructor(
    private formBuilder:FormBuilder,
    private dataService:DataService
  ) { }

  ngOnInit() {
    this.taskForm = this.formBuilder.group({
      name:['', [Validators.required, Validators.minLength(3) ] ]
    });
  }

  start(){
    this.started = true;
    this.startTime =new Date().getTime();//because start time is a property of the class, not the function
    const tm = timer(0,1000); //start at zero and do something every second
    this.timerSub=tm.subscribe( val => this.time = val );
    console.log(this.startTime);
  }

  stop(){
    this.started = false;
    this.stopTime = new Date().getTime();
    this.timerSub.unsubscribe();
    this.save();
    this.taskForm.reset();
  }

  save(){
    let task:Task = { //let is useful for creating local variables
       name: this.taskForm.get('name').value,
      start: this.startTime,
       stop: this.stopTime
    }
    this.dataService.addToList( task );
  }
}
