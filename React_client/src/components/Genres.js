import '../App.css';
import {Table, Container, Row } from 'react-bootstrap';
import React, { Component } from 'react';

class  Genres extends Component {

    state = {
        getGenres: []
    }

    getGenres = async() => {
        const response = await fetch('/api/genres');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    componentDidMount() {
        this.getGenres()
          .then(res => {
            this.setState({ getGenres: res });
          })
      }
      
    render() {
        const { getGenres } = this.state;
        return(
            <div>
                <h3>Genres ({getGenres.length})</h3>
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
                getGenres.map(genre =>
                    <tr><td>{genre.GenreId}</td>
                    <td>{genre.Name}</td></tr>) 
                }
                </tbody>
                </Table>
                </Row>
                </Container>
            </div>
         );
        }
}

export default Genres;