import { Hono } from "hono";

import healthRoutes from "./health.routes.js";
import resumeRoutes from "./resume.routes.js";

const apiRoutes = new Hono();

apiRoutes.route("/health", healthRoutes);
apiRoutes.route("/api/v1/resume", resumeRoutes);

export default apiRoutes;
