import '../App.css';
import {Table, Container, Row } from 'react-bootstrap';
import React, { Component } from 'react';

class  MediaTypes extends Component {

    state = {
        getMediaTypes: []
    }

    getMediaTypes = async() => {
        const response = await fetch('/api/media-types');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    componentDidMount() {
        this.getMediaTypes()
          .then(res => {
            this.setState({ getMediaTypes: res });
          })
      }
      
    render() {
        const { getMediaTypes } = this.state;
        return(
            <div>
                <h3>Media Types ({getMediaTypes.length})</h3>
                <Container>
                <Row>
                <Table striped bordered hover>
                <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                </tr>
                </thead>
                <tbody>
                { 
                getMediaTypes.map(media =>
                    <tr><td>{media.MediaTypeId}</td>
                    <td>{media.Name}</td></tr>) 
                }
                </tbody>
                </Table>
                </Row>
                </Container>
            </div>
         );
        }
}

export default MediaTypes;