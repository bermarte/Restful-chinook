import '../App.css';
import {Table, Container, Row, Button, ButtonGroup, Form, Col, Jumbotron } from 'react-bootstrap';
import React, { Component, useState } from 'react';
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

    //get all the playlists
    componentDidMount() {
        this.getTracks()
          .then(res => {
            this.setState({ getPlaylists: res });
          })
    }
      
    render() {
        const { getPlaylists } = this.state;

        //get all playlists (home)
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
        
        //add new playlist
        const AddPlaylist = () => {

          function PlayListForm() {

            //state using hook
            const [playlistName,setPlaylistName] = useState();
          
            const handleSubmit = (event) => {          
              event.preventDefault();
              event.stopPropagation();   
              alert(playlistName)
            };

            const handlePlaylistChange = (event) => {
              console.log(event.target.value);
              setPlaylistName(event.target.value);
            };
          
          return(
          <Container className="mt-5">
          <Row className="justify-content-md-center">
          <Col xs lg="6">
            <Jumbotron>
          <Form onSubmit={handleSubmit} >
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Add a new playlist</Form.Label>
            <Form.Control value={playlistName} onChange={handlePlaylistChange} type="text" placeholder="Playlist name" controlId="newPlaylist" required/>
          </Form.Group>
          <Button variant="primary" type="submit" >
            Submit
          </Button>
          </Form>
          </Jumbotron>
          </Col>
          </Row>
          </Container>
        )
      }
      return(<PlayListForm />);
      };

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
                <Route path="/playlist/add" component={AddPlaylist} />
                </Container>
                </Switch>
                </Router>
            </div>
         );
        }

}

export default Playlists;