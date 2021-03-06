import '../App.css';
import {Table, Container, Row, Button, ButtonGroup, Form, Col, Jumbotron } from 'react-bootstrap';
import React, { Component, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import Preloader from './Preloader';
import PencilIcon from './PencilIcon';

class  Albums extends Component {

  constructor(props) { 
    super(props);   
    this.searching="";
    this.state = {
      getAlbums: [],
      getArtists: []
    }
  }

    getAlbums = async() => {
        const response = await fetch('/api/albums');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    getArtists = async() => {
      const response = await fetch('/api/artists');
      const body = await response.json();
      if (response.status !== 200) throw Error(body.message);
      return body;
    }

    componentDidMount() {
        this.getAlbums()
          .then(res => {          
            this.setState({ getAlbums: res });          
          });
        this.getArtists()
          .then(res => {          
            this.setState({ getArtists: res });          
          }); 
        
    }

    //delete album by id
    deleteItem = async (item, indx) => {

        const settings = {
          method: 'DELETE'
        };
        try {
          const fetchResponse = await fetch(`http://localhost:8080/api/albums/${item}`, settings);
          const data = await fetchResponse.json();
          alert('item deleted');
     
          const newState = Object.assign({}, this.state);
          newState.getAlbums.splice(indx,1);
          this.props.history.push('/albums');           

          return data;
        } catch (e) {
          alert('error');
          return e;
        }    
  
    }

    //find artist by id
    upName = (uiid, par) => {
      const artid = this.state.getAlbums[uiid-1].ArtistId;
      const item = this.state.getArtists.find(e => e.ArtistId === Number(artid))
      if (item)
        document.getElementById(`artist_name_${uiid}`).innerHTML = this.getName(item);   
    }

    //PUT: title and album id
    handleInputChange(event, id){
        const val = event.target.value;
        //set value for editItem, new state
        const newState = Object.assign({}, this.state);
        newState.getAlbums[id-1].Title = val;
    }
    async handleInputArtistChange(event, id){
      let val = event.target.value;

      //set value for editItem, new state
      const newState = Object.assign({}, this.state);
      newState.getAlbums[id-1].ArtistId = Number(val);

      //change the name of artist
      this.upName(id, val);
      
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
    //fetch the name of the artist
    fetchName = async (idpar) => {
      //second fetch (get the name of the artist)
      const second_response = await fetch(`/api/artists/search/${idpar}`);
      const second_body = await second_response.json();
      if (second_response.status !== 200) throw Error(second_body.message);
      const artistname = await second_body[0].Name;
      return artistname;
    }

    //search item
    handleSearch = async (event) => {
        event.preventDefault();
        const val = this.searching;
        const encVal = this.HtmlEncode(val);
        const response = await fetch(`/api/albums/search/${encVal}`);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
  
        let message;
        if (body.error) {
          message = body.error
        }
        else{
          let data = body[0].Title;
          let id = body[0].AlbumId;
          let artistid = body[0].ArtistId;

          //call name fetch
          const artistname = await this.fetchName(artistid);
          message = `id: ${id} ${data} <br> artist id: ${artistid} [${artistname}]`;
        }
        
        //show results
        document.getElementById("results").classList.remove("hide");
        document.getElementById("results").classList.add("show");
        document.getElementById("results").innerHTML = message;
        
        return body;
    };

    //get name of the artist
    getName = (item) => {
        if (item) return item.Name;
    }  

    //edit item
    async editItem(id, alb, artid) {
  
        const settings = {
          method: 'PUT',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({title: alb, artistid: artid})
        };
        try {
          const fetchResponse = await fetch(`http://localhost:8080/api/albums/${id}`, settings);
          const data = await fetchResponse.json();

          this.upName(artid, artid-1);
          alert('item saved');
          return data;
        } catch (e) {
          alert('error');
          return e;
        }    
  
    }

    render() {
        const { getAlbums, getArtists } = this.state;

        //get all albums (home)
        const Home = () => (
          <Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Artist</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
              { getAlbums.map((album,index) => 
              
                <tr key={index+1}>
                  <td className="align-middle">{index+1}</td>
                  <td className="align-middle">

                    <input
                    type="text"
                    className="form-control"
                    id={`album_${album.AlbumId}`}
                    defaultValue={getAlbums[index].Title}
                    onBlur={(event) => this.handleInputChange(event, index+1)}// album.AlbumId
                    />
                  </td>
                  <td>
                    <div>
                      <span className="artist pr-2 pl-2" id={`artist_name_${index+1}`}>
                      {
                        this.getName(getArtists.find(e => e.ArtistId === getAlbums[index].ArtistId))
                      }
                      </span>
                    </div>
                    <input
                        type="number"
                        className="form-control col-sm-4 artist-td"
                        id={`artist_${album.AlbumId}`}
                        defaultValue={getAlbums[index].ArtistId}
                        onChange={(event) => this.handleInputArtistChange(event, index+1)}//album.AlbumId
                        min="1" max="10000"
                    />
                  </td>
                  <td className="align-middle">
                    <ButtonGroup>
                      <Button className="btn btn-secondary btn-sm" role="button" onClick={() => this.editItem(album.AlbumId, album.Title, album.ArtistId)}> <PencilIcon /> </Button>
                      <Button className="btn btn-secondary btn-sm" role="button" onClick={() => this.deleteItem(album.AlbumId, index)}>X</Button>
                    </ButtonGroup>
                  </td>
                  
                </tr>)
              }
              </tbody>
            </Table>
            {/* preloader */}
            { getAlbums.length<1?<Preloader />:''}
          </Row>
        );
        
        //search component
        const SearchAlbum = () => {

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
                            placeholder="Album title"
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
        const AddAlbum = () => {

          const AlbumListForm = () => {

            //state using hook
            const [albumTitle,setAlbumTitle] = useState();
            const [artistid, setArtistId] = useState();
          
            const handleSubmit = (event) => {          
              event.preventDefault();
              event.stopPropagation();
              saveAlbumlist(albumTitle, artistid);
            };

            const handleAlbumChange = (event) => {
              setAlbumTitle(event.target.value);
            };

            const handleArtistChange = (event) => {
                setArtistId(event.target.value);
              };

            const saveAlbumlist = async (albumtitle, artistid) => {
              const settings = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({title: albumtitle, artistid: artistid})
              };
              try {
                const fetchResponse = await fetch(`http://localhost:8080/api/albums`, settings);
                const data = await fetchResponse.json();
                alert('new item added');

                const newState = Object.assign({}, this.state);
                const newId = newState.getAlbums.length+1;
                newState.getAlbums.push({AlbumId: newId, ArtistId: Number(artistid), Title: albumtitle});
                this.props.history.push('/albums');
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
                      <Form.Label>Add a new album</Form.Label>
                      <Form.Control onChange={handleAlbumChange} type="text" placeholder="Album title" required/>
                      <Form.Control onChange={handleArtistChange} type="number" placeholder="Artist id" required/>
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
          return(<AlbumListForm />);

        };

        return(
            <div>
              <Router>          
                  <Container>
                    <h3>
                      Albums ({getAlbums.length})
                      <ButtonGroup className="ml-2">
                        <Link className="btn btn-secondary btn-sm" role="button" to="/album/add">add</Link>
                        <Link className="btn btn-secondary btn-sm" role="button" to="/album/search">search</Link>
                        <Link className="btn btn-secondary btn-sm" role="button" to="/albums">list</Link>
                      </ButtonGroup>
                    </h3>  
                    <Switch>
                      <Route path="/albums" exact component={Home} />
                      <Route path="/album/add" component={AddAlbum} />
                      <Route path="/album/search" component={SearchAlbum} />
                    </Switch>
                  </Container>         
              </Router>
            </div>
         );
        }
}

export default Albums;