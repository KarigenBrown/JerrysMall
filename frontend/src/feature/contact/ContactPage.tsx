import {Button, ButtonGroup, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../app/store/configureStore.ts";
import {decrement, increment} from "./counterSlice.ts";

export function ContactPage() {
    const dispatch = useAppDispatch()
    const {data, title} = useAppSelector(state => state.counter)

    return (
        <>
            <Typography variant="h2">
                {title}
            </Typography>
            <Typography variant="h5">
                The data is: {data}
            </Typography>
            <ButtonGroup>
                <Button
                    onClick={() => dispatch(decrement(1))}
                    variant="contained"
                    color="error"
                >
                    Decrement
                </Button>
                <Button
                    onClick={() => dispatch(increment(1))}
                    variant="contained"
                    color="primary"
                >
                    Increment
                </Button>
                <Button
                    onClick={() => dispatch(increment(5))}
                    variant="contained"
                    color="secondary"
                >
                    Increment by 5
                </Button>
            </ButtonGroup>
        </>
    )
}