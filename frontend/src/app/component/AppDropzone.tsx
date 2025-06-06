import {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import {useController, UseControllerProps} from "react-hook-form";
import {FormControl, FormHelperText, Typography} from "@mui/material";
import {UploadFile} from "@mui/icons-material";

type Props = UseControllerProps

export default function AppDropzone(props: Props) {
    const {fieldState, field} = useController({...props, defaultValue: null})

    const dropzoneStyle = {
        display: "flex",
        border: "dashed 3px #eee",
        borderColor: "#eee",
        borderRadius: "5px",
        paddingTop: "30px",
        alignItems: "center",
        height: 200,
        width: 500
    }

    const dropzoneActive = {
        borderColor: "green"
    }

    const onDrop = useCallback((acceptedFiles: any) => {
        acceptedFiles[0] = Object.assign(acceptedFiles[0], {preview: URL.createObjectURL(acceptedFiles[0])})
        field.onChange(acceptedFiles[0])
    }, [field])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    return (
        <div {...getRootProps()}>
            <FormControl
                style={
                    isDragActive
                        ? {...dropzoneStyle, ...dropzoneActive}
                        : dropzoneStyle
                }
                error={!!fieldState.error}
            >
                <input{...getInputProps()}/>
                <UploadFile sx={{fontSize: "100px"}}/>
                <Typography variant="h4">Drop image here</Typography>
                <FormHelperText>{fieldState.error?.message}</FormHelperText>
            </FormControl>
        </div>
    )
}