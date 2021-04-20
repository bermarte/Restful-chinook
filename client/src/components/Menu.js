import '../App.css';
import {ButtonGroup} from 'react-bootstrap';
import React from 'react';
import {Link} from 'react-router-dom';

const Menu = () => (
    <ButtonGroup size="lg" className="mb-2">
        <Link to="/albums" className="btn btn-primary" role="button">Albums</Link>
        <Link to="/artists" className="btn btn-primary" role="button">Artists</Link>
        <Link to="/genres" className="btn btn-primary" role="button">Genres</Link>
        <Link to="/media-types" className="btn btn-primary" role="button">Media-types</Link>
        <Link to="/playlists" className="btn btn-primary" role="button">Playlists</Link>
        <Link to="/tracks" className="btn btn-primary" role="button">Tracks</Link>
    </ButtonGroup>
);

export default Menu;