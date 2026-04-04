import { useAppSelector } from "../../../redux/hooks";
import ArchivedTasks from "../../dashboard/navbar/archivedTasks/ArchivedTasks";
import Chat from "../../dashboard/navbar/groupChat/Chat";
import InviteUsers from "../../dashboard/navbar/inviteUsers/InviteUsers";
import Settings from "../../dashboard/navbar/settings/Settings";
import Users from "../../dashboard/navbar/users/Users";

interface ProjectItemsProps {
  navExpanded: boolean;
  mobile: boolean;
}

const ProjectItems = ({ navExpanded, mobile }: ProjectItemsProps) => {
  const { loading, project } = useAppSelector((state) => state.projectGetData);
  const hide = !navExpanded && mobile;

  return (
    <>
      {!loading && project && Object.keys(project).length > 0 && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              minHeight: 37,
            }}
          >
            <Chat hide={hide} mobile={mobile} />
            {navExpanded && (
              <>
                <ArchivedTasks />
                <Settings />
              </>
            )}
          </div>
          <div style={{ visibility: hide ? "hidden" : undefined }}>
            <Users maxUsers={navExpanded ? 6 : 0} />
            <InviteUsers navExpanded={navExpanded} mobile={mobile} />
          </div>
        </>
      )}
    </>
  );
};

export default ProjectItems;
