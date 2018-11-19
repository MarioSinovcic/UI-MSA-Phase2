import * as React from 'react';
import Modal from 'react-responsive-modal';
// import * as Webcam from "react-webcam";
import './App.css';
import MemeDetail from './components/MemeDetail';
import MemeList from './components/MemeList';
import PatrickLogo from './patrick-logo.png';

interface IState {
	currentMeme: any,
	memes: any[],
	open: boolean,
	uploadFileList: any,
	// authenticated: boolean,
	// refCamera: any
	imageFound: boolean
}

class App extends React.Component<{}, IState> {
	constructor(props: any) {
		super(props)
		this.state = {
			currentMeme: { "id": 0, "title": "Loading ", "url": "", "tags": "⚆ _ ⚆", "uploaded": "", "width": "0", "height": "0" },
			memes: [],
			open: false,
			uploadFileList: null,
			// authenticated: false,
			// refCamera: React.createRef(),
			// tslint:disable-next-line:object-literal-sort-keys
			imageFound: true
		}

		this.selectNewMeme = this.selectNewMeme.bind(this)
		this.fetchMemes = this.fetchMemes.bind(this)
		this.fetchMemes("")
		this.handleFileUpload = this.handleFileUpload.bind(this)
		this.uploadMeme = this.uploadMeme.bind(this)
		this.authenticate = this.authenticate.bind(this)
	}

	public render() {
		// const {  } = this.state;

		const { open } = this.state;

		// const { authenticated } = this.state;

		if (this.state.imageFound) {
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
					{/* add a image hear pointing to the add option if need be with the logo --------------------- */}

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
		// const screenshot = this.state.refCamera.current.getScreenshot();
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
}

export default App;
