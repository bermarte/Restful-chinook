import '../App.css';
import {Table, Container, Row } from 'react-bootstrap';
import React, { Component } from 'react';

class  Artists extends Component {

    state = {
        getArtists: []
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
      
    render() {
        const { getArtists } = this.state;
        return(
            <div>
                <h3>Artists ({getArtists.length})</h3>
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
                { getArtists.map(artist =>
                    <tr><td>{artist.ArtistId}</td>
                    <td>{artist.Name}</td>
                    </tr>) }
                </tbody>
                </Table>
                </Row>
                </Container>
            </div>
         );
        }
}

export default Artists;