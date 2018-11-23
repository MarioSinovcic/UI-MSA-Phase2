import Switch from '@material-ui/core/Switch';
import * as React from 'react';
import {FacebookIcon, FacebookShareButton} from 'react-share';
// tslint:disable-next-line:ordered-imports
import Modal from 'react-responsive-modal';
import ChatBot from 'react-simple-chatbot';
import * as Webcam from "react-webcam";
import { ThemeProvider } from 'styled-components';
import './App.css';
// tslint:disable-next-line:ordered-imports
import EditButtons from './components/EditButtons';
import Searching from './components/Searching';
import BlackLogo from './stock-sloth-logo-black.png';
import WhiteLogo from './stock-sloth-logo-white.png';
// tslint:disable-next-line:ordered-imports
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { Transition } from 'react-transition-group';
import Facebook from './Facebook';

// theme settings for chatbox
const chatBotTheme = {
	background: '#f5f8fb',
	fontFamily: 'Helvetica Neue',
	headerBgColor: '#cd853f',
	headerFontColor: '#fff',
	headerFontSize: '15px',
	// tslint:disable-next-line:object-literal-sort-keys
	botBubbleColor: '#cd853f',
	botFontColor: '#eeeeee',
	userBubbleColor: '#fff',
	userFontColor: 'black',
  };

interface IState {
	currentMeme: any,
	memes: any[],
	open: boolean,
	uploadFileList: any,
	authenticated: boolean,
	refCamera: any,
	imageFound: boolean,
	predictionResult: any,
	stylePath: any,

	responce: any,
	redirect: any,

	darktheme: boolean,

	loading: boolean,
	result: any,
	trigger: boolean,

	chatActive: boolean,

	loginFailure: boolean,
	uploadDialogue: boolean,

	editEnable: boolean,

	loginGuy: boolean
}

class App extends React.Component<{}, IState> {
	constructor(props: any) {
		super(props)
		this.state = {
			currentMeme: { "id": 0, "title": "Loading ", "url": "", "tags": "⚆ _ ⚆", "uploaded": "", "width": "0", "height": "0" },
			memes: [],
			open: false,
			uploadFileList: null,
			// tslint:disable-next-line:object-literal-sort-keys
			authenticated: false,
			refCamera: React.createRef(),
			imageFound: true,
			predictionResult: 0.0,
			stylePath: 'darktheme.css',

			responce: null,
			redirect: null,

			darktheme: false,

			loading: true,
			result: '',
			trigger: false,

			chatActive: false,

			loginFailure: false,
			uploadDialogue: false,

			editEnable: false,

			loginGuy: true
		}

		this.selectNewMeme = this.selectNewMeme.bind(this)
		this.fetchMemes = this.fetchMemes.bind(this)
		this.fetchMemes("")
		this.handleFileUpload = this.handleFileUpload.bind(this)
		this.uploadImage = this.uploadImage.bind(this)
		this.authenticate = this.authenticate.bind(this)
		this.guestUser = this.guestUser.bind(this)
		this.getFaceRecognitionResult = this.getFaceRecognitionResult.bind(this)
		this.changeTheme = this.changeTheme.bind(this)
		this.openChat = this.openChat.bind(this)
		this.loginClose = this.loginClose.bind(this)
		this.loginOpen = this.loginOpen.bind(this)
		this.uploadMessage = this.uploadMessage.bind(this)
		this.FB=this.FB.bind(this)
	}

