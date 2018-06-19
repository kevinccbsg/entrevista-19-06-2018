import React, { Component } from 'react';
import './App.css';

const Room = (props) => (
  <div>
    <h1>{props.room}</h1>
    <p>{props.description}</p>
  </div>
);

const FilterBar = (props) => (
  <div>
    <div>
      <button
        onClick={() => props.handleClick('favorites')}
      >Favorite - {props.filters.favorites ? 'True' : 'False'}</button>
    </div>
    <div>
      <button
        onClick={() => props.handleClick('recomended')}
      >Recomended - {props.filters.recomended ? 'True' : 'False'}</button>
    </div>
    <div>
      <button
        onClick={() => props.handleClick('error')}
      >Error - {props.filters.error ? 'True' : 'False'}</button>
    </div>
  </div>
);


class App extends Component {
  constructor() {
    super();
    this.state = {
      load: true,
      rooms: [],
      filters: {
        favorites: false,
        recomended: false,
        error: false,
      },
    };
    this.filter = this.filter.bind(this);
  }

  async componentDidMount () {
    try {
      const response = await fetch('http://localhost:4000/rooms');
      const json = await response.json();
      console.log(json);
      this.setState({ load: false , rooms: json });
    } catch (err) {
      this.setState({ load: false, error: true });
    }
  }

  async filter(type) {
    const { filters } = this.state;

    const prev = filters[type];

    await this.setState({ filters: {
      [type]: !prev,
    }});
    try {
      const filt = this.state.filters;
      const response = await fetch(`http://localhost:4000/rooms?favorites=${filt.favorites}&recomended=${filt.recomended}`);
      const json = await response.json();
      console.log(json);
      this.setState({ load: false , rooms: json });
    } catch (err) {
      this.setState({ load: false, error: true });
    }
  }

  render() {
    const { load, filters, rooms, error } = this.state;
    if (error) return 'error!!';
    if (load) return <h3>Loading...</h3>
    return (
      <div className="App">
        <FilterBar
          filters={filters}
          handleClick={this.filter}
        />
        {rooms.map((room) => (
          <Room key={room.id} {...room} />
        ))}
      </div>
    );
  }
}

export default App;
