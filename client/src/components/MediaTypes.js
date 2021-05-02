import '../App.css';
import {Table, Container, Row, Button, ButtonGroup, Form, Col, Jumbotron } from 'react-bootstrap';
import React, { Component, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import Preloader from './Preloader';
import PencilIcon from './PencilIcon';

class  MediaTypes extends Component {

  constructor(props) { 
    super(props);   
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
    deleteItem = async (item, indx) => {

        const settings = {
          method: 'DELETE'
        };
        try {
          const fetchResponse = await fetch(`/api/media-types/${item}`, settings);
          const data = await fetchResponse.json();
          alert('item deleted');
          
          const newState = Object.assign({}, this.state);
          newState.getMediaTypes.splice(indx,1);
          this.props.history.push('/media-types');  
          
          return data;
        } catch (e) {
          alert('error');
          return e;
        }    
  
    }


    handleInputChange(event, id){
        let val = event.target.value;
        //set value for editItem, new state
        const newState = Object.assign({}, this.state);
        newState.getMediaTypes[id-1].Name = val;
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
        const response = await fetch(`/api/media-types/search/${encVal}`);
        const body = await response.json();
        if (response.status !== 200)
          throw Error(body.message);
    
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
  
        const settings = {
          method: 'PUT',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({name: nam})
        };
        try {
          const fetchResponse = await fetch(`/api/media-types/${id}`, settings);
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
                { getMediaTypes.map((mediatype,index) => 
                  <tr key={index+1}>
                    <td className="align-middle">{mediatype.MediaTypeId}</td>
                    <td>
                      <input
                      type="text"
                      className="form-control"
                      id={`media_${mediatype.MediaTypeId}`}
                      defaultValue={getMediaTypes[index].Name}
                      onBlur={(event) => this.handleInputChange(event, mediatype.MediaTypeId)}
                      />
                    </td>
                    <td className="align-middle">
                      <ButtonGroup>
                        <Button className="btn btn-secondary btn-sm" role="button" onClick={() => this.editItem(mediatype.MediaTypeId, mediatype.Name)}> <PencilIcon /> </Button>
                        <Button className="btn btn-secondary btn-sm" role="button" onClick={() => this.deleteItem(mediatype.MediaTypeId, index)}>X</Button> 
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

            const MediaTypeListForm = () => {
  
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
  
              const saveMediaTypelist = async(list) => {
                const settings = {
                  method: 'POST',
                  headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({name: list})
                };
                try {
                  const fetchResponse = await fetch(`/api/media-types`, settings);
                  const data = await fetchResponse.json();
                  alert('new item added');

                  const newState = Object.assign({}, this.state);
                  const newId = newState.getMediaTypes.length+1;
                  newState.getMediaTypes.push({MediaTypeId: newId, Name: list});

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
                        <Link className="btn btn-secondary btn-sm" role="button" to="/media-types">list</Link>
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