import request from 'superagent';

const utils = {
  getShowrooms(callback){
    request
      .get('http://localhost:3001/locations')
      .set('Accept', 'application/json')
      .end(function(err, resp){
        callback(resp)
      });
  },
  getCalendar(id, callback){
    request
      .get(`http://localhost:3001/calendars/${id}`)
      .set('Accept', 'application/json')
      .end(function(err, resp){
        callback(resp)
      });
  },
  stringToDate(date){
    // 'dd/mm/yyyy' -> new Date(yyyy,mm-1,dd)
    const convertedDate= date.split('/').reverse().map((value,index)=>{
      //convert to numbers, if month (index===1) subtract 1
      const output = (index===1) ? parseInt(value,10)-1 : parseInt(value,10);
      return output;
    });
    return new Date(...convertedDate);
  },
  // ----------------------------------------
  submitNewAppointment(id, modifiedData, callback){
    // simulate API post via json-server
    // cannot work on data on backend
    // so we merge new data with existing JSON returned by server
    // and save entire json object again
    // 1 get current data stored on server
    request
      .get(`http://localhost:3001/calendars/${id}`)
      .set('Accept', 'application/json')
      .end(function(err, resp){
        // 2 parse
        const updatedRecord = utils.parseAppointmentCalendar(resp, modifiedData);
        // 3 send back to server
        utils.submitToApi(id, updatedRecord, callback);
      });
  },
  parseAppointmentCalendar(resp, modifiedData){
    let updatedCal;
    const cal = resp.body.calendar;
    // 1. filter calendar to see if date already exists
    const filteredCal = cal.filter(existingDate=>existingDate.date === modifiedData.date);
    const dateAlreadySet = filteredCal.length > 0;
    // 2. create object with new appointment
    if(dateAlreadySet){
      updatedCal = cal.map(existingDate=>{
        if(existingDate.date === modifiedData.date){
          existingDate.booked.push(modifiedData.booked[0])
        }
        return existingDate;
      })
    }else{
      // push new appointment to existing array
      updatedCal = [...cal, modifiedData];
    }
    // 3. return
    resp.body.calendar = updatedCal;
    return resp.body;
  },
  parseAvailableTimeSlots(date, disabledArray, calendar){
    // 1. find slot if date already exists
    let slotToUpdate;
    calendar.forEach((el, i)=>{
      if(el.date===date) slotToUpdate = i;
    })
    const dateAlreadySet = (typeof(slotToUpdate) === 'number');
    // 2. create object with new disabled time
    if(dateAlreadySet){
      calendar[slotToUpdate].disabled = disabledArray;
    }else{
      // push new date to existing calendar
      calendar.push({
        'date':date,
        'booked':[],
        'disabled':disabledArray
      })
    }
    // 3. return
    return calendar;
  },
  submitToApi(id, data, callback){
    request
      .put(`http://localhost:3001/calendars/${id}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(data)
      .end(function(err, resp){
        callback(resp);
    });
  },
  localizeCalendar:{
    // Translate month names
    months:[
      'Gennaio',
      'Febbraio',
      'Marzo',
      'Aprile',
      'Maggio',
      'Giugno',
      'Luglio',
      'Agosto',
      'Settembre',
      'Ottobre',
      'Novembre',
      'Dicembre',
    ],
    week:['Do', 'Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa'],
    week_long:[
      'Domenica',
      'Lunedì',
      'Martedì',
      'Mercoledì',
      'Giovedì',
      'Venerdì',
      'Sabato',
    ],
    labels:{
      nextMonth: 'Prossimo mese',
      previousMonth: 'Mese precedente'
    }
  }
}
export default utils;
