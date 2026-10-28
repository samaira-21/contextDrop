import { api } from "@/trpc/react";
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

const useProject = () => {
  const { data: projects } = api.project.getProjects.useQuery();
  const [projectId, setProjectId] = useLocalStorage("dionysus-projectId", "");
  const selectedProjectId = projectId.trim();
  const project = projects?.find((item) => item.id === selectedProjectId);

  useEffect(() => {
    if (!projects?.length) return;
    if (project) return;
    const firstProject = projects[0];
    if (firstProject) setProjectId(firstProject.id);
  }, [projects, project, setProjectId]);

  return {
    projects,
    project,
    projectId: selectedProjectId,
    setProjectId,
  };
};

export default useProject;
