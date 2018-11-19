import * as React from 'react';
import * as Webcam from "react-webcam";
// tslint:disable-next-line:ordered-imports
import Modal from 'react-responsive-modal';
import './App.css';
import MemeDetail from './components/MemeDetail';
import MemeList from './components/MemeList';
import PatrickLogo from './stock-sloth-logo-white.png';

interface IState {
	currentMeme: any,
	memes: any[],
	open: boolean,
	uploadFileList: any,
	authenticated: boolean,
	refCamera: any,
	imageFound: boolean,
	predictionResult: any,
	stylePath: any

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
			stylePath: 'index.css'
		}

		this.selectNewMeme = this.selectNewMeme.bind(this)
		this.fetchMemes = this.fetchMemes.bind(this)
		this.fetchMemes("")
		this.handleFileUpload = this.handleFileUpload.bind(this)
		this.uploadMeme = this.uploadMeme.bind(this)
		this.authenticate = this.authenticate.bind(this)
		this.getFaceRecognitionResult = this.getFaceRecognitionResult.bind(this)
		this.changeTheme = this.changeTheme.bind(this)
	}

	public render() {

		const { open } = this.state;
		const { authenticated } = this.state;

		// maybe add FAQ page aswell---------------------------------------------------------------------------------------------------


		if (this.state.imageFound) {
			return (
				<div>
					{(!authenticated) ?
						<Modal open={!authenticated} onClose={this.authenticate} closeOnOverlayClick={false} showCloseIcon={false} center={true}>
							<Webcam
								audio={false}
								screenshotFormat="image/jpeg"
								ref={this.state.refCamera}
							/>
							<div className="row nav-row">
								<div className="btn btn-primary bottom-button" onClick={this.authenticate}>Login</div>
							</div>
						</Modal> : ""}

					{(authenticated) ?
						<div>
							<div className="header-wrapper">
								<div className="container-header">
									<img src={PatrickLogo} height='40' />&nbsp; Stock Image Bank &nbsp;
						<div className="btn btn-primary btn-action btn-add" onClick={this.onOpenModal}>+ New</div>
								</div>
							</div>
							<div>
								{/* <link rel="stylesheet" type="text/css" href={this.state.stylePath}                       CSS BUTTON />
								<button type="btn btn-primary btn-action btn-add" onClick={this.changeTheme}>Click to update stylesheet</button> */}
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
							<div className="footer-group">
								<img src={PatrickLogo} height='40' />&nbsp; This free collection of stock images can be used in any personal project. &nbsp;
				<div className="footer-txt">
									<p>Feel free to share your images: <br />  via circle buttons</p>
								</div>
							</div>
						</div>
						: ""}
				</div>
			);
		} else {
			return (
				<div>
					<div className="header-wrapper">
						<div className="container-header">
							<img src={PatrickLogo} height='40' />&nbsp; Stock Image Bank &nbsp;
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
						<img src={PatrickLogo} height='40' />&nbsp; This free collection of stock images can be used in any personal project. &nbsp;
							<p>Feel free to share your images: <br />  via circle buttons</p>
					</div>
				</div>

			)
		}
	}

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
		let url = "http://phase2apitest.azurewebsites.net/api/meme"
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
		console.log("it ran")
		const titleInput = document.getElementById("meme-title-input") as HTMLInputElement
		const tagInput = document.getElementById("meme-tag-input") as HTMLInputElement
		const imageFile = this.state.uploadFileList[0]

		if (titleInput === null || tagInput === null || imageFile === null) {
			return;
		}

		const title = titleInput.value
		const tag = tagInput.value
		const url = "http://phase2apitest.azurewebsites.net/api/meme/upload"

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

		this.setState({ stylePath: 'darktheme.css' });
	}
}

export default App;
