import {Typography, List, ListItem, ListItemText, Grid2} from '@mui/material';
import {Fragment} from 'react';

const products = [
    {
        name: 'Product 1',
        desc: 'A nice thing',
        price: '$9.99',
    },
    {
        name: 'Product 2',
        desc: 'Another thing',
        price: '$3.45',
    },
    {
        name: 'Product 3',
        desc: 'Something else',
        price: '$6.51',
    },
    {
        name: 'Product 4',
        desc: 'Best thing of all',
        price: '$14.11',
    },
    {name: 'Shipping', desc: '', price: 'Free'},
];
const addresses = ['1 Material-UI Drive', 'Reactville', 'Anytown', '99999', 'USA'];
const payments = [
    {name: 'Card type', detail: 'Visa'},
    {name: 'Card holder', detail: 'Mr John Smith'},
    {name: 'Card number', detail: 'xxxx-xxxx-xxxx-1234'},
    {name: 'Expiry date', detail: '04/2024'},
];

export default function Review() {
    return (
        <>
            <Typography variant="h6" gutterBottom>
                Order summary
            </Typography>
            <List disablePadding>
                {products.map((product) => (
                    <ListItem key={product.name} sx={{py: 1, px: 0}}>
                        <ListItemText primary={product.name} secondary={product.desc}/>
                        <Typography variant="body2">{product.price}</Typography>
                    </ListItem>
                ))}
                <ListItem sx={{py: 1, px: 0}}>
                    <ListItemText primary="Total"/>
                    <Typography variant="subtitle1" sx={{fontWeight: 700}}>
                        $34.06
                    </Typography>
                </ListItem>
            </List>
            <Grid2 container spacing={2}>
                <Grid2 size={{xs: 12, sm: 6}}>
                    <Typography variant="h6" gutterBottom sx={{mt: 2}}>
                        Shipping
                    </Typography>
                    <Typography gutterBottom>John Smith</Typography>
                    <Typography gutterBottom>{addresses.join(', ')}</Typography>
                </Grid2>
                <Grid2 container direction="column" size={{xs: 12, sm: 6}}>
                    <Typography variant="h6" gutterBottom sx={{mt: 2}}>
                        Payment details
                    </Typography>
                    <Grid2 container>
                        {payments.map((payment) => (
                            <Fragment key={payment.name}>
                                <Grid2 size={6}>
                                    <Typography gutterBottom>{payment.name}</Typography>
                                </Grid2>
                                <Grid2 size={6}>
                                    <Typography gutterBottom>{payment.detail}</Typography>
                                </Grid2>
                            </Fragment>
                        ))}
                    </Grid2>
                </Grid2>
            </Grid2>
        </>
    );
}