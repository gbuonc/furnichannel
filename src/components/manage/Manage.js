import React, {Component} from 'react';
import utils from '../../utils';
import request from 'superagent';
import Head from '../common/Head';
import SelectLocation from './SelectLocation';
import ShowroomCalendar from './ShowroomCalendar';
import ShowroomAppointments from './ShowroomAppointments';
import { Container, Segment, Divider, Grid } from 'semantic-ui-react';


class Manage extends Component{
  constructor(){
    super();
    this.state={
      locations:[],
      selectedShowroom:null,
      calendar:[],
      appointments:[],
      completed: false
    }
  }
  componentDidMount(){
    // Call remote API to get showrooms address
    utils.getShowrooms((resp)=>{
      this.setState({locations: resp.body})
    })
  }
  setShowroom(e, dropdown){
    this.setState({selectedShowroom : dropdown.value}, ()=>{
      this.getShowroomCalendar(this.state.selectedShowroom);
    })
  }
  getShowroomCalendar(showroom){
    utils.getCalendar(showroom, (resp)=>{
      this.setState({calendar:resp.body.calendar}, ()=>{
        this.getAppointments();
      })
    })
  }
  getAppointments(){
    // get days with appointments
    const appointments = this.state.calendar.filter(date=>date.booked.length>0);
    this.setState({appointments});
  }
  submitChange(date, disabled){
    this.setState({completed:false});
    // set disabled to 'all' if all slots are disabled
    if(disabled.length === this.props.timeSlots.length){
      disabled='all';
    }
    const updatedCalendar = utils.parseAvailableTimeSlots(date, disabled, this.state.calendar);
    // post to API
    const data = {
      'calendar':updatedCalendar
    }
    utils.submitToApi(this.state.selectedShowroom, data, (resp)=>{
      if(resp.ok){
        this.setState({completed: true});
      }
    });
  }
  render() {
    const showroom= this.state.locations.filter(location=>location.id===this.state.selectedShowroom)[0] || null;
    return(
      <div>
        <Head />
        <div className="app manage-app">
          <Container fluid textAlign="left">
            <Grid>
              <Grid.Row>
                <Grid.Column width={12}>
                  <h2>Gestione Appuntamenti</h2>
                  <Divider section />

                  <p>Seleziona lo showroom da modificare</p>
                  <SelectLocation
                    setShowroom={this.setShowroom.bind(this)}
                    locations={this.state.locations}
                    showroom = {showroom}
                  />

                  {this.state.calendar.length>0 &&
                    <ShowroomCalendar
                      calendar={this.state.calendar}
                      timeSlots={this.props.timeSlots}
                      submitChange={this.submitChange.bind(this)}
                      completed={this.state.completed}
                    />
                  }
                  <Divider hidden />
                </Grid.Column>
                <Grid.Column width={4}>
                  {this.state.selectedShowroom &&
                    <ShowroomAppointments apts={this.state.appointments} showroom={showroom} />
                  }
                </Grid.Column>
              </Grid.Row>
            </Grid>

          </Container>
        </div>
      </div>
    )
  }
}

export default Manage
