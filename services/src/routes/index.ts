import { Hono } from "hono";

import contactRoutes from "./contact.routes.js";
import healthRoutes from "./health.routes.js";
import resumeRoutes from "./resume.routes.js";

const apiRoutes = new Hono();

apiRoutes.route("/health", healthRoutes);
apiRoutes.route("/api/v1/resume", resumeRoutes);
apiRoutes.route("/api/v1/contact", contactRoutes);

export default apiRoutes;
