import { Tooltip, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuidv4 } from "uuid";

interface ImageUploadProps {
  setFormData: (data: FormData | null) => void;
  setBackground: (bg: string) => void;
  imageSelectRef: React.RefObject<HTMLInputElement | null>;
  disabled: boolean;
}

const ImageUpload = ({
  setFormData,
  setBackground,
  imageSelectRef,
  disabled,
}: ImageUploadProps) => {
  const handleSelectPicture = () => {
    imageSelectRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = event.target.files?.[0];
    if (imageFile) {
      let fileType = imageFile.type.split("/");
      const ext = fileType[fileType.length - 1];
      if (!!ext.match("jpg|jpeg|png|gif")) {
        const blob = imageFile.slice(0, imageFile.size, imageFile.type);
        const newFileName = uuidv4();
        const newFile = new File([blob], newFileName, {
          type: imageFile.type,
        });
        const imageDisplay = URL.createObjectURL(imageFile);
        setBackground(imageDisplay);
        const formData = new FormData();
        formData.append("img", newFile);
        setFormData(formData);
      }
    }
  };

  return (
    <Tooltip title="Upload" sx={{ position: "absolute", bottom: 8, right: 8 }}>
      <Fab
        color="primary"
        onClick={handleSelectPicture}
        size="small"
        disabled={disabled}
      >
        <input
          ref={imageSelectRef}
          id="imageUpload"
          type="file"
          hidden
          onChange={handleImageChange}
        />
        <AddIcon />
      </Fab>
    </Tooltip>
  );
};

export default ImageUpload;
