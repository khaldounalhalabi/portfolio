"use client";
import EditSheet from "@/components/site-settings/edit-sheet";
import SiteSetting from "@/models/SiteSetting";

const TableActions = ({ setting }: { setting: SiteSetting }) => {
  return (
    <div className={"flex flex-row items-center gap-2"}>
      <EditSheet setting={setting} />
    </div>
  );
};

export default TableActions;
