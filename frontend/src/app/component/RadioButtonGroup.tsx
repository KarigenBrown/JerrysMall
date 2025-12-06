import {FormControl, FormControlLabel, Radio, RadioGroup} from "@mui/material";

interface Props {
    options: any[],
    onChange: (event: any) => void,
    selectedValue: string
}

export default function RadioButtonGroup({options, onChange, selectedValue}: Props) {
    return (
        <FormControl component="fieldset">
            <RadioGroup onChange={onChange} value={selectedValue}>
                {/*
                (): 直接就是返回的值
                {}: 需要在代码里显示return
                */}
                {options.map(({value, label}) => (
                    <FormControlLabel value={value} control={<Radio/>} label={label} key={value}/>
                ))}
            </RadioGroup>
        </FormControl>
    )
}