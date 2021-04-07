import '../App.css';
import {Table, Container, Row, Button, ButtonGroup, Form, Col, Jumbotron } from 'react-bootstrap';
import React, { Component, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';


class  Tracks extends Component {

    state = {
        getTracks: [],
        track:'',
        album: 0,
        media: 0,
        genre: 0,
        composer:'',
        time: 0,
        bytes: 0,
        price: 0,
        searching:''
    }

    getTracks = async() => {
        const response = await fetch('/api/tracks');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    componentDidMount() {
        this.getTracks()
          .then(res => {
            this.setState({ getTracks: res });
          })
    }

     //delete album by id
     deleteItem = async (item) => {

        const settings = {
          method: 'DELETE'
        };
        try {
          const fetchResponse = await fetch(`http://localhost:8080/api/tracks/${item}`, settings);
          const data = await fetchResponse.json();
          alert('item deleted');
          window.location.reload();
          return data;
        } catch (e) {
          alert('error');
          return e;
        }    
  
    }

    //PUT: name
    handleInputChange(event){
        let val = event.target.value;
        console.log('name', val);
        //set value for editItem
        this.state.track = val;
    }
    //album, media, genre, composer, time, bytes, price
    handleInputAlbumChange(event){
      let val = event.target.value;
      console.log('album', val);
      //set value for editItem
      this.state.album = val;
    }
    handleInputMediaChange(event){
        let val = event.target.value;
        console.log('media', val);
        //set value for editItem
        this.state.album = val;
    }
    handleInputGenreChange(event){
        let val = event.target.value;
        console.log('genre', val);
        //set value for editItem
        this.state.genre = val;
    }
    handleInputComposerChange(event){
        let val = event.target.value;
        console.log('composer', val);
        //set value for editItem
        this.state.composer = val;
    }
    handleInputTimeChange(event){
        let val = event.target.value;
        console.log('time', val);
        //set value for editItem
        this.state.time = val;
    }
    handleInputBytesChange(event){
        let val = event.target.value;
        console.log('bytes', val);
        //set value for editItem
        this.state.bytes = val;
    }
    handleInputPriceChange(event){
        let val = event.target.value;
        console.log('price', val);
        //set value for editItem
        this.state.price = val;
    }

    //search by id or name
    handleSearchChange(event){
        let val = event.target.value;
        this.state.searching = val;
    }

    //search item
    handleSearch = async (event) => {
        event.preventDefault();
        const val = this.state.searching;
        const response = await fetch(`/api/tracks/search/${val}`);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
  
        let message;
        if (body.error) {
          message = body.error
        }
        else{
          let data = body[0].Name;
          let id = body[0].TrackId;
          let albumid = body[0].ArtistId;
          let mediatype = body[0].MediaTypeId;
          let genreid = body[0].GenreId;
          let composer = body[0].Composer;
          let milliseconds = body[0].Milliseconds;
          let bytes = body[0].Bytes;
          let unitprice = body[0].UnitPrice;
          message = `id: ${id} ${data}
                    <br> album id: ${albumid}
                    <br> media type: ${mediatype}
                    <br> genre id: ${genreid}
                    <br> composer: ${composer}
                    <br> time: ${milliseconds}
                    <br> bytes: ${bytes}
                    <br> price: ${unitprice}`;
        }
        
        //show results
        document.getElementById("results").classList.remove("hide");
        document.getElementById("results").classList.add("show");
        document.getElementById("results").innerHTML = message;
        
        return body;
    }

    //edit item
    //album, media, genre, composer, time, bytes, price
    async editItem(id, tra, albid, medid, gen, comp, tim, byt, pr) {
        //no modifications are added
        const val_track = (this.state.track==='') ? tra : this.state.track;
        const val_album = (this.state.album===0) ? albid : this.state.album;
        const val_media = (this.state.media===0) ? medid : this.state.media;
        const val_genre = (this.state.genre===0) ? gen : this.state.genre;
        const val_composer = (this.state.composer==='') ? comp : this.state.composer;
        const val_time = (this.state.time===0) ? tim : this.state.time;
        const val_bytes = (this.state.bytes===0) ? byt : this.state.bytes;
        const val_price = (this.state.price===0) ? pr : this.state.price;
  
        const settings = {
          method: 'PUT',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({name: val_track,
                                album: val_album,
                                media: val_media,
                                genre: val_genre,
                                composer: val_composer,
                                time: val_time,
                                bytes: val_bytes,
                                price: val_price

                            })
        };
        try {
          const fetchResponse = await fetch(`http://localhost:8080/api/tracks/${id}`, settings);
          const data = await fetchResponse.json();
          alert('item saved');
          return data;
        } catch (e) {
          alert('error');
          return e;
        }    
  
    }


      
    render() {
        const { getTracks } = this.state;

        //get all tracks (home)
        const Home = () => (
            <Row>
              <Table striped bordered hover>
                <thead>
                  <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Album</th>
                  <th>Media</th>
                  <th>Genre</th>
                  <th>Composer</th>
                  <th>Time</th>
                  <th>Bytes</th>
                  <th>Price</th>
                  <th></th>
                  </tr>
                </thead>
                <tbody>
                { getTracks.map(track => 
                  <tr key={track.TrackId}>
                    <td>{track.TrackId}</td>
                    <td>
                      <input
                      type="text"
                      className="form-control"
                      id={track.TrackId}
                      defaultValue={track.Name}
                      onChange={(event) => this.handleInputChange(event)}
                      />
                    </td>
                    <td>
                        {/* album-id */}
                      <input
                          type="number"
                          className="form-control artist-td"
                          id={"album-"+track.AlbumId}
                          defaultValue={track.AlbumId}
                          onChange={(event) => this.handleInputAlbumChange(event)}
                          min="1" 
                      />
                    </td>

                    <td>
                        {/* media-id */}
                      <input
                          type="number"
                          className="form-control artist-td"
                          id={"media-"+track.MediaTypeId}
                          defaultValue={track.MediaTypeId}
                          onChange={(event) => this.handleInputMediaChange(event)}
                          min="1" 
                      />
                    </td>

                    <td>
                        {/* genre-id */}
                      <input
                          type="number"
                          className="form-control artist-td"
                          id={"genre-"+track.GenreId}
                          defaultValue={track.GenreId}
                          onChange={(event) => this.handleInputGenreChange(event)}
                          min="1" 
                      />
                    </td>

                    <td>
                        {/* composer */}
                      <input
                          type="text"
                          className="form-control artist-td"
                          id={"composer-"+track.Composer}
                          defaultValue={track.Composer}
                          onChange={(event) => this.handleInputComposerChange(event)}
                      />
                    </td>

                    <td>
                        {/* time */}
                      <input
                          type="number"
                          className="form-control artist-td"
                          id={"time-"+track.Milliseconds}
                          defaultValue={track.Milliseconds}
                          min="1" 
                          onChange={(event) => this.handleInputTimeChange(event)}
                      />
                    </td>

                    <td>
                        {/* time */}
                      <input
                          type="number"
                          className="form-control artist-td"
                          id={"bytes-"+track.Bytes}
                          defaultValue={track.Bytes}
                          min="1" 
                          onChange={(event) => this.handleInputBytesChange(event)}
                      />
                    </td>

                    <td>
                        {/* price */}
                      <input
                          type="number"
                          className="form-control artist-td"
                          id={"price-"+track.UnitPrice}
                          defaultValue={track.UnitPrice}
                          min="0.0"
                          step="0.01" 
                          onChange={(event) => this.handleInputPriceChange(event)}
                      />
                    </td>

                    
                    <td>
                      <ButtonGroup>
                        <Button className="btn btn-secondary btn-sm"
                                role="button"
                                onClick={() => this.editItem(track.TrackId, track.Name, track.AlbumId,
                                                            track.MediaTypeId, track.GenreId, track.Composer,
                                                            track.Milliseconds, track.Bytes, track.UnitPrice)}>save</Button>
                        {/* to="/playlist/add" */}
                        <Button className="btn btn-secondary btn-sm" role="button" onClick={() => this.deleteItem(track.TrackId)}>X</Button> 
                        {/* to="/playlist/search" */}
                      </ButtonGroup>
                    </td>
                    
                  </tr>)
                }
                </tbody>
              </Table>
            </Row>
          );

          //search component
        const SearchAlbum = () => {

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
                              placeholder="Track title"
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
                        <p>{this.state.searchResults}</p>
                      </div>
  
                    </Jumbotron>
                  </Col>  
                </Row>
              </Container>
            );
            
          };

          //search component
        const SearchTrack = () => {

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
                      <p>{this.state.searchResults}</p>
                    </div>

                  </Jumbotron>
                </Col>  
              </Row>
            </Container>
          );
          
        };

        //add new album
        const AddTrack = () => {

            function TrackListForm() {
  
              //state using hook
              const [trackName,setTrackName] = useState();
              const [albumid, setAlbumId] = useState();
              const [mediaid, setMediaId] = useState();
              const [genreid, setGenreId] = useState();
              const [composer, setComposer] = useState();
              const [time, setTime] = useState();
              const [bytes, setBytes] = useState();
              const [price, setPrice] = useState();
            
              const handleSubmit = (event) => {          
                event.preventDefault();
                event.stopPropagation();
                //console.log('title',albumTitle, 'artist id', artistid);
                saveTracklist(trackName, albumid, mediaid,
                                genreid, composer, time, bytes, price);
              };

              const handleTrackChange = (event) => {
                setTrackName(event.target.value);
              };
  
              const handleAlbumChange = (event) => {
                setAlbumId(event.target.value);
              };
  
              const handleMediaChange = (event) => {
                  setMediaId(event.target.value);
              };

              const handleGenreChange = (event) => {
                setGenreId(event.target.value);
              };

              const handleComposerChange = (event) => {
                setComposer(event.target.value);
              };

              const handleTimeChange = (event) => {
                setTime(event.target.value);
              };

              const handleBytesChange = (event) => {
                setBytes(event.target.value);
              };

              const handlePriceChange = (event) => {
                setPrice(event.target.value);
              };
  
              const saveTracklist = async (trackName, albumid, mediaid,
                                            genreid, composer, time, bytes, price) => {
                const settings = {
                  method: 'POST',
                  headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({name: trackName,
                    album: albumid,
                    media: mediaid,
                    genre: genreid,
                    composer: composer,
                    time: time,
                    bytes: bytes,
                    price: price

                })
                  //body: JSON.stringify({title: albumtitle, artistid: artistid})
                };
                try {
                  const fetchResponse = await fetch(`http://localhost:8080/api/tracks`, settings);
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
                          <Form.Label>Add a new track</Form.Label>
                          <Form.Control onChange={handleTrackChange} type="text" placeholder="Track name" required/>
                          <Form.Control onChange={handleAlbumChange} type="number" placeholder="Album id" required/>
                          <Form.Control onChange={handleMediaChange} type="number" placeholder="Media Type id" required/>
                          <Form.Control onChange={handleGenreChange} type="number" placeholder="Genre id" required/>
                          <Form.Control onChange={handleComposerChange} type="text" placeholder="Composer" />
                          <Form.Control onChange={handleTimeChange} type="number" placeholder="Time" required/>
                          <Form.Control onChange={handleBytesChange} type="number" placeholder="Bytes" required/>
                          <Form.Control onChange={handlePriceChange} type="number" placeholder="Price" required/>
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
            return(<TrackListForm />);
            };
            
            return(
                <div>
                  <Router>          
                      <Container>
                        <h3>
                          Tracks ({getTracks.length})
                          <ButtonGroup className="ml-2">
                            <Link className="btn btn-secondary btn-sm" role="button" to="/track/add">add</Link>
                            <Link className="btn btn-secondary btn-sm" role="button" to="/track/search">search</Link>
                            {/* the component should update */}
                            <Link className="btn btn-secondary btn-sm" role="button" onClick={() => {window.location.href="/tracks"}} to="/#">list</Link>
                          </ButtonGroup>
                        </h3>  
                        <Switch>
                          <Route path="/tracks" exact component={Home} />
                          <Route path="/track/add" component={AddTrack} />
                          <Route path="/track/search" component={SearchAlbum} />
                        </Switch>
                      </Container>         
                  </Router>
                </div>
             );
            }
    }
    
    export default Tracks;