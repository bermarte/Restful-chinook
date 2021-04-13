import '../App.css';
import {Table, Container, Row, Button, ButtonGroup, Form, Col, Jumbotron } from 'react-bootstrap';
import React, { Component, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import Preloader from './Preloader';
import PencilIcon from './PencilIcon';

class  MediaTypes extends Component {

  constructor(props) { 
    super(props);   
    this.media= "";
    this.searching="";

    this.state = {
      getMediaTypes: []
    }
  }

    getMediaTypes = async() => {
        const response = await fetch('/api/media-types');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    //get all media types
    componentDidMount() {
        this.getMediaTypes()
          .then(res => {
            this.setState({ getMediaTypes: res });
          })
    }

    //delete mediatype by id
    deleteItem = async (item) => {

        const settings = {
          method: 'DELETE'
        };
        try {
          const fetchResponse = await fetch(`http://localhost:8080/api/media-types/${item}`, settings);
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
        this.media = val;
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
        const response = await fetch(`/api/media-types/search/${val}`);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
    
        let message;
        if (body.error) {
          message = body.error
        }
        else{
          let data = body[0].Name;
          let id = body[0].MediaTypeId;
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
        const val = (this.media==='') ? nam : this.media;
  
        const settings = {
          method: 'PUT',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({name: val})
        };
        try {
          const fetchResponse = await fetch(`http://localhost:8080/api/media-types/${id}`, settings);
          const data = await fetchResponse.json();
          alert('item saved');
          return data;
        } catch (e) {
          alert('error');
          return e;
        }    
  
      }

      
    render() {
        const { getMediaTypes } = this.state;

        //get all media-types (home)
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
                { getMediaTypes.map(mediatype => 
                  <tr key={mediatype.MediaTypeId}>
                    <td className="align-middle">{mediatype.MediaTypeId}</td>
                    <td>
                      <input
                      type="text"
                      className="form-control"
                      id={mediatype.MediaTypeId}
                      defaultValue={mediatype.Name}
                      onChange={(event) => this.handleInputChange(event)}
                      />
                    </td>
                    <td className="align-middle">
                      <ButtonGroup>
                        <Button className="btn btn-secondary btn-sm" role="button" onClick={() => this.editItem(mediatype.MediaTypeId, mediatype.Name)}> <PencilIcon /> </Button>
                        {/* to="/playlist/add" */}
                        <Button className="btn btn-secondary btn-sm" role="button" onClick={() => this.deleteItem(mediatype.MediaTypeId)}>X</Button> 
                        {/* to="/playlist/search" */}
                      </ButtonGroup>
                    </td>
                  </tr>)
                }
                </tbody>
              </Table>
              {/* preloader */}
              { getMediaTypes.length<1?<Preloader />:''}
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
                              placeholder="Media-type name"
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
        const AddMediaTypelist = () => {

            function MediaTypeListForm() {
  
              //state using hook
              const [mediatypeName,setMediatypeName] = useState();
            
              const handleSubmit = (event) => {          
                event.preventDefault();
                event.stopPropagation();   
                saveMediaTypelist(mediatypeName);
              };
  
              const handleMediaTypelistChange = (event) => {
                setMediatypeName(event.target.value);
              };
  
              const saveMediaTypelist = async (list) => {
                const settings = {
                  method: 'POST',
                  headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({name: list})
                };
                try {
                  const fetchResponse = await fetch(`http://localhost:8080/api/media-types`, settings);
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
                      <Form.Label>Add a new media-type</Form.Label>
                      <Form.Control onChange={handleMediaTypelistChange} type="text" placeholder="Media-type name" required/>
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
          return(<MediaTypeListForm />);

        };

        return(
            <div>
              <Router>          
                  <Container>
                    <h3>
                      Media-types ({getMediaTypes.length})
                      <ButtonGroup className="ml-2">
                        <Link className="btn btn-secondary btn-sm" role="button" to="/media-type/add">add</Link>
                        <Link className="btn btn-secondary btn-sm" role="button" to="/media-type/search">search</Link>
                        {/* the component should update */}
                        <Link className="btn btn-secondary btn-sm" role="button" onClick={() => {window.location.href="/media-types"}} to="/#">list</Link>
                      </ButtonGroup>
                    </h3>  
                    <Switch>
                      <Route path="/media-types" exact component={Home} />
                      <Route path="/media-type/add" component={AddMediaTypelist} />
                      <Route path="/media-type/search" component={SearchPlaylist} />
                    </Switch>
                  </Container>         
              </Router>
            </div>
         );
        }
}

export default MediaTypes;