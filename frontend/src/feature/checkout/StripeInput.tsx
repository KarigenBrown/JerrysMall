import {InputBaseComponentProps} from "@mui/material";
import {forwardRef, Ref, useImperativeHandle, useRef} from "react";

interface Props extends InputBaseComponentProps {

}

export const StripeInput = forwardRef(
    function StripeInput({component: Component, ...props}: Props, ref: Ref<unknown>) {
        const elementsRef = useRef<any>()

        useImperativeHandle(ref, () => ({
            focus: () => elementsRef.current.focus()
        }))

        return (
            <Component
                onReady={(element: any) => elementsRef.current = element}
                {...props}
            />
        )
    }
)