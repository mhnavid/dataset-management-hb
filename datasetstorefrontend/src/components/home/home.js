import React, {Component} from "react";
import {Alert, Button, Col, Container, Form, Navbar, ProgressBar, Row} from 'react-bootstrap';
import Logo from '../../images/logo.png';
import Dropzone from "react-dropzone";
import uuid from 'react-uuid';
import axios from 'axios';
import value from "../../value";
import {Redirect} from "react-router-dom";

class Home extends Component{

    constructor(props) {
        super(props);
        this.state = {
            inputVisibility: true,
            startLoading: false,
            connection: 1,
            jobId:"",
            mainFiles:[],
            renamedFiles:[],
            fileShape:[],
            uploadCompleted: 0
        };
        this.handleConnectionSelect = this.handleConnectionSelect.bind(this);
        this.handleProcessStart     = this.handleProcessStart.bind(this);
    }

    handleStateReset() {
        this.setState({
            inputVisibility: true,
            startLoading: false,
            connection: 1,
            jobId:"",
            mainFiles:[],
            renamedFiles:[],
            fileShape:[],
            uploadCompleted: 0
        })
    }

    handleConnectionSelect(e){
        this.setState({
            connection:e,
        });
    }

    handleProcessStart(){
        if (this.state.mainFiles.length !== 0){
            this.setState({
                startLoading:true,
                inputVisibility: false,
                jobId: uuid()
            }, () => {
                if (parseInt(this.state.connection) === 1){
                    this.handleOneConnection();
                } else {
                    this.handleMultipleConnection();
                }
            });
        }
        else {
            alert("No file selected.")
        }
    }

    handleOneConnection() {
        for (let i=0; i<this.state.renamedFiles.length; i++){
            this.handleServerRequests(this.state.renamedFiles[i], i);
        }
    }

    handleMultipleConnection() {
        if (this.state.renamedFiles.length / parseInt(this.state.connection) >= 1){
            for (let i=0; i<this.state.renamedFiles.length; i=i+parseInt(this.state.connection)){
                if ((this.state.renamedFiles.length - i) < parseInt(this.state.connection)){
                    for (let j=0; j<(this.state.renamedFiles.length - i); j++){
                        this.handleServerRequests(this.state.renamedFiles[i+j], i+j);
                    }
                } else {
                    for (let j=0; j<parseInt(this.state.connection); j++){
                        this.handleServerRequests(this.state.renamedFiles[i+j], i+j);
                    }
                }
            }
        } else {
            for (let i=0; i<this.state.renamedFiles.length; i=i+this.state.renamedFiles.length){
                for (let j=0; j<this.state.renamedFiles.length; j++){
                    this.handleServerRequests(this.state.renamedFiles[i+j], i+j);
                }
            }
        }
    }

    handleServerRequests(file, index) {
        this.retrieveNewURL(file, (file, url) => {
            // Upload the file to the server.
            this.uploadFile(file, url)
                .then(() => {
                    // code for DB request

                    let newFileName = file.name;
                    let originalFileName = this.state.mainFiles[index].name;
                    let relativePath = this.state.mainFiles[index].path;
                    let format = file.type;
                    let size = file.size;
                    let shape = this.state.fileShape[index];
                    let lastModifiedDate = this.state.mainFiles[index].lastModifiedDate.toString();
                    let jobId = this.state.jobId;

                    this.sendImageDetailsToDB(
                        newFileName,
                        originalFileName,
                        relativePath,
                        format,
                        size,
                        shape,
                        lastModifiedDate,
                        jobId
                    )
                        .then(() =>
                            this.setState({
                                uploadCompleted: this.state.uploadCompleted+1,
                            }, () => {
                                if (this.state.mainFiles.length === this.state.uploadCompleted){
                                    setTimeout(function() {
                                        this.handleStateReset();
                                    }.bind(this), 2000)
                                }
                            })
                        );
                });
        });
    }

    async sendImageDetailsToDB(
        newFileName,
        originalFileName,
        relativePath,
        format,
        size,
        shape,
        lastModifiedDate,
        jobId
    ) {
        await axios.post(`${value.BASE}/api/image-detail`,{
            newFileName: newFileName,
            originalFileName: originalFileName,
            relativePath: relativePath,
            format: format,
            size: size,
            shape: shape,
            lastModifiedDate: lastModifiedDate,
            jobId: jobId
        }).then(() => {
            // console.log(response);
        })
    }

     async uploadFile(file, url) {
        await axios.put(url, file)
            .then(() => {})
            .catch((e) => {
            console.error(e);
        });
    }

