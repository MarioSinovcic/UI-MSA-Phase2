import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MediaStreamRecorder from 'msr';
import * as React from "react";


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

export default class MemeList extends React.Component<IProps, {}> {
    constructor(props: any) {
        super(props)
        this.searchByTag = this.searchByTag.bind(this),
        this.searchTagByVoice = this.searchTagByVoice.bind(this),
        this.postAudio = this.postAudio.bind(this);
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
                        <div className="btn" onClick={this.searchTagByVoice}><i className="fa fa-microphone" /></div>
                    </div>
                </div>                
                {/* <div className="row meme-list-table">
                    <table className="table table-striped">
                        <tbody>
                            {this.createTable()}
                        </tbody>
                    </table>
                </div> */}
                <div className="searchButton">
                <MuiThemeProvider theme={theme}> 
                        <div className="btn btn-primary btn-action" onClick={this.searchByTag} > Search </div>
                </MuiThemeProvider> 
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
                        <div className="btn" onClick={this.searchTagByVoice}><i className="fa fa-microphone" /></div>
                    </div>
                </div>                
                <div className="searchButton">
                <MuiThemeProvider theme={theme}> 
                        <div className="btn btn-primary btn-action" onClick={this.searchByTag} > Search </div>
                </MuiThemeProvider> 
                </div>
            </div>
        );
            }
    }

    // Construct table using meme list
    // private createTable() {
    //     const table: any[] = []
    //     const memeList = this.props.memes
    //     if (memeList == null) {
    //         return table
    //     }

    //     for (let i = 0; i < memeList.length; i++) {
    //         const children = []
    //         const meme = memeList[i]
    //         children.push(<td key={"id" + i}>{meme.id}</td>)
    //         children.push(<td key={"name" + i}>{meme.title}</td>)
    //         children.push(<td key={"tags" + i}>{meme.tags}</td>)
    //         table.push(<tr key={i + ""} id={i + ""} onClick={this.selectRow.bind(this, i)}>{children}</tr>)
    //     }
    //     return table
    // }

    // // Meme selection handler to display selected meme in details component
    // private selectRow(index: any) {
    //     const selectedMeme = this.props.memes[index]
    //     if (selectedMeme != null) {
    //         this.props.selectNewMeme(selectedMeme)
    //     }
    // }

    // Search meme by tag
    private searchByTag() {
        const textBox = document.getElementById("search-tag-textbox") as HTMLInputElement
        if (textBox === null) {
            return;
        }
        const tag = textBox.value.toLowerCase().trimLeft().trim()
        this.props.searchByTag(tag)
    }

    private searchTagByVoice(){
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