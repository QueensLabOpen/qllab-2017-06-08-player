import { h, app } from "hyperapp"
import axios from "axios";

app({
  state: {
    winnerTag: 'Häst',
    images: []
  },
  view: (state, actions) => (
    <div>
      <h1>{state.winnerTag}</h1>
      <div>{ state.images.map(img => <img src={img.url} /> )}</div>
      <button onclick={actions.initNew}>Init</button>
      <button onclick={actions.startGame}>Start </button>
      <button onclick={actions.resetGame}>Reset</button>
    </div>
  ),
  actions: {
    mutateData: (state, actions, params) => Object.assign({}, state, params),
    api: {
      fetch: (state, actions, payload) => {
        console.log(payload.data);
        axios.get('http://qllab1-api.azurewebsites.net/api/question')
          .then(function (response) {
            actions.startGame({
              winnerTag: response.data.winningTag,
              images: response.data.answers
            });
          })
          .catch(function (error) {
            console.log(error);
          });

          // actions.startGame();
      }
    },

    initNew: (state, actions) => { console.log('Initing new game'); actions.api.fetch({ data: 'Test' });  },
    startGame: (state, actions, payload) => {
      console.log( payload.images);
      actions.mutateData({
        winnerTag: payload.winnerTag,
        images: payload.images
      });
    },
    resetGame: (state, actions) => { alert('reset'); actions.initNew(); },
  },
})
