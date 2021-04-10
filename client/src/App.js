import './App.css';
import React, { Component } from 'react';
import Albums from './components/Albums';
import Artists from './components/Artists';
import Genres from './components/Genres';
import MediaTypes from './components/MediaTypes';
import Playlists from './components/Playlists';
import Tracks from './components/Tracks';
import Menu from './components/Menu';
import Cover from './components/Cover';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';


class App extends Component {
  state = {
    getRoot: ''
  }

  getResponse = async() => {
    const response = await fetch('/api/');
    const body = await response.text();
    if (response.status !== 200) throw Error(body.message);
    console.log(body);
    return body;
  }

  getTracks = async() => {
    const response = await fetch('/api/Tracks');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  componentDidMount() {
    //api/
    this.getResponse()
      .then(res => {
        //const someData = res;
        this.setState({ getRoot: res });
      })
  }

  render() {
    const { getRoot } = this.state;

    return (
      <div className="App">
        <Router>
          <h2>{getRoot}</h2>
          <Menu />         
          <Switch>
            <Route path="/" exact component={Home} />
            {/* <Albums /> */}
            <Route path="/albums" component={Albums} />
            {/* <Artists /> */}
            <Route path="/artists" component={Artists} />
            {/* <Genres /> */}
            <Route path="/genres" component={Genres} />
            {/* <Genres /> */}
            <Route path="/media-types" component={MediaTypes} />
            {/* <Genres /> */}
            <Route path="/playlists" component={Playlists} />
            {/* <Genres /> */}
            <Route path="/tracks" component={Tracks} />
          </Switch>
        </Router>
      </div>
    );
  }
}

const Home = () => (
  <div>
    <h3>Home</h3>
    <Cover />
  </div>
);

export default App;
