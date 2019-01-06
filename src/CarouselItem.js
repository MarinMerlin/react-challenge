import React from 'react'
import Grid from '@material-ui/core/Grid';
import Item from './Item';

//The Carousel item arranges the four items in a grid and 
//passes each items info and the rate function
const CarouselItem = ({data, rate}) => {
    return (
        <Grid
        container
        direction="row"
        justify="center"
        alignItems="center">
            {data.map( (item) => (
            <Grid item key={item.id} style={{marginBottom:50}}>
                <Item item={item} rate={rate}/>
            </Grid>))}
        </Grid>
    )
}


export default CarouselItem