	public render() {
		const { open } = this.state;
		// this is used to ditermine the chatbox logic
		const steps=[
			{
				id: '1',
				message: 'Hello there, welcome to stock sloth. What are you having trouble with?',
				trigger: '2',
			  },
			  {
				id: '2',
				options: [
				  { value: 1, label: 'Uploading', trigger: '3' },
				  { value: 2, label: 'Editing', trigger: '4' },
				  { value: 3, label: 'Searching', trigger: '5' },
				  { value: 4, label: 'Something Else', trigger: '10'}
				],
			  },
			  {
				id: '3',
				message: 'First check your internet connection is reliable. To upload new images use the Upload button in the top right corner. This should open up a pop-up screen displaying all the information need for you to will need to enter about your new photo. Then simply select your file and upload it, via the choose file and upload buttons.',	trigger: '6',
			  },
			  {
				id: '4',
				message: 'Editing is done via the Edit button on the main screen. This should open up a pop-up screen displaying the current photos tag and title, which can then be changed. Insure your internet connection is reliable when editing photos.',			trigger: '6',
			  },
			  {
				id: '5',
				message: 'Searching is done via the search bar at the top of the screen. Enter a type of animal (making sure to exclude any spaces or invalid characters) and the system should show you the first image associated with that animal.',			trigger: '6',
			  },
			  {
				id: '6',
				message: 'Is there anything else you are having trouble with?',
				trigger: '7',
			  },
			  {
				id: '7',
				options: [
				  { value: 1, label: 'No', trigger: '9' },
				  { value: 2, label: 'Yes', trigger: '8' },
				],
			  },
			  {
				id: '8',
				message: 'What else do you need help with?',
				trigger: '2'
			  },
			  {
				id: '9',
				message: 'Hope this was helpful.',
			  },
			  {
				id: '10',
				message: 'If you did not find any of this helpful, feel free to contact me personally at: ',
				trigger: '11'
			  },
			  {
				  id: '11',
				  message: 'https://www.linkedin.com/in/mario-sinovcic-b33022159/'
			  }
		]

		if (!(this.state.authenticated)) {
			return (
				// move this to be above the if statement, so it is run once 
				<div>
					<div className="login-background">
					<p className="spacing"> space </p>
					</div>
					<Modal open={this.state.loginGuy} onClose={this.authenticate} closeOnOverlayClick={false} showCloseIcon={false} center={true}>
						<div className='containter-login'>
							<div className="login-image">
								<img src={BlackLogo} height='60' />
							</div>
							<div className="login-text">
								<p>Stock Sloth</p>
							</div>
							<div>
								<Webcam className="camera"
									heigth="300"
									width="250"
									audio={false}
									screenshotFormat="image/jpeg"
									ref={this.state.refCamera} />
							</div>
							<div className="row-nav-row">
								<Facebook callBack={this.FB}/>
							</div>
								<div className="row-nav-row">
								<div className="btn btn-primary btn-action-login" onClick={this.authenticate}>Developer Login</div>
								</div>
							<div className="row-nav-row">
							<div className="btn btn-primary btn-action-login-guest" onClick={this.guestUser}>User Login</div>
							</div>
						</div>
					</Modal>
					<div>
                <Dialog
                open={this.state.loginFailure}
                TransitionComponent={Transition}
                onClose={this.loginClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description">
                <DialogTitle id="alert-dialog-slide-title">{"Facial Recognition Failed"} </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                Sorry, the facial authentication system has seems to think you are not a Stock Sloth developer. Please use the "User" Login.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={this.loginClose} color="primary"> OK </Button>
                </DialogActions>
                </Dialog>
                </div>
				</div>
			)
		} else {
			if (this.state.darktheme) {
				if (this.state.imageFound) {
					return (
						<div className="background-dark">
						<div>
                	<Dialog
                	open={this.state.uploadDialogue}
                	TransitionComponent={Transition}
                	onClose={this.loginClose}
                	aria-labelledby="alert-dialog-slide-title"
                	aria-describedby="alert-dialog-slide-description">
                	<DialogTitle id="alert-dialog-slide-title">{"Uploads Take Time"} </DialogTitle>
					<DialogContent>
					<DialogContentText id="alert-dialog-slide-description">
					Please be patient while the image is uploaded, which can take up to 30 seconds depending on the size of your file.
					</DialogContentText>
					</DialogContent>
					<DialogActions>
					<Button onClick={this.loginClose} color="primary"> OK </Button>
					</DialogActions>
					</Dialog>
					</div>
							<div className="header-wrapper-dark">
								<div className="container-header">
									<img src={BlackLogo} height='40' />&nbsp; Stock Sloth &nbsp;
								<Switch
										onChange={this.changeTheme}
										value="checkedA"
										color="default"
									/>
									<div className="btn btn-primary btn-action-dark btn-add" onClick={this.onOpenModal}>Upload</div>
								</div>

							</div>
							<div className="container">
								<div className="row-1">
								<Searching darktheme={this.state.darktheme} memes={this.state.memes} selectNewMeme={this.selectNewMeme} searchByTag={this.fetchMemes} />>
								</div>
								<div className="row-2">
									<EditButtons authenticated={this.state.authenticated} currentMeme={this.state.currentMeme} />
								</div>
							</div>
							<Modal open={open} onClose={this.onCloseModal}>
								<form>
									<div className="form-group">
										<label> Photo Title</label>
										<input type="text" className="form-control" id="meme-title-input" placeholder="Enter Title" />
										<small className="form-text text-muted">You can edit this information later</small>
									</div>
									<div className="form-group">
										<label>Tag</label>
										<input type="text" className="form-control" id="meme-tag-input" placeholder="Enter Tag" />
										<small className="form-text text-muted">Tag is used when searching for images</small>
									</div>
									<div className="form-group">
										<label>Image</label>
										<input type="file" onChange={this.handleFileUpload} className="form-control-file" id="meme-image-input" />
									</div>
									<button type="button" className="btn" onClick={this.uploadImage}>Upload</button>
								</form>
							</Modal>
							<div className="chatbot">
									{this.state.chatActive &&
									<ThemeProvider theme={chatBotTheme}>
									<ChatBot openChat={this.state.chatActive} steps={steps}/>
									</ThemeProvider>}
							</div>
							<div className="footer-group-dark">
								<img src={BlackLogo} height='40' />&nbsp; <div className="btn btn-primary btn-action-dark btn-add" onClick={this.openChat}>Help</div>&nbsp; Stock Sloth - a stock bank for animal photos &nbsp;
							<div className="footer-txt">
							<p>Feel free to share this site</p>
									<div>
									<FacebookShareButton
                       				 url={"https://www.facebook.com/sharer/sharer.php?u=https%3A//msawebapp2.azurewebsites.net/"}
                        			quote={"StockSloth"}
                        			className="share-button">
                       				<FacebookIcon
                        			size={32}
                        			round={true} />
                    				</FacebookShareButton>
									</div>
								</div>
							</div>
						</div>
					);
				} else {
					return (
						<div className="background-dark">
						<div>
                	<Dialog
                	open={this.state.uploadDialogue}
                	TransitionComponent={Transition}
                	onClose={this.loginClose}
                	aria-labelledby="alert-dialog-slide-title"
                	aria-describedby="alert-dialog-slide-description">
                	<DialogTitle id="alert-dialog-slide-title">{"Uploads Take Time"} </DialogTitle>
					<DialogContent>
					<DialogContentText id="alert-dialog-slide-description">
					Please be patient while the image is uploaded, which can take up to 30 seconds depending on the size of your file.
					</DialogContentText>
					</DialogContent>
					<DialogActions>
					<Button onClick={this.loginClose} color="primary"> OK </Button>
					</DialogActions>
					</Dialog>
					</div>
							<div className="header-wrapper-dark">
								<div className="container-header">
									<img src={WhiteLogo} height='40' />&nbsp; Stock Sloth &nbsp;
								<Switch
										onChange={this.changeTheme}
										value="checkedA"
										color="default"
									/>
									<div className="btn btn-primary btn-action-dark btn-add" onClick={this.onOpenModal}>Upload</div>
								</div>
							</div>
							<div className="container">
								<div className="row-1">
									<Searching darktheme={this.state.darktheme} memes={this.state.memes} selectNewMeme={this.selectNewMeme} searchByTag={this.fetchMemes} />
								</div>
								<div className="error-heading-dark">
									<p>Looks like we have no stock images for that tag</p>
								</div>
								<div className="error-subheading-dark">
									<p>Try entering something else in the search bar </p>
								</div>
								<div className="error-subheading-dark">
									<p> or add an image of what you searched for via the "Upload" button</p>
								</div>
							</div>
							{/* add a image hear pointing to the add option if need be with the logo ---------------------*/}

							<Modal open={open} onClose={this.onCloseModal}>
								<form>
									<div className="form-group">
										<label> Photo Title</label>
										<input type="text" className="form-control" id="meme-title-input" placeholder="Enter Title" />
										<small className="form-text text-muted">You can edit this information later</small>
									</div>
									<div className="form-group">
										<label>Tag</label>
										<input type="text" className="form-control" id="meme-tag-input" placeholder="Enter Tag" />
										<small className="form-text text-muted">Tag is used when searching for images</small>
									</div>
									<div className="form-group">
										<label>Image</label>
										<input type="file" onChange={this.handleFileUpload} className="form-control-file" id="meme-image-input" />
									</div>
									<button type="button" className="btn" onClick={this.uploadImage}>Upload</button>
								</form>
							</Modal>

							<div className="large-spacing">
								<p> large spacing </p>
							</div>
							<div className="chatbot">
									{this.state.chatActive &&
									<ThemeProvider theme={chatBotTheme}>
									<ChatBot openChat={this.state.chatActive} steps={steps}/>
									</ThemeProvider>}
							</div>
							<div className="footer-group-dark">
								<img src={BlackLogo} height='40' />&nbsp; <div className="btn btn-primary btn-action-dark btn-add" onClick={this.openChat}>Help</div>&nbsp; Stock Sloth - a stock bank for animal photos &nbsp;
								<div className="footer-txt">	
								<p>Feel free to share this site</p>
								<div>
								<FacebookShareButton
                       				 url={"https://www.facebook.com/sharer/sharer.php?u=https%3A//msawebapp2.azurewebsites.net/"}
                        			quote={"StockSloth"}
                        			className="share-button">
                       				<FacebookIcon
                        			size={32}
                        			round={true} />
                    				</FacebookShareButton>
									</div>
							</div>
							</div>
						</div>
					)
				}
			} else {
				if (this.state.imageFound) {
					return (
						<div className="background-light">
						<div>
                	<Dialog
                	open={this.state.uploadDialogue}
                	TransitionComponent={Transition}
                	onClose={this.loginClose}
                	aria-labelledby="alert-dialog-slide-title"
                	aria-describedby="alert-dialog-slide-description">
                	<DialogTitle id="alert-dialog-slide-title">{"Uploads Take Time"} </DialogTitle>
					<DialogContent>
					<DialogContentText id="alert-dialog-slide-description">
					Please be patient while the image is uploaded, which can take up to 30 seconds depending on the size of your file.
					</DialogContentText>
					</DialogContent>
					<DialogActions>
					<Button onClick={this.loginClose} color="primary"> OK </Button>
					</DialogActions>
					</Dialog>
					</div>
							<div className="header-wrapper">
								<div className="container-header">
									<img src={WhiteLogo} height='40' />&nbsp; Stock Sloth &nbsp;
							<Switch
										onChange={this.changeTheme}
										value="checkedA"
										color="default"
									/>
									<div className="btn btn-primary btn-action btn-add" onClick={this.onOpenModal}>Upload</div>
								</div>
							</div>
							<div className="container">
								<div className="row-1">
									<Searching darktheme={this.state.darktheme} memes={this.state.memes} selectNewMeme={this.selectNewMeme} searchByTag={this.fetchMemes} />
								</div>
								<div className="row-2">
									<EditButtons authenticated={this.state.authenticated} currentMeme={this.state.currentMeme} />
								</div>
							</div>
							<Modal open={open} onClose={this.onCloseModal}>
								<form>
									<div className="form-group">
										<label> Photo Title</label>
										<input type="text" className="form-control" id="meme-title-input" placeholder="Enter Title" />
										<small className="form-text text-muted">You can edit this information later</small>
									</div>
									<div className="form-group">
										<label>Tag</label>
										<input type="text" className="form-control" id="meme-tag-input" placeholder="Enter Tag" />
										<small className="form-text text-muted">Tag is used when searching for images</small>
									</div>
									<div className="form-group">
										<label>Image</label>
										<input type="file" onChange={this.handleFileUpload} className="form-control-file" id="meme-image-input" />
									</div>
									<button type="button" className="btn" onClick={this.uploadImage}>Upload</button>
								</form>
							</Modal>
							<div className="chatbot">
									{this.state.chatActive &&
									<ThemeProvider theme={chatBotTheme}>
									<ChatBot openChat={this.state.chatActive} steps={steps}/>
									</ThemeProvider>}
							</div>
							<div className="footer-group">
								<img src={WhiteLogo} height='40' />&nbsp; <div className="btn btn-primary btn-action btn-add" onClick={this.openChat}>Help</div>&nbsp; Stock Sloth - a stock bank for animal photos &nbsp;
						<div className="footer-txt">
									<p>Feel free to share this site </p>
									<div>
									<FacebookShareButton
                       				 url={"https://www.facebook.com/sharer/sharer.php?u=https%3A//msawebapp2.azurewebsites.net/"}
                        			quote={"StockSloth"}
                        			className="share-button">
                       				<FacebookIcon
                        			size={32}
                        			round={true} />
                    				</FacebookShareButton>
									</div>
								</div>
							</div>
						</div>
					);
				} else {
					return (
						<div className="background-light">
						<div>
                	<Dialog
                	open={this.state.uploadDialogue}
                	TransitionComponent={Transition}
                	onClose={this.loginClose}
                	aria-labelledby="alert-dialog-slide-title"
                	aria-describedby="alert-dialog-slide-description">
                	<DialogTitle id="alert-dialog-slide-title">{"Uploads Take Time"} </DialogTitle>
					<DialogContent>
					<DialogContentText id="alert-dialog-slide-description">
					Please be patient while the image is uploaded, which can take up to 30 seconds depending on the size of your file.
					</DialogContentText>
					</DialogContent>
					<DialogActions>
					<Button onClick={this.loginClose} color="primary"> OK </Button>
					</DialogActions>
					</Dialog>
					</div>
							<div className="header-wrapper">
								<div className="container-header">
									<img src={WhiteLogo} height='40' />&nbsp; Stock Sloth &nbsp;
									<Switch
										onChange={this.changeTheme}
										value="checkedA"
										color="default"
									/>
									<div className="btn btn-primary btn-action btn-add" onClick={this.onOpenModal}>Upload</div>
								</div>
							</div>
							<div className="container">
								<div className="row-1">
									<Searching darktheme={this.state.darktheme} memes={this.state.memes} selectNewMeme={this.selectNewMeme} searchByTag={this.fetchMemes} />
								</div>
								<div className="error-heading">
									<p>Looks like we have no stock images for that tag</p>
								</div>
								<div className="error-subheading">
									<p>Try entering something else in the search bar </p>
								</div>
								<div className="error-subheading">
									<p> or add an image of what you searched for via the "Upload" button</p>
								</div>
							</div>
							{/* add a image hear pointing to the add option if need be with the logo ---------------------*/}

							<Modal open={open} onClose={this.onCloseModal}>
								<form>
									<div className="form-group">
										<label> Photo Title</label>
										<input type="text" className="form-control" id="meme-title-input" placeholder="Enter Title" />
										<small className="form-text text-muted">You can edit this information later</small>
									</div>
									<div className="form-group">
										<label>Tag</label>
										<input type="text" className="form-control" id="meme-tag-input" placeholder="Enter Tag" />
										<small className="form-text text-muted">Tag is used when searching for images</small>
									</div>
									<div className="form-group">
										<label>Image</label>
										<input type="file" onChange={this.handleFileUpload} className="form-control-file" id="meme-image-input" />
									</div>
									<button type="button" className="btn" onClick={this.uploadImage}>Upload</button>
								</form>
							</Modal>

							<div className="large-spacing">
								<p> large spacing </p>
							</div>
							<div className="chatbot">
									{this.state.chatActive &&
									<ThemeProvider theme={chatBotTheme}>
									<ChatBot openChat={this.state.chatActive} steps={steps}/>
									</ThemeProvider>}
							</div>
							<div className="footer-group">
								<img src={WhiteLogo} height='40' />&nbsp; <div className="btn btn-primary btn-action btn-add" onClick={this.openChat}>Help</div>&nbsp; Stock Sloth - a stock bank for animal photos &nbsp;
								<div className="footer-txt">
							<p>Feel free to share this site</p>
							<div>
							<FacebookShareButton
                       				 url={"https://www.facebook.com/sharer/sharer.php?u=https%3A//msawebapp2.azurewebsites.net/"}
                        			quote={"StockSloth"}
                        			className="share-button">
                       				<FacebookIcon
                        			size={32}
                        			round={true} />
                    		</FacebookShareButton>
							</div>
							</div>
							</div>
						</div>
					)
				}
			}
		}
	}
	
// authenticate with FB
private FB = (response: any) =>{
	if(!(response.status === "unknown")){
	this.setState({
		authenticated:true,
		loginGuy: false,

	})
}
}

	// Login as guest user
	private guestUser() {
		this.setState({ authenticated: true })
	}

	// Close the login failure message
	private loginClose = () => {
		this.setState({ loginFailure: false,
						uploadDialogue: false });
	};
	
	// Open the login faliure message
	private loginOpen = () => {
        this.setState({ loginFailure: true });
	};
	
	// Open dialogue for uploads
	private uploadMessage = () => {
        this.setState({ uploadDialogue: true });
	};
	

	// Authenticate
	private authenticate() {
		const screenshot = this.state.refCamera.current.getScreenshot();
		this.getFaceRecognitionResult(screenshot);
	}

	// Call custom vision model
	private getFaceRecognitionResult(image: string) {
		const url = "https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Prediction/3273e23a-35da-4653-a948-1e6ccc2a5a33/image?iterationId=f03d6dfe-a9bb-430e-8124-e0582f630acc"
		if (image === null) {
			return;
		}
		const base64 = require('base64-js');
		const base64content = image.split(";")[1].split(",")[1]
		const byteArray = base64.toByteArray(base64content);
		fetch(url, {
			body: byteArray,
			headers: {
				// tslint:disable-next-line:object-literal-sort-keys
				'cache-control': 'no-cache', 'Prediction-Key': 'e512b8c6f3634c2fb62c65fcec36950e', 'Content-Type': 'application/octet-stream'
			},
			method: 'POST'
		})
			.then((response: any) => {
				if (!response.ok) {
					// Error State
					alert(response.statusText)
				} else {
					response.json().then((json: any) => {
						console.log(json.predictions[0])
						this.setState({ predictionResult: json.predictions[0] })
						if (this.state.predictionResult.probability > 0.7) {
							this.setState({ authenticated: true,
							loginGuy: false})
						} else {
							this.setState({ authenticated: false })
							this.loginOpen()
						}
					})
				}
			})
	}

	// Modal open
	private onOpenModal = () => {
		this.setState({ open: true });
	};

	// Modal close
	private onCloseModal = () => {
		this.setState({ chatActive: false, 
		
		open: false});
	};

	// Change selected meme
	private selectNewMeme(newMeme: any) {
		this.setState({
			currentMeme: newMeme
		})
	}

	// Added via MSA repo
	private fetchMemes(tag: any) {

		let url = "https://phasetwowebapp.azurewebsites.net/api/MemeItems"
		if (tag !== "") {
			url += "/tag/" + tag
		}
		fetch(url, {
			method: 'GET'
		})
			.then(res => res.json())
			.then(json => {
				let currentMeme = json[0]
				if (currentMeme === undefined) {
					this.setState({
						imageFound: false
					})
					currentMeme = { "id": 0, "title": "", "url": "", "tags": "", "uploaded": "", "width": "0", "height": "0" }
				} else {

					this.setState({
						imageFound: true
					})

				}
				this.setState({
					currentMeme,
					memes: json
				})
			});
	}

	// Added via MSA repo
	private handleFileUpload(fileList: any) {
		this.setState({
			uploadFileList: fileList.target.files
		})
	}

	// Added via MSA repo
	private uploadImage() {
		const titleInput = document.getElementById("meme-title-input") as HTMLInputElement
		const tagInput = document.getElementById("meme-tag-input") as HTMLInputElement
		const imageFile = this.state.uploadFileList[0]

		if (titleInput === null || tagInput === null || imageFile === null) {
			return;
		}

		const title = titleInput.value
		const tag = tagInput.value
		const url = "https://phasetwowebapp.azurewebsites.net/api/MemeItems/upload"

		const formData = new FormData()
		formData.append("Title", title)
		formData.append("Tags", tag)
		formData.append("image", imageFile)

		this.uploadMessage()
		this.onCloseModal()

		fetch(url, {
			body: formData,
			headers: { 'cache-control': 'no-cache' },
			method: 'POST'
		})
			.then((response: any) => {
				if (!response.ok) {
					// Error State
					alert(response.statusText)
				} else {
					this.onCloseModal()
					// location.reload()
				}
			})
	}

	private changeTheme() {
		this.setState({
			darktheme: !(this.state.darktheme)
		})
	}

	private openChat(){
		this.setState({
			chatActive: !(this.state.chatActive)
		})
	}
}
export default App;