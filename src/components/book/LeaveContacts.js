import React, {Component} from 'react';
import { Dimmer, Divider, Container } from 'semantic-ui-react';
import { Form, Input } from 'formsy-semantic-ui-react';
const LeaveContacts = (props)=>{
  const isDimmed = props.bookingTime === null;
  return(
    <Dimmer.Dimmable  dimmed={isDimmed}>
        <Dimmer active={isDimmed} inverted />
        <Container textAlign='left'>
          <h3>3. Lascia i tuoi contatti</h3>
          <Form onValidSubmit={props.setContactInfo}>
            <Form.Group widths='equal'>
              <Form.Input name="surname" label='Cognome' instantValidation required />
              <Form.Input name="firstname" label='Nome' instantValidation required />
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Input name="email" label='Email' instantValidation required validations="isEmail"/>
              <Form.Input name="phone" label='Telefono' instantValidation required validations="isNumeric"/>
            </Form.Group>
            <Form.Button primary>Conferma Appuntamento</Form.Button>
          </Form>
        </Container>
    </Dimmer.Dimmable>
  )
}

export default LeaveContacts
