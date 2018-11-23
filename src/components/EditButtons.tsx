import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as React from "react";
import Modal from 'react-responsive-modal';
// tslint:disable-next-line:ordered-imports
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { Transition } from 'react-transition-group';

interface IProps {
    currentMeme: any,
    authenticated: boolean
}

interface IState {
    open: boolean,
    open2: boolean,
    open3: boolean
}

export default class EditButtons extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props)
        this.state = {
            open: false,
            open2: false,
            open3: false,

        }
        this.updateMeme = this.updateMeme.bind(this)
        this.deleteMeme = this.deleteMeme.bind(this)
        this.handleClickOpen = this.handleClickOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
    }



    public render() {
        const currentMeme = this.props.currentMeme
        const { open } = this.state;
        return (
            <div className="meme-wrapper">
                <div className="image-display">
                    <div className="row meme-img">
                        <img src={currentMeme.url} />
                    </div>
                </div>
                <div className="spacing"><p> spacing </p></div>
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className="meme-heading">{currentMeme.title}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography className="info"> Height: {currentMeme.height}px  Length: {currentMeme.width}px <br /> Uploaded:  {currentMeme.uploaded} <br /> Tags:  {currentMeme.tags} </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>

                <div className="row meme-done-button">
                    <div className="btn btn-primary btn-action" onClick={this.downloadMeme.bind(this, currentMeme.url)}>Download </div>
                    <div className="btn btn-primary btn-action" onClick={this.onOpenModal}>Edit </div>
                    <div className="btn btn-primary btn-action" onClick={this.deleteMeme.bind(this, currentMeme.id)}>Delete </div>
                </div>
                <div>
                <Dialog
                open={this.state.open2}
                TransitionComponent={Transition}
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description">
                <DialogTitle id="alert-dialog-slide-title">{"Image Edit Successful"} </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                The image being displayed currently has been editted succesfully, refresh the page to see your changes.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={this.handleClose} color="primary"> OK </Button>
                </DialogActions>
                </Dialog>
                </div>
                <div>
                <Dialog
                open={this.state.open3}
                TransitionComponent={Transition}
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description">
                <DialogTitle id="alert-dialog-slide-title">{"Deletion Successful"} </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                The image currently displayed has been deleted. Refresh the page to see your changes.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={this.handleClose} color="primary"> OK </Button>
                </DialogActions>
                </Dialog>
                </div>
                <Modal open={open} onClose={this.onCloseModal}>
                    <form>
                        <div className="form-group">
                            <label>Meme Title</label>
                            <input type="text" className="form-control" id="meme-edit-title-input" placeholder="Enter Title" />
                            <small className="form-text text-muted">You can edit any meme later</small>
                        </div>
                        <div className="form-group">
                            <label>Tag</label>
                            <input type="text" className="form-control" id="meme-edit-tag-input" placeholder="Enter Tag" />
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

    private handleClickOpen = () => {
        this.setState({ open2: true });
    };

    private handleClose = () => {
        this.setState({ open2: false,
        open3: false });
    };

    // Open meme image in new tab
    private downloadMeme(url: any) {
        window.open(url);
    }

    private handleDelete(){
        this.setState({ open3: true });
    }

    // Added via MSA repo
    private updateMeme() { 
        const titleInput = document.getElementById("meme-edit-title-input") as HTMLInputElement 
        const tagInput = document.getElementById("meme-edit-tag-input") as HTMLInputElement
        console.log(titleInput, tagInput)

        if (titleInput === null || tagInput === null || tagInput.size <=1 || titleInput.size <=1) {
            return;
        }

        this.handleClickOpen()

        const currentMeme = this.props.currentMeme
        const url = "https://phasetwowebapp.azurewebsites.net/api/MemeItems/" + currentMeme.id
        const updatedTitle = titleInput.value
        const updatedTag = tagInput.value.toLowerCase().trim()
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
            headers: { 'cache-control': 'no-cache', 'Content-Type': 'application/json' },
            method: 'PUT'
        })
            .then((response: any) => {
                if (!response.ok) {
                    // Error State
                    alert(response.statusText + " " + url)
                    this.onCloseModal()
                } else {
                    this.onCloseModal()
                }
            })
    }

    // Added via MSA repo
    private deleteMeme(id: any) {
        const url = "https://phasetwowebapp.azurewebsites.net/api/MemeItems/" + id

        fetch(url, {
            method: 'DELETE'
        })
            .then((response: any) => {
                if (!response.ok) {
                    // Error Response
                    alert(response.statusText)
                }
                else {
                    this.handleDelete()
                }
            })
    }
}