import React from 'react'
import MaterialIcon from 'material-icons-react';
import { Typography } from '@material-ui/core';
import { CSSTransitionGroup } from 'react-transition-group';
import './Item.css';

const Item = ({item,rate}) => {
  return (
    <div>
        {/* Wrapper to make the child components fade in and out it links with the .css file
        and triggers on startup and when an element changes (it "leaves" and a new one "enters") */}
        <CSSTransitionGroup
        transitionName="carousel"
        transitionAppear={true}
        transitionAppearTimeout={700}
        transitionEnterTimeout={700}
        transitionLeaveTimeout={500}>

            {/* When a user mouseovers the image it we reduce the opacity of the image to 30%
            and increase the text to 100% */}
            <div class="container">
                <img class="image" key={item.id} src={item.image} alt="" style={{width:224, height:283, boxShadow:"10px 5px 15px 5px black", margin:10}}/>   
                <div class="middle">
                    <div class="text">{item.text}..</div>
                    <div class="textLarge">{item.definingInfo}</div>
                </div>
            </div> 
            <Typography color="inherit">{item.name}</Typography>

            {/* The buttons that rate, they call the rate functions and pass id and 'like' or 'dislike'
            as arguments */}
            <MaterialIcon value={item.id} icon="favorite_border" color='#f7f6f2' onClick={rate(item.id,'like')} />
            <MaterialIcon value={item.id} icon="cancel" color='#f7f6f2' onClick={rate(item.id,'dislike')} /> 
        </CSSTransitionGroup>
    </div>
  );
}
export default Item
