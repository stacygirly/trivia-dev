import React, { Fragment, useState } from "react";
import { Typography, Radio, FormControl, FormLabel, Box, TextField, radioClasses } from "@mui/material"
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import '../../App.css';

function RadioGroupQuestion(props) {

    function handleChange(e) {
        if (props.onChange) {
            props.onChange(e.target.value);
        }

    }
    return (
        <Box pt={3}>
            <FormControl>
                <FormLabel 
                id={props.prompt.trim().replace(/\s+/g, '-')}
                >
                    <Typography variant="h6" gutterBottom>
                        {props.prompt}
                    </Typography>
                </FormLabel>
                {props.description && <Typography variant="body2" gutterBottom>{props.description}</Typography>}
                <Box ml={2}>
                    <RadioGroup        
                        // aria-labelledby={props.prompt.trim().replace(/\s+/g, '-')}
                        name={props.prompt}
                        value={props.response}
                        onChange={handleChange}
                    >

                        {/* {props.options.map((option, i) =>( 
                            <div >
                            <div key={i}  style={{float: "left",
                                                marginTop: "2.5px"}}>
                                <input type="radio" 
                                style={{
                                        float: "left",
                                        marginBottom: "5px",
                                        marginRight: "10px",
                                        width: '20px',
                                        height: '20px'}}
                                value={option}
                                label={option} 
                                name={props.prompt}
                                inputProps={{
                                    'aria-label': option,
                                }} />
                                <span aria-hidden="true">{option}</span>
                            </div>
                            </div>

                        ))} */}
                    {props.options.map((option, i) => (
                                <FormControlLabel
                                    key={i}
                                    value={option}
                                    control={<Radio />}
                                    label={option}
                                    name={props.prompt}
                                    inputProps={{
                                    "aria-label": option,
                                    }}
                                />
                                ))}

                    </RadioGroup>
                </Box>

            </FormControl>
        </Box >
    );
}

export default RadioGroupQuestion;