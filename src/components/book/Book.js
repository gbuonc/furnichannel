import React, {Component} from 'react';
import request from 'superagent';
import utils from '../../utils';
import Head from '../common/Head';
import SelectLocation from './SelectLocation';
import ChooseDateTime from './ChooseDateTime';
import LeaveContacts from './LeaveContacts';
import BookingSummary from './BookingSummary';
import ConfirmModal from './ConfirmModal';
import { Container, Segment, Divider, Grid, Modal, Button } from 'semantic-ui-react'

class Book extends Component{
  constructor(){
    super();
    this.state = {
      completed:false,
      locations:[],
      selectedShowroom: 0,
      bookingDate : null,
      bookingTime : null,
      surname: null,
      firstname:null,
      phone: null,
      email: null
    }
    this.setShowroom=this.setShowroom.bind(this);
  }
  componentDidMount(){
    // Call remote API to get showrooms address
   utils.getShowrooms((resp)=>{
      this.setState({locations: resp.body})
    })
  }
  setShowroom(e, dropdown){
    this.setState({selectedShowroom : dropdown.value, bookingDate:null, bookingTime:null})
  }
  setDateTime(date, hour){
    this.setState({bookingDate : date, bookingTime: hour})
  }
  setContactInfo(contact){
    this.setState({...contact}, ()=>this.submitBooking())
  }
  submitBooking(){
    // format json obj
    const appointment={
      date: this.state.bookingDate,
      booked:[{
        time: this.state.bookingTime,
        contact:{
          name: this.state.firstname+' '+this.state.surname,
          mail: this.state.email,
          phone: this.state.phone
        }
      }],
      disabled:[]
    }
    // post to API
    utils.submitNewAppointment(this.state.selectedShowroom, appointment, (resp)=>{
      if(resp.ok){
        this.setState({completed: true});
      }
    });
  }
  render() {
    const showroom = this.state.selectedShowroom > 0 ? this.state.locations.filter((location)=>location.value===this.state.selectedShowroom)[0] : '';
    return(
      <div>
        <Head />
        <div className="app">
          <Container fluid>
            <h2>Prenota il tuo appuntamento</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. At dolores voluptatem, facere reiciendis quos ipsam porro voluptates, consequuntur nostrum dolore illo nisi temporibus quis laborum inventore, et omnis. Id, officia.</p>
            <Divider section />
            <Grid divided>
              <Grid.Row>
                <Grid.Column width={this.state.selectedShowroom>0 ? 12: 16}>
                  <SelectLocation
                    setShowroom={this.setShowroom.bind(this)}
                    locations={this.state.locations}
                  />
                  <ChooseDateTime
                    selectedShowroom={this.state.selectedShowroom}
                    setDateTime={this.setDateTime.bind(this)}
                    timeSlots = {this.props.timeSlots}
                  />
                  <LeaveContacts
                    bookingTime={this.state.bookingTime}
                    setContactInfo={this.setContactInfo.bind(this)}
                  />
                </Grid.Column>
                {this.state.selectedShowroom>0 &&
                  <Grid.Column width={4}  className="booking-summary">
                  <BookingSummary
                  {...this.state}
                  locations={this.state.locations}
                />
                </Grid.Column>
                }
              </Grid.Row>
            </Grid>
          </Container>
          {this.state.completed &&
            <ConfirmModal
              {...this.state}
              locations={this.state.locations}
            />
          }
        </div>
      </div>
    )
  }
}

export default Book;
