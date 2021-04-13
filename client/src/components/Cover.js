import '../App.css';
import React from 'react';
import { Container, Row } from 'react-bootstrap';


function Cover(props) {
  return (
    <Container>
        <Row>
             <div className="cover-container">
                 <div className="cover"></div>
             </div>
        </Row>
    </Container>
  );
}

export default Cover;