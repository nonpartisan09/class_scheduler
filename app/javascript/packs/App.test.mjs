import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from './application';

Enzyme.configure({ adapter: new Adapter() });
 
// eslint-disable-next-line no-undef
test('renders without error', () => {
  const wrapper = Enzyme.shallow(<App />);
  
  // eslint-disable-next-line no-undef
  expect(wrapper).toBeTruthy();
}); 

