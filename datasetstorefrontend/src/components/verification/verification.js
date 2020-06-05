import React, {Component} from "react";
import {Button, Col, Container, Form, Navbar, Row} from "react-bootstrap";
import axios from 'axios';
import value from "../../value";
import {Redirect} from "react-router-dom";
import Logo from "../../images/logo.png";

class Verification extends Component{
    constructor(props) {
        super(props);
        this.state = {
            token:"",
            verificationMessage:""
        };

        this.handleFromSubmit = this.handleFromSubmit.bind(this);
        this.handleTokenChange = this.handleTokenChange.bind(this);
    }

    handleTokenChange(e){
        this.setState({
            token:e.target.value
        });
    }

    handleFromSubmit(e){
        e.preventDefault();
        axios.post(`${value.BASE}/api/verification`, {
            token: this.state.token
        }).then((response) => {
                if (response.status === 200){
                    if (response.data.verification){
                        this.props.history.push({
                            pathname:'/home',
                            verification:true
                        });
                        return <Redirect to={'/home'} />
                    }
                    console.log(response.data.verification);
                }else {
                    this.setState({
                        verificationMessage: "Token verification failed."
                    })
                }
            })
            .catch((err) => {
                this.setState({
                    verificationMessage: err.message
                })
            })
    }

    render() {
        return (
            <div>
                <div>
                    <Navbar style={{...styles.navbar}}>
                        <Navbar.Brand href="#home">
                            <img
                                alt=""
                                src={Logo}
                                width="30"
                                height="30"
                                className="d-inline-block align-top"
                            />{'  '}
                            <strong style={{color: "#fff"}}>HeadBlocks</strong>
                        </Navbar.Brand>
                    </Navbar>
                </div>
                <Container style={{ marginTop:"15%" }}>
                    <Row className="justify-content-center">
                        <Col md={8} lg={8} className="text-center">
                            <Form onSubmit={this.handleFromSubmit}>
                                <Form.Group controlId="verificationToken">
                                    <Form.Label><b>Please enter your token</b></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter token here"
                                        className="text-center"
                                        onChange={this.handleTokenChange}
                                    />
                                    {
                                        (this.state.verificationMessage !== "")?
                                            <Form.Text className="text-danger">
                                                {this.state.verificationMessage}
                                            </Form.Text>
                                            :""
                                    }
                                </Form.Group>
                                <Button variant="success" type="submit">
                                    Verify
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

const styles = {
    navbar:{
        backgroundColor: "#000"
    }
};

export default Verification;
