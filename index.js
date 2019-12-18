const express = require("express");

const app = express();

const projectExistsMiddleware = (req, res, next) => {
  const project = projects.find(project => project.id == req.params.project_id);

  if (!project) return res.status(400).send({ error: "Project not found" });
  next();
};

let projects = [];
let requests = 1;

app.use(express.json());

app.use((req, res, next) => {
  console.log(`There where(was) ${requests++} request(s)!`);
  next();
});

// Projects routes

app.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const newProject = {
    id,
    title,
    tasks: []
  };
  projects.push(newProject);
  res.send(newProject);
});

app.get("/projects", (req, res) => {
  res.send(projects);
});

app.get("/projects/:project_id", projectExistsMiddleware, (req, res) => {
  const { project_id } = req.params;
  const project = projects.find(project => project.id == project_id);

  res.send(project);
});

app.put("/projects/:project_id", projectExistsMiddleware, (req, res) => {
  const { project_id } = req.params;
  const { title } = req.body;

  const index = projects.findIndex(project => project.id == project_id);

  projects[index] = {
    ...projects[index],
    title
  };
  res.send(projects[index]);
});

app.delete("/projects/:project_id", projectExistsMiddleware, (req, res) => {
  const { project_id } = req.params;
  const index = projects.findIndex(project => project.id == project_id);
  projects.splice(index, 1);

  return res.send();
});

// Tasks routes
app.post("/projects/:project_id/tasks", projectExistsMiddleware, (req, res) => {
  const { project_id } = req.params;
  const { title } = req.body;

  const task = { title };

  const project = projects.find(project => project.id == project_id);
  project.tasks.push(task);

  res.send(project);
});

app.listen(3333, () => {
  "Server is on!";
});
