import React, {Component} from 'react';
import { Dropdown, Container, Loader, Message, Button, Divider } from 'semantic-ui-react';

class SelectLocation extends Component{
  constructor(){
    super();
    this.state = {
      loading: false,
      nearestShowRoom: null
    }
  }
  
  /* get user position via navigator geolocation */
  getUserPosition(e){
    this.setState({loading:true});
    // get user position via browser geolocation api
    navigator.geolocation.getCurrentPosition(resp=>{
      const userCoords=[resp.coords.latitude, resp.coords.longitude];  
      this.getNearestShowroom(userCoords);
    })
    e.preventDefault();
  }
  getNearestShowroom(userCoords){
    // set distance from user for every location
    const distances = this.props.locations.map(location =>{
      return this.getDistance(...userCoords, ...location.coords)
    })
    //calculate shortest distance position in distances array
    const nearestLocationIndex = distances.reduce((bestIndexSoFar, currentlyTestedValue, currentlyTestedIndex, array) => currentlyTestedValue < array[bestIndexSoFar] ? currentlyTestedIndex : bestIndexSoFar, 0);
    const nearestLocation = this.props.locations[nearestLocationIndex];
    this.setState({loading:false, nearestShowRoom: nearestLocation});
  }
  getDistance(lat1, lon1, lat2, lon2){
    // calculate distance in Km from 2 points given coordinates (latitude + longitude)
    // http://stackoverflow.com/a/21623206
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + 
      c(lat1 * p) * c(lat2 * p) * 
      (1 - c((lon2 - lon1) * p))/2;
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }
  render() {
    const locations = this.props.locations;
    const nearestShowRoom = this.state.nearestShowRoom;
    return(
      <Container textAlign='left'>
        <h3>1. Seleziona lo showroom</h3>
        <p>Seleziona lo showroom dall'elenco {'geolocation' in navigator && 
          <span>oppure <a href="#" onClick={(e)=>this.getUserPosition(e)}>trova quello più vicino a te</a></span>
          }</p>
        {nearestShowRoom &&
          <Message compact>
            Lo showroom più vicino è a {`${nearestShowRoom.text} in ${nearestShowRoom['data-addr']}`}
            &nbsp;&nbsp;
            <Button 
              onClick={()=>this.props.setShowroom(null, this.state.nearestShowRoom)} 
              size='mini' 
              primary
            >Conferma</Button>
          </Message>
        }
        <Divider fitted hidden />
        <Dropdown 
          placeholder='Scegli lo Showroom' 
          defaultValue={nearestShowRoom ? nearestShowRoom.value : ''}
          options={locations}
          onChange={this.props.setShowroom}
          selection simple />
        &nbsp;&nbsp;  
        {this.state.loading && <Loader active inline /> }
        <Divider section />
      </Container>
    ) 
  }
}

export default SelectLocation
