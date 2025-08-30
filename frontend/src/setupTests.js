import '@testing-library/jest-dom';

// Mock FullCalendar
jest.mock('@fullcalendar/react', () => {
  return {
    __esModule: true,
    default: ({ events, eventClick, selectable, editable, locale }) => {
      return (
        <div data-testid="fullcalendar">
          <div data-testid="calendar-events">
            {events?.map((event, index) => (
              <div 
                key={index} 
                data-testid={`calendar-event-${event.id || index}`}
                onClick={() => eventClick?.({ event })}
                data-event-title={event.title}
                data-event-start={event.start}
                data-event-end={event.end}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
  };
});

// Mock FullCalendar plugins
jest.mock('@fullcalendar/daygrid', () => ({}));

// Mock Material-UI theme
jest.mock('@mui/material/styles', () => ({
  ...jest.requireActual('@mui/material/styles'),
  useTheme: () => ({
    palette: {
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
      error: { main: '#f44336' },
      success: { main: '#4caf50' },
      text: { primary: '#000000', secondary: '#666666' },
      background: { default: '#ffffff' }
    },
    spacing: (factor) => `${8 * factor}px`,
    breakpoints: {
      up: () => '@media (min-width: 600px)',
      down: () => '@media (max-width: 599px)'
    }
  })
}));

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

global.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));
