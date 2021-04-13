import '../App.css';
import {Table, Container, Row, Button, ButtonGroup, Form, Col, Jumbotron, Tooltip, OverlayTrigger } from 'react-bootstrap';
import React, { Component, useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import Preloader from './Preloader';
import PencilIcon from './PencilIcon';


class  Tracks extends Component {

  constructor(props) { 
    super(props);   
    this.editid= 0;
    this.searching="";

    this.state = {
      getTracks: []
    }
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

    //search by id or name
    handleSearchChange(event){
        let val = event.target.value;
        this.searching = val;
    }

    //search item
    handleSearch = async (event) => {
        event.preventDefault();
        const val = this.searching;
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

    async editItem(id) {
      this.editid= id;
  
        const settings = {
          method: 'GET',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          }
        };
        try {
          const fetchResponse = await fetch(`http://localhost:8080/api/tracks/search/${id}`, settings);
          const data = await fetchResponse.json();
          return data;
        } catch (e) {
          alert('error');
          return e;
        }    

    }

    render() {
        const { getTracks } = this.state;
        const columnStyle = { maxWidth: "150px"};
        const columnStyleSmall = { maxWidth: "70px"};

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
                  <th>Action</th>
                  </tr>
                </thead>
                <tbody>

                { getTracks.map(track =>
                    <tr key={track.TrackId}>
                        <td className="align-middle text-truncate" style={columnStyleSmall}>{track.TrackId}</td>
                        <td className="align-middle text-truncate2" style={columnStyle}>{track.Name}</td>
                        <td className="align-middle text-truncate" style={columnStyleSmall}>{track.AlbumId}</td>
                        <td className="align-middle text-truncate" style={columnStyleSmall}>{track.MediaTypeId}</td>
                        <td className="align-middle text-truncate" style={columnStyleSmall}>{track.GenreId}</td>
                        <td className="align-middle text-truncate" style={columnStyle}>{track.Composer}</td>
                        <td className="align-middle text-truncate" style={columnStyleSmall}>{track.Milliseconds}</td>
                        <td className="align-middle text-truncate" style={columnStyleSmall}>{track.Bytes}</td>
                        <td className="align-middle text-truncate" style={columnStyleSmall}>{track.UnitPrice}</td>
                        <td className="align-middle">
                        <ButtonGroup>
                          <Link className="btn btn-primary btn-sm" role="button" to={`/track/edit/${track.TrackId}`}> <PencilIcon /> </Link>
                          <Button className="btn btn-primary btn-sm" role="button" onClick={() => this.deleteItem(track.TrackId)}>X</Button> 
                        </ButtonGroup>
                        </td>
                    </tr>) }
                </tbody>
              </Table>

               {/* preloader */}
               { getTracks.length<1?<Preloader />:''}
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

                saveTracklist(trackName, albumid, mediaid,
                                genreid, composer, time, bytes, price);
              };

              // create track

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

        // edit row
        //add new album
        const EditTrack = (props) => {

          //get the id in the url provided by props
          const url = props.location.pathname;
          const id = url.substring(url.lastIndexOf("/")+1, url.length);

          let filldata = [];

          const getData = async () => {

            const response = await this.editItem(id)

            filldata.push(response[0].TrackId)
            filldata.push(response[0].Name)
            filldata.push(response[0].AlbumId)
            filldata.push(response[0].MediaTypeId)
            filldata.push(response[0].GenreId)
            filldata.push(response[0].Composer)
            filldata.push(response[0].Milliseconds)
            filldata.push(response[0].Bytes)
            filldata.push(response[0].UnitPrice)

          }

          getData();

          function TrackListForm() {
            
            //edit item submit
            const handleSubmit = (event) => {
              
              event.preventDefault();
              event.stopPropagation();

              //values for fetch
              const vals = [];
              //get trackid
              const idtrack = document.getElementById("trackid").innerHTML.substring(1);
              vals.push(idtrack);
              const ids = ['trackname','albumid','mediaid','genreid','composer','milliseconds','manybytes','theprice'];
              ids.map(id => vals.push(document.getElementById(id).value));
              saveTracklist(vals);

            };

            // edit track

            const saveTracklist = async (arr) => {

              const settings = {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  name: arr[1],
                  album: arr[2],
                  media: arr[3],
                  genre: arr[4],
                  composer: arr[5],
                  time: arr[6],
                  bytes: arr[7],
                  price: arr[8]
                })
              };
              try {
                const fetchResponse = await fetch(`http://localhost:8080/api/tracks/${arr[0]}`, settings);
                const data = await fetchResponse.json();
                alert('item saved');
                return data;
              } catch (e) {
                alert('error');
                return e;
              }    

            }

            useEffect(() => {
              const timer = setTimeout(() => {
                console.log('Timeout called!');

                document.getElementById('trackid').innerHTML = `# ${filldata[0]}`;
                document.getElementById('trackname').value = filldata[1];
                document.getElementById('albumid').value = filldata[2];
                document.getElementById('mediaid').value = filldata[3];
                document.getElementById('genreid').value = filldata[4];
                document.getElementById('composer').value = filldata[5];
                document.getElementById('milliseconds').value = filldata[6];
                document.getElementById('manybytes').value = filldata[7];
                document.getElementById('theprice').value = filldata[8];

              }, 1000);
              return () => clearTimeout(timer);
            }, []);

            //tooltips
            const tracknameTooltip = (props) => (
              <Tooltip id="button-tooltip-1" {...props}>
                Track name
              </Tooltip>
            );
            const albumidTooltip = (props) => (
              <Tooltip id="button-tooltip-2" {...props}>
                Album id
              </Tooltip>
            );
            const mediaidTooltip = (props) => (
              <Tooltip id="button-tooltip-3" {...props}>
                Media id
              </Tooltip>
            );
            const genreidTooltip = (props) => (
              <Tooltip id="button-tooltip-4" {...props}>
                Genre id
              </Tooltip>
            );
            const composerTooltip = (props) => (
              <Tooltip id="button-tooltip-5" {...props}>
                Composer
              </Tooltip>
            );
            const timeTooltip = (props) => (
              <Tooltip id="button-tooltip-6" {...props}>
                Milliseconds
              </Tooltip>
            );
            const bytesTooltip = (props) => (
              <Tooltip id="button-tooltip-7" {...props}>
                Bytes
              </Tooltip>
            );
            const priceTooltip = (props) => (
              <Tooltip id="button-tooltip-8" {...props}>
                Price
              </Tooltip>
            );                    

            return(
                <Container className="mt-5">
                <Row className="justify-content-md-center">
                  <Col xs lg="6">
                    <Jumbotron>
                      <Form onSubmit={handleSubmit} >
                        <Form.Group>
                          <Form.Label>Edit track <span id="trackid"></span></Form.Label>
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={tracknameTooltip}
                          >
                            <Form.Control type="text" id="trackname" placeholder="Track name" defaultValue='loading...' required/>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={albumidTooltip}
                          >
                            <Form.Control type="number" id="albumid" placeholder="Album id" required/>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={mediaidTooltip}
                          >
                            <Form.Control type="number" id="mediaid" placeholder="Media Type id" required/>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={genreidTooltip}
                          >
                            <Form.Control type="number" id="genreid" placeholder="Genre id" required/>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={composerTooltip}
                          >
                            <Form.Control type="text" id="composer" placeholder="Composer" defaultValue='loading...' />
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={timeTooltip}
                          >
                            <Form.Control type="number" id="milliseconds" placeholder="Time" required/>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={bytesTooltip}
                          >
                            <Form.Control type="number" id="manybytes" placeholder="Bytes" required/>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={priceTooltip}
                          >
                            <Form.Control type="number" id="theprice" step="0.01" placeholder="Price" required/>
                          </OverlayTrigger>
                        </Form.Group>
                        <Button variant="primary" type="submit" >
                          Submit
                        </Button>
                      </Form>
                    </Jumbotron>
                  </Col>
                </Row>
              </Container>
                );

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
                          <Route path="/track/edit/:id" component={EditTrack} />                       
                          <Route path="/track/search" component={SearchAlbum} />
                        </Switch>
                      </Container>         
                  </Router>
                </div>
            );

            }

}

export default Tracks;