import React, {Component} from 'react';
import { Segment} from 'semantic-ui-react';
const ShowroomAppointments = (props)=>{
   return(
      <Segment>
         {props.showroom.text &&
            <h3>Appuntamenti del mese ({props.showroom.text})</h3>
         }

         <ul>
         {props.apts.map(day=>{
            return (
               <li key={day.date} className='apt-list'>
               <h4>{day.date}</h4>
               <ul>
               {day.booked.map(el=>{
                  return(
                     <li key={el.time}>
                     {el.time}<br/>
                     {el.contact.name}<br/>
                     {el.contact.mail}<br/>
                     {el.contact.phone}
                     </li>
                  )
               })}
               </ul>
               </li>
            )
         })}
         </ul>
      </Segment>
   )
}
export default ShowroomAppointments
