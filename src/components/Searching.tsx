import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MediaStreamRecorder from 'msr';
import * as React from "react";
import { Transition } from 'react-transition-group';


// theme used to set colours of UI components
const theme = createMuiTheme({
    palette: {
        primary: {
          main: '#512da8',
        },
        secondary: {
          main: '#512da8',
        },
      },
});

const theme2 = createMuiTheme({
    palette: {
        primary: {
          main: '#eeeeee',
        },
        secondary: {
          main: '#eeeeee',
        },
      },
});

interface IProps {
    memes: any[],
    selectNewMeme: any,
    searchByTag: any,
    darktheme: any,
}

interface IState {    
    currentIndex: any,
    open: boolean,
}


export default class Searching extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props)
        this.searchByTag = this.searchByTag.bind(this),
        this.searchTagByVoice = this.searchTagByVoice.bind(this),
        this.postAudio = this.postAudio.bind(this);
        this.plusIndex = this.plusIndex.bind(this);
        this.minusIndex = this.minusIndex.bind(this);
        this.closeMic = this.closeMic.bind(this);
        this.disable = this.disable.bind(this);

        this.state = {
            currentIndex: 0,
            open: false
        }
    }
    public render() {
        if(this.props.darktheme){
            return(
                <div className="container meme-list-wrapper">
                <div className="row meme-list-heading">
                    <div className="input-group">
                    <MuiThemeProvider theme={theme2}> 
                        <TextField id="search-tag-textbox" type="text"  placeholder="Search for photos"/>
                    </MuiThemeProvider> 
                        <div className="btn" onClick={this.disable}><i className="fa fa-microphone" /></div>
                    </div>
                </div>                
                <div className="searchButton">
                <MuiThemeProvider theme={theme}> 
                        <div className="btn btn-primary btn-action" onClick={this.searchByTag} > Search </div>
                </MuiThemeProvider> 
                </div>
                <div className="toggle">
                <div className="toggle">
                <div className="btn btn-primary btn-action-small" onClick={this.minusIndex} > &#8592; </div>
                <p className="spacing-button"> spacing </p>
                <div className="btn btn-primary btn-action-small" onClick={this.plusIndex} > &#8594; </div>
                </div>
                </div>
                <div>
                <Dialog
                open={this.state.open}
                TransitionComponent={Transition}
                onClose={this.closeMic}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description">
                <DialogTitle id="alert-dialog-slide-title">{"Image Edit Successful"} </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                The image being displayed currently has been editted succesfully.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={this.closeMic} color="primary"> OK </Button>
                </DialogActions>
                </Dialog>
                </div>
            </div>
            )
        }else{
        return (
            <div className="container meme-list-wrapper">
                <div className="row meme-list-heading">
                    <div className="input-group">
                    <MuiThemeProvider theme={theme}> 
                        <TextField id="search-tag-textbox" type="text"  placeholder="Search for photos"/>
                    </MuiThemeProvider> 
                        <div className="btn" onClick={this.disable}><i className="fa fa-microphone" /></div>
                    </div>
                </div>                
                <div className="searchButton">
                <MuiThemeProvider theme={theme}> 
                        <div className="btn btn-primary btn-action" onClick={this.searchByTag} > Search </div>
                </MuiThemeProvider> 
                </div>
                <div className="toggle">
                <div className="toggle">
                <div className="btn btn-primary btn-action-small" onClick={this.minusIndex} > &#8592; </div>
                <p className="spacing-button"> spacing </p>
                <div className="btn btn-primary btn-action-small" onClick={this.plusIndex} > &#8594; </div>
                </div>
                </div>
                <div>
                <Dialog
                open={this.state.open}
                TransitionComponent={Transition}
                onClose={this.closeMic}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description">
                <DialogTitle id="alert-dialog-slide-title">{"Feature Temporarily Disabled"} </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                Due to conflicts involving the camera authentication, this feature has been temporarily disabled. 
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={this.closeMic} color="primary"> OK </Button>
                </DialogActions>
                </Dialog>
                </div>
            </div>
        );
            }
    }

    // Close the mic dialgoue
    private closeMic() {
        this.setState({ open: false }) 
    }

    // Swap to the next image if possible ->
    private plusIndex() {
        const length = this.props.memes.length;
        // tslint:disable-next-line:prefer-const
        let num = (Number(this.state.currentIndex) + 1)

        if(num > length-1){
            num = 0
        }

        console.log(num, length, this.state.currentIndex)

        if (num != null) {
            const selectedMeme = this.props.memes[num]
            this.props.selectNewMeme(selectedMeme)
            this.setState({ currentIndex: num }) 
            console.log(num, length, this.state.currentIndex)
    
        }
    }

      // Swap to the next image if possible <-
    private minusIndex() {
        const length = this.props.memes.length;
        // tslint:disable-next-line:prefer-const
        let num = (Number(this.state.currentIndex) - 1)
        console.log(num, length, this.state.currentIndex)   
        
        if(num <= 0){
            num = length-1
        }

        if (num != null) {
            const selectedMeme = this.props.memes[num]
            this.props.selectNewMeme(selectedMeme)
            this.setState({ currentIndex: num }) 
            console.log(num, length, this.state.currentIndex)
    
        }
    }

    // Search meme by tag
    private searchByTag() {
        const num = 0
        this.setState({ currentIndex: num }) 
        const textBox = document.getElementById("search-tag-textbox") as HTMLInputElement
        if (textBox === null) {
            return;
        }
        const tag = textBox.value.toLowerCase().trimLeft().trim()
        this.props.searchByTag(tag)
    }

    private disable(){
        this.setState({ open: true }) 
        if(this.state.open){
            console.log("should opemn the thing")
            return;
        }
    }


    // This section of code doesn't work
    private searchTagByVoice(){
        // This feature has been currently disabled due to conflicts with the webcam
        const mediaConstraints = {
           audio: true
        }
        const onMediaSuccess = (stream: any) => {
            const mediaRecorder = new MediaStreamRecorder(stream);
            mediaRecorder.mimeType = 'audio/wav'; // check this line for audio/wav
            mediaRecorder.ondataavailable = (blob: any) => {
                this.postAudio(blob);
                mediaRecorder.stop()
                
            }
            mediaRecorder.start(3000);
        }
        navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError)
    
        function onMediaError(e: any) {
            console.error('media error', e);
        }
    }

    private postAudio(blob:any) {
        
        let accessToken: any;
        fetch(' https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken', {
            headers: {
                'Content-Length': '0',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Ocp-Apim-Subscription-Key': ' f803856f2fde4726ad902ef64dd21426'
            },
            method: 'POST'
        }).then((response) => {
            return response.text()
        }).then((response) => {
            console.log(response)
            accessToken = response
        }).catch((error) => {
            console.log("Error", error)
        });

    fetch('https://westus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US', {
        body: blob, // this is a .wav audio file    
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer' + accessToken,
            'Content-Type': 'audio/wav;codec=audio/pcm; samplerate=16000',
            'Ocp-Apim-Subscription-Key': '8a4ee527cc2e4a778e12f9352379db9d'
        },    
        method: 'POST'
    }).then((res) => {   
        return res.json()
    }).then((res: any) => {
        console.log(res)
        const textBox = document.getElementById("search-tag-textbox") as HTMLInputElement
        textBox.value = (res.DisplayText as string).slice(0, -1)
    }).catch((error) => {
        console.log("Error", error)
    });
    }
}