import '../App.css';
import {Table, Container, Row, Button, ButtonGroup, Form, Col, Jumbotron } from 'react-bootstrap';
import React, { Component, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import Preloader from './Preloader';
import PencilIcon from './PencilIcon';

class  Playlists extends Component {

  constructor(props) { 
    super(props);   
    this.play= "";
    this.searching="";

    this.state = {
      getPlaylists: []
    }
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

    handleInputChange(event){
      let val = event.target.value;
      //set value for editItem
      this.play = val;
    }  

    //search by id or name
    handleSearchChange(event){
      let val = event.target.value;     
      this.searching = val;
    }
    
    //search item
    handleSearch = async (event) => {
      event.preventDefault();
      const val = this.searching;
      const response = await fetch(`/api/playlists/search/${val}`);
      const body = await response.json();
      if (response.status !== 200) throw Error(body.message);

      let message;
      if (body.error) {
        message = body.error
      }
      else{
        let data = body[0].Name;
        let id = body[0].PlaylistId;
        message = `id: ${id} ${data}`;
      }
      
      //show results
      document.getElementById("results").classList.remove("hide");
      document.getElementById("results").classList.add("show");
      document.getElementById("results").innerHTML = message;
      
      return body;
    }

    //edit item
    async editItem(id, nam) {
      //no modifications are added
      const val = (this.play==='') ? nam : this.play;

      const settings = {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({name: val})
      };
      try {
        const fetchResponse = await fetch(`http://localhost:8080/api/playlists/${id}`, settings);
        const data = await fetchResponse.json();
        alert('item saved');
        return data;
      } catch (e) {
        alert('error');
        return e;
      }    

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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
              { getPlaylists.map(playlist => 
                <tr key={playlist.PlaylistId}>
                  <td className="align-middle">{playlist.PlaylistId}</td>
                  <td>
                    <input
                    type="text"
                    className="form-control"
                    id={playlist.PlaylistId}
                    defaultValue={playlist.Name}
                    onChange={(event) => this.handleInputChange(event)}
                    />
                  </td>
                  <td className="align-middle">
                    <ButtonGroup>
                      <Button className="btn btn-secondary btn-sm" role="button" onClick={() => this.editItem(playlist.PlaylistId, playlist.Name)}> <PencilIcon /> </Button>
                      {/* to="/playlist/add" */}
                      <Button className="btn btn-secondary btn-sm" role="button" onClick={() => this.deleteItem(playlist.PlaylistId)}>X</Button> 
                      {/* to="/playlist/search" */}
                    </ButtonGroup>
                  </td>
                </tr>)
              }
              </tbody>
            </Table>
            {/* preloader */}
            { getPlaylists.length<1?<Preloader />:''}
          </Row>
        );
        
        //search component
        const SearchPlaylist = () => {

          return (
            <Container className="mt-5">
              <Row className="justify-content-md-center">
                <Col xs lg="6">
                  <Jumbotron>
                  {/* onSubmit={handleSearch} */}
                    <Form onSubmit={(event) => this.handleSearch(event)}>
                      <Form.Group>
                        <Form.Label>Search by id or by name</Form.Label>
                        <Form.Control 
                            type="text"
                            placeholder="Playlist name"
                            required
                            onChange={(event) => this.handleSearchChange(event)}
                         /> 
                      </Form.Group>
                      <Button variant="primary" type="submit" >
                        Search
                      </Button>
                    </Form>

                    {/* search results */}
                    <div className="mt-5 hide" id="results">
                    </div>

                  </Jumbotron>
                </Col>  
              </Row>
            </Container>
          );
          
        };

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
                  <Container>
                    <h3>
                      Playlists ({getPlaylists.length})
                      <ButtonGroup className="ml-2">
                        <Link className="btn btn-secondary btn-sm" role="button" to="/playlist/add">add</Link>
                        <Link className="btn btn-secondary btn-sm" role="button" to="/playlist/search">search</Link>
                        {/* the component should update */}
                        <Link className="btn btn-secondary btn-sm" role="button" onClick={() => {window.location.href="/playlists"}} to="/#">list</Link>
                      </ButtonGroup>
                    </h3>  
                    <Switch>
                      <Route path="/playlists" exact component={Home} />
                      <Route path="/playlist/add" component={AddPlaylist} />
                      <Route path="/playlist/search" component={SearchPlaylist} />
                    </Switch>
                  </Container>         
              </Router>
            </div>
         );
        }

}

export default Playlists;