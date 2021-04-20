import '../App.css';
import {Table, Container, Row, Button, ButtonGroup, Form, Col, Jumbotron } from 'react-bootstrap';
import React, { Component, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import Preloader from './Preloader';
import PencilIcon from './PencilIcon';

class  Artists extends Component {

    constructor(props) { 
        super(props);   
        this.searching="";
        this.state = {
          getArtists: []
        }
    }

    getArtists = async() => {
        const response = await fetch('/api/artists');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    componentDidMount() {
        this.getArtists()
          .then(res => {
            this.setState({ getArtists: res });
          })
    }

    //delete artist by id
    deleteItem = async (item, indx) => {

        const settings = {
          method: 'DELETE'
        };
        try {
          const fetchResponse = await fetch(`http://localhost:8080/api/artists/${item}`, settings);
          const data = await fetchResponse.json();
          alert('item deleted');
     
          const newState = Object.assign({}, this.state);
          newState.getArtists.splice(indx,1);
          this.props.history.push('/artists');           

          return data;
        } catch (e) {
          alert('error');
          return e;
        }    
  
    }

    //PUT: title and album id
    handleInputChange(event, id){
        const val = event.target.value;
        //set value for editItem, new state
        const newState = Object.assign({}, this.state);
        newState.getArtists[id-1].Name = val;
    }

    //search by id or name
    handleSearchChange(event){
        let val = event.target.value;
        this.searching = val;
    }

    //AC%2FDC => AC/DC
    HtmlEncode = (str) => {
        const arr = [];
        for (let n = 0, l = str.length; n < l; n ++){
            const hex = Number(str.charCodeAt(n)).toString(16);
            arr.push(hex);
        }
        const s = arr.join('%');
        return `%${s}`
    }

    //search item
    handleSearch = async (event) => {
        event.preventDefault();
        const val = this.searching;
        const encVal = this.HtmlEncode(val);
        const response = await fetch(`/api/artists/search/${encVal}`);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
  
        let message;
        if (body.error) {
          message = body.error
        }
        else{
          let data = body[0].Name;
          let id = body[0].ArtistId;
          message = `id: ${id} ${data}`;
        }
        
        //show results
        document.getElementById("results").classList.remove("hide");
        document.getElementById("results").classList.add("show");
        document.getElementById("results").innerHTML = message;
        
        return body;
    }

    //edit item
    async editItem(id, art) {
  
        const settings = {
          method: 'PUT',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({name: art})
        };
        try {
          const fetchResponse = await fetch(`http://localhost:8080/api/artists/${id}`, settings);
          const data = await fetchResponse.json();
          alert('item saved');
          return data;
        } catch (e) {
          alert('error');
          return e;
        }    
  
    }

    render() {
        const { getArtists } = this.state;

        //get all artists (home)
        const Home = () => (
          <Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Artist</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
              { getArtists.map((artist,index) => 
              
                <tr key={index+1}>
                  <td className="align-middle">{artist.ArtistId}</td>
                  <td>

                    <input
                    type="text"
                    className="form-control"
                    id={`artist_${artist.ArtistId}`}
                    defaultValue={getArtists[index].Name}
                    onBlur={(event) => this.handleInputChange(event, artist.ArtistId)}
                    />
                  </td>
                  <td className="align-middle">
                    <ButtonGroup>
                      <Button className="btn btn-secondary btn-sm" role="button" onClick={() => this.editItem(artist.ArtistId, artist.Name)}> <PencilIcon /> </Button>
                      <Button className="btn btn-secondary btn-sm" role="button" onClick={() => this.deleteItem(artist.ArtistId, index)}>X</Button>
                    </ButtonGroup>
                  </td>
                  
                </tr>)
              }
              </tbody>
            </Table>
            {/* preloader */}
            { getArtists.length<1?<Preloader />:''}
          </Row>
        );
        
        //search component
        const SearchArtist = () => {

          return (
            <Container className="mt-5">
              <Row className="justify-content-md-center">
                <Col xs lg="6">
                  <Jumbotron>
                    <Form onSubmit={(event) => this.handleSearch(event)}>
                      <Form.Group>
                        <Form.Label>Search by id or by name</Form.Label>
                        <Form.Control 
                            type="text"
                            placeholder="Artist name"
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

        //add new album
        const AddArtist = () => {

          const ArtistListForm = () => {

            //state using hook
            const [artistName,setArtistName] = useState();
          
            const handleSubmit = (event) => {          
              event.preventDefault();
              event.stopPropagation();
              console.log('name',artistName);
              saveArtistName(artistName);
            };

            const handleAlbumChange = (event) => {
                setArtistName(event.target.value);
            };

            const saveArtistName = async (list) => {
              const settings = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name: list})
              };
              try {
                const fetchResponse = await fetch(`http://localhost:8080/api/artists`, settings);
                const data = await fetchResponse.json();
                alert('new item added');

                const newState = Object.assign({}, this.state);
                const newId = newState.getArtists.length+1;
                newState.getArtists.push({ArtistId: newId, Name: list});

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
                      <Form.Label>Add a new artist</Form.Label>
                      <Form.Control onChange={handleAlbumChange} type="text" placeholder="Artist name" required/>
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
          return(<ArtistListForm />);

        };

        return(
            <div>
              <Router>          
                  <Container>
                    <h3>
                      Artists ({getArtists.length})
                      <ButtonGroup className="ml-2">
                        <Link className="btn btn-secondary btn-sm" role="button" to="/artist/add">add</Link>
                        <Link className="btn btn-secondary btn-sm" role="button" to="/artist/search">search</Link>
                        <Link className="btn btn-secondary btn-sm" role="button" to="/artists">list</Link>
                      </ButtonGroup>
                    </h3>  
                    <Switch>
                      <Route path="/artists" exact component={Home} />
                      <Route path="/artist/add" component={AddArtist} />
                      <Route path="/artist/search" component={SearchArtist} />
                    </Switch>
                  </Container>         
              </Router>
            </div>
         );
        }
}

export default Artists;