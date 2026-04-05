import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../../redux/hooks";
import { taskFieldUpdate } from "../../../../redux/actions/projectActions";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Bold,
  Italic,
  Heading,
  BlockQuote,
  Link,
  List,
  Alignment,
  Table,
  TableToolbar,
  Undo,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import { Box, Button, ClickAwayListener } from "@mui/material";
import Loader from "../../../Loader";
import type { Task } from "../../../../types/models";

interface TaskDescriptionProps {
  userPermissions: number;
  task: Task;
  disabled: boolean;
}

const TaskDescription = ({
  task,
  userPermissions,
  disabled,
}: TaskDescriptionProps) => {
  const dispatch = useAppDispatch();
  const [descriptionEditOpen, setDescriptionEditOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDescription(task.description);
  }, [task.description]);

  const updateHandle = () => {
    if (description !== task.description) {
      setLoading(true);
      dispatch(
        taskFieldUpdate(
          task._id,
          task.projectId,
          description,
          "description",
          () => {
            setLoading(false);
            setDescriptionEditOpen(false);
          },
        ),
      );
    } else {
      setDescriptionEditOpen(false);
    }
  };

  const escBlurHandle = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      setDescriptionEditOpen(false);
      const [editor] = document.getElementsByClassName("ck-content");
      if (editor) (editor as HTMLElement).blur();
    }
  };

  return (
    <ClickAwayListener
      mouseEvent="onMouseDown"
      onClickAway={() =>
        !loading && descriptionEditOpen && setDescriptionEditOpen(false)
      }
    >
      <Box
        onKeyDown={escBlurHandle}
        sx={{ "& .ck-editor__editable_inline": { minHeight: 100 } }}
      >
        <CKEditor
          editor={ClassicEditor}
          config={{
            licenseKey: "GPL",
            plugins: [
              Essentials,
              Paragraph,
              Bold,
              Italic,
              Heading,
              BlockQuote,
              Link,
              List,
              Alignment,
              Table,
              TableToolbar,
              Undo,
            ],
            toolbar: {
              items:
                userPermissions >= 1
                  ? [
                      "heading",
                      "|",
                      "bold",
                      "italic",
                      "blockQuote",
                      "link",
                      "numberedList",
                      "bulletedList",
                      "alignment",
                      "insertTable",
                      "|",
                      "undo",
                      "redo",
                    ]
                  : [],
            },
          }}
          disabled={loading || disabled}
          data={task.description}
          onChange={(_event, editor) => setDescription(editor.getData())}
          onFocus={() => setDescriptionEditOpen(true)}
        />
        {descriptionEditOpen && (
          <div
            style={{
              marginTop: 10,
              textAlign: "right",
            }}
          >
            <Button
              color="secondary"
              onClick={() => setDescriptionEditOpen(false)}
              sx={{ marginRight: "5px" }}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              variant="outlined"
              disabled={loading}
              onClick={updateHandle}
              sx={{ position: "relative" }}
            >
              Save
              {loading && <Loader button />}
            </Button>
          </div>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default TaskDescription;
