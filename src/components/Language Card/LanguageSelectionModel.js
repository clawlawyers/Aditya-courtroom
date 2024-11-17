import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  OutlinedInput,
} from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const languagesArr = [
  "English",
  "Hindi",
  "Bengali",
  "Punjabi",
  "Gujarati",
  "Marathi",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Odia",
  "Urdu",
  "Assamese",
  "Maithili",
  "Dogri",
  "Nepali",
  "Sindhi",
  "Sanskrit",
];

const LanguageSelectionModal = ({ onClose, onSelectLanguage }) => {
  const [languageName, setLanguageName] = React.useState([]);
  console.log(languageName);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setLanguageName(typeof value === "string" ? value.split(",") : value);
  };

  const handleConfirm = () => {
    onSelectLanguage(languageName);
  };

  return (
    <Dialog open onClose={onClose}>
      <div style={{ backgroundColor: "#E0F7F7", padding: "10px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <DialogTitle
            style={{
              flexGrow: 1,
              fontWeight: 600,
              fontSize: "24px",
              color: "#008080",
              padding: 0,
            }}
          >
            Select Document Language
          </DialogTitle>
          <IconButton onClick={onClose} style={{ color: "#008080" }}>
            <CloseIcon />
          </IconButton>
        </div>
        <DialogContent>
          <Typography
            variant="body2"
            style={{ color: "#333333", marginBottom: "16px" }}
          >
            Select Language of the document that you wish to upload.
          </Typography>
          <FormControl fullWidth sx={{ m: 1 }}>
            <Select
              id="demo-multiple-checkbox"
              multiple
              value={languageName}
              onChange={handleChange}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {languagesArr.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={languageName.includes(name)} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "8px",
            }}
          >
            <Button
              onClick={handleConfirm}
              variant="contained"
              style={{
                backgroundColor: "#008080",
                color: "#FFFFFF",
                fontWeight: "bold",
                width: "150px",
              }}
              disabled={languageName.length === 0}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </div>
      <div
        style={{
          backgroundColor: "#E0F7F7",
          paddingBottom: "8px",
          textAlign: "center",
        }}
      >
        <hr
          style={{
            border: "0.5px solid black",
            width: "90%",
            margin: "8px auto 4px",
          }}
        />
        <Typography variant="caption" style={{ color: "#666666" }}>
          Upload Documents of same language throughout a case for best results
        </Typography>
      </div>
    </Dialog>
  );
};

export default LanguageSelectionModal;
