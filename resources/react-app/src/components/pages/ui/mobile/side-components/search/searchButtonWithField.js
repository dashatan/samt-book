import React from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import {Search} from "@material-ui/icons";
import translate from "../../../../../translate";
import {Box} from "@material-ui/core";

function SearchButtonWithField(props) {
  return (
    <Box onClick={props.onClick} style={{width:'100%'}}>
      <TextField
        placeholder={translate('جستجو')}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          readOnly:true,
        }}

        fullWidth
        variant='outlined'
        size='small'
      />
    </Box>
  )
}
export default SearchButtonWithField;