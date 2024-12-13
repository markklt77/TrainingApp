import './Calender.css'

function Calender() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    //gives an index of the day of the week
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();

    //get date will give you days
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        days.push(day);
    }

    return (
            <div className='calender'>
                <h2>
                    {today.toLocaleString('default', {month: 'long'})} {currentYear}
                </h2>
                <div className='days-of-week'>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className='week-day'>
                            {day}
                        </div>
                    ))}
                </div>
                <div className='days-grid'>
                    {days.map((day, index) => (
                        <div key={index}  className='single-day'>
                            {day}
                        </div>
                    ))}
                </div>

            </div>
    )
}

export default Calender;
