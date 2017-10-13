import React, { Component } from 'react';
import './Courses.css';

class Courses extends Component {
  constructor(props) {
    super(props);

    this.state = {
      courses: { }
    }
  }
  componentDidMount(){
    this.fetchClasses();
  }
  render() {
    if (this.state.courses[0]) {
      return (
        <div>
          <h3 className='courseHeader'>
            Available Classes
          </h3>
          <div className='courseContainer'>
            { this.renderClasses() }
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  fetchClasses() {
    return fetch('/courses', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.status < 400) {

        return response.json().then((json)=> {
          return this.setState({
            courses: json
          });
        });
      }
    })
  }

  renderClasses() {
    const { courses } = this.state;

    if (courses[0]) {
      return courses.map((item) => {
        return (
          <div key={item.id} className='course' style={ { background: `url(/assets/${item.url_slug}.jpg) no-repeat center` } }>
            <div className='courseLabel'>
              { item.name }
            </div>
          </div>
        );
      })
    }
  }

}

Courses.propTypes = {

};

Courses.defaultProps = {

};

export default Courses;
