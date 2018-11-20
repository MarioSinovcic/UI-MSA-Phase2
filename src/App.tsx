import Switch from '@material-ui/core/Switch';
import * as React from 'react';
// import FacebookShareButton from 'react-share';
// import FacebookLogin from 'react-facebook-login';
// tslint:disable-next-line:ordered-imports
import Modal from 'react-responsive-modal';
import * as Webcam from "react-webcam";
import './App.css';
// tslint:disable-next-line:ordered-imports
import MemeDetail from './components/MemeDetail';
import MemeList from './components/MemeList';
import BlackLogo from './stock-sloth-logo-black.png';
import WhiteLogo from './stock-sloth-logo-white.png';

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

	darktheme: boolean
}

class App extends React.Component<{}, IState> {
	// tslint:disable-next-line:member-access
	darktheme = false;

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

			darktheme: false
		}

		this.selectNewMeme = this.selectNewMeme.bind(this)
		this.fetchMemes = this.fetchMemes.bind(this)
		this.fetchMemes("")
		this.handleFileUpload = this.handleFileUpload.bind(this)
		this.uploadMeme = this.uploadMeme.bind(this)
		this.authenticate = this.authenticate.bind(this)
		this.guestUser = this.guestUser.bind(this)
		this.getFaceRecognitionResult = this.getFaceRecognitionResult.bind(this)
		this.changeTheme = this.changeTheme.bind(this)
	}

	public render() {
		const { open } = this.state;

		// maybe add FAQ page aswell---------------------------------------------------------------------------------------------------

		if(!(this.state.authenticated)){
			return(
				 // move this to be above the if statement, so it is run once 
					<div>
						<div className="login-background">
							<p>Background</p>
						</div>
						<Modal open={true} onClose={this.authenticate} closeOnOverlayClick={false} showCloseIcon={false} center={true}>
						<div className='containter-login'>
							<div className="login-image">
								<img src={BlackLogo} height='60' />
							</div>
							<div className="login-text">
								<p>Stock Sloth</p>
							</div>
							<div >
							<Webcam className="camera"
								heigth= "300"
								width= "400"
								audio={false}
								screenshotFormat="image/jpeg"
								ref={this.state.refCamera}
							/>
							</div>
							<div className="row-nav-row">
								<div className="btn btn-primary bottom-button" onClick={this.authenticate}>Facial Authentication </div>
								<div className="btn btn-primary" onClick={this.guestUser}>Guest User Login</div>
							</div>
						</div>
						</Modal>
					</div>
			)
		} else{
		if(this.state.darktheme){
			if (this.state.imageFound) {
				return (
					<div className="background-dark">
						<div className="header-wrapper-dark">
							<div className="container-header">
								<img src={BlackLogo} height='40' />&nbsp; Stock Sloth &nbsp;
								<Switch
          						onChange={this.changeTheme}
		  						value="checkedA"
		  						color="default"
        						/>
								<div className="btn btn-primary btn-action-dark btn-add" onClick={this.onOpenModal}>+ New</div>
							</div>

						</div>
						<div className="container">
							<div className="row-1">
								<MemeList memes={this.state.memes} selectNewMeme={this.selectNewMeme} searchByTag={this.fetchMemes} />
							</div>
							<div className="row-2">
								<MemeDetail currentMeme={this.state.currentMeme} />
							</div>
						</div>
						<Modal open={open} onClose={this.onCloseModal}>
							<form>
								<div className="form-group">
									<label>Photo Title</label>
									<input type="text" className="form-control" id="meme-title-input" placeholder="Enter Title" />
									<small className="form-text text-muted">You can edit your photo later</small>
								</div>
								<div className="form-group">
										<label>Tag</label>
										<input type="text" className="form-control" id="meme-tag-input" placeholder="Enter Tag" />
										<small className="form-text text-muted">Tags are used for search</small>
								</div>
								<div className="form-group">
									<label>Image</label>
									<input type="file" onChange={this.handleFileUpload} className="form-control-file" id="meme-image-input" />
								</div>
									<button type="button" className="btn" onClick={this.uploadMeme}>Upload</button>
							</form>
						</Modal>
						<div className="footer-group-dark">
						<img src={BlackLogo} height='40' />&nbsp; <div className="btn btn-primary btn-action-dark btn-add" >Help</div>&nbsp; Stock Sloth - a stock photo bank for animals &nbsp; 
							<div className="footer-txt">
								<p>Feel free to share your images: <br />  via circle buttons</p>
							</div>
						</div>
					</div>
				);
			} else {
				return (
					<div className="background-dark">
						<div className="header-wrapper-dark">
							<div className="container-header">
								<img src={WhiteLogo} height='40' />&nbsp; Stock Image Bank &nbsp;
						<div className="btn btn-primary btn-action-dark btn-add" onClick={this.onOpenModal}>+ New</div>
							</div>
						</div>
						<div className="container">
							<div className="row-1">
								<MemeList memes={this.state.memes} selectNewMeme={this.selectNewMeme} searchByTag={this.fetchMemes} />
							</div>
							<div className="error-heading">
								<p>Looks like we have no stock images for that tag</p>
							</div>
							<div className="error-subheading">
								<p>Try entering something else in the search bar </p>
							</div>
							<div className="error-subheading">
								<p> or add an image of what you searched for via the add button</p>
							</div>
						</div>
						{/* add a image hear pointing to the add option if need be with the logo ---------------------*/}
	
						<Modal open={open} onClose={this.onCloseModal}>
							<form>
								<div className="form-group">
									<label>Meme Title</label>
									<input type="text" className="form-control" id="meme-title-input" placeholder="Enter Title" />
									<small className="form-text text-muted">You can edit any meme later</small>
								</div>
								<div className="form-group">
									<label>Tag</label>
									<input type="text" className="form-control" id="meme-tag-input" placeholder="Enter Tag" />
									<small className="form-text text-muted">Tag is used for search</small>
								</div>
								<div className="form-group">
									<label>Image</label>
									<input type="file" onChange={this.handleFileUpload} className="form-control-file" id="meme-image-input" />
								</div>
								<button type="button" className="btn" onClick={this.uploadMeme}>Upload</button>
							</form>
						</Modal>
	
						<div className="large-spacing">
							<p> large spacing </p>
						</div>
	
						<div className="footer-group-dark">
						<img src={BlackLogo} height='40' />&nbsp; <div className="btn btn-primary btn-action-dark btn-add" >Help</div>&nbsp; Stock Sloth - a stock photo bank for animals &nbsp; 
								<p>Feel free to share your images: <br />  via circle buttons</p>
						</div>
					</div>
				)
			}
		}else{		
		if (this.state.imageFound) {
			return (
				<div>
					<div className="header-wrapper">
						<div className="container-header">
							<img src={WhiteLogo} height='40' />&nbsp; Stock Sloth &nbsp;
							<Switch
          						onChange={this.changeTheme}
		  						value="checkedA"
		  						color="default"
        						/>		
							<div className="btn btn-primary btn-action btn-add" onClick={this.onOpenModal}>+ New</div>
						</div>
					</div>
					<div className="container">
						<div className="row-1">
							<MemeList memes={this.state.memes} selectNewMeme={this.selectNewMeme} searchByTag={this.fetchMemes} />
						</div>
						<div className="row-2">
							<MemeDetail currentMeme={this.state.currentMeme} />
						</div>
					</div>
					<Modal open={open} onClose={this.onCloseModal}>
						<form>
							<div className="form-group">
								<label>Photo Title</label>
								<input type="text" className="form-control" id="meme-title-input" placeholder="Enter Title" />
								<small className="form-text text-muted">You can edit your photo later</small>
							</div>
							<div className="form-group">
									<label>Tag</label>
									<input type="text" className="form-control" id="meme-tag-input" placeholder="Enter Tag" />
									<small className="form-text text-muted">Tags are used for search</small>
							</div>
							<div className="form-group">
								<label>Image</label>
								<input type="file" onChange={this.handleFileUpload} className="form-control-file" id="meme-image-input" />
							</div>
								<button type="button" className="btn" onClick={this.uploadMeme}>Upload</button>
						</form>
					</Modal>
					<div className="footer-group">
						<img src={WhiteLogo} height='40' />&nbsp; <div className="btn btn-primary btn-action btn-add" >Help</div>&nbsp; Stock Sloth - a stock photo bank for animals &nbsp; 
						<div className="footer-txt">
							<p>Feel free to share your images: <br />  via circle buttons</p>
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div>
					<div className="header-wrapper">
						<div className="container-header">
							<img src={WhiteLogo} height='40' />&nbsp; Stock Image Bank &nbsp;
					<div className="btn btn-primary btn-action btn-add" onClick={this.onOpenModal}>+ New</div>
						</div>
					</div>
					<div className="container">
						<div className="row-1">
							<MemeList memes={this.state.memes} selectNewMeme={this.selectNewMeme} searchByTag={this.fetchMemes} />
						</div>
						<div className="error-heading">
							<p>Looks like we have no stock images for that tag</p>
						</div>
						<div className="error-subheading">
							<p>Try entering something else in the search bar </p>
						</div>
						<div className="error-subheading">
							<p> or add an image of what you searched for via the add button</p>
						</div>
					</div>
					{/* add a image hear pointing to the add option if need be with the logo ---------------------*/}

					<Modal open={open} onClose={this.onCloseModal}>
						<form>
							<div className="form-group">
								<label>Meme Title</label>
								<input type="text" className="form-control" id="meme-title-input" placeholder="Enter Title" />
								<small className="form-text text-muted">You can edit any meme later</small>
							</div>
							<div className="form-group">
								<label>Tag</label>
								<input type="text" className="form-control" id="meme-tag-input" placeholder="Enter Tag" />
								<small className="form-text text-muted">Tag is used for search</small>
							</div>
							<div className="form-group">
								<label>Image</label>
								<input type="file" onChange={this.handleFileUpload} className="form-control-file" id="meme-image-input" />
							</div>
							<button type="button" className="btn" onClick={this.uploadMeme}>Upload</button>
						</form>
					</Modal>

					<div className="large-spacing">
						<p> large spacing </p>
					</div>

					<div className="footer-group">
					<img src={WhiteLogo} height='40' />&nbsp; <div className="btn btn-primary btn-action btn-add" >Help</div>&nbsp; Stock Sloth - a stock photo bank for animals &nbsp; 
							<p>Feel free to share your images: <br />  via circle buttons</p>
							{/* <FacebookShareButton url='https://msawebapp2.azurewebsites.net/' /> */}
					</div>
				</div>
			)
		}
		}
		}
	}

	// Login as guest user
	private guestUser() {
		this.setState({ authenticated: true })
	}

	// Authenticate
	private authenticate() {
		const screenshot = this.state.refCamera.current.getScreenshot();
		this.getFaceRecognitionResult(screenshot);
		this.setState({ authenticated: true })
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
							this.setState({ authenticated: true })
						} else {
							this.setState({ authenticated: false })

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
		this.setState({ open: false });
	};

	// Change selected meme
	private selectNewMeme(newMeme: any) {
		this.setState({
			currentMeme: newMeme
		})
	}

	// Added via MSA repo
	private fetchMemes(tag: any) {
		
		let url = "http://phase2apitest.azurewebsites.net/api/meme"// "https://phasetwowebapp.azurewebsites.net/api/Meme"
		if (tag !== "") {
			url += "/tag?=" + tag
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
					currentMeme = { "id": 0, "title": "No memes (╯°□°）╯︵ ┻━┻", "url": "", "tags": "try a different tag", "uploaded": "", "width": "0", "height": "0" }
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
	private uploadMeme() {
		const titleInput = document.getElementById("meme-title-input") as HTMLInputElement
		const tagInput = document.getElementById("meme-tag-input") as HTMLInputElement
		const imageFile = this.state.uploadFileList[0]

		if (titleInput === null || tagInput === null || imageFile === null) {
			return;
		}

		const title = titleInput.value
		const tag = tagInput.value
		const url = "http://phase2apitest.azurewebsites.net/api/meme/upload" // "https://phasetwowebapp.azurewebsites.net/api/Meme/upload"

		const formData = new FormData()
		formData.append("Title", title)
		formData.append("Tags", tag)
		formData.append("image", imageFile)

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
					location.reload()
				}
			})
	}

	private changeTheme() {
		this.setState({
			darktheme: !(this.state.darktheme)
		})
	}
}

export default App;
