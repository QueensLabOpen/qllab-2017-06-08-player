import { h, app } from "hyperapp"
import axios from "axios";
import './app.css'
import bookshelv from './components/bookshelv.js'
import './toaster.css'


app({
    state: {
        winnerTag: null,
        images: [],
        hasError:false,
        isLoading:false
    },
    view: ({winnerTag, images, isLoading, hasError}, actions) =>{ 
        if(isLoading) return <div className="loading">
            <img src="http://ql-register.azurewebsites.net/images/logo.png" className="logo" alt=""/>
        </div>;
        return (
            <div>
                <div id="snackbar" className={hasError ? 'show':''}>Något gick fel</div>
                <div className="queestion-container">
                <h1 className="queestion-header">{winnerTag ? `Du ska leta efter en ${winnerTag}` : ''}</h1>
                </div>
                <div id="shelf">{images.map(({isWinner, url},i) => <img key={i} className={ isWinner ? 'winner' : ''} src={url} />)}</div>
            </div>
        );
    },
    events:{
        loaded: (state,action) => {
            action.mutateData({isLoading: true})
            setInterval(()=> {
                action.initNew()
            },5000)
            
        }
    } ,
    actions: {
        mutateData: (state, actions, params) => Object.assign({}, state, params),
        api: {
            fetch: (state, actions, payload) => {
                axios.get('http://qllab1-api.azurewebsites.net/api/question')
                    .then(response => 
                        actions.startGame({
                            winnerTag: response.data.winningTag,
                            images:[
                            {
                                "url": "http://via.placeholder.com/1080x460"
                            },
                            {
                                "url": "http://via.placeholder.com/1080x460"
                            },
                            {
                                "url": "http://via.placeholder.com/1080x460"
                            },
                            {
                                "url": "http://via.placeholder.com/1080x460"
                            }
                            ]
                            // images: response.data.answers
                        })
                    )
                    .catch(error => {
                        actions.mutateData({
                            isLoading: false,
                            hasError: true
                        });
                        console.error(error);
                    });
            }
        },
        initNew: (state, actions) => {
             console.log('Initing new game'); 
             actions.mutateData({
                    winnerTag: null,
                    images: [],
                    hasError:false
             });
             actions.api.fetch(); 
             setTimeout(() => {
                actions.presentCorrectWinner();
             },15000)
             
        },
        presentCorrectWinner: (state, actions) => {
             setTimeout(() => 
                actions.initNew()
             ,5000)
        },
        startGame: (state, actions, { winnerTag, images }) => 
            actions.mutateData({
                winnerTag,
                images,
                isLoading:false
            })
        ,
        resetGame: (state, actions) => actions.initNew(),
    },
})