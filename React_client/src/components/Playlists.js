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

    //delete playlist by id
    deleteItem = async (item) => {

      const settings = {
        method: 'DELETE'
      };
      try {
        const fetchResponse = await fetch(`http://localhost:8080/api/playlists/${item}`, settings);
        const data = await fetchResponse.json();
        alert('item deleted');
        window.location.reload();
        return data;
      } catch (e) {
        alert('error');
        return e;
      }    

    }

    // handleRefresh = async() => {
    //   //window.location.reload();
    // };
      
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
                  <th> </th>
                </tr>
              </thead>
              <tbody>
              { getPlaylists.map(playlist => <tr><td>{playlist.PlaylistId}</td><td>{playlist.Name}</td>
              <td>
              <ButtonGroup>
                <Link className="btn btn-secondary btn-sm" role="button" to="/playlist/add">edit</Link>
                <Link className="btn btn-secondary btn-sm" role="button" onClick={() => this.deleteItem(playlist.PlaylistId)}>X</Link> 
                {/* to="/playlist/search" */}
              </ButtonGroup></td></tr>)
              }
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
              savePlaylist(playlistName);
            };

            const handlePlaylistChange = (event) => {
              setPlaylistName(event.target.value);
            };

            const savePlaylist = async (list) => {
              const settings = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name: list})
              };
              try {
                const fetchResponse = await fetch(`http://localhost:8080/api/playlists`, settings);
                const data = await fetchResponse.json();
                alert('new item added');
                return data;
              } catch (e) {
                alert('error');
                return e;
              }    

            }
          
          return(
          <Container className="mt-5">
            <Row className="justify-content-md-center">
              <Col xs lg="6">
                <Jumbotron>
                  <Form onSubmit={handleSubmit} >
                    <Form.Group>
                      <Form.Label>Add a new playlist</Form.Label>
                      <Form.Control onChange={handlePlaylistChange} type="text" placeholder="Playlist name" required/>
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
                <Switch>
                  <Container>
                    <h3>
                      Playlists ({getPlaylists.length})
                      <ButtonGroup className="ml-2">
                        <Link className="btn btn-secondary btn-sm" role="button" to="/playlist/add">add</Link>
                        <Link className="btn btn-secondary btn-sm" role="button" to="/playlist/search">search</Link>
                        {/* the component should update */}
                        <Link className="btn btn-secondary btn-sm" role="button" onClick={() => {window.location.href="/playlists"}}>list</Link>
                      </ButtonGroup>
                    </h3>    
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