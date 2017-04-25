import React, {Component} from 'react';
import { Modal, Button } from 'semantic-ui-react'

const ConfirmModal = (props)=>{
   const showroom= props.locations.filter((location)=>location.value===props.selectedShowroom)[0];
   const closeModal=()=>{window.location.reload()};
    return(
      <Modal onClose={closeModal} size="small" dimmer={false} open={props.completed}>
         <Modal.Header>Il tuo appuntamento è confermato, grazie.</Modal.Header>
         <Modal.Content>
            <Modal.Description>
               <p>
               <strong>{props.bookingDate}</strong> ore <strong>{props.bookingTime}</strong> <br />
               Showroom di <strong>{showroom.text}</strong>, {showroom['data-addr']}
               </p>
               <Button color='green' onClick={()=>closeModal()}>
                  OK
               </Button>
            </Modal.Description>
         </Modal.Content>
      </Modal>
    )
}
export default ConfirmModal
