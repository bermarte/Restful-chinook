import '../App.css';
import {Table, Container, Row } from 'react-bootstrap';
import React, { Component } from 'react';

class  Tracks extends Component {

    state = {
        getTracks: []
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
      
    render() {
        const { getTracks } = this.state;
        return(
            <div>
                <h3>Tracks ({getTracks.length})</h3>
                <Container>
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
                </tr>
                </thead>
                <tbody>
                { getTracks.map(track =>
                    <tr><td>{track.TrackId}</td>
                    <td>{track.Name}</td>
                    <td>{track.AlbumId}</td>
                    <td>{track.MediaTypeId}</td>
                    <td>{track.GenreId}</td>
                    <td>{track.Composer}</td>
                    <td>{track.Milliseconds}</td>
                    <td>{track.Bytes}</td>
                    <td>{track.UnitPrice}</td></tr>) }
                </tbody>
                </Table>
                </Row>
                </Container>
            </div>
         );
        }
}

export default Tracks;