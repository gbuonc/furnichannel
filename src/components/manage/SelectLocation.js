import React, {Component} from 'react';
import { Dropdown, Container} from 'semantic-ui-react';

const SelectLocation = (props)=>{
  const locations = props.locations;
  return(
    <Container textAlign='left'>
      <div className="manage-header">
      <Dropdown
        placeholder='Seleziona'
        options={locations}
        onChange={props.setShowroom}
        selection simple
      />
      {props.showroom &&
        <div>
          <strong>{props.showroom.text}</strong><br/>
          {props.showroom['data-addr']}
        </div>
      }
      </div>
    </Container>
  )
}
export default SelectLocation
