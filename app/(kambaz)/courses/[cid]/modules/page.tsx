"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ListGroup, ListGroupItem, FormControl } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { setModules, updateModule, editModule } from "./reducer";
import ModulesControls from "./ModulesControls";
import ModuleControlButtons from "./ModuleControlButtons";
import * as client from "../../client";

type ModuleRow = {
  _id: string;
  name: string;
  course: string;
  editing?: boolean;
  lessons?: unknown[];
};

export default function Modules() {
  const { cid } = useParams();
  const [moduleName, setModuleName] = useState("");
  const { modules } = useSelector(
    (state: RootState) => state.modulesReducer
  );
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const isFaculty = ["FACULTY", "ADMIN", "TA"].includes(
    currentUser?.role ?? ""
  );
  const dispatch = useDispatch();

  const fetchModules = async () => {
    if (!cid) return;
    const data = (await client.findModulesForCourse(cid as string)) as ModuleRow[];
    dispatch(setModules(data));
  };

  useEffect(() => {
    fetchModules();
  }, [cid]);

  const onCreateModuleForCourse = async () => {
    if (!cid) return;
    const newModule = { name: moduleName };
    const created = (await client.createModuleForCourse(
      cid as string,
      newModule
    )) as ModuleRow;
    dispatch(setModules([...(modules as ModuleRow[]), created]));
    setModuleName("");
  };

  const onRemoveModule = async (moduleId: string) => {
    if (!cid) return;
    await client.deleteModule(cid as string, moduleId);
    dispatch(
      setModules(
        (modules as ModuleRow[]).filter((m) => m._id !== moduleId)
      )
    );
  };

  const onUpdateModule = async (module: ModuleRow) => {
    if (!cid) return;
    const { editing, ...payload } = module;
    void editing;
    await client.updateModuleOnServer(cid as string, payload as ModuleRow);
    const newModules = (modules as ModuleRow[]).map((m) =>
      m._id === module._id ? module : m
    );
    dispatch(setModules(newModules));
  };

  return (
    <div className="wd-modules">
      {isFaculty && (
        <ModulesControls
          moduleName={moduleName}
          setModuleName={setModuleName}
          addModule={() => {
            onCreateModuleForCourse();
          }}
        />
      )}
      <br />
      <ListGroup id="wd-modules" className="rounded-0">
        {(modules as ModuleRow[]).map((module) => (
            <ListGroupItem
              key={module._id}
              className="wd-module p-0 mb-5 fs-5 border-gray"
            >
              <div className="wd-title p-3 ps-2 bg-secondary">
                <BsGripVertical className="me-2 fs-3" />
                {!module.editing && module.name}
                {module.editing && (
                  <FormControl
                    className="w-50 d-inline-block"
                    onChange={(e) =>
                      dispatch(
                        updateModule({ ...module, name: e.target.value })
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onUpdateModule({ ...module, editing: false });
                      }
                    }}
                    value={module.name}
                  />
                )}
                <ModuleControlButtons
                  moduleId={module._id}
                  deleteModule={(moduleId) => onRemoveModule(moduleId)}
                  editModule={(moduleId) => dispatch(editModule(moduleId))}
                  isFaculty={isFaculty}
                />
              </div>
              {module.lessons && (
                <ListGroup className="wd-lessons rounded-0">
                  {(module.lessons as { _id: string; name: string }[]).map(
                    (lesson) => (
                      <ListGroupItem
                        key={lesson._id}
                        className="wd-lesson p-3 ps-1"
                      >
                        <BsGripVertical className="me-2 fs-3" />
                        {lesson.name}
                      </ListGroupItem>
                    )
                  )}
                </ListGroup>
              )}
            </ListGroupItem>
          ))}
      </ListGroup>
    </div>
  );
}
