import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as React from "react";
import Modal from 'react-responsive-modal';

interface IProps {
    currentMeme: any
}

interface IState {
    open: boolean
}

export default class MemeDetail extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props)   
        this.state = {
            open: false
        }

        this.updateMeme = this.updateMeme.bind(this)
        this.deleteMeme = this.deleteMeme.bind(this)
    }



	public render() {
        const currentMeme = this.props.currentMeme
        const { open } = this.state;
		return (
			<div className="meme-wrapper">
                <div className= "image-display">
                    <div className="row meme-img">
                        <img src={currentMeme.url}/>
                    </div>
                </div>
                <div className="spacing"><p> spacing </p></div>
                <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className="meme-heading">{currentMeme.title}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Typography> Discription: <br/> Uploaded:  {currentMeme.uploaded} <br/> Tags:  {currentMeme.tags} </Typography>
                </ExpansionPanelDetails>
                </ExpansionPanel>
                
                <div className="row meme-done-button">
                    <div className="btn btn-primary btn-action" onClick={this.downloadMeme.bind(this, currentMeme.url)}>Download </div>
                    <div className="btn btn-primary btn-action" onClick={this.onOpenModal}>Edit </div>
                    <div className="btn btn-primary btn-action" onClick={this.deleteMeme.bind(this, currentMeme.id)}>Delete </div>
                </div>
                <Modal open={open} onClose={this.onCloseModal}>
                    <form>
                        <div className="form-group">
                            <label>Meme Title</label>
                            <input type="text" className="form-control" id="meme-edit-title-input" placeholder="Enter Title"/>
                            <small className="form-text text-muted">You can edit any meme later</small>
                        </div>
                        <div className="form-group">
                            <label>Tag</label>
                            <input type="text" className="form-control" id="meme-edit-tag-input" placeholder="Enter Tag"/>
                            <small className="form-text text-muted">Tag is used for search</small>
                        </div>
                        <button type="button" className="btn" onClick={this.updateMeme}>Save</button>
                    </form>
                </Modal>
            </div>
		);
    }

    // Modal Open
    private onOpenModal = () => {
        this.setState({ open: true });
	  };
    
    // Modal Close
    private onCloseModal = () => {
		this.setState({ open: false });
    };

    // Open meme image in new tab
    private downloadMeme(url: any) {
        window.open(url);
    }

    // Added via MSA repo
    private updateMeme(){
        const titleInput = document.getElementById("meme-edit-title-input") as HTMLInputElement
        const tagInput = document.getElementById("meme-edit-tag-input") as HTMLInputElement
    
        if (titleInput === null || tagInput === null) {
            return;
        }
    
        const currentMeme = this.props.currentMeme
        const url = "http://phase2apitest.azurewebsites.net/api/meme/" + currentMeme.id
        const updatedTitle = titleInput.value
        const updatedTag = tagInput.value
        fetch(url, {
            body: JSON.stringify({
                "height": currentMeme.height,
                "id": currentMeme.id,
                "tags": updatedTag,
                "title": updatedTitle,
                "uploaded": currentMeme.uploaded,
                "url": currentMeme.url,
                "width": currentMeme.width
            }),
            headers: {'cache-control': 'no-cache','Content-Type': 'application/json'},
            method: 'PUT'
        })
        .then((response : any) => {
            if (!response.ok) {
                // Error State
                alert(response.statusText + " " + url)
            } else {
                location.reload()
            }
        })
    }

    // Added via MSA repo
    private deleteMeme(id: any) {
        const url = "http://phase2apitest.azurewebsites.net/api/meme/" + id
    
        fetch(url, {
            method: 'DELETE'
        })
        .then((response : any) => {
            if (!response.ok) {
                // Error Response
                alert(response.statusText)
            }
            else {
                location.reload()
            }
        })
    }
}