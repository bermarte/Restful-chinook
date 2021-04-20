import '../App.css';
import {
    Table,
    Container,
    Row,
    Button,
    ButtonGroup,
    Form,
    Col,
    Jumbotron
} from 'react-bootstrap';
import React, {Component, useState} from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import Preloader from './Preloader';
import PencilIcon from './PencilIcon';

class Genres extends Component {

    constructor(props) {
        super(props);
        this.searching = "";

        this.state = {
            getGenreslists: []
        }
    }

    getGenres = async() => {
        const response = await fetch('/api/genres');
        const body = await response.json();
        if (response.status !== 200) 
            throw Error(body.message);
        return body;
    }

    //get all the genres
    componentDidMount() {
        this
            .getGenres()
            .then(res => {
                this.setState({getGenreslists: res});
            })
    }

    //delete playlist by id
    deleteItem = async(item,indx) => {

        const settings = {
            method: 'DELETE'
        };
        try {
            const fetchResponse = await fetch(`http://localhost:8080/api/genres/${item}`, settings);
            const data = await fetchResponse.json();
            alert('item deleted');

            const newState = Object.assign({}, this.state);
            newState.getGenreslists.splice(indx,1);
            this.props.history.push('/genres');

            return data;
        } catch (e) {
            alert('error');
            return e;
        }

    }

    handleInputChange(event, id) {
        let val = event.target.value;
        //set value for editItem, new state
        const newState = Object.assign({}, this.state);
        newState.getGenreslists[id - 1].Name = val;
    }

    //search by id or name
    handleSearchChange(event) {
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
    handleSearch = async(event) => {
        event.preventDefault();
        const val = this.searching;
        const encVal = this.HtmlEncode(val);
        const response = await fetch(`/api/genres/search/${encVal}`);
        const body = await response.json();
        if (response.status !== 200) 
            throw Error(body.message);
        
        let message;
        if (body.error) {
            message = body.error
        } else {
            let data = body[0].Name;
            let id = body[0].GenreId;
            message = `id: ${id} ${data}`;
        }

        //show results
        document
            .getElementById("results")
            .classList
            .remove("hide");
        document
            .getElementById("results")
            .classList
            .add("show");
        document
            .getElementById("results")
            .innerHTML = message;

        return body;
    }

    //edit item
    async editItem(id, nam) {

        const settings = {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: nam})
        };
        try {
            const fetchResponse = await fetch(`http://localhost:8080/api/genres/${id}`, settings);
            const data = await fetchResponse.json();
            alert('item saved');
            return data;
        } catch (e) {
            alert('error');
            return e;
        }

    }

    render() {
        const {getGenreslists} = this.state;

        //get all genres (home)
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
                        {getGenreslists.map((genre,index) => <tr key={index+1}>
                            <td className="align-middle">{genre.GenreId}</td>
                            <td>
                                <input
                                    type="text"
                                    className="form-control"
                                    id={`genre_${genre.GenreId}`}
                                    defaultValue={getGenreslists[index].Name}
                                    onBlur={(event) => this.handleInputChange(event, genre.GenreId)}/>
                            </td>
                            <td className="align-middle">
                                <ButtonGroup>
                                    <Button
                                        className="btn btn-secondary btn-sm"
                                        role="button"
                                        onClick={() => this.editItem(genre.GenreId, genre.Name)}>
                                        <PencilIcon/>
                                    </Button>
                                    <Button
                                        className="btn btn-secondary btn-sm"
                                        role="button"
                                        onClick={() => this.deleteItem(genre.GenreId, index)}>X</Button>
                                </ButtonGroup>
                            </td>
                        </tr>)
}
                    </tbody>
                </Table>
                {/* preloader */}
                {getGenreslists.length < 1? <Preloader/>: ''}
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
                                            placeholder="Genre name"
                                            required
                                            onChange={(event) => this.handleSearchChange(event)}/>
                                    </Form.Group>
                                    <Button variant="primary" type="submit">
                                        Search
                                    </Button>
                                </Form>

                                {/* search results */}
                                <div className="mt-5 hide" id="results"></div>

                            </Jumbotron>
                        </Col>
                    </Row>
                </Container>
            );

        };

        //add new genre
        const AddGenrelist = () => {

            const GenreListForm = () => {

                //state using hook
                const [genrelistName,
                    setGenrelistName] = useState();

                const handleSubmit = (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    saveGenrelist(genrelistName);
                };

                const handleGenrelistChange = (event) => {
                    setGenrelistName(event.target.value);
                };

                const saveGenrelist = async(list) => {
                    const settings = {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({name: list})
                    };
                    try {
                        const fetchResponse = await fetch(`http://localhost:8080/api/genres`, settings);
                        const data = await fetchResponse.json();
                        alert('new item added');
                        
                        const newState = Object.assign({}, this.state);
                        const newId = newState.getGenreslists.length+1;
                        newState.getGenreslists.push({GenreId: newId, Name: list});

                        return data;
                    } catch (e) {
                        alert('error');
                        return e;
                    }

                }

                return (
                    <Container className="mt-5">
                        <Row className="justify-content-md-center">
                            <Col xs lg="6">
                                <Jumbotron>
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group>
                                            <Form.Label>Add a new genre</Form.Label>
                                            <Form.Control
                                                onChange={handleGenrelistChange}
                                                type="text"
                                                placeholder="Genre name"
                                                required/>
                                        </Form.Group>
                                        <Button variant="primary" type="submit">
                                            Submit
                                        </Button>
                                    </Form>
                                </Jumbotron>
                            </Col>
                        </Row>
                    </Container>
                )
            }
            return (<GenreListForm/>);

        };

        return (
            <div>
                <Router>
                    <Container>
                        <h3>
                            Genres ({getGenreslists.length})
                            <ButtonGroup className="ml-2">
                                <Link className="btn btn-secondary btn-sm" role="button" to="/genre/add">add</Link>
                                <Link className="btn btn-secondary btn-sm" role="button" to="/genre/search">search</Link>
                                <Link className="btn btn-secondary btn-sm" role="button" to="/genres">list</Link>
                            </ButtonGroup>
                        </h3>
                        <Switch>
                            <Route path="/genres" exact component={Home}/>
                            <Route path="/genre/add" component={AddGenrelist}/>
                            <Route path="/genre/search" component={SearchPlaylist}/>
                        </Switch>
                    </Container>
                </Router>
            </div>
        );
    }
}

export default Genres;