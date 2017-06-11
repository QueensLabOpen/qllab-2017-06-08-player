import { h, app } from 'hyperapp';
import velocity from 'velocity-animate';
import sizzle from 'sizzle';
import axios from 'axios';
import './app.css';
import './toaster.css';


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
                <h1 className="queestion-header">{winnerTag ? `Vart är ${winnerTag}n?` : ''}</h1>
                </div>
                <div id="shelf">{images.map(({isWinner, url},i) => <img key={i} className={ isWinner ? 'winner' : ''} src={url} />)}</div>
            </div>
        );
    },
    events:{
        loaded: (state,action) => {
            action.mutateData({isLoading: true})
            setTimeout(()=> {
                action.initNew()
            }, 5000)
        }
    },
    actions: {
        mutateData: (state, actions, params) => Object.assign({}, state, params),
        api: {
            fetch: (state, actions, payload) => {
                axios.get('http://qllab1-api.azurewebsites.net/api/question')
                    .then(response => 
                        actions.startGame({
                            winnerTag: response.data.winningTag,
                            images: response.data.answers
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
             }, 7000)
        },
        presentCorrectWinner: (state, actions) => {
            let stop = false
            const scaleUp = () => {
                velocity(sizzle('.winner'), {
                    scale: 1.1,
                    background: '#ccc'
                }, {
                    duration: 300,
                    complete () {
                        if (!stop) {
                            scaleDown()
                        }
                    }
                })
            }

            const scaleDown = () => {
                velocity(sizzle('.winner'), {
                    scale: 1,
                    background: 'transparent'
                }, {
                    duration: 300,
                    complete () {
                        if (!stop) {
                            scaleUp()
                        }
                    }
                })
            }
            scaleUp()
            setTimeout(() => {
                stop = true
                actions.initNew()
            }, 5000)
        },
        shuffle (array) {
            let counter = array.length;

            // While there are elements in the array
            while (counter > 0) {
                // Pick a random index
                let index = Math.floor(Math.random() * counter);

                // Decrease counter by 1
                counter--;

                // And swap the last element with it
                let temp = array[counter];
                array[counter] = array[index];
                array[index] = temp;
            }

            return array;
        },
        startGame: (state, actions, { winnerTag, images }) => {
            for (let i = images.length; i; i--) {
                let j = Math.floor(Math.random() * i);
                [images[i - 1], images[j]] = [images[j], images[i - 1]];
            }
            actions.mutateData({
                winnerTag,
                images,
                isLoading:false
            })
        },
        resetGame: (state, actions) => actions.initNew(),
    },
})