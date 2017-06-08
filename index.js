import { h, app } from "hyperapp"
import axios from "axios";
import './app.css'
import bookshelv from './components/bookshelv.js'


const apiUrl = 'http://qllab1-api.azurewebsites.net/api/question';

app({
    state: {
        winnerTag: null,
        images: [],
        hasError:false,
        isLoading:false
    },
    view: (state, actions) => (
        <div>
            <div className="queestion-container">
            <h1 className="queestion-header">{state.winnerTag ? `Du ska leta efter en ${state.winnerTag}` : ''}</h1>
            </div>
            <div id="shelf">{state.images.map((img, i) => <img className={img.isWinner ? 'winner' : ''} src={img.url} />)}</div>
        </div>
    ),
    events:{
        loaded: (state,action) => action.initNew()
    } ,
    actions: {
        mutateData: (state, actions, params) => Object.assign({}, state, params),
        api: {
            fetch: (state, actions, payload) => {
                console.log(payload.data);
                axios.get(apiUrl)
                    .then(response => 
                        actions.startGame({
                            winnerTag: response.data.winningTag,
                            images: response.data.answers
                        })
                    )
                    .catch(error => {
                        actions.mutateData({
                            isLoading:false,
                            hasError:true
                        });
                        console.error(error);
                    });

                // actions.startGame();
            }
        },
        initNew: (state, actions) => {
             console.log('Initing new game'); 
             actions.mutateData({
                    winnerTag: null,
                    images: [],
                    hasError:false,
                    isLoading:true
             });
             actions.api.fetch({ data: 'Test' }); 
        },
        startGame: (state, actions, payload) => {
            console.log(payload.images);
            actions.mutateData({
                winnerTag: payload.winnerTag,
                images: payload.images
            });
        },
        resetGame: (state, actions) => actions.initNew(),
    },
})