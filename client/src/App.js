import './App.css';
import React, {Component} from 'react';
import Albums from './components/Albums';
import Artists from './components/Artists';
import Genres from './components/Genres';
import MediaTypes from './components/MediaTypes';
import Playlists from './components/Playlists';
import Tracks from './components/Tracks';
import Menu from './components/Menu';
import Cover from './components/Cover';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

class App extends Component {
    state = {
        getRoot: ''
    }

    getResponse = async() => {
        const response = await fetch('/api/');
        const body = await response.text();
        if (response.status !== 200) 
            throw Error(body.message);
        console.log(body);
        return body;
    }

    getTracks = async() => {
        const response = await fetch('/api/Tracks');
        const body = await response.json();
        if (response.status !== 200) 
            throw Error(body.message);
        return body;
    }

    componentDidMount() {
        //api/
        this
            .getResponse()
            .then(res => {
                //const someData = res;
                this.setState({getRoot: res});
            })
    }

    render() {
        const {getRoot} = this.state;

        return (
            <div className="App">
                <Router>
                    <h2>{getRoot}</h2>
                    <Menu/>
                    <Switch>
                        {/* force remount of the components */}
                        <Route path="/" exact component={Home}/>
                        <Route path="/albums" render={p => <Albums key={Date.now()} {...p}/>}/>
                        <Route path="/artists" render={p => <Artists key={Date.now()} {...p}/>}/>
                        <Route path="/genres" render={p => <Genres key={Date.now()} {...p}/>}/>
                        <Route path="/media-types" render={p => <MediaTypes key={Date.now()} {...p}/>}/>
                        <Route path="/playlists" render={p => <Playlists key={Date.now()} {...p}/>}/>
                        <Route path="/tracks" render={p => <Tracks key={Date.now()} {...p}/>}/>
                    </Switch>
                </Router>
            </div>
        );
    }
}

const Home = () => (
    <div>
        <h3>Home</h3>
        <Cover/>
    </div>
);

export default App;
