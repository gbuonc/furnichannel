import 'semantic-ui-css/semantic.min.css'
import 'react-day-picker/lib/style.css'
import './app.css'
import React from 'react'
import {render} from 'react-dom'
import Book from './components/book/Book'
import Manage from './components/manage/Manage'


/* nasty hack to avoid using routing or multiple entry points in webpack */
const urlParam = window.location.pathname.split('/')[1];
// config appointments time slots
const timeSlots = ['9:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00', '18:00'];
switch (urlParam) {
  case "manage":
    render(<Manage timeSlots={timeSlots} />, document.getElementById('app'));
    break;
  case undefined:
  default:
    render(<Book timeSlots={timeSlots} />, document.getElementById('app'));
    break;
}