     retrieveNewURL(file, cb) {
         axios.get(`${value.BASE}/api/presignedUrl?name=${file.name}`)
            .then((response) =>{
                if (!response.data.error){
                    cb(file, response.data.url);
                } else {
                    alert("Storage server error.");
                }
            }).catch((e) => {
            console.error(e);
        });
    }

    render(){
        if (!this.props.location.verification){
            return <Redirect to="/"/>
        }
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
                <Container>
                    {(this.state.inputVisibility)?
                        <div>
                            <Row className="justify-content-md-center" style={{marginTop:"30px"}}>
                                <Dropzone
                                    accept={"image/*"}
                                    onDrop={
                                        (acceptedFiles) => {
                                            acceptedFiles.map((file) => {
                                                // console.log(file.lastModifiedDate);
                                                let reader = new FileReader();
                                                reader.readAsDataURL(file);
                                                reader.onload = () => {
                                                    let img = new Image();
                                                    img.src = reader.result;
                                                    img.onload = () => {
                                                        this.state.fileShape.push(`${img.width}, ${img.height}`);
                                                    }
                                                };
                                            });

                                            const renamedAcceptedFiles = acceptedFiles.map((file) => (
                                                new File([file], `${uuid()}.${file.name.split('.')[file.name.split('.').length-1]}`, { type: file.type })
                                            ));

                                            this.setState({
                                                mainFiles: acceptedFiles,
                                                renamedFiles: renamedAcceptedFiles
                                            });
                                        }
                                    }
                                >

                                    {({getRootProps, getInputProps}) => (
                                        <section>
                                            <div {...getRootProps({ className: "dropzone" })}>
                                                <input {...getInputProps()} directory="" webkitdirectory="" type="file" />
                                                {(this.state.mainFiles.length === 0)?
                                                    <p>Drag 'n' drop <b>Directory</b> here, or click to select <b>Directory</b></p>
                                                    :
                                                    <Alert variant="success"><b>{this.state.mainFiles.length}</b> files selected.</Alert>
                                                }

                                            </div>
                                        </section>
                                    )}
                                </Dropzone>
                            </Row>
                            <Row style={{marginTop:"30px"}}>
                                <Col>
                                    <Form>
                                        <div style={{width:"100px", float:"right", marginRight:"80px"}}>
                                            <Form.Group controlId="connectionSelection">
                                                <Form.Label>Connection</Form.Label>
                                                <Form.Control as="select" custom onChange={event => this.handleConnectionSelect(event.target.value)}>
                                                    <option>1</option>
                                                    <option>2</option>
                                                    <option>3</option>
                                                    <option>4</option>
                                                    <option>5</option>
                                                </Form.Control>
                                            </Form.Group>
                                        </div>
                                    </Form>
                                </Col>
                                <Col>
                                    <br/>
                                    <div style={{marginTop:"8px"}}>
                                        <Button variant="outline-primary" style={{width:"200px"}} onClick={this.handleProcessStart}>Start</Button>
                                    </div>
                                </Col>
                            </Row>
                            {(this.state.connection.toString() === "1")?
                                <Row style={{marginTop:"30px", textAlign:"center"}}>
                                    <Col>
                                        <Alert
                                            variant="warning"
                                        >
                                            Your selected connection is {this.state.connection}.
                                        </Alert>
                                    </Col>
                                </Row>
                                :""
                            }
                        </div>
                        :""
                    }
                    {(this.state.startLoading)?
                        <div>
                            <Row style={{marginTop:"30px"}}>
                                <Col>
                                    <div className="text-center" style={{fontSize:"11px"}}>
                                        <span style={{...styles.jobid}}>JOB ID</span>
                                        <span style={{...styles.jobValue}}>{this.state.jobId}</span>
                                    </div>

                                </Col>
                            </Row>
                            <Row style={{marginTop:"10px"}}>
                                <Col>
                                    <ProgressBar
                                        animated
                                        now={(this.state.uploadCompleted*100)/this.state.mainFiles.length}
                                        label={this.state.uploadCompleted + '/' + this.state.mainFiles.length}/>
                                </Col>
                            </Row>
                        </div>
                        :""
                    }

                </Container>
            </div>
        );
    }
}

const styles = {
    navbar:{
        backgroundColor: "#000"
    },
    jobid:{
        backgroundColor:"#0085FC",
        color:"#eee",
        padding:"5px",
        borderRadius:"5px 0px 0px 5px"
    },
    jobValue:{
        backgroundColor:"#D6D8D9",
        padding:"5px",
        borderRadius:"0px 5px 5px 0px"
    }
};

export default Home;
