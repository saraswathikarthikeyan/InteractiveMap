import React from 'react';
import ReactDOM from 'react-dom';
import InteractiveMap from './InteractiveMap';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<InteractiveMap />, div);
  ReactDOM.unmountComponentAtNode(div); 
});
