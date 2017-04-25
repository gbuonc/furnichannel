import React, {Component} from 'react';
import request from 'superagent';
import utils from '../../utils';
import DayPicker from 'react-day-picker';
import "react-day-picker/lib/style.css"
import { Container, Dimmer, Divider, Grid, Radio, Button } from 'semantic-ui-react';

class ChooseDateTime extends Component{
  constructor(){
    super();
    this.state = {
      selectedDay: null,
      selectedTime: null,
      unavailableTime:[],
      calendar:[]
    }
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
  }
  componentWillReceiveProps(nextProps){
    // Get current showroom calendar details from API
    if(this.props.selectedShowroom !== nextProps.selectedShowroom){
      utils.getCalendar(nextProps.selectedShowroom, (resp)=>{
        this.setState({calendar:resp.body.calendar, selectedDay:null, selectedTime:null})
      })
    }
  }
  handleDayClick(date,{ disabled, past, sundays }){
    // disable on click
    if (disabled || sundays || past) return;
    const selectedDay = date.toLocaleDateString();
    const unavailableTime = this.getUnavailableTime(selectedDay);
    this.setState({selectedDay, unavailableTime, selectedTime:null}, ()=>{
      this.props.setDateTime(this.state.selectedDay, this.state.selectedTime)
    });
  }
  getUnavailableTime(selectedDay){
    // get currently selected day details
    const selectedDayDetails= this.state.calendar.filter(day=>{
      return day.date===selectedDay;
    })[0];
    if(selectedDayDetails){
      // get booked time for current day
      const bookedTime = selectedDayDetails.booked.map(item=>item.time);
      // get disabled time (already an array)
      const disabledTime = selectedDayDetails.disabled;
      // merge booked and disabled time together
      return [...bookedTime, ...disabledTime];
    }else{
      // if there is no entry it means current day has all slot available
      // so return empty array
      return [];
    }
  }
  findDisabledDays(){
    // filter calendar for days set disabled
    // or where disabled+booked time is equal to max available slot
    // then convert date to a format suitable for calendar component
    // dd/mm/yyyy -> new Date(yyyy,mm-1,dd)
    const disabledDays = this.state.calendar.filter(day=>{
      const slotsLength = this.props.timeSlots.length;
      return day.disabled==='all' || day.disabled.length+day.booked.length===slotsLength;
    }).map(day=>utils.stringToDate(day.date));
    return disabledDays;
  }
  handleRadioChange(e, el){
    this.setState({selectedTime: el.value}, ()=>{
      this.props.setDateTime(this.state.selectedDay, this.state.selectedTime)
    });
  }
  render() {
    const isDimmed = this.props.selectedShowroom <=0;
    const today = new Date();
    const disabledDays = this.findDisabledDays();
    const calendarModifiers={
      sundays : day=>day.getDay()===0,
      past : {
        before: new Date()
      },
      disabled:disabledDays
    }
    const selectedDay = this.state.selectedDay || '';
    const selectedTime = this.state.selectedTime || '';
    return(
      <Dimmer.Dimmable  dimmed={isDimmed}>
          <Dimmer active={isDimmed} inverted />
          <Container textAlign='left'>
            <h3>2. Scegli data e ora</h3>
            <Grid>
              <Grid.Row>
                <Grid.Column width={5}>
                  <DayPicker
                    locale="it"
                    months={utils.localizeCalendar.months}
                    weekdaysShort={utils.localizeCalendar.week}
                    labels={utils.localizeCalendar.labels}
                    modifiers={calendarModifiers}
                    firstDayOfWeek={1}
                    fromMonth={new Date(today.getFullYear(), today.getMonth())}
                    toMonth={new Date(today.getFullYear(), today.getMonth()+2)}
                    initialMonth={new Date(today.getFullYear(), today.getMonth())}
                    onDayClick={this.handleDayClick}
                  />
                </Grid.Column>
                <Grid.Column width={2} />
                <Grid.Column width={9}>
                  <p>{selectedDay ? 'Giorno selezionato: ': 'Seleziona una data tra quelle disponibili'} <strong>{selectedDay}</strong></p>
                  {selectedDay &&
                    <p>{selectedTime ? 'Ora selezionata: ': 'Seleziona un\'ora tra quelle disponibili'} <strong>{selectedTime}</strong></p>
                  }

                    {selectedDay &&
                    <div className="timeslots-card">
                      {this.props.timeSlots.map((time, i)=>{
                        const isDisabled = this.state.unavailableTime.indexOf(time)>-1;
                        const label= isDisabled ? `${time} - non disponibile` : time;
                        return(
                          <Radio
                            key={time}
                            name='radioGroup'
                            value={time}
                            label={label}
                            disabled={isDisabled}
                            onChange={this.handleRadioChange}
                            checked={this.state.selectedTime === time} />
                        )
                      })}

                    </div>
                    }
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Divider section />
          </Container>
      </Dimmer.Dimmable>
    )
  }
}

export default ChooseDateTime
