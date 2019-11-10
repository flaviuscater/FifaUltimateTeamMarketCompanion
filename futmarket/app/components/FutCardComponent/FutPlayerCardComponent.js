import React, {Component} from 'react';
import HTML from 'react-native-render-html';
import FifaGraphQLService from "../../service/FifaGraphQLService";

import {Dimensions, ScrollView} from 'react-native'

export default class FutPlayerCardComponent extends Component {

    render() {
        return (
            <ScrollView style={{flex: 1}}>
                <HTML html={htmlContent} imagesMaxWidth={Dimensions.get('window').width}/>
            </ScrollView>
        );
    }
}

const htmlContent = `
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Saira+Semi+Condensed:300,400,700" />

                <div class="wrapper">
                    <div class="fut-player-card">

                        <div class="player-card-top">
                            <div class="player-master-info">
                                <div class="player-rating"><span>97</span></div>
                                <div class="player-position"><span>RW</span></div>
                                <div class="player-nation"><img src="https://selimdoyranli.com/cdn/fut-player-card/img/argentina.svg" alt="Argentina" draggable="false" /></div>
                                <div class="player-club"><img src="https://selimdoyranli.com/cdn/fut-player-card/img/barcelona.svg" alt="Barcelona" draggable="false" /></div>
                            </div>
                            <div class="player-picture"><img src="https://selimdoyranli.com/cdn/fut-player-card/img/messi.png" alt="Messi" draggable="false" />
                                <div class="player-extra"><span>4*SM</span><span>4*WF</span></div>
                            </div>
                        </div>

                        <div class="player-card-bottom">
                            <div class="player-info">

                                <div class="player-name"><span>MESSI</span></div>

                                <div class="player-features">
                                    <div class="player-features-col"><span><div class="player-feature-value">97</div><div class="player-feature-title">PAC</div></span><span><div class="player-feature-value">95</div><div class="player-feature-title">SHO</div></span><span><div class="player-feature-value">94</div><div class="player-feature-title">PAS</div></span></div>
                                    <div
                                        class="player-features-col"><span><div class="player-feature-value">99</div><div class="player-feature-title">DRI</div></span><span><div class="player-feature-value">35</div><div class="player-feature-title">DEF</div></span><span><div class="player-feature-value">68</div><div class="player-feature-title">PHY</div></span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
`;