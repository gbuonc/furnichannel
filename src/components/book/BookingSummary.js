import React, {Component} from 'react';
import { Segment, Divider } from 'semantic-ui-react'

const BookingSummary = (props)=>{
   const selectedLocation= props.locations.filter((location)=>location.value===props.selectedShowroom)[0];
    return(
            <Segment textAlign="left">
               {props.selectedShowroom &&
                  <div>
                  <h4>Showroom</h4>
                  <strong>{selectedLocation.text}</strong><br />
                  {selectedLocation['data-addr']}
                  <Divider />
                  </div>
               }
               {props.bookingDate &&
                  <div>
                  <h4>Data e ora</h4>
                  <strong>{props.bookingDate}</strong> ore {props.bookingTime}
                  <Divider />
                  </div>
               }
            </Segment>
    )
}

export default BookingSummary
