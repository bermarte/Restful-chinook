import '../App.css';
import {Table, Container, Row, Button, ButtonGroup } from 'react-bootstrap';
import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { Link } from 'react-router-dom';

class  Playlists extends Component {

    state = {
        getPlaylists: []
    }

    getTracks = async() => {
        const response = await fetch('/api/playlists');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    componentDidMount() {
        this.getTracks()
          .then(res => {
            this.setState({ getPlaylists: res });
          })
      }
      
    render() {
        const { getPlaylists } = this.state;
        console.log(getPlaylists);


        const Home = () => (
          <Row>
          <Table striped bordered hover>
          <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
          </tr>
          </thead>
          <tbody>
          { getPlaylists.map(playlist => <tr><td>{playlist.PlaylistId}</td><td>{playlist.Name}</td></tr>) }
          </tbody>
          </Table>
          </Row>
        );

        return(
            <div>
              <Router>
                <h3>
                  Playlists ({getPlaylists.length})
                  <ButtonGroup className="ml-2">
                    <Link to="/playlist/add">
                      <Button variant="secondary" size="sm">add</Button>
                    </Link>
                    <Link to="/playlist/search">
                      <Button variant="secondary" size="sm">search</Button>
                    </Link>
                  </ButtonGroup>
                </h3>
                <Switch>
                <Container>
                <Route path="/playlists" exact component={Home} />
                </Container>
                </Switch>
                </Router>
            </div>
         );
        }

}



export default Playlists;