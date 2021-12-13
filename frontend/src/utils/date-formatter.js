import moment from 'moment';

function formatDate(dateTime, type) {
  var today = moment().startOf('day');
  var yesterday = moment().subtract(1, 'days').startOf('day');

  var weekAgo = moment().subtract(7, 'days').startOf('day');

  var yearAgo = moment().subtract(365, 'days').startOf('day');

  switch (type) {
    case 'time':
      return moment(dateTime).format('hh:mm A');
      break;
    case 'date':
      var sentDay = moment(dateTime);
      if (sentDay.isAfter(weekAgo, 'd')) {
        if (sentDay.isSame(today, 'd')) {
          return 'Today';
        } else if (sentDay.isSame(yesterday, 'd')) {
          return 'Yesterday';
        } else {
          return sentDay.format('dddd');
        }
      } else if (sentDay.isAfter(yearAgo)) {
        return sentDay.format('MMMM D');
      } else {
        return sentDay.format('D/M/YY');
      }
      break;
  }
}
export default formatDate;