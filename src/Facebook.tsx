import * as React from "react";
import FacebookLogin from 'react-facebook-login'


interface IState {
    isLoggedIn: boolean,
    userID: any,
    name: any,
    email: any,
    picture: any,
}

interface IProps {
    callBack: any,
}

export default class Facebook extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props)   
        this.state = {
            isLoggedIn: false,
            userID: '',
            // tslint:disable-next-line:object-literal-sort-keys
            name: '',
            email: '',
            picture: '',
        }
    }

    public render() {
        const{isLoggedIn}= this.state
        let fbContent;
    
        if(isLoggedIn){
            fbContent = null;
        } else {
            fbContent = (<FacebookLogin
                appId="1109870552512520"
                autoLoad={true}
                fields="name,email,picture"
                onClick={this.componentClicked}
                callback={this.responseFacebook}
                cssClass= "btn btn-primary btn-action-login" />);
        }
        return(
            <div>
                {fbContent}
            </div>
        )
    }
    
    private componentClicked =() => console.log("Clicked");

    private responseFacebook = (response: any) => {
        this.props.callBack(response);
    }

}