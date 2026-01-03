import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Navigation from '../components/Navigation';
import { getUser } from '../utils/auth';
import api from '../services/api';

const localizer = momentLocalizer(moment);

const HRMSCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const user = getUser();

  useEffect(() => {
    fetchCalendarData();
  }, [currentDate, currentView]);

  const fetchCalendarData = async () => {
    setLoading(true);
    try {
      const startDate = moment(currentDate).startOf(currentView).format('YYYY-MM-DD');
      const endDate = moment(currentDate).endOf(currentView).format('YYYY-MM-DD');
      
      const [attendanceData, leaveData] = await Promise.all([
        fetchAttendanceData(startDate, endDate),
        fetchLeaveData(startDate, endDate)
      ]);

      const calendarEvents = [
        ...processAttendanceEvents(attendanceData),
        ...processLeaveEvents(leaveData)
      ];

      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceData = async (startDate, endDate) => {
    try {
      const response = await api.get(`/attendance?startDate=${startDate}&endDate=${endDate}`);
      return user.role === 'Admin' ? response.data : response.data.filter(a => a.employeeId === user.employeeId);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      return [];
    }
  };

  const fetchLeaveData = async (startDate, endDate) => {
    try {
      const response = await api.get(`/leave?startDate=${startDate}&endDate=${endDate}`);
      return user.role === 'Admin' ? response.data : response.data.filter(l => l.employeeId === user.employeeId);
    } catch (error) {
      console.error('Error fetching leave data:', error);
      return [];
    }
  };

  const processAttendanceEvents = (attendanceData) => {
    return attendanceData.map(attendance => ({
      id: `attendance-${attendance.attendanceId}`,
      title: `${attendance.status} - ${attendance.employee?.firstName || 'Employee'}`,
      start: new Date(attendance.date),
      end: new Date(attendance.date),
      allDay: true,
      resource: {
        type: 'attendance',
        status: attendance.status,
        checkIn: attendance.checkIn,
        checkOut: attendance.checkOut,
        employee: attendance.employee
      },
      color: getAttendanceColor(attendance.status)
    }));
  };

  const processLeaveEvents = (leaveData) => {
    return leaveData.map(leave => ({
      id: `leave-${leave.leaveId}`,
      title: `${leave.leaveType} Leave - ${leave.employee?.firstName || 'Employee'}`,
      start: new Date(leave.startDate),
      end: new Date(leave.endDate),
      allDay: true,
      resource: {
        type: 'leave',
        leaveType: leave.leaveType,
        status: leave.status,
        remarks: leave.remarks,
        employee: leave.employee
      },
      color: getLeaveColor(leave.status, leave.leaveType)
    }));
  };

  const getAttendanceColor = (status) => {
    switch (status) {
      case 'Present': return '#10b981';
      case 'Absent': return '#ef4444';
      case 'Half-day': return '#f59e0b';
      case 'Leave': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getLeaveColor = (status, leaveType) => {
    if (status === 'Approved') return '#10b981';
    if (status === 'Rejected') return '#ef4444';
    if (status === 'Pending') return '#f59e0b';
    
    switch (leaveType) {
      case 'Paid': return '#3b82f6';
      case 'Sick': return '#06b6d4';
      case 'Unpaid': return '#6b7280';
      default: return '#8b5cf6';
    }
  };

  const eventStyleGetter = (event) => {
    const backgroundColor = event.color || '#3b82f6';
    const style = {
      backgroundColor,
      borderRadius: '6px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
      padding: '2px 6px',
      fontSize: '12px',
      fontWeight: '500'
    };
    return { style };
  };

  const handleEventClick = (event) => {
    const { resource } = event;
    let details = '';
    
    if (resource.type === 'attendance') {
      details = `
        Employee: ${resource.employee?.firstName} ${resource.employee?.lastName}
        Status: ${resource.status}
        Check In: ${resource.checkIn || 'N/A'}
        Check Out: ${resource.checkOut || 'N/A'}
      `;
    } else if (resource.type === 'leave') {
      details = `
        Employee: ${resource.employee?.firstName} ${resource.employee?.lastName}
        Leave Type: ${resource.leaveType}
        Status: ${resource.status}
        Remarks: ${resource.remarks || 'N/A'}
      `;
    }
    
    alert(details.trim());
  };

  const handleSelectSlot = ({ start, end }) => {
    if (user.role === 'Admin') {
      console.log('Selected slot:', start, end);
    }
  };

  const EventComponent = ({ event }) => {
    const { resource } = event;
    return (
      <div className="text-xs">
        <div className="font-semibold truncate">{event.title}</div>
        {resource.type === 'attendance' && resource.checkIn && (
          <div className="text-xs opacity-90">
            {resource.checkIn} - {resource.checkOut || 'Active'}
          </div>
        )}
        {resource.type === 'leave' && (
          <div className="text-xs opacity-90 capitalize">
            {resource.status}
          </div>
        )}
      </div>
    );
  };

  const CustomToolbar = ({ label, onNavigate, onView }) => (
    <div className="rbc-toolbar flex justify-between items-center mb-4 bg-gray-800 p-4 rounded-t-lg">
      <div className="flex space-x-2">
        <button
          onClick={() => onNavigate('PREV')}
          className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => onNavigate('TODAY')}
          className="px-3 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
        >
          Today
        </button>
        <button
          onClick={() => onNavigate('NEXT')}
          className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Next
        </button>
      </div>
      
      <span className="text-white font-semibold text-lg">{label}</span>
      
      <div className="flex space-x-2">
        <button
          onClick={() => onView('month')}
          className={`px-3 py-2 rounded transition-colors ${
            currentView === 'month' 
              ? 'bg-primary text-white' 
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          Month
        </button>
        <button
          onClick={() => onView('week')}
          className={`px-3 py-2 rounded transition-colors ${
            currentView === 'week' 
              ? 'bg-primary text-white' 
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          Week
        </button>
        <button
          onClick={() => onView('day')}
          className={`px-3 py-2 rounded transition-colors ${
            currentView === 'day' 
              ? 'bg-primary text-white' 
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          Day
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-white text-xl">Loading calendar...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-gray-800 rounded-lg shadow-xl">
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-3xl font-bold text-white">HR Calendar</h1>
            <p className="text-gray-400 mt-2">
              View attendance, leave requests, and HR events in calendar format
            </p>
          </div>
          
          <div className="p-6">
            <div className="mb-6 flex flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-sm">Legend:</span>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-gray-300 text-sm">Present</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-gray-300 text-sm">Absent</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-amber-500 rounded"></div>
                    <span className="text-gray-300 text-sm">Half-day</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-violet-500 rounded"></div>
                    <span className="text-gray-300 text-sm">Leave</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-gray-300 text-sm">Approved Leave</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-amber-500 rounded"></div>
                    <span className="text-gray-300 text-sm">Pending Leave</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg" style={{ height: '600px' }}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultView="month"
                view={currentView}
                date={currentDate}
                onNavigate={setCurrentDate}
                onView={setCurrentView}
                onSelectEvent={handleEventClick}
                onSelectSlot={handleSelectSlot}
                selectable={user.role === 'Admin'}
                components={{
                  toolbar: CustomToolbar,
                  event: EventComponent
                }}
                eventPropGetter={eventStyleGetter}
                popup
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRMSCalendar;