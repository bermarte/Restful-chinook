import '../App.css';
import React from 'react';
import {Table, Container, Row } from 'react-bootstrap';


function Cover(props) {
  return (
    <Container>
        <Row>
             <div class="cover-container">
                 <div class="cover"></div>
             </div>
        </Row>
    </Container>
  );
}

export default Cover;