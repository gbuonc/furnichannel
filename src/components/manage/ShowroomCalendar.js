import React, {Component} from 'react';
import request from 'superagent';
import utils from '../../utils';
import DayPicker from 'react-day-picker';
import "react-day-picker/lib/style.css"
import { Segment, Checkbox, Button, Message } from 'semantic-ui-react';

class ShowroomCalendar extends Component{
  constructor(){
    super();
    this.state = {
      selectedDay:null,
      disabledTimeSlots:[],
      bookedTimeSlots:[]
    }
    this.handleDayClick = this.handleDayClick.bind(this);
    this.getDayStatus = this.getDayStatus.bind(this);
    this.disableAll = this.disableAll.bind(this);
  }
  componentWillReceiveProps(){
    // reset when changing showroom
    this.setState({
      selectedDay:null,
      disabledTimeSlots:[],
      bookedTimeSlots:[]
    })
  }
  findDisabledDays(){
    // filter calendar for days set disabled
    // then convert date to a format suitable for calendar component
    // dd/mm/yyyy -> new Date(yyyy,mm-1,dd)
    const disabledDays = this.props.calendar.filter(day=>{
      return day.disabled==='all';
    }).map(day=>utils.stringToDate(day.date));
    return disabledDays;
  }
  findBookedDays(){
    // filter days with at least one appointment
    // then convert date to a format suitable for calendar component
    // dd/mm/yyyy -> new Date(yyyy,mm-1,dd)
    const bookedDays = this.props.calendar.filter(day=>{
      return day.booked.length>0
    }).map(day=>utils.stringToDate(day.date));
    return bookedDays;
  }
  handleDayClick(date,{ disabled, past, sundays }){
    // disable on click
    if (sundays || past) return;
    const selectedDay = date.toLocaleDateString();
    this.setState({selectedDay, disabledTimeSlots:[], bookedTimeSlots:[]}, ()=>{
      this.getDayStatus(this.state.selectedDay);
    })
  }
  getDayStatus(selectedDay){
    // get currently selected day details
    const selectedDayDetails= this.props.calendar.filter(day=>{
      return day.date===selectedDay;
    })[0];
    if(selectedDayDetails){
      if(selectedDayDetails.disabled==='all'){
        // if set as fully disabled there are no available slots
        this.setState({disabledTimeSlots: [...this.props.timeSlots]});
      }else{
        this.setState({disabledTimeSlots: selectedDayDetails.disabled});
      }
      const bookedTime = selectedDayDetails.booked.map(el=>el.time);
      this.setState({bookedTimeSlots: bookedTime});
    }else{
      // if there is no entry it means current day has all slot available
      this.setState({disabledTimeSlots: []});
    }
  }
  toggleCheck(event, data){
    const newTimeSlot = this.state.disabledTimeSlots;
    // check if current timeslot is in disabled array
    const checkboxIndex = this.state.disabledTimeSlots.indexOf(data.label);
    // toggle
    if(checkboxIndex > -1){
      newTimeSlot.splice(checkboxIndex, 1);
    }else{
      newTimeSlot.push(data.label);
    }
    this.setState({disabledTimeSlots : newTimeSlot});
  }
  disableAll(e){
    // uncheck all time slots
    this.setState({disabledTimeSlots: [...this.props.timeSlots]});
    e.preventDefault();
  }
  submitChange(){
    // pass to parent component
    this.props.submitChange(this.state.selectedDay, this.state.disabledTimeSlots);
  }
  render() {
    const today = new Date();
    const disabledDays = this.findDisabledDays();
    const bookedDays = this.findBookedDays();
    // dress calendar
    const calendarModifiers={
      sundays : day=>day.getDay()===0,
      past : {
        before: new Date()
      },
      disabled: disabledDays,
      highlighted: bookedDays
    }
    return(
      <div>
      <DayPicker
        locale="it"
        months={utils.localizeCalendar.months}
        weekdaysShort={utils.localizeCalendar.week}
        labels={utils.localizeCalendar.labels}
        modifiers={calendarModifiers}
        numberOfMonths={3}
        firstDayOfWeek={1}
        fromMonth={new Date(today.getFullYear(), today.getMonth())}
        toMonth={new Date(today.getFullYear(), today.getMonth()+2)}
        initialMonth={new Date(today.getFullYear(), today.getMonth())}
        onDayClick={this.handleDayClick}
      />
      {this.state.selectedDay &&
        <Segment>
          <div>
            <h2>{this.state.selectedDay}</h2>
            <h4>Seleziona le fasce orarie disponibili</h4>
          </div>
          <div className="time-slots">
          {this.props.timeSlots.map(time=>{
            // is time already booked?
            const isBooked = this.state.bookedTimeSlots.indexOf(time)>-1;
            const label = isBooked ? `${time} - appuntamento` : time;
            return(
              <div key={time}>
                <Checkbox
                  label={label}
                  checked={this.state.disabledTimeSlots.indexOf(time)===-1}
                  disabled={isBooked}
                  className={isBooked?'booked':''}
                  onChange={(event, data)=>this.toggleCheck(event, data)}
                />
              </div>
            )
          })}
          </div>
          {/* no slots booked, so we can disable all if desired */}
          {this.state.bookedTimeSlots.length === 0 &&
            <p><a href="#" onClick={(e)=>this.disableAll(e)}>Disabilita l'intera giornata</a></p>
          }

          <div>
          <Button primary onClick={()=>this.submitChange()}>Conferma modifiche</Button>
          </div>
        </Segment>
      }
      {this.props.completed && !this.state.selectedDay &&
        <Message>Modifiche effettuate con successo</Message>
      }
      </div>
    )
  }
}
export default ShowroomCalendar
