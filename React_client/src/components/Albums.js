import '../App.css';
import {Table, Container, Row } from 'react-bootstrap';
import React, { Component } from 'react';

class  Albums extends Component {

    state = {
        getAlbums: []
    }

    getAlbums = async() => {
        const response = await fetch('/api/albums');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    componentDidMount() {
        this.getAlbums()
          .then(res => {
            this.setState({ getAlbums: res });
          })
      }
      
    render() {
        const { getAlbums } = this.state;
        return(
            <div>
                <h3>Albums ({getAlbums.length})</h3>
                <Container>
                <Row>
                <Table striped bordered hover>
                <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Artist</th>
                </tr>
                </thead>
                <tbody>
                { getAlbums.map(album =>
                    <tr><td>{album.AlbumId}</td>
                    <td>{album.Title}</td>
                    <td>{album.ArtistId}</td>
                    </tr>) }
                </tbody>
                </Table>
                </Row>
                </Container>
            </div>
         );
        }
}

export default Albums;